"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Loader2, Package, Store } from "lucide-react";
import { SearchBar } from "@/components/layout/SearchBar";
import { useMarketplaceSearch } from "@/hooks/useMarketplaceSearch";
import { formatPrice } from "@/lib/utils/currency";
import { shouldUseUnoptimizedImage } from "@/lib/utils/images";
import { cn } from "@/lib/utils/cn";

export function GlobalSearch({ embedded = false }: { embedded?: boolean }) {
  const [query, setQuery] = useState("");
  const enabled = query.trim().length >= 2;
  const { data, isFetching, isError } = useMarketplaceSearch(query);

  const shops = data?.shops ?? [];
  const products = data?.products ?? [];
  const empty = enabled && !isFetching && shops.length === 0 && products.length === 0;

  return (
    <div className={cn(!embedded && "container")}>
      <div className={cn("relative", embedded ? "w-full max-w-xl" : "mx-auto max-w-2xl")}>
        <SearchBar
          onChangeDebounced={setQuery}
          delay={350}
          ariaLabel="Recherche globale boutique ou produit"
        />
        {enabled ? (
          <div
            role="listbox"
            aria-label="Résultats de recherche"
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(420px,70vh)] overflow-auto rounded-lg border border-border bg-surface p-3 shadow-card-hover"
          >
            {isFetching && !data ? (
              <div className="flex items-center gap-2 px-2 py-3 text-body-sm text-ink-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                Recherche en cours…
              </div>
            ) : isError ? (
              <div className="px-2 py-3 text-body-sm text-red-600">
                La recherche a échoué. Réessayez dans un instant.
              </div>
            ) : empty ? (
              <div className="px-2 py-3 text-body-sm text-ink-muted">
                Aucun résultat pour « {query} ».{" "}
                <Link href="/shops" className="text-brand-600 hover:underline">
                  Voir toutes les boutiques
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <SearchSection
                  title="Boutiques"
                  icon={<Store className="h-3.5 w-3.5" aria-hidden />}
                  count={shops.length}
                >
                  {shops.length === 0 ? (
                    <p className="px-2 py-2 text-caption text-ink-muted">
                      Aucune boutique trouvée
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {shops.map((s) => (
                        <li key={s.id}>
                          <Link
                            href={`/${s.slug}`}
                            className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-surface-subtle"
                          >
                            <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-md bg-surface-muted text-ink-subtle">
                              {s.logoUrl ? (
                                <Image
                                  src={s.logoUrl}
                                  alt=""
                                  fill
                                  sizes="36px"
                                  unoptimized={shouldUseUnoptimizedImage(s.logoUrl)}
                                  className="object-cover"
                                />
                              ) : (
                                <Store className="h-4 w-4" />
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-body font-medium text-ink">
                                {s.name}
                              </span>
                              <span className="block truncate text-caption text-ink-muted">
                                {[s.city, s.shortDescription].filter(Boolean).join(" · ") ||
                                  "Boutique"}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </SearchSection>

                <SearchSection
                  title="Produits"
                  icon={<Package className="h-3.5 w-3.5" aria-hidden />}
                  count={products.length}
                >
                  {products.length === 0 ? (
                    <p className="px-2 py-2 text-caption text-ink-muted">
                      Aucun produit trouvé
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {products.map(({ shopSlug, shopName, product }) => (
                        <li key={`${shopSlug}-${product.id}`}>
                          <Link
                            href={`/${shopSlug}/products/${product.slug}`}
                            className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-surface-subtle"
                          >
                            <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-md bg-surface-muted text-ink-subtle">
                              {product.imageUrl ? (
                                <Image
                                  src={product.imageUrl}
                                  alt=""
                                  fill
                                  sizes="36px"
                                  unoptimized={shouldUseUnoptimizedImage(product.imageUrl)}
                                  className="object-cover"
                                />
                              ) : (
                                <Package className="h-4 w-4" />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-body font-medium text-ink">
                                {product.name}
                              </span>
                              <span className="block truncate text-caption text-ink-muted">
                                {shopName}
                                {" · "}
                                {formatPrice(
                                  product.promoPrice ?? product.price,
                                  product.currency,
                                )}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </SearchSection>

                {isFetching ? (
                  <p className="flex items-center gap-2 px-2 text-caption text-ink-subtle">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Mise à jour…
                  </p>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SearchSection({
  title,
  icon,
  count,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  children: ReactNode;
}) {
  return (
    <section>
      <div
        className={cn(
          "mb-1.5 flex items-center gap-2 px-2 text-caption font-semibold uppercase tracking-wide text-ink-subtle",
        )}
      >
        {icon}
        <span>
          {title}
          {count > 0 ? ` (${count})` : ""}
        </span>
      </div>
      {children}
    </section>
  );
}
