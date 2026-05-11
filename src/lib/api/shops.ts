import { apiFetch, ApiError } from "@/lib/api/client";
import { env } from "@/lib/config/env";
import {
  PaginatedShopsSchema,
  type PaginatedShopsDTO,
} from "@/schemas/shop.schema";
import {
  ShopWithProductsSchema,
  type ShopWithProductsDTO,
} from "@/schemas/product.schema";
import {
  getShopDetailMock,
  listShopsMock,
} from "@/lib/api/mocks";

export type ListShopsParams = {
  query?: string;
  page?: number;
  signal?: AbortSignal;
};

async function withMockFallback<T>(
  realCall: () => Promise<T>,
  mockCall: () => T | null,
  notFoundError = "Not found",
): Promise<T> {
  if (env.useMocks) {
    const m = mockCall();
    if (m === null) throw new ApiError(notFoundError, 404);
    return m;
  }
  try {
    return await realCall();
  } catch (err) {
    // graceful degradation if backend not ready
    if (err instanceof ApiError && err.status >= 500) {
      const m = mockCall();
      if (m !== null) return m;
    }
    throw err;
  }
}

export async function listShops(
  params: ListShopsParams = {},
): Promise<PaginatedShopsDTO> {
  return withMockFallback<PaginatedShopsDTO>(
    async () => {
      const json = await apiFetch("/api/marketplace/shops", {
        searchParams: {
          query: params.query,
          page: params.page,
        },
        signal: params.signal,
        revalidate: 60,
        tags: ["shops"],
      });
      return PaginatedShopsSchema.parse(json);
    },
    () => listShopsMock(params),
  );
}

export async function getShop(slug: string): Promise<ShopWithProductsDTO> {
  return withMockFallback<ShopWithProductsDTO>(
    async () => {
      const json = await apiFetch(
        `/api/marketplace/shops/${encodeURIComponent(slug)}`,
        {
          revalidate: 60,
          tags: ["shop", `shop:${slug}`],
        },
      );
      return ShopWithProductsSchema.parse(json);
    },
    () => getShopDetailMock(slug),
    `Shop ${slug} not found`,
  );
}
