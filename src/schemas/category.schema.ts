import { z } from "zod";

export const MarketplaceCategorySchema = z.object({
  slug: z.string(),
  label: z.string(),
});

export const MarketplaceCategoriesSchema = z.array(MarketplaceCategorySchema);

export type MarketplaceCategoryDTO = z.infer<typeof MarketplaceCategorySchema>;
