"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard, Screen } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";
import { Stepper } from "@/components/ui/stepper";

export default function PhotoVerificationPage() {
  const router = useRouter();
  const [notice, setNotice] = useState<string | undefined>();
  return (
    <Screen>
      <PageHeader title="Photo and documents" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <Stepper current={3} />
          <h2 className="mt-5 text-xl font-semibold text-ink">Help customers recognize you</h2>
          {notice ? <p className="mt-3 text-xs text-warning">{notice}</p> : null}
          <p className="mt-3 text-sm text-text-secondary">
            Photo upload is not connected to the API yet.
          </p>
        </FormCard>
      </div>
      <AuthBottomBar
        primaryLabel="Continue to preview"
        onPrimary={() => router.push("/provider/onboarding/preview")}
        secondaryLabel="Upload later"
        onSecondary={() => setNotice("Photo upload is not available yet.")}
      />
    </Screen>
  );
}
