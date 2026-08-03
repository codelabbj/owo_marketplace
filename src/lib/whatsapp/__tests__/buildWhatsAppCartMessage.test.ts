import { describe, expect, it } from "vitest";
import { buildWhatsAppCartMessage } from "@/lib/whatsapp/buildWhatsAppCartMessage";
import type { CartItem } from "@/schemas/cart.schema";

const item: CartItem = {
  lineId: "shop:prod:",
  shopSlug: "owo-desk",
  shopName: "Owo Desk",
  productSlug: "macbook",
  productName: "Macbook pro 2019",
  productUrl: "https://owo.bj/owo-desk/products/macbook",
  qty: 2,
  formattedPrice: "400 000 F CFA",
  currency: "XOF",
};

describe("buildWhatsAppCartMessage", () => {
  it("includes order reference and line items", () => {
    const msg = buildWhatsAppCartMessage([item], "OWO-260803-OWOD-XZ9Q");
    expect(msg).toContain("Référence commande : OWO-260803-OWOD-XZ9Q");
    expect(msg).toContain("Boutique : Owo Desk");
    expect(msg).toContain("Macbook pro 2019 — Qté 2");
  });
});
