import { z } from "zod";

/** Corps attendu pour `POST /api/marketplace/contact-intents` */
export const ContactIntentRequestSchema = z.object({
  first_name: z.string().min(1).max(80),
  last_name: z.string().min(1).max(80),
  phone_e164: z.string().regex(/^\d{6,15}$/),
  shop_slug: z.string().min(1),
  product_slug: z.string().min(1),
  prefilled_message: z.string().min(1),
  product_url: z.string().url(),
});

export type ContactIntentRequestDTO = z.infer<typeof ContactIntentRequestSchema>;

export const ContactIntentResponseSchema = z.object({
  id: z.string().optional(),
});

export type ContactIntentResponseDTO = z.infer<typeof ContactIntentResponseSchema>;
