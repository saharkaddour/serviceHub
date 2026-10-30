"use client";

import { useRouter } from "next/navigation";
import { InfoCard, InfoRow } from "@/components/ui/info-card";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileShell } from "@/components/layout/profile-shell";
import { useUser } from "@/features/auth/user-provider";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useUser();
  return (
    <ProfileShell>
      <PageHeader title="Account settings" />
      <div className="flex-1 overflow-auto p-4">
        <h2 className="text-xl font-semibold text-ink">Your account, your control</h2>
        <p className="mt-2 text-xs text-text-secondary">
          Manage security, preferences and permissions.
        </p>
        <div className="mt-5">
          <InfoCard>
            <InfoRow title="Email" subtitle={user?.email} />
            <InfoRow
              title="Phone number"
              subtitle={user?.phone ?? "Add a phone number"}
              action="Manage"
              onClick={() => router.push("/profile/phone")}
            />
            <InfoRow
              title="Log out"
              subtitle="Sign out of this device"
              onClick={() => router.push("/logout")}
            />
          </InfoCard>
        </div>
      </div>
    </ProfileShell>
  );
}
