export type AddressInput = {
  id?: string;
  street: string;
  city: string;
  zip: string;
  isDefault?: boolean;
};

export function isDuplicateAddress(
  current: AddressInput[],
  candidate: AddressInput,
): boolean {
  return current.some(
    (address) =>
      address.id !== candidate.id &&
      address.street.trim().toLowerCase() === candidate.street.trim().toLowerCase() &&
      address.city.trim().toLowerCase() === candidate.city.trim().toLowerCase() &&
      address.zip.trim() === candidate.zip.trim(),
  );
}

export function withSingleDefault<T extends AddressInput>(
  current: T[],
  candidate: T,
): T {
  const othersHaveDefault = current.some(
    (address) => address.id !== candidate.id && address.isDefault,
  );
  if (candidate.isDefault || !othersHaveDefault) {
    return { ...candidate, isDefault: true };
  }
  return candidate;
}

export function nextDefaultId<T extends { id: string; isDefault?: boolean }>(
  remaining: T[],
  deletedId: string,
): string | undefined {
  if (remaining.length === 0) return undefined;
  const stillDefault = remaining.find((address) => address.isDefault);
  if (stillDefault) return stillDefault.id;
  return remaining[0]?.id;
}

export function streetLine(street: string, unit?: string | null): string {
  return unit ? `${street}, ${unit}` : street;
}

export function toSpringAddressBody(address: {
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
