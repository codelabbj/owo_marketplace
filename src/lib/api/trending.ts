import { env } from "@/lib/config/env";
import { getShop, listShops } from "@/lib/api/shops";
import { toProductSummary, toShopFromBundle } from "@/lib/api/mappers";
import { getTrendingProductsMock } from "@/lib/api/mocks";
import type { ProductSummary } from "@/types/domain";

export type TrendingProductItem = {
  shopSlug: string;
  shopName: string;
  whatsappPhoneE164: string | null;
  whatsappUrl: string | null;
  product: ProductSummary;
};

const DEFAULT_LIMIT = 8;
const MAX_SHOPS_TO_SCAN = 6;
const PRODUCTS_PER_SHOP = 2;

/**
 * Produits « tendances » : agrégation depuis les catalogues publics des boutiques actives.
 * (Pas d’endpoint dédié côté ERP — on pioche dans les boutiques listées.)
 */
export async function listTrendingProducts(
  limit = DEFAULT_LIMIT,
): Promise<TrendingProductItem[]> {
  if (env.useMocks) {
    return getTrendingProductsMock().map((item) => ({
      shopSlug: item.shopSlug,
      shopName: item.shopName,
      whatsappPhoneE164: item.product.shop.whatsapp_phone_e164 ?? null,
      whatsappUrl: item.product.shop.whatsapp_url ?? null,
      product: {
        id: item.product.id,
        slug: item.product.slug,
        name: item.product.name,
        imageUrl: item.product.images[0] ?? null,
        price: item.product.price,
        promoPrice: item.product.promo_price ?? null,
        currency: item.product.currency,
        inStock:
          item.product.stock > 0 ||
          item.product.variants.some((v) => v.stock > 0),
        stockLabel:
          item.product.stock > 0 && item.product.stock <= 5
            ? "Stock limité"
            : null,
      },
    }));
  }

  const shopsPage = await listShops({ page: 1 });
  const items: TrendingProductItem[] = [];

  for (const shopRow of shopsPage.results.slice(0, MAX_SHOPS_TO_SCAN)) {
    if (items.length >= limit) break;

    const bundle = await getShop(shopRow.slug).catch(() => null);
    if (!bundle) continue;

    const shop = toShopFromBundle(bundle);
    for (const productDto of bundle.products.results.slice(0, PRODUCTS_PER_SHOP)) {
      if (items.length >= limit) break;
      if (!productDto.in_stock) continue;

      items.push({
        shopSlug: shop.slug,
        shopName: shop.name,
        whatsappPhoneE164: shop.whatsappPhoneE164,
        whatsappUrl: shop.whatsappUrl,
        product: toProductSummary(productDto),
      });
    }
  }

  return items;
}
