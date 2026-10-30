"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readLocal, writeLocal } from "@/hooks/use-local-storage";
import { STORAGE_KEYS, type SavedAddress, type UserProfile } from "@/lib/types";

type UserContextValue = {
  user: UserProfile | null;
  addresses: SavedAddress[];
  loading: boolean;
  fromCache: boolean;
  notice: string | null;
  setNotice: (value: string | null) => void;
  refresh: () => Promise<void>;
  logoutLocal: () => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [meRes, addrRes] = await Promise.all([
        fetch("/api/me", { credentials: "same-origin" }),
        fetch("/api/addresses", { credentials: "same-origin" }),
      ]);
      if (meRes.status === 401) {
        setUser(null);
        setAddresses([]);
        setLoading(false);
        return;
      }
      if (!meRes.ok) throw new Error("me failed");
      const me = (await meRes.json()) as UserProfile;
      const preferred = readLocal<string | null>(STORAGE_KEYS.preferredName, null);
      const profile = { ...me, preferredName: preferred ?? me.preferredName };
      setUser(profile);
      writeLocal(STORAGE_KEYS.profile, profile);

      if (addrRes.ok) {
        const list = (await addrRes.json()) as SavedAddress[];
        const extras = readLocal<Record<string, { state?: string; accessNote?: string | null; isDefault?: boolean; unit?: string | null; street?: string; country?: string }>>(
          STORAGE_KEYS.extras,
          {},
        );
        const merged = list.map((item) => {
          const extra = extras[item.id] ?? {};
          return {
            ...item,
            street: extra.street || item.street,
            unit: extra.unit ?? item.unit,
            state: extra.state ?? item.state,
            country: extra.country ?? item.country,
            accessNote: extra.accessNote ?? item.accessNote,
            isDefault: extra.isDefault ?? item.isDefault,
          };
        });
        if (merged.length > 0 && !merged.some((item) => item.isDefault)) {
          merged[0]!.isDefault = true;
        }
        setAddresses(merged);
        writeLocal(STORAGE_KEYS.addresses, merged);
      }
      setFromCache(false);
    } catch {
      window.dispatchEvent(new Event("servicehub:fetch-failed"));
      const cachedUser = readLocal<UserProfile | null>(STORAGE_KEYS.profile, null);
      const cachedAddresses = readLocal<SavedAddress[]>(STORAGE_KEYS.addresses, []);
      setUser(cachedUser);
      setAddresses(cachedAddresses);
      setFromCache(Boolean(cachedUser));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logoutLocal = useCallback(() => {
    setUser(null);
    setAddresses([]);
    writeLocal(STORAGE_KEYS.profile, null);
    writeLocal(STORAGE_KEYS.addresses, []);
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "CLEAR_USER_CACHE" });
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      addresses,
      loading,
      fromCache,
      notice,
      setNotice,
      refresh,
      logoutLocal,
    }),
    [user, addresses, loading, fromCache, notice, refresh, logoutLocal],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
