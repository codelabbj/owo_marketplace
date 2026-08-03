import Link from "next/link";
import Image from "next/image";
import { Sparkles, Store } from "lucide-react";
import type { ShopSummary } from "@/types/domain";
import { shouldUseUnoptimizedImage } from "@/lib/utils/images";
import { cn } from "@/lib/utils/cn";

export function ShopCard({
  shop,
  featured = false,
}: {
  shop: ShopSummary;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "card relative flex h-full flex-col overflow-hidden p-0",
        featured && "ring-1 ring-brand-500/40",
      )}
    >
      <div className="relative h-28 w-full bg-surface-muted">
        {shop.coverUrl || shop.logoUrl ? (
          <Image
            src={shop.coverUrl || shop.logoUrl!}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            unoptimized={shouldUseUnoptimizedImage(shop.coverUrl || shop.logoUrl || "")}
            className="object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-500/20 to-surface-muted text-ink-subtle">
            <Store className="h-7 w-7" aria-hidden />
          </div>
        )}
        {featured ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-1 text-caption font-semibold text-white shadow-sm">
            <Sparkles className="h-3 w-3" aria-hidden />
            En vedette
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-surface-muted">
            {shop.logoUrl ? (
              <Image
                src={shop.logoUrl}
                alt=""
                fill
                sizes="48px"
                unoptimized={shouldUseUnoptimizedImage(shop.logoUrl)}
                className="object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-ink-subtle">
                <Store className="h-4 w-4" aria-hidden />
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
          <Link href={`/${shop.slug}`} className="btn-outline h-9 px-3 text-body-sm">
            Voir la boutique
          </Link>
        </div>
      </div>
    </article>
  );
}
