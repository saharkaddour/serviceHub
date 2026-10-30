"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/features/auth/actions";
import { signInSchema } from "@/features/auth/schemas";
import { useUser } from "@/features/auth/user-provider";
import { AuthBottomBar } from "@/components/ui/auth-bottom-bar";
import { FormCard, Screen } from "@/components/ui/form-card";
import { PageHeader } from "@/components/ui/page-header";
import { PasswordField } from "@/components/ui/password-field";
import { TextField } from "@/components/ui/text-field";
import { fieldErrorsFromZod } from "@/lib/zod-fields";

export default function SignInPage() {
  const router = useRouter();
  const { refresh } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function submit() {
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      return;
    }
    setLoading(true);
    const result = await loginAction(parsed.data);
    setLoading(false);
    if (!result.ok) {
      setFormError(result.formError);
      setFieldErrors(result.fieldErrors ?? {});
      return;
    }
    await refresh();
    router.push("/profile");
  }

  return (
    <Screen>
      <PageHeader title="Sign in" />
      <div className="flex-1 overflow-auto p-4">
        <FormCard>
          <h2 className="text-2xl font-bold text-ink">Welcome back</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to manage your bookings or your business.
          </p>
          {formError ? (
            <p role="alert" aria-live="polite" className="mt-3 text-xs text-error">
              {formError}
            </p>
          ) : null}
          <div className="mt-6 space-y-4">
            <TextField
              label="Email address"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              error={fieldErrors.email}
              autoComplete="email"
            />
            <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              error={fieldErrors.password}
            />
            <button
              type="button"
              className="text-sm font-semibold text-accent"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot password?
            </button>
            <div className="rounded-[16px] border border-warm-border bg-surface p-4">
              <p className="text-sm font-semibold text-ink">One secure account</p>
              <p className="mt-1 text-xs text-text-secondary">
                Customers and providers sign in here. We’ll take you to the right home
                for your account.
              </p>
            </div>
          </div>
        </FormCard>
      </div>
      <AuthBottomBar
        primaryLabel="Sign in"
        onPrimary={() => void submit()}
        loading={loading}
        secondaryLabel="New to ServiceHub? Create account"
        onSecondary={() => router.push("/register")}
      />
    </Screen>
  );
}
