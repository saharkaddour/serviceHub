"use client";

import { useRouter } from "next/navigation";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard, Screen } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";

export default function VerificationPage() {
  const router = useRouter();
  return (
    <Screen>
      <PageHeader title="Verification" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <p className="rounded-[10px] bg-warm-border px-3 py-2 text-xs text-ink">
            TODO: verification is a UI-only step. The backend has no provider onboarding
            endpoint yet.
          </p>
          <h2 className="mt-4 text-xl font-semibold text-ink">We’re reviewing your profile</h2>
          <p className="mt-2 text-sm text-text-secondary">
            You can explore the provider home while review is pending.
          </p>
        </FormCard>
      </div>
      <AuthBottomBar primaryLabel="Go to provider home" onPrimary={() => router.push("/provider/home")} />
    </Screen>
  );
}
