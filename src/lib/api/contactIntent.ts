import { apiFetch } from "@/lib/api/client";
import { env } from "@/lib/config/env";
import { marketplacePaths } from "@/lib/api/marketplacePaths";
import {
  ContactIntentRequestSchema,
  type ContactIntentRequestDTO,
} from "@/schemas/contact-intent.schema";

export async function submitContactIntent(
  body: ContactIntentRequestDTO,
  options: { signal?: AbortSignal } = {},
): Promise<void> {
  if (env.useMocks) {
    await new Promise((r) => setTimeout(r, 120));
    return;
  }
  const validated = ContactIntentRequestSchema.parse(body);
  await apiFetch<unknown>(marketplacePaths.contactIntents, {
    method: "POST",
    jsonBody: validated,
    signal: options.signal,
  });
}
