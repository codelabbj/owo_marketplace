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
