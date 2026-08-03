import { orderRefLine } from "@/lib/whatsapp/orderRef";

export type WhatsAppMessagePayload = {
  shopName: string;
  productName: string;
  productUrl: string;
  qty?: number;
  variantLabel?: string | null;
  formattedPrice?: string | null;
  promoPrice?: string | null;
  stockLabel?: string | null;
  /** Référence commande pour recherche ERP */
  orderRef?: string | null;
};

export type WhatsAppTemplate = "promo" | "variant" | "limited" | "simple";

const STOCK_LIMITED_KEYWORDS = ["stock limité", "stock limite", "limited stock", "low stock"];

function isLimitedStockLabel(label?: string | null): boolean {
  if (!label) return false;
  const normalized = label.toLowerCase();
  return STOCK_LIMITED_KEYWORDS.some((kw) => normalized.includes(kw));
}

export function selectTemplate(payload: WhatsAppMessagePayload): WhatsAppTemplate {
  if (payload.promoPrice && payload.promoPrice.trim().length > 0) return "promo";
  if (payload.variantLabel && payload.variantLabel.trim().length > 0) return "variant";
  if (isLimitedStockLabel(payload.stockLabel)) return "limited";
  return "simple";
}

const HEADER = "Bonjour 👋\nJe vous contacte depuis owo.bj.";

function asQty(qty?: number): number {
  if (typeof qty !== "number" || !Number.isFinite(qty) || qty < 1) return 1;
  return Math.floor(qty);
}

function priceLine(label: string, value: string | null | undefined): string | null {
  if (!value || value.trim().length === 0) return null;
  return `- ${label} : ${value}`;
}

function withOrderRef(lines: Array<string | null>, orderRef?: string | null): string {
  const cleaned = lines.filter((l): l is string => l !== null);
  if (!orderRef?.trim()) return cleaned.join("\n");
  // Juste après l’en-tête + ligne vide
  const insertAt = Math.min(2, cleaned.length);
  cleaned.splice(insertAt, 0, orderRefLine(orderRef.trim()), "");
  return cleaned.join("\n");
}

export function buildWhatsAppMessage(payload: WhatsAppMessagePayload): string {
  const template = selectTemplate(payload);
  const qty = asQty(payload.qty);
  const price = payload.formattedPrice ?? "—";
  const ref = payload.orderRef;

  switch (template) {
    case "promo": {
      return withOrderRef(
        [
          HEADER,
          "",
          "Je suis intéressé(e) par votre offre :",
          `- Boutique : ${payload.shopName}`,
          `- Produit : ${payload.productName}`,
          priceLine("Prix promo affiché", payload.promoPrice ?? null),
          `- Quantité : ${qty}`,
          `- Lien : ${payload.productUrl}`,
          "",
          "Pouvez-vous confirmer le prix final et la disponibilité ?",
        ],
        ref,
      );
    }
    case "variant": {
      return withOrderRef(
        [
          HEADER,
          "",
          "Je souhaite commander ce produit :",
          `- Boutique : ${payload.shopName}`,
          `- Produit : ${payload.productName}`,
          `- Variante : ${payload.variantLabel}`,
          `- Quantité : ${qty}`,
          `- Prix affiché : ${price}`,
          `- Lien : ${payload.productUrl}`,
          "",
          "Merci de me confirmer la disponibilité de cette variante.",
        ],
        ref,
      );
    }
    case "limited": {
      return withOrderRef(
        [
          HEADER,
          "",
          "Je veux commander :",
          `- Boutique : ${payload.shopName}`,
          `- Produit : ${payload.productName}`,
          `- Quantité : ${qty}`,
          `- Prix affiché : ${price}`,
          `- Info stock : ${payload.stockLabel}`,
          `- Lien : ${payload.productUrl}`,
          "",
          "Merci de me confirmer rapidement la disponibilité.",
        ],
        ref,
      );
    }
    case "simple":
    default: {
      return withOrderRef(
        [
          HEADER,
          "",
          "Je souhaite commander ce produit :",
          `- Boutique : ${payload.shopName}`,
          `- Produit : ${payload.productName}`,
          `- Quantité : ${qty}`,
          `- Prix affiché : ${price}`,
          `- Lien : ${payload.productUrl}`,
          "",
          "Merci de me confirmer la disponibilité.",
        ],
        ref,
      );
    }
  }
}
