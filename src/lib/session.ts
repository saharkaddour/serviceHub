import { cookies } from "next/headers";

const ACCESS = "sh_access";
const REFRESH = "sh_refresh";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function setSessionCookies(tokens: {
  accessToken: string;
  refreshToken?: string;
}) {
  const store = await cookies();
  store.set(ACCESS, tokens.accessToken, {
    ...cookieOptions(),
    maxAge: 60 * 60 * 24 * 7,
  });
  if (tokens.refreshToken) {
    store.set(REFRESH, tokens.refreshToken, {
      ...cookieOptions(),
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.delete(ACCESS);
  store.delete(REFRESH);
}

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH)?.value;
}

export async function hasSessionCookie(): Promise<boolean> {
  return Boolean(await getAccessToken());
}
