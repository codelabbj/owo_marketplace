import { getShop, listShops } from "@/lib/api/shops";
import { toProductSummary, toShopFromBundle } from "@/lib/api/mappers";
import { matchesQuery, normalizeSearchText } from "@/lib/utils/searchMatch";
import type { ProductSummary, ShopDetail } from "@/types/domain";

export type CategoryProductHit = {
  shopSlug: string;
  shopName: string;
  whatsappPhoneE164: string | null;
  whatsappUrl: string | null;
  product: ProductSummary;
};

export type CategoryBrowseResult = {
  shops: ShopDetail[];
  products: CategoryProductHit[];
};

const MAX_SHOPS_TO_SCAN = 24;

function productMatchesCategory(
  product: { name: string; slug: string; category?: string | null },
  categorySlug: string,
  categoryLabel?: string,
): boolean {
  const slug = normalizeSearchText(categorySlug);
  const productCat = normalizeSearchText(product.category ?? "");

  if (productCat && (productCat === slug || productCat.includes(slug) || slug.includes(productCat))) {
    return true;
  }

  // Fallback si le produit n’a pas encore de category renseignée côté ERP
  if (categoryLabel) {
    const tokens = normalizeSearchText(categoryLabel)
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length >= 4);
    if (tokens.some((t) => matchesQuery(product.name, t) || matchesQuery(product.slug, t))) {
      return true;
    }
  }

  return matchesQuery(product.slug, categorySlug) || matchesQuery(product.name, categorySlug);
}

/**
 * Parcourt les catalogues publics pour trouver boutiques / produits d’une catégorie.
 * (Pas de filtre `category` fiable sur GET /shops/ — catégorie = champ produit.)
 */
export async function browseByCategory(
  categorySlug: string,
  options: { label?: string; signal?: AbortSignal } = {},
): Promise<CategoryBrowseResult> {
  const slug = categorySlug.trim();
  if (!slug) return { shops: [], products: [] };

  const shopsPage = await listShops({ page: 1, signal: options.signal });
  if (options.signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const shops: ShopDetail[] = [];
  const products: CategoryProductHit[] = [];
  const shopIds = new Set<string>();

  await Promise.all(
    shopsPage.results.slice(0, MAX_SHOPS_TO_SCAN).map(async (row) => {
      if (options.signal?.aborted) return;
      const bundle = await getShop(row.slug).catch(() => null);
      if (!bundle || options.signal?.aborted) return;

      const shop = toShopFromBundle(bundle);
      let shopHasMatch = false;

      for (const dto of bundle.products.results) {
        if (!productMatchesCategory(dto, slug, options.label)) continue;
        shopHasMatch = true;
        products.push({
          shopSlug: shop.slug,
          shopName: shop.name,
          whatsappPhoneE164: shop.whatsappPhoneE164,
          whatsappUrl: shop.whatsappUrl,
          product: toProductSummary(dto),
        });
      }

      if (shopHasMatch && !shopIds.has(shop.id)) {
        shopIds.add(shop.id);
        shops.push(shop);
      }
    }),
  );

  products.sort((a, b) => a.product.name.localeCompare(b.product.name, "fr"));
  shops.sort((a, b) => a.name.localeCompare(b.name, "fr"));

  return { shops, products };
}
