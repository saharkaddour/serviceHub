"use client";

import { readLocal, writeLocal } from "@/hooks/use-local-storage";
import { streetLine } from "@/lib/address-rules";
import {
  STORAGE_KEYS,
  type AddressExtras,
  type SavedAddress,
} from "@/lib/types";

export function readExtras(): Record<string, AddressExtras> {
  return readLocal<Record<string, AddressExtras>>(STORAGE_KEYS.extras, {});
}

export function writeExtras(map: Record<string, AddressExtras>) {
  writeLocal(STORAGE_KEYS.extras, map);
}

export function mergeAddress(
  api: {
    id: string;
    label?: string;
    addressLine?: string;
    city?: string;
    postalCode?: string;
  },
  extras: AddressExtras,
): SavedAddress {
  const defaultId = Object.entries(readExtras()).find(([, value]) => value.isDefault)?.[0];
  return {
    id: api.id,
    label: api.label || "Address",
    street: extras.street ?? api.addressLine ?? "",
    unit: extras.unit ?? null,
    city: api.city ?? "",
    state: extras.state ?? "",
    zip: api.postalCode ?? "",
    country: extras.country ?? "United States",
    accessNote: extras.accessNote ?? null,
    isDefault: extras.isDefault ?? api.id === defaultId,
  };
}

export function toSpringBody(address: {
  label: string;
  street: string;
  unit?: string | null;
  city: string;
  zip: string;
  country?: string;
}) {
  return {
    label: address.label || "Address",
    addressLine: streetLine(address.street, address.unit),
    city: address.city,
    postalCode: address.zip,
    country: address.country || "United States",
  };
}

export function ensureDefault(list: SavedAddress[]): SavedAddress[] {
  if (list.length === 0) return list;
  if (list.some((item) => item.isDefault)) return list;
  return list.map((item, index) => ({ ...item, isDefault: index === 0 }));
}
