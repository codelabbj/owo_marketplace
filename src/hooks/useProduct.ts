"use client";

import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/lib/api/products";

export function useProduct(shopSlug: string, productSlug: string) {
  return useQuery({
    queryKey: ["product", shopSlug, productSlug] as const,
    queryFn: () => getProduct(shopSlug, productSlug),
    enabled: Boolean(shopSlug && productSlug),
  });
}
