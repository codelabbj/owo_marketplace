import { z } from "zod";

export const ShopSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  logo_url: z.string().url().nullable().optional(),
  cover_url: z.string().url().nullable().optional(),
  short_description: z.string().nullable().optional(),
  products_count: z.number().int().nonnegative().default(0),
  category: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
});

export const ShopDetailSchema = ShopSummarySchema.extend({
  description: z.string().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  whatsapp_phone_e164: z.string().nullable().optional(),
  whatsapp_url: z.string().url().nullable().optional(),
});

export const PaginatedShopsSchema = z.object({
  count: z.number().int().nonnegative(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(ShopSummarySchema),
});

export type ShopSummaryDTO = z.infer<typeof ShopSummarySchema>;
export type ShopDetailDTO = z.infer<typeof ShopDetailSchema>;
export type PaginatedShopsDTO = z.infer<typeof PaginatedShopsSchema>;
