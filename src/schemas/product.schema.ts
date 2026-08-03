import { z } from "zod";

const optionalUrl = z.preprocess(
  (v) => (v === "" || v === undefined || v === null ? null : v),
  z.string().nullable().optional(),
);

const money = z.coerce.number().nonnegative();

export const ProductSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  image_url: optionalUrl,
  price: money,
  promo_price: money.nullable().optional(),
  currency: z.string().default("XOF"),
  in_stock: z.boolean().default(true),
  stock_label: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});

export const ProductVariantSchema = z.object({
  id: z.string(),
  label: z.string(),
  price: money,
  stock: z.coerce.number().int().nonnegative().default(0),
});

export const ProductDetailSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().default(""),
  images: z.array(z.string()).default([]),
  price: money,
  promo_price: money.nullable().optional(),
  currency: z.string().default("XOF"),
  stock: z.coerce.number().int().nonnegative().default(0),
  in_stock: z.boolean().optional(),
  variants: z.array(ProductVariantSchema).default([]),
  shop: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    whatsapp_phone_e164: z.string().nullable().optional(),
    whatsapp_url: optionalUrl,
  }),
});

/** Réponse plate de GET /api/marketplace/shops/{slug}/ (ERP). */
export const PublicShopDetailApiSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    short_description: z.string().nullable().optional(),
    logo_url: optionalUrl,
    cover_url: optionalUrl,
    city: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    whatsapp_phone_e164: z.string().nullable().optional(),
    whatsapp_url: optionalUrl,
    products_count: z.number().int().nonnegative().optional(),
    products: z.object({
      count: z.number().int().nonnegative(),
      next: z.string().nullable().optional(),
      previous: z.string().nullable().optional(),
      results: z.array(ProductSummarySchema),
    }),
  })
  .transform((data) => ({
    shop: {
      id: data.id,
      slug: data.slug,
      name: data.name,
      logo_url: data.logo_url,
      cover_url: data.cover_url,
      description: data.description,
      short_description: data.short_description,
      contact_phone: null as string | null,
      address: data.address,
      whatsapp_phone_e164: data.whatsapp_phone_e164,
      whatsapp_url: data.whatsapp_url,
      products_count: data.products_count ?? data.products.count,
      city: data.city,
    },
    products: {
      count: data.products.count,
      next: data.products.next ?? null,
      previous: data.products.previous ?? null,
      results: data.products.results,
    },
  }));

export const ShopWithProductsSchema = z.object({
  shop: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    logo_url: optionalUrl,
    cover_url: optionalUrl,
    description: z.string().nullable().optional(),
    short_description: z.string().nullable().optional(),
    contact_phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    whatsapp_phone_e164: z.string().nullable().optional(),
    whatsapp_url: optionalUrl,
    products_count: z.number().int().nonnegative().default(0),
    city: z.string().nullable().optional(),
  }),
  products: z.object({
    count: z.number().int().nonnegative(),
    results: z.array(ProductSummarySchema),
  }),
});

export type ProductSummaryDTO = z.infer<typeof ProductSummarySchema>;
export type ProductDetailDTO = z.infer<typeof ProductDetailSchema>;
export type ShopWithProductsDTO = z.infer<typeof ShopWithProductsSchema>;
