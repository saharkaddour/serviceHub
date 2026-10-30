"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/features/auth/schemas";
import { useProviderDraft } from "@/features/provider/draft-provider";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard, Screen } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";
import { PasswordField } from "@/components/ui/password-field";
import { Select } from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";
import { fieldErrorsFromZod } from "@/lib/zod-fields";

export default function ProviderRegisterPage() {
  const router = useRouter();
  const { update } = useProviderDraft();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("business");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function submit() {
    const parsed = registerSchema.safeParse({ fullName, email, phone, password });
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      return;
    }
    // TODO(backend): POST /auth/register always creates a CUSTOMER. No provider
    // account is created here; this only starts the onboarding UI.
    update({
      ownerName: fullName.trim(),
      businessEmail: email.trim(),
      businessPhone: phone.trim(),
      role: accountType,
    });
    router.push("/provider/onboarding");
  }

  return (
    <Screen>
      <PageHeader title="Create provider account" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <p className="rounded-[10px] bg-warm-border px-3 py-2 text-xs text-ink">
            Provider accounts are not created on the server yet. This flow is a
            UI prototype only.
          </p>
          <h2 className="mt-4 text-2xl font-bold text-ink">Offer services nearby</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Tell customers who you are. You can finish your business profile next.
          </p>
          <div className="mt-5 space-y-4">
            <Select
              label="I want to"
              value="provider"
              onChange={(value) => {
                if (value === "customer") router.push("/register");
              }}
              options={[
                { value: "customer", label: "Book services · Customer" },
                { value: "provider", label: "Offer services · Provider" },
              ]}
            />
            <Select
              label="Account type"
              value={accountType}
              onChange={setAccountType}
              options={[
                { value: "business", label: "Business" },
                { value: "independent", label: "Independent professional" },
              ]}
            />
            <TextField
              label="Full name *"
              value={fullName}
              onChange={(event) => setFullName(event.currentTarget.value)}
              error={fieldErrors.fullName}
            />
            <TextField
              label="Email address *"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              error={fieldErrors.email}
            />
            <TextField
              label="Phone number *"
              value={phone}
              onChange={(event) => setPhone(event.currentTarget.value)}
              error={fieldErrors.phone}
            />
            <PasswordField
              label="Password *"
              value={password}
              onChange={setPassword}
              error={fieldErrors.password}
              autoComplete="new-password"
            />
          </div>
        </FormCard>
      </div>
      <AuthBottomBar
        primaryLabel="Continue to business setup"
        onPrimary={submit}
        secondaryLabel="Already have an account? Sign in"
        onSecondary={() => router.push("/sign-in")}
      />
    </Screen>
  );
}
