"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useShops } from "@/hooks/useShops";
import { useCategoryBrowse } from "@/hooks/useCategoryBrowse";
import { ShopCard } from "@/components/shops/ShopCard";
import { ProductCard } from "@/components/products/ProductCard";
import { SkeletonGrid } from "@/components/states/SkeletonGrid";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { SearchBar } from "@/components/layout/SearchBar";
import { toShopSummary } from "@/lib/api/mappers";

type SortKey = "popular" | "newest" | "alpha";

export function ShopsBrowser({
  initialQuery = "",
  initialCategory = "",
  categoryLabel = "",
}: {
  initialQuery?: string;
  initialCategory?: string;
  categoryLabel?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>("popular");
  const categorySlug = initialCategory.trim();
  const browsingCategory = Boolean(categorySlug);

  const shopsQuery = useShops({
    query: browsingCategory ? "" : query,
    page: 1,
  });

  const categoryQuery = useCategoryBrowse(
    browsingCategory ? categorySlug : "",
    categoryLabel || undefined,
  );

  const isLoading = browsingCategory ? categoryQuery.isLoading : shopsQuery.isLoading;
  const isError = browsingCategory ? categoryQuery.isError : shopsQuery.isError;
  const isFetching = browsingCategory ? categoryQuery.isFetching : shopsQuery.isFetching;
  const refetch = browsingCategory ? categoryQuery.refetch : shopsQuery.refetch;

  const shopItems = useMemo(() => {
    if (browsingCategory) {
      return (categoryQuery.data?.shops ?? []).map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        logoUrl: s.logoUrl,
        coverUrl: s.coverUrl,
        shortDescription: s.shortDescription,
        productsCount: s.productsCount,
        city: s.city,
      }));
    }
    const raw = (shopsQuery.data?.results ?? []).map(toShopSummary);
    const sorted = [...raw];
    if (sort === "alpha") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "newest") sorted.reverse();
    else sorted.sort((a, b) => b.productsCount - a.productsCount);
    return sorted;
  }, [browsingCategory, categoryQuery.data, shopsQuery.data, sort]);

  const products = categoryQuery.data?.products ?? [];
  const hasSearch = Boolean(query.trim());
  const title = browsingCategory
    ? categoryLabel || "Catégorie"
    : "Toutes les boutiques";

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col gap-3">
        {browsingCategory ? (
          <p className="text-caption uppercase tracking-wide text-ink-subtle">
            <Link href="/shops" className="hover:text-ink">
              Boutiques
            </Link>
            {" / "}
            Catégorie
          </p>
        ) : null}
        <h1 className="text-h1">{title}</h1>
        <p className="text-body text-ink-muted">
          {browsingCategory
            ? "Produits et boutiques correspondant à cette catégorie."
            : "Parcourez les boutiques de la marketplace."}
        </p>
      </div>

      {!browsingCategory ? (
        <div className="card flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="flex-1">
            <SearchBar
              initialValue={initialQuery}
              placeholder="Rechercher une boutique"
              onChangeDebounced={setQuery}
              ariaLabel="Recherche boutique"
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:flex md:flex-row md:items-center">
            <label className="sr-only" htmlFor="sort">
              Tri
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="input h-10 px-3"
            >
              <option value="popular">Populaires</option>
              <option value="newest">Nouveautés</option>
              <option value="alpha">A → Z</option>
            </select>

            {hasSearch ? (
              <button type="button" onClick={() => setQuery("")} className="btn-ghost h-10">
                Réinitialiser
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mb-2">
          <Link href="/shops" className="btn-outline h-10 px-4 text-body-sm">
            Voir toutes les boutiques
          </Link>
        </div>
      )}

      <div className="mt-8" aria-busy={isFetching}>
        {isLoading ? (
          <SkeletonGrid count={8} />
        ) : isError ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : browsingCategory && products.length === 0 && shopItems.length === 0 ? (
          <EmptyState
            title="Aucun résultat dans cette catégorie"
            description="Aucun produit publié pour cette catégorie pour le moment. Explorez toutes les boutiques."
            action={
              <Link href="/shops" className="btn-primary">
                Voir toutes les boutiques
              </Link>
            }
          />
        ) : !browsingCategory && shopItems.length === 0 ? (
          <EmptyState
            title="Aucune boutique"
            description={
              hasSearch
                ? "Essayez un autre mot-clé ou parcourez toutes les boutiques."
                : "Aucune boutique pour le moment."
            }
            action={
              hasSearch ? (
                <button type="button" onClick={() => setQuery("")} className="btn-primary">
                  Effacer la recherche
                </button>
              ) : (
                <Link href="/" className="btn-primary">
                  Retour à l&apos;accueil
                </Link>
              )
            }
          />
        ) : (
          <div className="space-y-10">
            {browsingCategory && products.length > 0 ? (
              <section>
                <h2 className="mb-4 text-h3">
                  Produits ({products.length})
                </h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {products.map(({ shopSlug, shopName, whatsappPhoneE164, whatsappUrl, product }) => (
                    <ProductCard
                      key={`${shopSlug}-${product.id}`}
                      shopSlug={shopSlug}
                      shopName={shopName}
                      whatsappPhoneE164={whatsappPhoneE164}
                      whatsappUrl={whatsappUrl}
                      product={product}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {shopItems.length > 0 ? (
              <section>
                {browsingCategory ? (
                  <h2 className="mb-4 text-h3">
                    Boutiques ({shopItems.length})
                  </h2>
                ) : null}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 wide:grid-cols-4">
                  {shopItems.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
