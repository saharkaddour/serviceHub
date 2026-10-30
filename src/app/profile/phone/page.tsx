"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { phoneSchema } from "@/features/profile/schemas";
import { useUser } from "@/features/auth/user-provider";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileShell } from "@/components/layout/profile-shell";
import { TextField } from "@/components/ui/text-field";

export default function PhonePage() {
  const router = useRouter();
  const { user } = useUser();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [notice, setNotice] = useState<string | undefined>();

  function send() {
    const parsed = phoneSchema.safeParse({ phone });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    // No phone-verification endpoint is documented yet.
    setNotice("Phone verification is not connected yet.");
  }

  return (
    <ProfileShell>
      <PageHeader title="Phone number" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <p className="text-sm text-text-secondary">
            Current number: {user?.phone ?? "None on file"}
          </p>
          {notice ? <p className="mt-2 text-xs text-warning">{notice}</p> : null}
          <div className="mt-6">
            <TextField
              label="New phone number"
              value={phone}
              onChange={(event) => {
                setPhone(event.currentTarget.value);
                setError(undefined);
              }}
              error={error}
            />
          </div>
        </FormCard>
      </div>
      <AuthBottomBar
        primaryLabel="Send verification code"
        onPrimary={send}
        secondaryLabel="Cancel"
        onSecondary={() => router.back()}
      />
    </ProfileShell>
  );
}
