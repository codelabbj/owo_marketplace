import Image from "next/image";
import { MapPin, Phone, Store } from "lucide-react";
import type { ShopDetail } from "@/types/domain";

export function ShopHeader({ shop }: { shop: ShopDetail }) {
  return (
    <header>
      <div className="relative h-[220px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 md:h-[320px]">
        {shop.coverUrl ? (
          <Image
            src={shop.coverUrl}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover"
          />
        ) : null}

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10"
        />

        <div className="absolute inset-x-0 bottom-0 p-4 md:p-8">
          <div className="flex items-end gap-3 md:gap-5">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-card-hover md:h-[96px] md:w-[96px]">
              {shop.logoUrl ? (
                <Image
                  src={shop.logoUrl}
                  alt={`Logo ${shop.name}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-ink-subtle">
                  <Store className="h-7 w-7" aria-hidden />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 pb-1 text-white">
              {shop.city ? (
                <p className="mb-1 inline-flex items-center gap-1 text-caption font-medium uppercase tracking-wider text-white/80">
                  <MapPin className="h-3 w-3" aria-hidden />
                  {shop.city}
                </p>
              ) : null}
              <h1 className="line-clamp-2 text-h1 leading-tight drop-shadow-md md:text-display-xl">
                {shop.name}
              </h1>
              {shop.shortDescription ? (
                <p className="mt-1 line-clamp-2 max-w-2xl text-body text-white/90 drop-shadow md:text-body-lg">
                  {shop.shortDescription}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {(shop.address || shop.contactPhone || shop.description) && (
        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-start md:gap-8">
          {shop.description && shop.description !== shop.shortDescription ? (
            <p className="max-w-3xl text-body text-ink-muted">{shop.description}</p>
          ) : (
            <span />
          )}
          {shop.address || shop.contactPhone ? (
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-body-sm text-ink-muted md:justify-end">
              {shop.address ? (
                <li className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-brand-500" aria-hidden />
                  {shop.address}
                </li>
              ) : null}
              {shop.contactPhone ? (
                <li className="inline-flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-brand-500" aria-hidden />
                  {shop.contactPhone}
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
      )}
    </header>
  );
}
