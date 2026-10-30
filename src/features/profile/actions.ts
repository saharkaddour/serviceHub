"use server";

import { fail, handleActionError, ok, type ActionResult } from "@/lib/action-result";
import { expectOk, springFetch } from "@/lib/spring";
import { profileSchema } from "./schemas";

export async function updateProfileAction(input: unknown): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message);
  }
  try {
    await expectOk(
      await springFetch("/users/me", {
        method: "PATCH",
        body: JSON.stringify({ fullName: parsed.data.fullName }),
      }),
    );
    return ok();
  } catch (error) {
    return handleActionError(error);
  }
}
