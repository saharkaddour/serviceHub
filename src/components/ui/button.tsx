"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "text" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-surface border-transparent disabled:bg-disabled disabled:text-text-secondary",
  outline:
    "bg-surface text-accent border-accent disabled:text-text-secondary disabled:border-disabled",
  text: "bg-transparent text-accent border-transparent disabled:text-disabled",
  danger: "bg-surface text-error border-error disabled:text-disabled",
};

export function Button({
  variant = "primary",
  loading = false,
  fullWidth = true,
  className = "",
  children,
  disabled,
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex h-12 items-center justify-center rounded-[10px] border px-4 text-base font-semibold transition ${
        fullWidth ? "w-full" : "w-auto"
      } ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
