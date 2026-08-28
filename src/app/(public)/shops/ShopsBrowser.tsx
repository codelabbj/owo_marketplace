"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useShops } from "@/hooks/useShops";
import { useCategoryBrowse } from "@/hooks/useCategoryBrowse";
import { ShopCard } from "@/components/shops/ShopCard";
import { ProductCard } from "@/components/products/ProductCard";
import { SkeletonGrid } from "@/components/states/SkeletonGrid";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { SearchBar } from "@/components/layout/SearchBar";
import { toShopSummary } from "@/lib/api/mappers";
import { cn } from "@/lib/utils/cn";

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
  const [city, setCity] = useState<string>("all");
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

  const allShopItems = useMemo(() => {
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
    return (shopsQuery.data?.results ?? []).map(toShopSummary);
  }, [browsingCategory, categoryQuery.data, shopsQuery.data]);

  const cityFilters = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of allShopItems) {
      const c = s.city?.trim();
      if (c) counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], "fr"));
  }, [allShopItems]);

  const shopItems = useMemo(() => {
    const filtered =
      city === "all"
        ? [...allShopItems]
        : allShopItems.filter((s) => (s.city ?? "").trim() === city);
    if (sort === "alpha") filtered.sort((a, b) => a.name.localeCompare(b.name, "fr"));
    else if (sort === "newest") filtered.reverse();
    else filtered.sort((a, b) => b.productsCount - a.productsCount);
    return filtered;
  }, [allShopItems, city, sort]);

  const products = categoryQuery.data?.products ?? [];
  const hasSearch = Boolean(query.trim());
  const title = browsingCategory ? categoryLabel || "Catégorie" : "Toutes les boutiques";

  return (
    <div className="mp-wrap">
      <div className="flex items-end justify-between gap-6 border-b-2 border-ink pb-[22px] pt-12">
        <div>
          {browsingCategory ? (
            <p className="mp-kicker-muted mb-2">
              <Link href="/shops" className="hover:text-ink">
                Annuaire
              </Link>
              {" / "}
              Catégorie
            </p>
          ) : (
            <p className="mp-kicker-muted mb-2">Annuaire</p>
          )}
          <h1 className="font-display text-[clamp(32px,4vw,46px)] font-extrabold tracking-[-0.045em]">
            {title}
          </h1>
        </div>
        <p className="hidden text-[14px] text-ink-muted md:block">
          {browsingCategory
            ? "Produits et boutiques de cette catégorie"
            : `${allShopItems.length} boutique${allShopItems.length > 1 ? "s" : ""} · toutes vérifiées sur place`}
        </p>
      </div>

      <div className={cn("grid gap-0", !browsingCategory && "lg:grid-cols-[236px_minmax(0,1fr)]")}>
        {!browsingCategory ? (
          <aside className="border-b border-border py-7 lg:border-b-0 lg:border-r lg:py-7 lg:pr-7">
            <div className="mb-6">
              <SearchBar
                initialValue={initialQuery}
                placeholder="Rechercher une boutique"
                onChangeDebounced={setQuery}
                ariaLabel="Recherche boutique"
              />
            </div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-subtle">Ville</p>
            <div className="mb-7 flex flex-col gap-0.5">
              <CityRow
                label="Toutes"
                count={allShopItems.length}
                active={city === "all"}
                onClick={() => setCity("all")}
              />
              {cityFilters.map(([label, count]) => (
                <CityRow
                  key={label}
                  label={label}
                  count={count}
                  active={city === label}
                  onClick={() => setCity(label)}
                />
              ))}
            </div>
            <div className="border border-ink p-4">
              <p className="font-display text-[15px] font-bold">Vous êtes vendeur ?</p>
              <p className="mb-3 mt-1.5 text-[13px] leading-snug text-ink-muted">
                La vérification se fait dans votre boutique, sur place.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.06em] text-brand-700 hover:text-brand-500"
              >
                En savoir plus <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        ) : (
          <div className="py-6">
            <Link href="/shops" className="btn-outline h-10 px-4 text-body-sm">
              Voir toutes les boutiques
            </Link>
          </div>
        )}

        <div className={cn("pb-16", !browsingCategory && "lg:pl-8")} aria-busy={isFetching}>
          {!browsingCategory ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-3.5">
              <p className="text-[13px] text-ink-muted">
                {shopItems.length} boutique{shopItems.length > 1 ? "s" : ""}
                {city !== "all" ? ` à ${city}` : ""}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    ["popular", "Populaires"],
                    ["newest", "Nouveautés"],
                    ["alpha", "A → Z"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSort(value)}
                    className={cn(
                      "h-8 px-3 text-[12px] font-semibold",
                      sort === value
                        ? "border border-ink bg-ink text-surface"
                        : "border border-border bg-transparent text-ink hover:border-ink",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {isLoading ? (
            <div className="py-8">
              <SkeletonGrid count={8} />
            </div>
          ) : isError ? (
            <div className="py-8">
              <ErrorState onRetry={() => void refetch()} />
            </div>
          ) : browsingCategory && products.length === 0 && shopItems.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="Aucun résultat dans cette catégorie"
                description="Aucun produit publié pour cette catégorie pour le moment. Explorez toutes les boutiques."
                action={
                  <Link href="/shops" className="btn-primary">
                    Voir toutes les boutiques
                  </Link>
                }
              />
            </div>
          ) : !browsingCategory && shopItems.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="Aucune boutique"
                description={
                  hasSearch
                    ? "Essayez un autre mot-clé ou parcourez toutes les boutiques."
                    : city !== "all"
                      ? "Aucune boutique dans cette ville pour le moment."
                      : "Aucune boutique pour le moment."
                }
                action={
                  hasSearch || city !== "all" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setCity("all");
                      }}
                      className="btn-primary"
                    >
                      Réinitialiser
                    </button>
                  ) : (
                    <Link href="/" className="btn-primary">
                      Retour à l&apos;accueil
                    </Link>
                  )
                }
              />
            </div>
          ) : (
            <div className="space-y-10">
              {browsingCategory && products.length > 0 ? (
                <section className="pt-6">
                  <h2 className="mb-4 font-display text-[22px] font-extrabold">
                    Produits ({products.length})
                  </h2>
                  <div className="grid grid-cols-2 border-l border-border md:grid-cols-3 lg:grid-cols-4">
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
                    <h2 className="mb-4 pt-6 font-display text-[22px] font-extrabold">
                      Boutiques ({shopItems.length})
                    </h2>
                  ) : null}
                  <div className="flex flex-col">
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
    </div>
  );
}

function CityRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2 py-2 text-left text-[14px]",
        active ? "font-bold text-ink" : "font-medium text-ink-muted hover:text-ink",
      )}
    >
      <span className={cn("border-l-[3px] pl-2.5", active ? "border-ink" : "border-transparent")}>
        {label}
      </span>
      <span className="text-[12px] tabular-nums text-ink-subtle">{count}</span>
    </button>
  );
}
