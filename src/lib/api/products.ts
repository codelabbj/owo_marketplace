import { apiFetch, ApiError } from "@/lib/api/client";
import { env } from "@/lib/config/env";
import { marketplacePaths } from "@/lib/api/marketplacePaths";
import {
  ProductDetailSchema,
  type ProductDetailDTO,
} from "@/schemas/product.schema";
import { getProductDetailMock } from "@/lib/api/mocks";

export async function getProduct(
  shopSlug: string,
  productSlug: string,
): Promise<ProductDetailDTO> {
  if (env.useMocks) {
    const mock = getProductDetailMock(shopSlug, productSlug);
    if (!mock) throw new ApiError("Product not found", 404);
    return mock;
  }
  try {
    const json = await apiFetch(
      marketplacePaths.product(shopSlug, productSlug),
      {
        revalidate: 60,
        tags: ["product", `product:${shopSlug}:${productSlug}`],
      },
    );
    return ProductDetailSchema.parse(json);
  } catch (err) {
    if (err instanceof ApiError && err.status >= 500) {
      const mock = getProductDetailMock(shopSlug, productSlug);
      if (mock) return mock;
    }
    throw err;
  }
}
