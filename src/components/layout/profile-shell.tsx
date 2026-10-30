"use client";

import type { ReactNode } from "react";
import { BottomNav, SideNav } from "@/components/ui/bottom-nav";
import { Screen } from "@/components/ui/form-card";

export function ProfileShell({
  children,
  current = "/profile",
  variant = "customer",
}: {
  children: ReactNode;
  current?: string;
  variant?: "customer" | "provider";
}) {
  return (
    <Screen>
      <div className="flex min-h-screen">
        <SideNav variant={variant} current={current} />
        <div className="flex min-w-0 flex-1 flex-col pb-16 lg:pb-0">{children}</div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-10 lg:hidden">
        <BottomNav variant={variant} current={current} />
      </div>
    </Screen>
  );
}
