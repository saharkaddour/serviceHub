import { describe, expect, it } from "vitest";
import {
  addressSchema,
  otpSchema,
  registerSchema,
  signInSchema,
} from "./schemas";

describe("registerSchema", () => {
  it("requires a full name, email, phone and 8-character password", () => {
    const result = registerSchema.safeParse({
      fullName: "",
      email: "bad",
      phone: "12",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid customer form", () => {
    const result = registerSchema.safeParse({
      fullName: "Alex Morgan",
      email: "alex@example.com",
      phone: "+216 20 123 456",
      password: "password",
    });
    expect(result.success).toBe(true);
  });
});

describe("signInSchema", () => {
  it("requires a password", () => {
    const result = signInSchema.safeParse({ email: "a@b.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("otpSchema", () => {
  it("requires exactly 4 digits", () => {
    expect(otpSchema.safeParse({ otp: "12" }).success).toBe(false);
    expect(otpSchema.safeParse({ otp: "1234" }).success).toBe(true);
  });
});

describe("addressSchema", () => {
  it("accepts a 5+4 ZIP", () => {
    const result = addressSchema.safeParse({
      street: "24 Maple Street",
      city: "Austin",
      zip: "78701-1234",
    });
    expect(result.success).toBe(true);
  });
});
