"use client";

import { useParams } from "next/navigation";
import { AddressForm } from "@/features/addresses/components/address-form";
import { useUser } from "@/features/auth/user-provider";

export default function EditAddressPage() {
  const params = useParams<{ id: string }>();
  const { addresses } = useUser();
  const address = addresses.find((item) => item.id === params.id);
  if (!address) return <p className="p-4 text-sm">Address not found.</p>;
  return <AddressForm address={address} />;
}
