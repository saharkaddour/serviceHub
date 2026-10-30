"use client";

import { useRouter } from "next/navigation";
import { useProviderDraft } from "@/features/provider/draft-provider";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard, Screen } from "@/components/ui/form-card";
import { InfoCard, InfoRow } from "@/components/ui/info-card";
import { PageHeader } from "@/components/ui/page-header";

export default function ProviderOnboardingPage() {
  const router = useRouter();
  const { draft } = useProviderDraft();
  const name = draft.ownerName.split(" ")[0] || "";
  const business = draft.businessName || "your business";

  return (
    <Screen>
      <PageHeader title="Set up your business" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <p className="rounded-[10px] bg-warm-border px-3 py-2 text-xs text-ink">
            TODO: provider profiles are not stored on the Spring API yet.
          </p>
          <h2 className="mt-4 text-center text-xl font-semibold text-ink">
            Let’s meet your business
          </h2>
          <p className="mt-2 text-center text-xs text-text-secondary">
            {name ? `Welcome, ${name}` : "Welcome"}. Build a profile that helps customers
            choose {business} with confidence.
          </p>
          <div className="mt-6">
            <InfoCard>
              <InfoRow title="Your professional details" subtitle="Your experience and business contact" />
              <InfoRow title="Your services and area" subtitle="What you do and where you work" />
              <InfoRow title="Photo and verification" subtitle="Help customers recognize you" />
            </InfoCard>
          </div>
        </FormCard>
      </div>
      <AuthBottomBar
        primaryLabel="Start setup"
        onPrimary={() => router.push("/provider/onboarding/professional")}
      />
    </Screen>
  );
}
