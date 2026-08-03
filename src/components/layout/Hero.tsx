import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, Store } from "lucide-react";
import type { ShopSummary } from "@/types/domain";
import { GlobalSearch } from "@/components/home/GlobalSearch";
import { shouldUseUnoptimizedImage } from "@/lib/utils/images";
import { cn } from "@/lib/utils/cn";

type HeroProps = {
  spotlightShops?: ShopSummary[];
};

export function Hero({ spotlightShops = [] }: HeroProps) {
  const mosaic = spotlightShops.slice(0, 4);

  return (
    <section className="relative z-20 border-b border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgb(249_115_22_/_0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgb(249_115_22_/_0.08),_transparent_50%),linear-gradient(180deg,rgb(var(--color-surface-subtle)),rgb(var(--color-surface)))]" />
        <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgb(var(--color-border)/0.55)_1px,transparent_1px),linear-gradient(90deg,rgb(var(--color-border)/0.55)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" />
        <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl animate-[hero-glow_8s_ease-in-out_infinite]" />
      </div>

      <div className="container grid items-center gap-10 py-12 md:gap-12 md:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:py-20">
        <div className="space-y-7 animate-[hero-rise_0.7s_ease-out]">
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              owo<span className="text-ink">.bj</span> · Marketplace du Bénin
            </p>
            <h1 className="max-w-[18ch] text-balance text-h1 leading-[1.08] tracking-tight md:text-display-xl">
              Toutes vos boutiques préférées,{" "}
              <span className="text-brand-600">à un message près.</span>
            </h1>
            <p className="max-w-[38ch] text-body-lg text-ink-muted">
              Parcourez, choisissez, puis commandez en un clic via WhatsApp —
              sans création de compte.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/shops" className="btn-primary h-12 px-6">
              Explorer les boutiques <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/help" className="btn-outline h-12 px-6">
              Comment ça marche
            </Link>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-caption text-ink-muted">
            <li className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-brand-600" aria-hidden />
              Commande WhatsApp
            </li>
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-600" aria-hidden />
              Conseils d&apos;achat sûrs
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-600" aria-hidden />
              Boutiques en vedette
            </li>
          </ul>

          <div className="pt-1">
            <GlobalSearch embedded />
          </div>
        </div>

        <div
          className="relative mx-auto w-full max-w-md animate-[hero-rise_0.9s_ease-out] lg:max-w-none"
          aria-hidden
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-500/25 via-transparent to-brand-600/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-surface/80 p-4 shadow-card-hover backdrop-blur-sm md:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-caption font-semibold uppercase tracking-wide text-ink-subtle">
                  À la une
                </p>
                <p className="text-body font-semibold text-ink">Boutiques du moment</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/15 px-2.5 py-1 text-caption font-medium text-brand-700 dark:text-brand-300">
                <Sparkles className="h-3.5 w-3.5" />
                Vedette
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(mosaic.length > 0 ? mosaic : PLACEHOLDERS).map((shop, index) => (
                <HeroShopTile
                  key={"id" in shop ? shop.id : `ph-${index}`}
                  shop={shop}
                  className={cn(index === 0 && "row-span-2 min-h-[220px]")}
                  featured={index === 0}
                />
              ))}
            </div>

            <p className="mt-4 text-center text-caption text-ink-subtle">
              Bientôt : mettez votre boutique en vedette pour plus de visibilité.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const PLACEHOLDERS: Array<Pick<ShopSummary, "name" | "city" | "logoUrl" | "slug"> & { id: string }> = [
  { id: "ph-1", slug: "shops", name: "Votre boutique", city: "Cotonou", logoUrl: null },
  { id: "ph-2", slug: "shops", name: "Mode & style", city: "Porto-Novo", logoUrl: null },
  { id: "ph-3", slug: "shops", name: "Tech locale", city: "Calavi", logoUrl: null },
  { id: "ph-4", slug: "shops", name: "Maison", city: "Parakou", logoUrl: null },
];

function HeroShopTile({
  shop,
  className,
  featured = false,
}: {
  shop: Pick<ShopSummary, "name" | "city" | "logoUrl" | "slug"> & { id?: string };
  className?: string;
  featured?: boolean;
}) {
  const href = shop.slug === "shops" ? "/shops" : `/${shop.slug}`;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-h-[104px] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-surface-muted p-3 transition-transform duration-300 ease-out hover:-translate-y-0.5",
        className,
      )}
    >
      {shop.logoUrl ? (
        <Image
          src={shop.logoUrl}
          alt=""
          fill
          sizes="(max-width: 1024px) 40vw, 220px"
          unoptimized={shouldUseUnoptimizedImage(shop.logoUrl)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-500/40 to-surface-muted">
          <Store className="h-8 w-8 text-white/70" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
      <div className="relative z-[1] space-y-1 text-white">
        {featured ? (
          <span className="inline-flex rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            En vedette
          </span>
        ) : null}
        <p className="line-clamp-2 text-body-sm font-semibold drop-shadow">{shop.name}</p>
        {shop.city ? (
          <p className="text-caption text-white/80">{shop.city}</p>
        ) : null}
      </div>
    </Link>
  );
}
