"use client";

import { useProviderDraft } from "@/features/provider/draft-provider";
import { ProfileShell } from "@/components/layout/profile-shell";
import { PageHeader } from "@/components/ui/page-header";

export default function ProviderHomePage() {
  const { draft } = useProviderDraft();
  return (
    <ProfileShell variant="provider" current="/provider/home">
      <PageHeader title="Provider home" showBack={false} />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-ink">
          Welcome{draft.ownerName ? `, ${draft.ownerName.split(" ")[0]}` : ""}
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          {draft.businessName || "Your business"} is ready for the rest of the marketplace
          modules.
        </p>
      </div>
    </ProfileShell>
  );
}
