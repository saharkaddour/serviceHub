"use client";

import type { ReactNode } from "react";
import { Button } from "./button";

type Props = {
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  loading?: boolean;
  disabled?: boolean;
  extra?: ReactNode;
};

export function AuthBottomBar({
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  loading,
  disabled,
}: Props) {
  return (
    <div className="border-t border-warm-border bg-surface p-4">
      <Button onClick={onPrimary} loading={loading} disabled={disabled}>
        {primaryLabel}
      </Button>
      {secondaryLabel && onSecondary ? (
        <Button variant="text" className="mt-1" onClick={onSecondary}>
          {secondaryLabel}
        </Button>
      ) : null}
    </div>
  );
}
