"use client";

import { useRouter } from "next/navigation";
import { PROVIDER_ROLES } from "@/features/provider/lib/options";
import { useProviderDraft } from "@/features/provider/draft-provider";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard, Screen } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Stepper } from "@/components/ui/stepper";
import { TextField } from "@/components/ui/text-field";

export default function ProfessionalInfoPage() {
  const router = useRouter();
  const { draft, update } = useProviderDraft();

  return (
    <Screen>
      <PageHeader title="Professional info" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <Stepper current={1} />
          <h2 className="mt-5 text-xl font-semibold text-ink">Your professional details</h2>
          <div className="mt-5 space-y-4">
            <TextField
              label="Professional title"
              value={draft.professionalTitle}
              onChange={(e) => update({ professionalTitle: e.currentTarget.value })}
            />
            <TextField
              label="Years of experience"
              value={draft.yearsOfExperience}
              onChange={(e) => update({ yearsOfExperience: e.currentTarget.value })}
            />
            <Select
              label="Role"
              value={draft.role}
              onChange={(value) => update({ role: value })}
              placeholder="Select a role"
              options={PROVIDER_ROLES.map((role) => ({ value: role, label: role }))}
            />
            <TextField
              label="Business email"
              value={draft.businessEmail}
              onChange={(e) => update({ businessEmail: e.currentTarget.value })}
            />
            <TextField
              label="Business phone"
              value={draft.businessPhone}
              onChange={(e) => update({ businessPhone: e.currentTarget.value })}
            />
          </div>
        </FormCard>
      </div>
      <AuthBottomBar
        primaryLabel="Continue"
        onPrimary={() => router.push("/provider/onboarding/business")}
      />
    </Screen>
  );
}
