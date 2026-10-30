import { NextResponse } from "next/server";
import { springFetch, UnauthorizedError } from "@/lib/spring";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const response = await springFetch(`/users/me/addresses/${id}`, {
      method: "DELETE",
    });
    return new NextResponse(null, { status: response.status });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Could not delete address" }, { status: 503 });
  }
}
