"use client";

import { useQuery } from "@tanstack/react-query";
import { browseByCategory } from "@/lib/api/browseCategory";

export function useCategoryBrowse(slug: string, label?: string) {
  const enabled = slug.trim().length > 0;
  return useQuery({
    queryKey: ["category-browse", slug.trim(), label ?? ""] as const,
    queryFn: ({ signal }) => browseByCategory(slug, { label, signal }),
    enabled,
    staleTime: 30_000,
  });
}
