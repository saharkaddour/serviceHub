/**
 * TODO(backend): confirm the exact login token response shape with the Spring
 * team. AuthResponse currently looks like `{ token, tokenType, user }`, but
 * the identity contract is not frozen, so this parser stays tolerant.
 */

export type SessionTokens = {
  accessToken: string;
  refreshToken?: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function firstText(
  source: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}

export function parseLoginResponse(json: unknown): SessionTokens {
  const root = asRecord(json);
  if (!root) {
    throw new Error("Unexpected login response.");
  }

  const nested = asRecord(root.tokens) ?? asRecord(root.data) ?? root;
  const accessToken = firstText(nested, [
    "accessToken",
    "access_token",
    "token",
    "jwt",
  ]);
  if (!accessToken) {
    throw new Error("Unexpected login response.");
  }

  return {
    accessToken,
    refreshToken: firstText(nested, ["refreshToken", "refresh_token"]),
  };
}
