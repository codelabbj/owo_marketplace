import { apiFetch } from "@/lib/api/client";
import { env } from "@/lib/config/env";
import { marketplacePaths } from "@/lib/api/marketplacePaths";
import {
  MarketplaceCategoriesSchema,
  type MarketplaceCategoryDTO,
} from "@/schemas/category.schema";
import { MOCK_CATEGORIES } from "@/lib/api/mocks";

export async function listCategories(): Promise<MarketplaceCategoryDTO[]> {
  if (env.useMocks) {
    return MOCK_CATEGORIES.map((c) => ({ slug: c.slug, label: c.label }));
  }
  const json = await apiFetch<unknown>(marketplacePaths.categories, {
    revalidate: 86400,
    tags: ["categories"],
  });
  return MarketplaceCategoriesSchema.parse(json);
}
