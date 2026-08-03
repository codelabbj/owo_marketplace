import type { CartItem } from "@/schemas/cart.schema";
import { orderRefLine } from "@/lib/whatsapp/orderRef";

const HEADER = "Bonjour 👋\nJe vous contacte depuis owo.bj.";

export function buildWhatsAppCartMessage(
  items: CartItem[],
  orderRef: string,
): string {
  const first = items[0];
  if (!first) return HEADER;

  const shopName = first.shopName;
  const lines = items.map((item, index) => {
    const price = item.promoPrice ?? item.formattedPrice;
    const parts = [
      `${index + 1}. ${item.productName} — Qté ${item.qty} — ${price}`,
      item.variantLabel ? `   Variante : ${item.variantLabel}` : null,
      `   ${item.productUrl}`,
    ].filter(Boolean);
    return parts.join("\n");
  });

  return [
    HEADER,
    "",
    orderRefLine(orderRef),
    "",
    "Je souhaite commander les produits suivants :",
    "",
    `Boutique : ${shopName}`,
    "",
    ...lines,
    "",
    "Merci de me confirmer la disponibilité et le montant total.",
  ].join("\n");
}
