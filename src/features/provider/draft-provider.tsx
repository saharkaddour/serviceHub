"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS } from "@/lib/types";
import { emptyDraft, type ProviderDraft } from "./lib/options";

type Ctx = {
  draft: ProviderDraft;
  update: (patch: Partial<ProviderDraft>) => void;
  reset: () => void;
};

const DraftContext = createContext<Ctx | null>(null);

export function ProviderDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ProviderDraft>(emptyDraft);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.providerDraft);
      if (raw) setDraft({ ...emptyDraft, ...(JSON.parse(raw) as ProviderDraft) });
    } catch {
      // Ignore.
    }
  }, []);

  function persist(next: ProviderDraft) {
    setDraft(next);
    try {
      sessionStorage.setItem(STORAGE_KEYS.providerDraft, JSON.stringify(next));
    } catch {
      // Ignore.
    }
  }

  const value = useMemo<Ctx>(
    () => ({
      draft,
      update: (patch) => persist({ ...draft, ...patch }),
      reset: () => persist(emptyDraft),
    }),
    [draft],
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useProviderDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useProviderDraft must be used within ProviderDraftProvider");
  return ctx;
}
