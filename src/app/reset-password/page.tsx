"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordSchema } from "@/features/auth/schemas";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard, Screen } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";
import { PasswordField } from "@/components/ui/password-field";
import { fieldErrorsFromZod } from "@/lib/zod-fields";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | undefined>();

  function submit() {
    const parsed = resetPasswordSchema.safeParse({ password, confirm });
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      return;
    }
    // No reset-password endpoint is documented yet: no network call is made.
    setNotice("Password reset is not connected to the server yet.");
    router.push("/password-updated");
  }

  return (
    <Screen>
      <PageHeader title="Reset password" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <h2 className="text-2xl font-bold text-ink">Choose a new password</h2>
          {notice ? <p className="mt-2 text-xs text-warning">{notice}</p> : null}
          <div className="mt-6 space-y-4">
            <PasswordField
              label="New password"
              value={password}
              onChange={setPassword}
              error={fieldErrors.password}
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirm password"
              value={confirm}
              onChange={setConfirm}
              error={fieldErrors.confirm}
              autoComplete="new-password"
            />
          </div>
        </FormCard>
      </div>
      <AuthBottomBar primaryLabel="Save password" onPrimary={submit} />
    </Screen>
  );
}
