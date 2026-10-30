"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileShell } from "@/components/layout/profile-shell";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InfoCard, InfoRow } from "@/components/ui/info-card";
import { PageHeader } from "@/components/ui/page-header";
import { SuccessBanner } from "@/components/ui/success-banner";
import { useUser } from "@/features/auth/user-provider";

export default function ProfilePage() {
  const router = useRouter();
  const { user, addresses, loading, fromCache, notice, setNotice } = useUser();
  const [updated, setUpdated] = useState(Boolean(notice));
  const defaultAddress = addresses.find((item) => item.isDefault) ?? addresses[0];

  if (loading && !user) {
    return (
      <ProfileShell>
        <p className="p-6 text-sm text-text-secondary">Loading your profile…</p>
      </ProfileShell>
    );
  }

  if (!user) {
    return (
      <ProfileShell>
        <p className="p-6 text-sm text-text-secondary">Sign in to see your profile.</p>
        <div className="px-6">
          <Button onClick={() => router.push("/sign-in")}>Sign in</Button>
        </div>
      </ProfileShell>
    );
  }

  const summary = (
    <div>
      <div className="flex justify-center">
        <Avatar name={user.fullName} />
      </div>
      <p className="mt-3 text-center text-base font-bold text-ink">{user.fullName}</p>
      <p className="text-center text-xs text-text-secondary">{user.email}</p>
      <div className="mt-4">
        {updated ? (
          <Button variant="outline" onClick={() => router.push("/profile")}>
            Continue to customer home
          </Button>
        ) : (
          <Button variant="outline" onClick={() => router.push("/profile/edit")}>
            Edit personal information
          </Button>
        )}
      </div>
    </div>
  );

  const cards = (
    <div>
      <h2 className="mb-3 text-base font-bold text-ink">Your information</h2>
      <InfoCard>
        {updated ? (
          <InfoRow
            title="Personal information"
            subtitle={
              user.preferredName
                ? `${user.fullName} · Preferred name ${user.preferredName}`
                : user.fullName
            }
            action="Edit"
            onClick={() => router.push("/profile/edit")}
          />
        ) : (
          <InfoRow
            title="Profile photo"
            subtitle={user.hasPhoto ? "Photo added" : "Add a photo so providers recognize you"}
            action={user.hasPhoto ? "Change" : "Add"}
            onClick={() => router.push("/profile/photo")}
          />
        )}
        <InfoRow
          title="Phone number"
          subtitle={user.phone ?? "Add a phone number"}
          action="Manage"
          onClick={() => router.push("/profile/phone")}
        />
        <InfoRow
          title="Saved addresses"
          subtitle={defaultAddress ? `${defaultAddress.label} · ${defaultAddress.street}` : "Add your first address"}
          action="Manage"
          onClick={() => router.push("/profile/addresses")}
        />
        <InfoRow
          title="Account settings"
          subtitle="Security, permissions and preferences"
          onClick={() => router.push("/profile/settings")}
        />
      </InfoCard>
    </div>
  );

  return (
    <ProfileShell>
      <PageHeader title="My profile" showBack={false} />
      <div className="flex-1 overflow-auto p-4 pb-24">
        {notice ? (
          <div className="mb-4">
            <SuccessBanner
              message={notice}
              onClose={() => {
                setNotice(null);
                setUpdated(true);
              }}
            />
          </div>
        ) : null}
        <div className="grid gap-6 md:grid-cols-[2fr_3fr]">{summary}{cards}</div>
        <p className="mt-4 text-xs text-text-secondary">
          {fromCache
            ? "Saved data from your last visit (offline)."
            : "Customer account"}
        </p>
        <div className="mt-2 text-center">
          <button
            type="button"
            className="text-sm font-semibold text-error"
            onClick={() => router.push("/logout")}
          >
            Log out
          </button>
        </div>
      </div>
    </ProfileShell>
  );
}
