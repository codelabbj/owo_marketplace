import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-surface to-surface dark:from-brand-500/10 dark:via-surface dark:to-surface" />
      <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-brand-100 blur-3xl dark:bg-brand-500/10" />
      <div className="container py-12 md:py-20">
        <div className="max-w-[680px] space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-surface/80 px-3 py-1 text-caption text-brand-700 dark:border-brand-500/30 dark:text-brand-300">
            <ShoppingBag className="h-3.5 w-3.5" /> La marketplace du Bénin
          </span>
          <h1 className="text-h1 md:text-display-xl">
            Toutes vos boutiques préférées, <br />
            <span className="text-brand-600">à un message près.</span>
          </h1>
          <p className="max-w-[720px] text-body-lg text-ink-muted">
            Parcourez des centaines de boutiques, choisissez vos produits, puis commandez
            en un clic via WhatsApp — sans création de compte.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/shops" className="btn-primary h-12 px-6">
              Explorer les boutiques <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/help" className="btn-outline h-12 px-6">
              Comment ça marche
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
