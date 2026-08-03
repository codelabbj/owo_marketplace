import type { Metadata } from "next";
import { ShopsBrowser } from "./ShopsBrowser";
import { listCategories } from "@/lib/api/categories";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "Boutiques",
  description: "Toutes les boutiques de la marketplace Owo, filtrables par catégorie.",
  alternates: {
    canonical: `${env.siteUrl}/shops`,
  },
};

type SearchParams = Promise<{ query?: string; category?: string }>;

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const categorySlug = sp.category?.trim() ?? "";
  let categoryLabel = "";

  if (categorySlug) {
    const categories = await listCategories().catch(() => []);
    categoryLabel =
      categories.find((c) => c.slug === categorySlug)?.label ?? categorySlug;
  }

  return (
    <ShopsBrowser
      initialQuery={sp.query ?? ""}
      initialCategory={categorySlug}
      categoryLabel={categoryLabel}
    />
  );
}
