"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InstallButton } from "@/components/install-button";
import { Screen } from "@/components/ui/form-card";

export default function WelcomePage() {
  const router = useRouter();
  return (
    <Screen>
      <div className="px-4 pb-2 pt-4">
        <p className="text-xl font-semibold text-ink">ServiceHub</p>
      </div>
      <div className="flex-1 px-4 pb-8">
        <div className="flex h-40 items-center justify-center rounded-[16px] bg-warm-border text-4xl text-ink">
          ⌂
        </div>
        <h1 className="mt-6 text-[28px] font-bold leading-9 text-ink">Good help, nearby.</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Find trusted local experts for your home, or grow your business with ServiceHub.
        </p>
        <div className="mt-5 rounded-[16px] border border-warm-border bg-surface p-4">
          <p className="text-sm font-semibold text-ink">Book with confidence</p>
          <p className="text-xs text-text-secondary">
            Verified professionals, clear service details
          </p>
          <p className="mt-4 text-sm font-semibold text-ink">Local expertise, easy booking</p>
          <p className="text-xs text-text-secondary">Your next helping hand is close to home</p>
        </div>
        <p className="mt-5 text-xs text-text-secondary">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
        <div className="mt-4">
          <InstallButton />
        </div>
      </div>
      <div className="border-t border-warm-border bg-surface p-4">
        <Button onClick={() => router.push("/register")}>Create account</Button>
        <Button variant="text" className="mt-2" onClick={() => router.push("/sign-in")}>
          Sign in
        </Button>
      </div>
    </Screen>
  );
}
