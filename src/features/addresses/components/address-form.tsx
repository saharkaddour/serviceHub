"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveAddressAction } from "@/features/addresses/actions";
import { addressSchema } from "@/features/addresses/schemas";
import { readExtras, writeExtras } from "@/features/addresses/lib/extras";
import { useUser } from "@/features/auth/user-provider";
import { useOnline } from "@/hooks/use-online";
import { isDuplicateAddress, withSingleDefault } from "@/lib/address-rules";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileShell } from "@/components/layout/profile-shell";
import { TextField } from "@/components/ui/text-field";
import { fieldErrorsFromZod } from "@/lib/zod-fields";
import type { SavedAddress } from "@/lib/types";

export function AddressForm({ address }: { address?: SavedAddress }) {
  const router = useRouter();
  const { addresses, refresh, setNotice } = useUser();
  const { offline } = useOnline();
  const isFirst = addresses.length === 0;
  const [label, setLabel] = useState(address?.label ?? "Home");
  const [street, setStreet] = useState(address?.street ?? "");
  const [unit, setUnit] = useState(address?.unit ?? "");
  const [city, setCity] = useState(address?.city ?? "");
  const [state, setState] = useState(address?.state ?? "");
  const [zip, setZip] = useState(address?.zip ?? "");
  const [accessNote, setAccessNote] = useState(address?.accessNote ?? "");
  const [isDefault, setIsDefault] = useState(isFirst || Boolean(address?.isDefault));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function save() {
    if (offline) {
      setFormError("You are offline. Reconnect to save your changes.");
      return;
    }
    const parsed = addressSchema.safeParse({
      id: address?.id,
      label,
      street,
      unit,
      city,
      state,
      zip,
      accessNote,
      isDefault,
    });
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      return;
    }
    const candidate = withSingleDefault(addresses, {
      id: address?.id,
      street: parsed.data.street,
      city: parsed.data.city,
      zip: parsed.data.zip,
      isDefault: parsed.data.isDefault,
    });
    if (isDuplicateAddress(addresses, candidate)) {
      setFormError("This address is already saved.");
      return;
    }
    setLoading(true);
    const result = await saveAddressAction({ ...parsed.data, isDefault: candidate.isDefault });
    setLoading(false);
    if (!result.ok) {
      setFormError(result.formError);
      setFieldErrors(result.fieldErrors ?? {});
      return;
    }
    const id = result.data?.id || address?.id;
    if (id) {
      const extras = readExtras();
      if (candidate.isDefault) {
        for (const key of Object.keys(extras)) extras[key] = { ...extras[key], isDefault: false };
      }
      extras[id] = {
        state,
        accessNote,
        unit,
        street: parsed.data.street,
        isDefault: Boolean(candidate.isDefault),
        country: "United States",
      };
      writeExtras(extras);
    }
    setNotice(address ? "Address updated." : "Address saved.");
    await refresh();
    router.push("/profile/addresses");
  }

  return (
    <ProfileShell>
      <PageHeader title={address ? "Edit address" : "Add address"} />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <h2 className="text-xl font-semibold text-ink">Where should we come?</h2>
          <p className="mt-2 text-xs text-text-secondary">
            Use a complete address to help your provider find you.
          </p>
          {formError ? (
            <p role="alert" className="mt-3 text-xs text-error">
              {formError}
            </p>
          ) : null}
          <div className="mt-5 space-y-4">
            <TextField label="Address label" value={label} onChange={(e) => setLabel(e.currentTarget.value)} />
            <TextField label="Street address *" value={street} error={fieldErrors.street} onChange={(e) => setStreet(e.currentTarget.value)} />
            <TextField label="Unit" value={unit} onChange={(e) => setUnit(e.currentTarget.value)} />
            <TextField label="City *" value={city} error={fieldErrors.city} onChange={(e) => setCity(e.currentTarget.value)} />
            <TextField label="State" value={state} onChange={(e) => setState(e.currentTarget.value)} />
            <TextField label="ZIP *" value={zip} error={fieldErrors.zip} onChange={(e) => setZip(e.currentTarget.value)} />
            <TextField label="Access note" value={accessNote} onChange={(e) => setAccessNote(e.currentTarget.value)} />
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={isDefault}
                disabled={isFirst}
                onChange={(event) => setIsDefault(event.target.checked)}
              />
              Default address
            </label>
          </div>
        </FormCard>
      </div>
      <AuthBottomBar
        primaryLabel="Save address"
        onPrimary={() => void save()}
        loading={loading}
        disabled={offline}
        secondaryLabel="Cancel"
        onSecondary={() => router.back()}
      />
    </ProfileShell>
  );
}
