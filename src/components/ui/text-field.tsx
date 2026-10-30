"use client";

import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  label: string;
  error?: string;
  multiline?: boolean;
};

export function TextField({
  label,
  error,
  id,
  multiline,
  className = "",
  ...props
}: Props) {
  const fieldId = id ?? label.replace(/\s+/g, "-").toLowerCase();
  const errorId = `${fieldId}-error`;
  const shared =
    "w-full rounded-[10px] border bg-surface px-3 py-3 text-sm text-ink placeholder:text-text-secondary " +
    (error ? "border-error" : "border-warm-border");

  return (
    <div className="w-full">
      <label htmlFor={fieldId} className="mb-1 block text-sm font-semibold text-ink">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={fieldId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${shared} min-h-28 ${className}`}
          {...(props as InputHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={fieldId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${shared} ${className}`}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
