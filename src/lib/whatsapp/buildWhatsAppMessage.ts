export type WhatsAppMessagePayload = {
  shopName: string;
  productName: string;
  productUrl: string;
  qty?: number;
  variantLabel?: string | null;
  formattedPrice?: string | null;
  promoPrice?: string | null;
  stockLabel?: string | null;
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

export function buildWhatsAppMessage(payload: WhatsAppMessagePayload): string {
  const template = selectTemplate(payload);
  const qty = asQty(payload.qty);
  const price = payload.formattedPrice ?? "—";

  switch (template) {
    case "promo": {
      const lines = [
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
      ].filter((l): l is string => l !== null);
      return lines.join("\n");
    }
    case "variant": {
      return [
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
      ].join("\n");
    }
    case "limited": {
      return [
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
      ].join("\n");
    }
    case "simple":
    default: {
      return [
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
      ].join("\n");
    }
  }
}
