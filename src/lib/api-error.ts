export type SpringErrorBody = {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  fieldErrors?: Record<string, string>;
};

export type FieldErrors = Record<string, string>;

export function parseSpringError(json: unknown): SpringErrorBody | null {
  if (json === null || typeof json !== "object" || Array.isArray(json)) {
    return null;
  }
  return json as SpringErrorBody;
}

export function mapRegisterError(body: SpringErrorBody | null): {
  formError?: string;
  fieldErrors?: FieldErrors;
} {
  const message = body?.message ?? "Something went wrong. Please try again.";
  if (message.toLowerCase().includes("already exists")) {
    return { fieldErrors: { email: "An account with this email already exists." } };
  }
  if (body?.fieldErrors) {
    return { fieldErrors: body.fieldErrors };
  }
  return { formError: message };
}

export function userMessageForStatus(status: number, fallback?: string): string {
  if (status === 401) return "Incorrect email or password.";
  if (status === 403) return "You do not have permission to do that.";
  if (status === 404) return "The requested information could not be found.";
  if (status >= 500) return "The server is temporarily unavailable. Try again shortly.";
  return fallback ?? "Something went wrong. Please try again.";
}
