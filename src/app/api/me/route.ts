import { NextResponse } from "next/server";
import { clearSessionCookies } from "@/lib/session";
import { readJson, springFetch, UnauthorizedError } from "@/lib/spring";

export async function GET() {
  try {
    const response = await springFetch("/users/me");
    const json = (await readJson(response)) as Record<string, unknown> | null;
    if (response.status === 401) {
      await clearSessionCookies();
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!response.ok || !json) {
      return NextResponse.json(
        { error: "Could not load profile" },
        { status: response.status || 502 },
      );
    }
    return NextResponse.json({
      id: json.id != null ? String(json.id) : undefined,
      fullName: json.fullName ?? "",
      email: json.email ?? "",
      role: json.role,
      phone: json.phoneNumber ?? null,
      hasPhoto: Boolean(json.profileImageUrl),
    });
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
