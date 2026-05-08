"use client";

import { useQuery } from "@tanstack/react-query";
import { listShops } from "@/lib/api/shops";

export type UseShopsParams = {
  query?: string;
  category?: string;
  page?: number;
};

export function useShops(params: UseShopsParams) {
  return useQuery({
    queryKey: ["shops", params] as const,
    queryFn: ({ signal }) => listShops({ ...params, signal }),
  });
}
