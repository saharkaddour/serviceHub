import { NextResponse } from "next/server";
import { readJson, springFetch, UnauthorizedError } from "@/lib/spring";

function asList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object" && Array.isArray((data as { content?: unknown }).content)) {
    return (data as { content: Record<string, unknown>[] }).content;
  }
  return [];
}

export async function GET() {
  try {
    const response = await springFetch("/users/me/addresses");
    const json = await readJson(response);
    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!response.ok) {
      return NextResponse.json({ error: "Could not load addresses" }, { status: response.status });
    }
    const list = asList(json).map((item) => ({
      id: String(item.id ?? ""),
      label: item.label ?? "Address",
      addressLine: item.addressLine ?? "",
      city: item.city ?? "",
      postalCode: item.postalCode ?? "",
      street: item.addressLine ?? "",
      zip: item.postalCode ?? "",
      state: "",
      country: item.country ?? "United States",
      isDefault: false,
    }));
    return NextResponse.json(list);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "ServiceHub could not reach the server." },
      { status: 503 },
    );
  }
}
