import { z } from "zod";

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const phoneChars = /^\+?[0-9\s().-]+$/;
const otpPattern = /^[0-9]{4}$/;

export const MIN_PASSWORD_LENGTH = 8;

function validPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!phoneChars.test(trimmed)) return false;
  const digits = trimmed.replace(/[^0-9]/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

export const registerSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your full name."),
  email: z
    .string()
    .trim()
    .regex(emailPattern, "Enter a valid email address."),
  phone: z.string().refine(validPhone, "Enter a valid phone number."),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters.`),
});

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .regex(emailPattern, "Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .regex(emailPattern, "Enter a valid email address."),
});

export const otpSchema = z.object({
  otp: z.string().trim().regex(otpPattern, "Enter the 4-digit code."),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters.`),
    confirm: z.string(),
  })
  .refine((value) => value.password === value.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your full name."),
  preferredName: z.string().optional(),
});

export const phoneSchema = z.object({
  phone: z.string().refine(validPhone, "Enter a valid phone number."),
});

const zipPattern = /^[0-9]{5}(-[0-9]{4})?$/;

export const addressSchema = z.object({
  id: z.string().optional(),
  label: z.string().trim().min(1).default("Address"),
  street: z.string().trim().min(1, "Enter your street address."),
  unit: z.string().optional(),
  city: z.string().trim().min(1, "Enter your city."),
  state: z.string().optional(),
  zip: z.string().trim().regex(zipPattern, "Enter a valid ZIP code."),
  country: z.string().optional(),
  accessNote: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const aiDescriptionSchema = z.object({
  businessName: z.string().trim().min(1),
  category: z.string().trim().min(1),
  services: z.array(z.string()).default([]),
  area: z.string().trim().min(1),
  yearsOfExperience: z.union([z.string(), z.number()]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
