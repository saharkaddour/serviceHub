"use server";

import { redirect } from "next/navigation";
import { fail, handleActionError, ok, type ActionResult } from "@/lib/action-result";
import { mapRegisterError, userMessageForStatus } from "@/lib/api-error";
import { parseLoginResponse } from "@/lib/parse-login";
import { clearSessionCookies, getRefreshToken, setSessionCookies } from "@/lib/session";
import {
  expectOk,
  springFetch,
  SpringRequestError,
  UnauthorizedError,
} from "@/lib/spring";
import { registerSchema, signInSchema } from "./schemas";

export async function registerAction(input: unknown): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return fail(undefined, fieldErrors);
  }
  try {
    const response = await springFetch(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({
          fullName: parsed.data.fullName,
          email: parsed.data.email,
          password: parsed.data.password,
        }),
      },
      { auth: false },
    );
    if (!response.ok) {
      const json = await response.json().catch(() => null);
      return {
        ok: false,
        ...mapRegisterError(json),
      };
    }
    return ok();
  } catch (error) {
    return handleActionError(error);
  }
}

export async function loginAction(input: unknown): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return fail(undefined, fieldErrors);
  }
  try {
    const response = await springFetch(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email: parsed.data.email,
          password: parsed.data.password,
        }),
      },
      { auth: false },
    );
    const json = await response.json().catch(() => null);
    if (!response.ok) {
      const status = response.status;
      return fail(
        status === 400 || status === 401
          ? "Incorrect email or password."
          : userMessageForStatus(status),
      );
    }
    const tokens = parseLoginResponse(json);
    await setSessionCookies(tokens);
    return ok();
  } catch (error) {
    if (error instanceof SpringRequestError && error.status === 0) {
      return { ok: false, formError: error.message, offline: true };
    }
    return handleActionError(error);
  }
}

export async function logoutAction(): Promise<void> {
  const refresh = await getRefreshToken();
  try {
    await springFetch("/auth/logout", {
      method: "POST",
      body: refresh ? JSON.stringify({ refreshToken: refresh }) : undefined,
    });
  } catch {
    // Logout endpoint is optional.
  }
  await clearSessionCookies();
  redirect("/");
}

export async function requireSessionOrRedirect() {
  try {
    const response = await springFetch("/users/me");
    if (response.status === 401) throw new UnauthorizedError();
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/sign-in");
  }
}
