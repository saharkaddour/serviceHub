"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileShell } from "@/components/layout/profile-shell";
import { useUser } from "@/features/auth/user-provider";
import { Avatar } from "@/components/ui/avatar";

export default function ProfilePhotoPage() {
  const router = useRouter();
  const { user } = useUser();
  const [notice, setNotice] = useState<string | undefined>();

  return (
    <ProfileShell>
      <PageHeader title="Profile photo" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <div className="flex justify-center">
            <Avatar name={user?.fullName ?? "?"} size={96} />
          </div>
          <p className="mt-4 text-center text-sm text-text-secondary">
            A photo helps providers recognize you.
          </p>
          {notice ? <p className="mt-3 text-center text-xs text-warning">{notice}</p> : null}
        </FormCard>
      </div>
      <AuthBottomBar
        primaryLabel="Upload photo"
        onPrimary={() => setNotice("Photo upload is not available yet.")}
        secondaryLabel="Cancel"
        onSecondary={() => router.back()}
      />
    </ProfileShell>
  );
}
