import { z } from "zod";

export const CartItemSchema = z.object({
  lineId: z.string(),
  shopSlug: z.string(),
  shopName: z.string(),
  productSlug: z.string(),
  productName: z.string(),
  productUrl: z.string(),
  qty: z.number().int().min(1).max(99),
  variantLabel: z.string().nullable().optional(),
  formattedPrice: z.string(),
  promoPrice: z.string().nullable().optional(),
  currency: z.string().default("XOF"),
  whatsappPhoneE164: z.string().nullable().optional(),
  whatsappUrl: z.string().nullable().optional(),
});

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;

export function cartLineId(input: {
  shopSlug: string;
  productSlug: string;
  variantLabel?: string | null;
}): string {
  const variant = (input.variantLabel ?? "").trim().toLowerCase();
  return `${input.shopSlug}:${input.productSlug}:${variant}`;
}
