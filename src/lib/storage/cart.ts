import {
  CartItemSchema,
  CartSchema,
  cartLineId,
  type Cart,
  type CartItem,
} from "@/schemas/cart.schema";

const STORAGE_KEY = "owo-marketplace-cart";

function repairCartItem(entry: unknown): CartItem | null {
  const direct = CartItemSchema.safeParse(entry);
  if (direct.success) return direct.data;

  if (!entry || typeof entry !== "object") return null;
  const raw = entry as Record<string, unknown>;
  const shopSlug = typeof raw.shopSlug === "string" ? raw.shopSlug : "";
  const productSlug = typeof raw.productSlug === "string" ? raw.productSlug : "";
  if (!shopSlug || !productSlug) return null;

  const variantLabel =
    typeof raw.variantLabel === "string" ? raw.variantLabel : null;

  const repaired = CartItemSchema.safeParse({
    lineId:
      typeof raw.lineId === "string" && raw.lineId
        ? raw.lineId
        : cartLineId({ shopSlug, productSlug, variantLabel }),
    shopSlug,
    shopName: typeof raw.shopName === "string" ? raw.shopName : "Boutique",
    productSlug,
    productName: typeof raw.productName === "string" ? raw.productName : "Produit",
    productUrl: typeof raw.productUrl === "string" ? raw.productUrl : "",
    qty:
      typeof raw.qty === "number"
        ? Math.min(99, Math.max(1, Math.trunc(raw.qty)))
        : 1,
    variantLabel,
    formattedPrice:
      typeof raw.formattedPrice === "string" ? raw.formattedPrice : "—",
    promoPrice: typeof raw.promoPrice === "string" ? raw.promoPrice : null,
    currency: typeof raw.currency === "string" ? raw.currency : "XOF",
    whatsappPhoneE164:
      typeof raw.whatsappPhoneE164 === "string" ? raw.whatsappPhoneE164 : null,
    whatsappUrl: typeof raw.whatsappUrl === "string" ? raw.whatsappUrl : null,
  });

  return repaired.success ? repaired.data : null;
}

export function normalizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const items: CartItem[] = [];
  for (const entry of raw) {
    const item = repairCartItem(entry);
    if (item) items.push(item);
  }
  return items;
}

export function getCart(): Cart {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "items" in parsed) {
      const items = normalizeCartItems((parsed as { items: unknown }).items);
      return { items };
    }
    const r = CartSchema.safeParse(parsed);
    return r.success ? { items: normalizeCartItems(r.data.items) } : { items: [] };
  } catch {
    return { items: [] };
  }
}

export function setCart(cart: Cart): void {
  if (typeof window === "undefined") return;
  const items = normalizeCartItems(cart.items);
  const validated = CartSchema.safeParse({ items });
  if (!validated.success) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validated.data));
}

export function clearCartStorage(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function cartShopSlug(cart: Cart): string | null {
  return cart.items[0]?.shopSlug ?? null;
}

export function mergeCartItem(items: CartItem[], incoming: CartItem): CartItem[] {
  const idx = items.findIndex((i) => i.lineId === incoming.lineId);
  if (idx === -1) return [...items, incoming];
  const existing = items[idx];
  if (!existing) return [...items, incoming];
  const next = [...items];
  next[idx] = {
    ...existing,
    qty: Math.min(99, existing.qty + incoming.qty),
  };
  return next;
}
