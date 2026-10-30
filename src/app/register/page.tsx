"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/features/auth/actions";
import { registerSchema } from "@/features/auth/schemas";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard, Screen } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";
import { PasswordField } from "@/components/ui/password-field";
import { Select } from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";
import { fieldErrorsFromZod } from "@/lib/zod-fields";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const errorCount = useMemo(
    () => Object.values(fieldErrors).filter(Boolean).length,
    [fieldErrors],
  );
  const hasErrors = errorCount > 0 || Boolean(formError);
  const summary =
    formError ??
    (errorCount === 1
      ? "1 field needs your attention"
      : `${errorCount} fields need your attention`);

  function clear(field: string) {
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setFormError(undefined);
  }

  async function submit() {
    const parsed = registerSchema.safeParse({ fullName, email, phone, password });
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      return;
    }
    setLoading(true);
    const result = await registerAction(parsed.data);
    setLoading(false);
    if (!result.ok) {
      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError);
      return;
    }
    router.push("/sign-in");
  }

  return (
    <Screen>
      <PageHeader title="Create account" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <h2 className="text-2xl font-bold text-ink">
            {hasErrors ? "Check a few details" : "Make home life easier"}
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            {hasErrors
              ? "Your information is still here. Fix the highlighted fields to continue."
              : "Create your customer account to book trusted home help."}
          </p>
          {hasErrors ? (
            <p role="alert" aria-live="polite" className="mt-3 text-xs text-error">
              {summary}
            </p>
          ) : null}

          <div className="mt-5">
            <Select
              label="I want to"
              value={role}
              onChange={(value) => {
                setRole(value);
                if (value === "provider") router.push("/register/provider");
              }}
              options={[
                { value: "customer", label: "Book services · Customer" },
                { value: "provider", label: "Offer services · Provider" },
              ]}
            />
          </div>
          <p className="mt-2 text-xs text-text-secondary">* Required fields</p>
          <div className="mt-4 space-y-4">
            <TextField
              label="Full name *"
              value={fullName}
              onChange={(event) => {
                setFullName(event.currentTarget.value);
                clear("fullName");
              }}
              error={fieldErrors.fullName}
              placeholder="Alex Morgan"
              autoComplete="name"
            />
            <TextField
              label="Email address *"
              value={email}
              onChange={(event) => {
                setEmail(event.currentTarget.value);
                clear("email");
              }}
              error={fieldErrors.email}
              placeholder="alex.morgan@example.com"
              autoComplete="email"
            />
            <TextField
              label="Phone number *"
              value={phone}
              onChange={(event) => {
                setPhone(event.currentTarget.value);
                clear("phone");
              }}
              error={fieldErrors.phone}
              placeholder="+216 20 123 456"
              autoComplete="tel"
            />
            <PasswordField
              label="Password *"
              value={password}
              onChange={(value) => {
                setPassword(value);
                clear("password");
              }}
              error={fieldErrors.password}
              autoComplete="new-password"
            />
            <p className="text-xs text-text-secondary">
              Use at least 8 characters. By creating an account, you agree to the Terms of
              Service and Privacy Policy.
            </p>
          </div>
        </FormCard>
      </div>
      <AuthBottomBar
        primaryLabel="Create customer account"
        onPrimary={() => void submit()}
        loading={loading}
        secondaryLabel="Already have an account? Sign in"
        onSecondary={() => router.push("/sign-in")}
      />
    </Screen>
  );
}
