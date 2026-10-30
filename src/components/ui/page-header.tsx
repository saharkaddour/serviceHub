"use client";

import { useRouter } from "next/navigation";

export function PageHeader({
  title,
  showBack = true,
}: {
  title: string;
  showBack?: boolean;
}) {
  const router = useRouter();
  return (
    <header className="flex h-14 items-center gap-2 px-4">
      {showBack ? (
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold text-ink"
          aria-label="Back"
        >
          ←
        </button>
      ) : null}
      <h1 className="text-base font-semibold text-ink">{title}</h1>
    </header>
  );
}
