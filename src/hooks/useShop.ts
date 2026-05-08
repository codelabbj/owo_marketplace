"use client";

import { useQuery } from "@tanstack/react-query";
import { getShop } from "@/lib/api/shops";

export function useShop(slug: string) {
  return useQuery({
    queryKey: ["shop", slug] as const,
    queryFn: () => getShop(slug),
    enabled: Boolean(slug),
  });
}
