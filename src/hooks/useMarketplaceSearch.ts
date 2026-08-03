"use client";

import { useQuery } from "@tanstack/react-query";
import { searchMarketplace } from "@/lib/api/search";

export function useMarketplaceSearch(query: string) {
  const enabled = query.trim().length >= 2;

  return useQuery({
    queryKey: ["marketplace-search", query.trim()] as const,
    queryFn: ({ signal }) => searchMarketplace(query, signal),
    enabled,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
