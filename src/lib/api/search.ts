import { listShops, getShop } from "@/lib/api/shops";
import { toProductSummary, toShopFromBundle } from "@/lib/api/mappers";
import { filterShopSummaries, matchesQuery } from "@/lib/utils/searchMatch";
import type { ProductSummary } from "@/types/domain";

export type MarketplaceShopHit = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  city: string | null;
  logoUrl: string | null;
};

export type MarketplaceProductHit = {
  shopSlug: string;
  shopName: string;
  product: ProductSummary;
};

export type MarketplaceSearchResult = {
  shops: MarketplaceShopHit[];
  products: MarketplaceProductHit[];
};

const MAX_SHOPS_TO_SCAN = 20;
const MAX_SHOP_RESULTS = 8;
const MAX_PRODUCT_RESULTS = 8;

/**
 * Recherche combo : filtre boutiques + produits (client-side),
 * car l’ERP n’expose pas encore de `?query=` fiable sur /shops/.
 */
export async function searchMarketplace(
  query: string,
  signal?: AbortSignal,
): Promise<MarketplaceSearchResult> {
  const q = query.trim();
  if (q.length < 2) {
    return { shops: [], products: [] };
  }

  const allShopsPage = await listShops({ page: 1, signal });
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const matchedShops = filterShopSummaries(allShopsPage.results, q)
    .slice(0, MAX_SHOP_RESULTS)
    .map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      shortDescription: s.short_description ?? null,
      city: s.city ?? null,
      logoUrl: s.logo_url ?? null,
    }));

  const products: MarketplaceProductHit[] = [];
  const shopsToScan = allShopsPage.results.slice(0, MAX_SHOPS_TO_SCAN);

  await Promise.all(
    shopsToScan.map(async (shopRow) => {
      if (signal?.aborted) return;
      const bundle = await getShop(shopRow.slug).catch(() => null);
      if (!bundle || signal?.aborted) return;

      const shop = toShopFromBundle(bundle);
      for (const dto of bundle.products.results) {
        if (!matchesQuery(dto.name, q) && !matchesQuery(dto.slug, q)) continue;
        products.push({
          shopSlug: shop.slug,
          shopName: shop.name,
          product: toProductSummary(dto),
        });
      }
    }),
  );

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  // Tri simple : nom le plus court / début de match en premier
  products.sort((a, b) => a.product.name.localeCompare(b.product.name, "fr"));

  return {
    shops: matchedShops,
    products: products.slice(0, MAX_PRODUCT_RESULTS),
  };
}
