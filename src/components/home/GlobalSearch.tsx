"use client";

import Link from "next/link";
import { useState } from "react";
import { useShops } from "@/hooks/useShops";
import { SearchBar } from "@/components/layout/SearchBar";
import { Loader2, Store } from "lucide-react";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const enabled = query.length >= 2;
  const { data, isFetching } = useShops({ query, page: 1 });

  return (
    <div className="container">
      <div className="relative mx-auto max-w-2xl">
        <SearchBar
          onChangeDebounced={setQuery}
          delay={350}
          ariaLabel="Recherche globale boutique ou produit"
        />
        {enabled ? (
          <div
            role="listbox"
            className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[360px] overflow-auto rounded-lg border border-border bg-surface p-2 shadow-card-hover"
          >
            {isFetching ? (
              <div className="flex items-center gap-2 px-3 py-3 text-body-sm text-ink-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                Recherche en cours…
              </div>
            ) : !data || data.results.length === 0 ? (
              <div className="px-3 py-3 text-body-sm text-ink-muted">
                Aucun résultat pour « {query} ».{" "}
                <Link href="/shops" className="text-brand-600 hover:underline">
                  Voir toutes les boutiques
                </Link>
              </div>
            ) : (
              <ul className="space-y-1">
                {data.results.slice(0, 6).map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/${s.slug}`}
                      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-surface-subtle"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-md bg-surface-muted text-ink-subtle">
                        <Store className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-body font-medium text-ink">
                          {s.name}
                        </span>
                        <span className="block truncate text-caption text-ink-muted">
                          {s.short_description ?? "Boutique"}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
