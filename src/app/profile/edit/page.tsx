"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/features/profile/actions";
import { profileSchema } from "@/features/profile/schemas";
import { useUser } from "@/features/auth/user-provider";
import { writeLocal } from "@/hooks/use-local-storage";
import { useOnline } from "@/hooks/use-online";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileShell } from "@/components/layout/profile-shell";
import { TextField } from "@/components/ui/text-field";
import { STORAGE_KEYS } from "@/lib/types";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, refresh, setNotice } = useUser();
  const { offline } = useOnline();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [preferredName, setPreferredName] = useState(user?.preferredName ?? "");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function save() {
    if (offline) {
      setError("You are offline. Reconnect to save your changes.");
      return;
    }
    const parsed = profileSchema.safeParse({ fullName, preferredName });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    setLoading(true);
    const result = await updateProfileAction(parsed.data);
    setLoading(false);
    if (!result.ok) {
      setError(result.formError);
      return;
    }
    writeLocal(STORAGE_KEYS.preferredName, preferredName.trim());
    setNotice("Personal information updated.");
    await refresh();
    router.push("/profile");
  }

  return (
    <ProfileShell>
      <PageHeader title="Personal information" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <h2 className="text-2xl font-bold text-ink">Make it yours</h2>
          <div className="mt-6 space-y-4">
            <TextField
              label="Full name *"
              value={fullName}
              onChange={(event) => setFullName(event.currentTarget.value)}
              error={error}
            />
            <TextField
              label="Preferred name"
              value={preferredName}
              onChange={(event) => setPreferredName(event.currentTarget.value)}
            />
            <TextField label="Email" value={user?.email ?? ""} disabled />
            <p className="text-xs text-text-secondary">
              * Required. Your name is shared with providers when you book. Your email is never
              shown on a public profile.
            </p>
          </div>
        </FormCard>
      </div>
      <AuthBottomBar
        primaryLabel="Save changes"
        onPrimary={() => void save()}
        loading={loading}
        disabled={offline}
        secondaryLabel="Cancel"
        onSecondary={() => router.back()}
      />
    </ProfileShell>
  );
}
