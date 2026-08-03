import { describe, expect, it } from "vitest";
import {
  buildWhatsAppMessage,
  selectTemplate,
  type WhatsAppMessagePayload,
} from "@/lib/whatsapp/buildWhatsAppMessage";

const base: WhatsAppMessagePayload = {
  shopName: "Didier Shop",
  productName: "T-shirt noir",
  productUrl: "https://owo.bj/didier-shop/products/t-shirt-noir",
  qty: 1,
  formattedPrice: "7\u00a0500\u00a0FCFA",
};

describe("selectTemplate", () => {
  it("returns 'simple' by default", () => {
    expect(selectTemplate(base)).toBe("simple");
  });

  it("returns 'variant' when variantLabel is set", () => {
    expect(selectTemplate({ ...base, variantLabel: "M" })).toBe("variant");
  });

  it("returns 'promo' when promoPrice is set", () => {
    expect(selectTemplate({ ...base, promoPrice: "3\u00a0990\u00a0FCFA" })).toBe(
      "promo",
    );
  });

  it("promo wins over variant", () => {
    expect(
      selectTemplate({
        ...base,
        promoPrice: "3\u00a0990\u00a0FCFA",
        variantLabel: "M",
      }),
    ).toBe("promo");
  });

  it("returns 'limited' when stockLabel signals limited stock", () => {
    expect(selectTemplate({ ...base, stockLabel: "Stock limité" })).toBe(
      "limited",
    );
  });

  it("ignores generic stockLabel", () => {
    expect(selectTemplate({ ...base, stockLabel: "En stock" })).toBe("simple");
  });
});

describe("buildWhatsAppMessage", () => {
  it("simple template contains required fields", () => {
    const msg = buildWhatsAppMessage(base);
    expect(msg).toContain("Bonjour 👋");
    expect(msg).toContain("- Boutique : Didier Shop");
    expect(msg).toContain("- Produit : T-shirt noir");
    expect(msg).toContain("- Quantité : 1");
    expect(msg).toContain("- Prix affiché : 7\u00a0500\u00a0FCFA");
    expect(msg).toContain(base.productUrl);
    expect(msg).toContain("Merci de me confirmer la disponibilité.");
  });

  it("variant template includes variant line", () => {
    const msg = buildWhatsAppMessage({ ...base, variantLabel: "M", qty: 2 });
    expect(msg).toContain("- Variante : M");
    expect(msg).toContain("- Quantité : 2");
    expect(msg).toContain("Merci de me confirmer la disponibilité de cette variante.");
  });

  it("promo template references promoPrice", () => {
    const msg = buildWhatsAppMessage({
      ...base,
      promoPrice: "3\u00a0990\u00a0FCFA",
    });
    expect(msg).toContain("Prix promo affiché : 3\u00a0990\u00a0FCFA");
    expect(msg).toContain("Pouvez-vous confirmer le prix final");
  });

  it("limited stock template includes stock info", () => {
    const msg = buildWhatsAppMessage({
      ...base,
      stockLabel: "Stock limité",
    });
    expect(msg).toContain("- Info stock : Stock limité");
    expect(msg).toContain("rapidement la disponibilité");
  });

  it("normalizes invalid quantity to 1", () => {
    const msg = buildWhatsAppMessage({ ...base, qty: 0 });
    expect(msg).toContain("- Quantité : 1");
  });

  it("includes order reference when provided", () => {
    const msg = buildWhatsAppMessage({
      ...base,
      orderRef: "OWO-260803-DIDI-A7K2",
    });
    expect(msg).toContain("Référence commande : OWO-260803-DIDI-A7K2");
  });
});
