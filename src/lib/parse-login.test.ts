import { describe, expect, it } from "vitest";
import { parseLoginResponse } from "./parse-login";

describe("parseLoginResponse", () => {
  it("reads token from the Spring AuthResponse shape", () => {
    expect(parseLoginResponse({ token: "abc", tokenType: "Bearer" })).toEqual({
      accessToken: "abc",
      refreshToken: undefined,
    });
  });

  it("reads nested accessToken and refreshToken", () => {
    expect(
      parseLoginResponse({
        data: { access_token: "a", refresh_token: "r" },
      }),
    ).toEqual({ accessToken: "a", refreshToken: "r" });
  });

  it("reads jwt from a tokens object", () => {
    expect(parseLoginResponse({ tokens: { jwt: "j" } }).accessToken).toBe("j");
  });
});
