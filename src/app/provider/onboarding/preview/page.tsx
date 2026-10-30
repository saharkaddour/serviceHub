"use client";

import { useRouter } from "next/navigation";
import { useProviderDraft } from "@/features/provider/draft-provider";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard, Screen } from "@/components/ui/form-card";
import { InfoCard, InfoRow } from "@/components/ui/info-card";
import { PageHeader } from "@/components/ui/page-header";
import { Stepper } from "@/components/ui/stepper";

export default function PreviewPage() {
  const router = useRouter();
  const { draft } = useProviderDraft();
  return (
    <Screen>
      <PageHeader title="Profile preview" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <Stepper current={4} />
          <h2 className="mt-5 text-xl font-semibold text-ink">
            {draft.businessName || "Your business"}
          </h2>
          <p className="mt-2 text-sm text-text-secondary">{draft.businessDescription}</p>
          <div className="mt-4">
            <InfoCard>
              <InfoRow title="Category" subtitle={draft.primaryCategory || "—"} />
              <InfoRow title="Area" subtitle={`${draft.serviceArea} · ${draft.travelRadius}`} />
              <InfoRow title="Experience" subtitle={`${draft.professionalTitle} · ${draft.yearsOfExperience} years`} />
            </InfoCard>
          </div>
        </FormCard>
      </div>
      <AuthBottomBar
        primaryLabel="Submit for review"
        onPrimary={() => router.push("/provider/verification")}
      />
    </Screen>
  );
}
