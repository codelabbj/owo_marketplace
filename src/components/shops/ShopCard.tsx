import Link from "next/link";
import Image from "next/image";
import { Store } from "lucide-react";
import type { ShopSummary } from "@/types/domain";

export function ShopCard({ shop }: { shop: ShopSummary }) {
  return (
    <article className="card flex h-full flex-col p-4">
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface-muted">
          {shop.logoUrl ? (
            <Image
              src={shop.logoUrl}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-ink-subtle">
              <Store className="h-5 w-5" aria-hidden />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-h3 text-ink">{shop.name}</h3>
          {shop.city ? (
            <p className="text-caption uppercase tracking-wide text-ink-subtle">
              {shop.city}
            </p>
          ) : null}
        </div>
      </div>

      {shop.shortDescription ? (
        <p className="mt-3 line-clamp-2 text-body-sm text-ink-muted">
          {shop.shortDescription}
        </p>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <span className="text-caption text-ink-muted">
          {shop.productsCount} produit{shop.productsCount > 1 ? "s" : ""}
        </span>
        <Link href={`/${shop.slug}`} className="btn-outline">
          Voir la boutique
        </Link>
      </div>
    </article>
  );
}
