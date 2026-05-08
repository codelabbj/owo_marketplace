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

export function toShopSummary(dto: ShopSummaryDTO): ShopSummary {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    logoUrl: dto.logo_url ?? null,
    coverUrl: dto.cover_url ?? null,
    shortDescription: dto.short_description ?? null,
    productsCount: dto.products_count ?? 0,
    category: dto.category ?? null,
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
    logoUrl: s.logo_url ?? null,
    coverUrl: s.cover_url ?? null,
    shortDescription: s.short_description ?? null,
    productsCount: s.products_count ?? 0,
    category: null,
    city: null,
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
    imageUrl: dto.image_url ?? null,
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
    images: dto.images,
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
