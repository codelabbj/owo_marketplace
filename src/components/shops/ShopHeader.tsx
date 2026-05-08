import Image from "next/image";
import { MapPin, Phone, Store } from "lucide-react";
import type { ShopDetail } from "@/types/domain";

export function ShopHeader({ shop }: { shop: ShopDetail }) {
  return (
    <header className="space-y-4">
      <div className="relative h-[160px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 md:h-[220px]">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="-mt-10 flex flex-col gap-3 px-1 md:flex-row md:items-end md:gap-6">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-surface bg-surface shadow-card md:h-[88px] md:w-[88px]">
          {shop.logoUrl ? (
            <Image
              src={shop.logoUrl}
              alt={`Logo ${shop.name}`}
              fill
              sizes="88px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-ink-subtle">
              <Store className="h-6 w-6" aria-hidden />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-h1 md:text-display-xl">{shop.name}</h1>
          {shop.shortDescription || shop.description ? (
            <p className="mt-1 max-w-2xl text-body text-ink-muted">
              {shop.shortDescription ?? shop.description}
            </p>
          ) : null}
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-body-sm text-ink-muted">
            {shop.address ? (
              <li className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden /> {shop.address}
              </li>
            ) : null}
            {shop.contactPhone ? (
              <li className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4" aria-hidden /> {shop.contactPhone}
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </header>
  );
}
