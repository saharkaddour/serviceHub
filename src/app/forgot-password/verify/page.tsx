"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { otpSchema } from "@/features/auth/schemas";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard, Screen } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";
import { TextField } from "@/components/ui/text-field";

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [notice, setNotice] = useState<string | undefined>();

  function submit() {
    const parsed = otpSchema.safeParse({ otp });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    // No OTP endpoint is documented yet: the code is only checked locally.
    setNotice("OTP verification is not connected yet.");
  }

  return (
    <Screen>
      <PageHeader title="Forgot password" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <h2 className="text-center text-xl font-semibold text-ink">Enter your code</h2>
          <p className="mt-2 text-center text-xs text-text-secondary">
            We would send a 4-digit code to {email || "your email"}.
          </p>
          {notice ? (
            <p role="status" className="mt-3 text-xs text-warning">
              {notice}
            </p>
          ) : null}
          <div className="mt-8">
            <TextField
              label="OTP"
              value={otp}
              inputMode="numeric"
              maxLength={4}
              onChange={(event) => {
                setOtp(event.currentTarget.value);
                setError(undefined);
              }}
              error={error}
            />
          </div>
        </FormCard>
      </div>
      <AuthBottomBar
        primaryLabel="Verify OTP"
        onPrimary={submit}
        secondaryLabel="Use a different email"
        onSecondary={() => router.push("/forgot-password")}
      />
    </Screen>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
