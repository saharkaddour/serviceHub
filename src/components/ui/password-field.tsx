"use client";

import { useState } from "react";
import { TextField } from "./text-field";

type Props = {
  label: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
};

export function PasswordField({
  label,
  name,
  value,
  onChange,
  error,
  disabled,
  autoComplete = "current-password",
}: Props) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <TextField
        label={label}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        error={error}
        disabled={disabled}
        autoComplete={autoComplete}
      />
      <div className="mt-1 flex justify-end">
        <button
          type="button"
          className="text-xs font-semibold text-accent"
          onClick={() => setShow((current) => !current)}
        >
          {show ? "Hide password" : "Show password"}
        </button>
      </div>
    </div>
  );
}
