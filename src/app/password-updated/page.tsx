"use client";

import { useRouter } from "next/navigation";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard, Screen } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";

export default function PasswordUpdatedPage() {
  const router = useRouter();
  return (
    <Screen>
      <PageHeader title="Password updated" showBack={false} />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <h2 className="text-center text-2xl font-bold text-ink">You’re all set</h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Sign in with your new password when the reset flow is connected to the API.
          </p>
        </FormCard>
      </div>
      <AuthBottomBar primaryLabel="Back to sign in" onPrimary={() => router.push("/sign-in")} />
    </Screen>
  );
}
