import { redirect } from "next/navigation";
import { UnauthorizedError } from "./spring";

export type ActionResult<T = undefined> = {
  ok: boolean;
  data?: T;
  formError?: string;
  fieldErrors?: Record<string, string>;
  offline?: boolean;
};

export function fail(
  formError?: string,
  fieldErrors?: Record<string, string>,
): ActionResult {
  return { ok: false, formError, fieldErrors };
}

export function ok<T>(data?: T): ActionResult<T> {
  return { ok: true, data };
}

export function handleActionError(error: unknown): ActionResult {
  if (error instanceof UnauthorizedError) {
    redirect("/sign-in");
  }
  if (error instanceof Error) {
    const offline =
      error.message.includes("could not reach") ||
      error.message.includes("offline");
    return { ok: false, formError: error.message, offline };
  }
  return { ok: false, formError: "Something went wrong. Please try again." };
}
