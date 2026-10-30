"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompletion } from "@ai-sdk/react";
import {
  ADDITIONAL_SERVICES,
  MAX_DESCRIPTION,
  PROVIDER_CATEGORIES,
  SERVICE_AREAS,
  TRAVEL_RADII,
} from "@/features/provider/lib/options";
import { useProviderDraft } from "@/features/provider/draft-provider";
import { useOnline } from "@/hooks/use-online";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { Button } from "@/components/ui/button";
import { FormCard, Screen } from "@/components/ui/form-card";
import { MultiSelect } from "@/components/ui/multi-select";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Stepper } from "@/components/ui/stepper";
import { TextField } from "@/components/ui/text-field";

export default function BusinessDetailsPage() {
  const router = useRouter();
  const { draft, update } = useProviderDraft();
  const { offline } = useOnline();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiError, setAiError] = useState<string | undefined>();

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/ai/business-description",
    streamProtocol: "text",
    onError: (error) => setAiError(error.message),
  });

  useEffect(() => {
    if (completion) update({ businessDescription: completion.slice(0, MAX_DESCRIPTION) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completion]);

  function continueNext() {
    const next: Record<string, string> = {};
    if (!draft.businessName.trim()) next.businessName = "Enter your business name.";
    if (!draft.businessDescription.trim()) next.businessDescription = "Describe your business.";
    if (!draft.primaryCategory) next.primaryCategory = "Select a category.";
    if (!draft.serviceArea) next.serviceArea = "Select a service area.";
    if (!draft.travelRadius) next.travelRadius = "Select a travel radius.";
    setErrors(next);
    if (Object.keys(next).length) return;
    router.push("/provider/onboarding/photo");
  }

  async function generate() {
    setAiError(undefined);
    if (offline) {
      setAiError("You are offline. Reconnect to generate a description.");
      return;
    }
    if (!draft.primaryCategory || !draft.serviceArea) {
      setAiError("Choose a category and service area first.");
      return;
    }
    await complete("", {
      body: {
        businessName: draft.businessName || "My business",
        category: draft.primaryCategory,
        services: draft.additionalServices,
        area: draft.serviceArea,
        yearsOfExperience: draft.yearsOfExperience || "0",
      },
    });
  }

  return (
    <Screen>
      <PageHeader title="Business details" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <Stepper current={2} />
          <h2 className="mt-5 text-xl font-semibold text-ink">Show what you do best</h2>
          <p className="mt-2 text-xs text-text-secondary">
            Tell customers about your business and where you offer services.
          </p>
          <div className="mt-5 space-y-4">
            <TextField
              label="Business name *"
              value={draft.businessName}
              error={errors.businessName}
              onChange={(e) => update({ businessName: e.currentTarget.value })}
            />
            <TextField
              label="Business description *"
              multiline
              maxLength={MAX_DESCRIPTION}
              value={draft.businessDescription}
              error={errors.businessDescription}
              onChange={(e) => update({ businessDescription: e.currentTarget.value })}
            />
            <p className="text-xs text-text-secondary">
              Up to {MAX_DESCRIPTION} characters · Describe what makes your service different.
            </p>
            {aiError ? <p className="text-xs text-error">{aiError}</p> : null}
            <Button variant="outline" loading={isLoading} disabled={offline} onClick={() => void generate()}>
              Generate with AI
            </Button>
            <Select
              label="Primary service category *"
              value={draft.primaryCategory}
              error={errors.primaryCategory}
              placeholder="Select a category"
              onChange={(value) => update({ primaryCategory: value })}
              options={PROVIDER_CATEGORIES.map((item) => ({ value: item, label: item }))}
            />
            <MultiSelect
              label="Additional services"
              options={ADDITIONAL_SERVICES}
              selected={draft.additionalServices}
              onChange={(value) => update({ additionalServices: value })}
            />
            <Select
              label="Service area *"
              value={draft.serviceArea}
              error={errors.serviceArea}
              placeholder="Select a service area"
              onChange={(value) => update({ serviceArea: value })}
              options={SERVICE_AREAS.map((item) => ({ value: item, label: item }))}
            />
            <Select
              label="Travel radius *"
              value={draft.travelRadius}
              error={errors.travelRadius}
              placeholder="Select a travel radius"
              onChange={(value) => update({ travelRadius: value })}
              options={TRAVEL_RADII.map((item) => ({ value: item, label: item }))}
            />
          </div>
        </FormCard>
      </div>
      <AuthBottomBar primaryLabel="Continue to photo" onPrimary={continueNext} />
    </Screen>
  );
}
