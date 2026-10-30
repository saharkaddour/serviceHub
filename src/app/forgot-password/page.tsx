"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { emailSchema } from "@/features/auth/schemas";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard, Screen } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";
import { TextField } from "@/components/ui/text-field";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [notice, setNotice] = useState<string | undefined>();

  function submit() {
    const parsed = emailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    // No password-reset endpoint is documented yet: no network call is made.
    setNotice("Password reset is not connected to the server yet.");
    router.push(`/forgot-password/verify?email=${encodeURIComponent(parsed.data.email)}`);
  }

  return (
    <Screen>
      <PageHeader title="Forgot password" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <h2 className="text-center text-xl font-semibold text-ink">Let’s get you back in</h2>
          <p className="mt-2 text-center text-xs text-text-secondary">
            Enter the email you use for ServiceHub. We’ll send you a secure password reset
            link.
          </p>
          {notice ? <p className="mt-3 text-xs text-warning">{notice}</p> : null}
          <div className="mt-8">
            <TextField
              label="Email address"
              value={email}
              onChange={(event) => {
                setEmail(event.currentTarget.value);
                setError(undefined);
              }}
              error={error}
              placeholder="alex.morgan@example.com"
            />
          </div>
          <p className="mt-4 text-xs text-text-secondary">
            If an account exists for this email, you’ll receive a link. For your security, it
            expires after 30 minutes.
          </p>
        </FormCard>
      </div>
      <AuthBottomBar
        primaryLabel="Send OTP"
        onPrimary={submit}
        secondaryLabel="Back to sign in"
        onSecondary={() => router.push("/sign-in")}
      />
    </Screen>
  );
}
