import type { ShopSummaryDTO } from "@/schemas/shop.schema";

export function normalizeSearchText(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function matchesQuery(
  haystack: string | null | undefined,
  query: string,
): boolean {
  if (!query) return true;
  if (!haystack) return false;
  return normalizeSearchText(haystack).includes(normalizeSearchText(query));
}

export function filterShopSummaries(
  shops: ShopSummaryDTO[],
  query: string,
): ShopSummaryDTO[] {
  const q = query.trim();
  if (!q) return shops;
  return shops.filter(
    (s) =>
      matchesQuery(s.name, q) ||
      matchesQuery(s.short_description, q) ||
      matchesQuery(s.city, q) ||
      matchesQuery(s.slug, q),
  );
}
