import { describe, expect, it } from "vitest";
import {
  PaginatedShopsSchema,
  ShopDetailSchema,
} from "@/schemas/shop.schema";
import { ProductDetailSchema } from "@/schemas/product.schema";

describe("ShopSchema", () => {
  it("parses a minimal valid shop summary list", () => {
    const json = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: "shop_1",
          slug: "didier-shop",
          name: "Didier Shop",
          products_count: 12,
        },
      ],
    };
    const parsed = PaginatedShopsSchema.parse(json);
    expect(parsed.results[0]?.name).toBe("Didier Shop");
  });

  it("rejects a missing slug", () => {
    expect(() =>
      ShopDetailSchema.parse({
        id: "shop_1",
        name: "Didier Shop",
        products_count: 0,
      }),
    ).toThrow();
  });
});

describe("ProductDetailSchema", () => {
  it("accepts a product with no variants", () => {
    const parsed = ProductDetailSchema.parse({
      id: "p1",
      slug: "tshirt",
      name: "T-shirt",
      price: 7500,
      currency: "XOF",
      stock: 5,
      shop: { id: "s1", slug: "didier-shop", name: "Didier Shop" },
    });
    expect(parsed.variants).toEqual([]);
    expect(parsed.images).toEqual([]);
  });

  it("parses ERP decimal stock and nullable variant price", () => {
    const parsed = ProductDetailSchema.parse({
      id: "3f09b8cc-d8bd-4e5f-9613-cda20b47fae2",
      slug: "ciment",
      name: "ciment",
      description: "Ciment poids 25kg et 50kg",
      images: [],
      price: "7500.00",
      promo_price: null,
      currency: "XOF",
      in_stock: true,
      stock: "20.00",
      variants: [
        {
          id: "704426c0-1d0c-4afe-a609-aa4f0beb36ed",
          label: "Unité",
          price: 7500.0,
          stock: 20.0,
        },
        {
          id: "55f480fa-6e9d-435c-9a51-89ac796e5779",
          label: "ciment poids 25Kg et 50kg",
          price: null,
          stock: 0.0,
        },
      ],
      shop: {
        id: "3a9cfc39-a336-42c0-a83c-484fdd0fa87d",
        slug: "owo-desk",
        name: "Owo Desk",
        whatsapp_phone_e164: null,
        whatsapp_url: null,
      },
    });
    expect(parsed.stock).toBe(20);
    expect(parsed.price).toBe(7500);
    expect(parsed.variants[0]?.stock).toBe(20);
  });

  it("rejects negative price", () => {
    expect(() =>
      ProductDetailSchema.parse({
        id: "p1",
        slug: "tshirt",
        name: "T-shirt",
        price: -1,
        shop: { id: "s1", slug: "didier-shop", name: "Didier Shop" },
      }),
    ).toThrow();
  });
});
