import { getAccessToken, clearSessionCookies } from "./session";
import { parseSpringError, type SpringErrorBody } from "./api-error";

const DEFAULT_BASE = "http://localhost:8080/api/v1";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export class SpringRequestError extends Error {
  constructor(
    public status: number,
    public body: SpringErrorBody | null,
    message: string,
  ) {
    super(message);
    this.name = "SpringRequestError";
  }
}

export async function springFetch(
  path: string,
  init: RequestInit = {},
  options: { auth?: boolean } = { auth: true },
): Promise<Response> {
  const base = process.env.API_BASE_URL ?? DEFAULT_BASE;
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (options.auth !== false) {
    const token = await getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new SpringRequestError(
      0,
      null,
      "ServiceHub could not reach the server. Check your connection.",
    );
  }

  if (response.status === 401 && options.auth !== false) {
    await clearSessionCookies();
    throw new UnauthorizedError();
  }

  return response;
}

export async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function expectOk(response: Response): Promise<unknown> {
  const json = await readJson(response);
  if (!response.ok) {
    const body = parseSpringError(json);
    throw new SpringRequestError(
      response.status,
      body,
      body?.message ?? "Something went wrong. Please try again.",
    );
  }
  return json;
}
