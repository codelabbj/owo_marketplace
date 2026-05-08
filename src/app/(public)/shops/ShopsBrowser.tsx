"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useShops } from "@/hooks/useShops";
import { ShopCard } from "@/components/shops/ShopCard";
import { SkeletonGrid } from "@/components/states/SkeletonGrid";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { SearchBar } from "@/components/layout/SearchBar";
import { toShopSummary } from "@/lib/api/mappers";
import { MOCK_CATEGORIES } from "@/lib/api/mocks";

type SortKey = "popular" | "newest" | "alpha";

export function ShopsBrowser({
  initialQuery = "",
  initialCategory = "",
}: {
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortKey>("popular");

  const { data, isLoading, isError, refetch, isFetching } = useShops({
    query,
    category,
    page: 1,
  });

  const items = useMemo(() => {
    const raw = (data?.results ?? []).map(toShopSummary);
    const sorted = [...raw];
    if (sort === "alpha") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "newest") sorted.reverse();
    else sorted.sort((a, b) => b.productsCount - a.productsCount);
    return sorted;
  }, [data, sort]);

  const hasFilters = Boolean(query || category);

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col gap-3">
        <h1 className="text-h1">Toutes les boutiques</h1>
        <p className="text-body text-ink-muted">
          Parcourez les boutiques de la marketplace.
        </p>
      </div>

      <div className="card flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="flex-1">
          <SearchBar
            initialValue={initialQuery}
            placeholder="Rechercher une boutique"
            onChangeDebounced={setQuery}
            ariaLabel="Recherche boutique"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-row md:items-center">
          <label className="sr-only" htmlFor="cat">
            Catégorie
          </label>
          <select
            id="cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input h-10 px-3"
          >
            <option value="">Toutes catégories</option>
            {MOCK_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>

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

          {hasFilters ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("");
              }}
              className="btn-ghost h-10"
            >
              Réinitialiser
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-8" aria-busy={isFetching}>
        {isLoading ? (
          <SkeletonGrid count={8} />
        ) : isError ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Aucune boutique"
            description={
              hasFilters
                ? "Essayez d'élargir votre recherche."
                : "Aucune boutique pour le moment."
            }
            action={
              hasFilters ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("");
                  }}
                  className="btn-primary"
                >
                  Effacer les filtres
                </button>
              ) : (
                <Link href="/" className="btn-primary">
                  Retour à l&apos;accueil
                </Link>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 wide:grid-cols-4">
            {items.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
