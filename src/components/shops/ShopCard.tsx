import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, MapPin, Package, Store } from "lucide-react";
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
    <Link
      href={`/${shop.slug}`}
      className={cn(
        "group grid items-center gap-4 border-b border-border py-5 hover:bg-[#F7F4EF] dark:hover:bg-surface-muted",
        featured
          ? "grid-cols-[64px_minmax(0,1fr)_auto] md:grid-cols-[64px_minmax(0,1fr)_40px] md:gap-[22px] md:py-[22px]"
          : "grid-cols-[72px_minmax(0,1fr)] md:grid-cols-[72px_minmax(0,1fr)_auto] md:gap-[22px]",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-surface-muted",
          featured ? "h-16 w-16" : "h-[72px] w-[72px]",
        )}
      >
        {shop.logoUrl || shop.coverUrl ? (
          <Image
            src={shop.logoUrl || shop.coverUrl!}
            alt=""
            fill
            sizes="72px"
            unoptimized={shouldUseUnoptimizedImage(shop.logoUrl || shop.coverUrl || "")}
            className="object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-ink-subtle">
            <Store className="h-6 w-6" aria-hidden />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-[20px] font-bold tracking-[-0.025em]">{shop.name}</span>
          <span className="mp-verified">
            <BadgeCheck className="h-3 w-3" />
            Vérifié
          </span>
        </div>
        {shop.shortDescription ? (
          <p className="mt-1 line-clamp-1 text-[14px] text-ink-muted">{shop.shortDescription}</p>
        ) : null}
        <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-subtle">
          {shop.city ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {shop.city}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <Package className="h-3 w-3" />
            {shop.productsCount} produit{shop.productsCount > 1 ? "s" : ""}
          </span>
        </p>
      </div>
      {featured ? (
        <span className="hidden h-10 w-10 items-center justify-center border border-ink md:grid">
          <ArrowRight className="h-4 w-4" />
        </span>
      ) : (
        <span className="hidden h-10 items-center gap-2 border border-ink px-4 text-[12.5px] font-bold uppercase tracking-[0.04em] md:inline-flex">
          Voir <ArrowRight className="h-3.5 w-3.5" />
        </span>
      )}
    </Link>
  );
}
