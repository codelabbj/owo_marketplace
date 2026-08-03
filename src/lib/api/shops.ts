import { apiFetch, ApiError } from "@/lib/api/client";
import { env } from "@/lib/config/env";
import { marketplacePaths } from "@/lib/api/marketplacePaths";
import {
  PaginatedShopsSchema,
  type PaginatedShopsDTO,
} from "@/schemas/shop.schema";
import {
  PublicShopDetailApiSchema,
  ShopWithProductsSchema,
  type ShopWithProductsDTO,
} from "@/schemas/product.schema";
import {
  getShopDetailMock,
  listShopsMock,
} from "@/lib/api/mocks";
import { filterShopSummaries } from "@/lib/utils/searchMatch";

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
      const json = await apiFetch(marketplacePaths.shops, {
        searchParams: {
          query: params.query,
          page: params.page,
        },
        signal: params.signal,
        revalidate: 60,
        tags: ["shops"],
      });
      try {
        const parsed = PaginatedShopsSchema.parse(json);
        // L’ERP peut ignorer `query` : on filtre aussi côté client.
        if (params.query?.trim()) {
          const results = filterShopSummaries(parsed.results, params.query);
          return {
            ...parsed,
            count: results.length,
            next: null,
            previous: null,
            results,
          };
        }
        return parsed;
      } catch (parseErr) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.error("[listShops] Réponse API invalide", parseErr, json);
        }
        throw parseErr;
      }
    },
    () => listShopsMock(params),
  );
}

export async function getShop(slug: string): Promise<ShopWithProductsDTO> {
  return withMockFallback<ShopWithProductsDTO>(
    async () => {
      const json = await apiFetch(marketplacePaths.shop(slug), {
        revalidate: 60,
        tags: ["shop", `shop:${slug}`],
      });
      return PublicShopDetailApiSchema.parse(json);
    },
    () => {
      const mock = getShopDetailMock(slug);
      return mock ? ShopWithProductsSchema.parse(mock) : null;
    },
    `Shop ${slug} not found`,
  );
}
