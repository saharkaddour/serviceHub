export type UserProfile = {
  id?: string;
  role?: string;
  fullName: string;
  email: string;
  preferredName?: string | null;
  phone?: string | null;
  memberSince?: string | null;
  hasPhoto: boolean;
};

export type SavedAddress = {
  id: string;
  label: string;
  street: string;
  unit?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  accessNote?: string | null;
  isDefault: boolean;
};

export type AddressExtras = {
  state?: string;
  accessNote?: string | null;
  country?: string;
  isDefault?: boolean;
  unit?: string | null;
  street?: string;
};

export const STORAGE_KEYS = {
  profile: "servicehub.profile",
  addresses: "servicehub.addresses",
  extras: "servicehub.addressExtras",
  preferredName: "servicehub.preferredName",
  providerDraft: "servicehub.providerDraft",
} as const;
