import { z } from "zod";

export const ProductSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  image_url: z.string().url().nullable().optional(),
  price: z.number().nonnegative(),
  promo_price: z.number().nonnegative().nullable().optional(),
  currency: z.string().default("XOF"),
  in_stock: z.boolean().default(true),
  stock_label: z.string().nullable().optional(),
});

export const ProductVariantSchema = z.object({
  id: z.string(),
  label: z.string(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative().default(0),
});

export const ProductDetailSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().default(""),
  images: z.array(z.string().url()).default([]),
  price: z.number().nonnegative(),
  promo_price: z.number().nonnegative().nullable().optional(),
  currency: z.string().default("XOF"),
  stock: z.number().int().nonnegative().default(0),
  variants: z.array(ProductVariantSchema).default([]),
  shop: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    whatsapp_phone_e164: z.string().nullable().optional(),
    whatsapp_url: z.string().url().nullable().optional(),
  }),
});

export const ShopWithProductsSchema = z.object({
  shop: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    logo_url: z.string().url().nullable().optional(),
    cover_url: z.string().url().nullable().optional(),
    description: z.string().nullable().optional(),
    short_description: z.string().nullable().optional(),
    contact_phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    whatsapp_phone_e164: z.string().nullable().optional(),
    whatsapp_url: z.string().url().nullable().optional(),
    products_count: z.number().int().nonnegative().default(0),
  }),
  products: z.object({
    count: z.number().int().nonnegative(),
    results: z.array(ProductSummarySchema),
  }),
});

export type ProductSummaryDTO = z.infer<typeof ProductSummarySchema>;
export type ProductDetailDTO = z.infer<typeof ProductDetailSchema>;
export type ShopWithProductsDTO = z.infer<typeof ShopWithProductsSchema>;
