"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAddressAction } from "@/features/addresses/actions";
import { readExtras, writeExtras } from "@/features/addresses/lib/extras";
import { useUser } from "@/features/auth/user-provider";
import { useOnline } from "@/hooks/use-online";
import { nextDefaultId } from "@/lib/address-rules";
import { Button } from "@/components/ui/button";
import { InfoCard, InfoRow } from "@/components/ui/info-card";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileShell } from "@/components/layout/profile-shell";

export default function AddressesPage() {
  const router = useRouter();
  const { addresses, refresh, setNotice } = useUser();
  const { offline } = useOnline();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  async function remove(id: string) {
    if (offline) {
      setError("You are offline. Reconnect to save your changes.");
      return;
    }
    if (!window.confirm("Delete this address?")) return;
    const result = await deleteAddressAction(id);
    if (!result.ok) {
      setError(result.formError);
      return;
    }
    const extras = readExtras();
    delete extras[id];
    const remaining = addresses.filter((item) => item.id !== id);
    const nextId = nextDefaultId(remaining, id);
    if (nextId) extras[nextId] = { ...extras[nextId], isDefault: true };
    writeExtras(extras);
    setNotice("Address deleted.");
    await refresh();
    setPendingId(null);
  }

  return (
    <ProfileShell>
      <PageHeader title="Saved addresses" />
      <div className="flex-1 overflow-auto p-4 pb-24">
        {error ? <p className="mb-3 text-xs text-error">{error}</p> : null}
        {addresses.length === 0 ? (
          <p className="text-sm text-text-secondary">Add your first address</p>
        ) : (
          <InfoCard>
            {addresses.map((address) => (
              <div key={address.id} className="border-b border-warm-border last:border-0">
                <InfoRow
                  title={address.label + (address.isDefault ? " · Default" : "")}
                  subtitle={`${address.street}, ${address.city} ${address.zip}`}
                  action="Edit"
                  onClick={() => router.push(`/profile/addresses/${address.id}/edit`)}
                />
                <div className="px-4 pb-3">
                  <button
                    type="button"
                    className="text-xs font-semibold text-error"
                    onClick={() => setPendingId(address.id)}
                  >
                    Delete
                  </button>
                  {pendingId === address.id ? (
                    <div className="mt-2 flex gap-2">
                      <Button variant="danger" onClick={() => void remove(address.id)}>
                        Confirm delete
                      </Button>
                      <Button variant="text" onClick={() => setPendingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </InfoCard>
        )}
        <div className="mt-4">
          <Button onClick={() => router.push("/profile/addresses/new")}>Add address</Button>
        </div>
      </div>
    </ProfileShell>
  );
}
