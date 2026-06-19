import type {
  ShopSummaryDTO,
  ShopDetailDTO,
} from "@/schemas/shop.schema";
import type {
  ProductSummaryDTO,
  ProductDetailDTO,
  ShopWithProductsDTO,
} from "@/schemas/product.schema";
import type {
  ShopSummary,
  ShopDetail,
  ProductSummary,
  ProductDetail,
} from "@/types/domain";
import { env } from "@/lib/config/env";

function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = env.apiBaseUrl.replace(/\/+$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function toShopSummary(dto: ShopSummaryDTO): ShopSummary {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    logoUrl: resolveMediaUrl(dto.logo_url),
    coverUrl: resolveMediaUrl(dto.cover_url),
    shortDescription: dto.short_description ?? null,
    productsCount: dto.products_count ?? 0,
    city: dto.city ?? null,
  };
}

export function toShopDetail(dto: ShopDetailDTO): ShopDetail {
  return {
    ...toShopSummary(dto),
    description: dto.description ?? null,
    contactPhone: dto.contact_phone ?? null,
    address: dto.address ?? null,
    whatsappPhoneE164: dto.whatsapp_phone_e164 ?? null,
    whatsappUrl: dto.whatsapp_url ?? null,
  };
}

export function toShopFromBundle(
  bundle: ShopWithProductsDTO,
): ShopDetail {
  const s = bundle.shop;
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    logoUrl: resolveMediaUrl(s.logo_url),
    coverUrl: resolveMediaUrl(s.cover_url),
    shortDescription: s.short_description ?? null,
    productsCount: s.products_count ?? 0,
    city: s.city ?? null,
    description: s.description ?? null,
    contactPhone: s.contact_phone ?? null,
    address: s.address ?? null,
    whatsappPhoneE164: s.whatsapp_phone_e164 ?? null,
    whatsappUrl: s.whatsapp_url ?? null,
  };
}

export function toProductSummary(dto: ProductSummaryDTO): ProductSummary {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    imageUrl: resolveMediaUrl(dto.image_url),
    price: dto.price,
    promoPrice: dto.promo_price ?? null,
    currency: dto.currency,
    inStock: dto.in_stock,
    stockLabel: dto.stock_label ?? null,
  };
}

export function toProductDetail(dto: ProductDetailDTO): ProductDetail {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    description: dto.description,
    images: dto.images.map((u) => resolveMediaUrl(u) ?? u).filter(Boolean) as string[],
    price: dto.price,
    promoPrice: dto.promo_price ?? null,
    currency: dto.currency,
    stock: dto.stock,
    variants: dto.variants.map((v) => ({
      id: v.id,
      label: v.label,
      price: v.price,
      stock: v.stock,
    })),
    shop: {
      id: dto.shop.id,
      slug: dto.shop.slug,
      name: dto.shop.name,
      whatsappPhoneE164: dto.shop.whatsapp_phone_e164 ?? null,
      whatsappUrl: dto.shop.whatsapp_url ?? null,
    },
  };
}
