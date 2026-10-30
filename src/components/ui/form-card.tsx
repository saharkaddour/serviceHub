import type { ReactNode } from "react";

export function FormCard({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-none md:max-w-[520px] md:rounded-[16px] md:border md:border-warm-border md:bg-surface md:p-6">
      {children}
    </div>
  );
}

export function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1120px] flex-col bg-cream">
      {children}
    </div>
  );
}
