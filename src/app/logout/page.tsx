"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "@/features/auth/actions";
import { useUser } from "@/features/auth/user-provider";
import { Avatar } from "@/components/ui/avatar";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileShell } from "@/components/layout/profile-shell";

export default function LogoutPage() {
  const router = useRouter();
  const { user, logoutLocal } = useUser();

  async function confirm() {
    logoutLocal();
    await logoutAction();
  }

  return (
    <ProfileShell>
      <PageHeader title="Log out" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <div className="flex justify-center">
            <Avatar name={user?.fullName ?? "?"} />
          </div>
          <p className="mt-3 text-center font-bold text-ink">{user?.fullName}</p>
          <p className="text-center text-xs text-text-secondary">{user?.email}</p>
          <div className="mt-5 rounded-[16px] border border-warm-border bg-surface p-4">
            <p className="font-bold text-ink">Log out of ServiceHub?</p>
            <p className="mt-1 text-xs text-text-secondary">
              You can sign back in anytime. Saved profile data on this device will be cleared.
            </p>
          </div>
        </FormCard>
      </div>
      <AuthBottomBar
        primaryLabel="Log out"
        onPrimary={() => void confirm()}
        secondaryLabel="Stay signed in"
        onSecondary={() => router.push("/profile")}
      />
    </ProfileShell>
  );
}
