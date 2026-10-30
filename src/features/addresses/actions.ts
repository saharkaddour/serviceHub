"use server";

import { addressSchema } from "./schemas";
import { fail, handleActionError, ok, type ActionResult } from "@/lib/action-result";
import { expectOk, springFetch } from "@/lib/spring";
import { toSpringAddressBody } from "@/lib/address-rules";

export async function saveAddressAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return fail(undefined, fieldErrors);
  }
  const body = toSpringAddressBody({
    label: parsed.data.label || "Address",
    street: parsed.data.street,
    unit: parsed.data.unit,
    city: parsed.data.city,
    zip: parsed.data.zip,
    country: parsed.data.country,
  });
  try {
    if (parsed.data.id) {
      await expectOk(
        await springFetch(`/users/me/addresses/${parsed.data.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        }),
      );
      return ok({ id: parsed.data.id });
    }
    const json = (await expectOk(
      await springFetch("/users/me/addresses", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    )) as { id?: string };
    return ok({ id: String(json?.id ?? "") });
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteAddressAction(id: string): Promise<ActionResult> {
  try {
    await expectOk(await springFetch(`/users/me/addresses/${id}`, { method: "DELETE" }));
    return ok();
  } catch (error) {
    return handleActionError(error);
  }
}
