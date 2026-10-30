"use client";

import { useOnline } from "@/hooks/use-online";

export function OfflineBanner() {
  const { offline } = useOnline();
  if (!offline) return null;
  return (
    <div
      role="status"
      className="bg-ink px-4 py-2 text-xs text-surface"
    >
      You’re offline or the server is unreachable. Showing saved data.
    </div>
  );
}
