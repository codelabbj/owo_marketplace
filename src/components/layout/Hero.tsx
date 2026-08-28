import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Lock } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";

/** Aperçu WhatsApp figé sur la boutique Owo Desk (données catalogue). */
const OWO_DESK_CHAT = {
  shopName: "Owo Desk",
  city: "Abomey-Calavi",
  productName: "Macbook pro 2019",
  variant: "16/512GB",
  price: formatPrice(300_000, "XOF"),
  logoSrc: "/logo.png",
} as const;

type HeroProps = {
  shopsCount?: number;
};

export function Hero({ shopsCount }: HeroProps) {

  return (
    <section className="border-b border-ink bg-surface">
      <div className="mp-wrap">
        <p className="mp-kicker-muted border-b border-border py-[22px]">
          Marketplace du Bénin — Cotonou · Porto-Novo · Calavi · Parakou
        </p>
      </div>
      <div className="mp-wrap grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)]">
        <div className="border-border py-12 md:py-14 lg:border-r lg:pr-14">
          <h1 className="max-w-[14ch] font-display text-[clamp(38px,4.4vw,66px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
            Achetez chez des vendeurs
            <span className="text-brand-500"> que vous pouvez rencontrer.</span>
          </h1>
          <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-ink-muted">
            Chaque boutique d&apos;Owo est vérifiée sur place : identité, adresse, numéro WhatsApp.
            Vous discutez avec le vendeur, vous payez à la livraison.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shops" className="btn-primary h-[52px] px-6">
              Parcourir les boutiques vérifiées <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/help" className="btn-outline h-[52px] px-6">
              Comment on vérifie
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-3 border-t border-border">
            <div className="py-5 pr-4">
              <p className="font-display text-[34px] font-extrabold tabular-nums tracking-[-0.04em]">
                {shopsCount && shopsCount > 0 ? shopsCount : "—"}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-ink-muted">boutiques actives</p>
            </div>
            <div className="py-5 pr-4">
              <p className="font-display text-[34px] font-extrabold tracking-[-0.04em]">0 F</p>
              <p className="mt-1 text-[13px] leading-snug text-ink-muted">à payer d&apos;avance</p>
            </div>
            <div className="py-5">
              <p className="font-display text-[34px] font-extrabold tracking-[-0.04em]">WhatsApp</p>
              <p className="mt-1 text-[13px] leading-snug text-ink-muted">commande en 3 messages</p>
            </div>
          </div>
        </div>

        <div className="hidden flex-col justify-center py-12 lg:flex lg:pl-11">
          <p className="mp-kicker-muted mb-3.5">Une commande, trois messages</p>
          <div className="border border-ink bg-surface-subtle">
            <div className="flex items-center gap-2.5 border-b border-border px-3.5 py-3">
              <Image
                src={OWO_DESK_CHAT.logoSrc}
                alt=""
                width={34}
                height={34}
                className="h-[34px] w-[34px] object-contain"
              />
              <div className="leading-tight">
                <p className="text-[13.5px] font-bold">{OWO_DESK_CHAT.shopName}</p>
                <p className="text-[11.5px] font-semibold text-[#1C7A4B]">
                  {OWO_DESK_CHAT.city} · en ligne
                </p>
              </div>
              <span className="mp-verified ml-auto">
                <BadgeCheck className="h-3 w-3" />
                Vérifié
              </span>
            </div>
            <div className="flex flex-col gap-2.5 bg-[#F7F4EF] p-4 dark:bg-surface-muted">
              <div className="max-w-[88%] self-end border border-[#C6E9AC] bg-[#DCF8C6] px-3 py-2.5 text-[13px] leading-snug text-[#17140F]">
                Bonjour {OWO_DESK_CHAT.shopName} 👋
                <br />
                Je souhaite commander :
                <br />
                Produit : {OWO_DESK_CHAT.productName}
                <br />
                Variante : {OWO_DESK_CHAT.variant}
                <br />
                Prix : {OWO_DESK_CHAT.price}
              </div>
              <div className="max-w-[80%] self-start border border-border bg-white px-3 py-2.5 text-[13px] leading-snug dark:bg-surface">
                Bonjour ! {OWO_DESK_CHAT.productName} dispo. Livraison {OWO_DESK_CHAT.city}{" "}
                à convenir, je peux passer aujourd&apos;hui.
              </div>
              <div className="max-w-[70%] self-end border border-[#C6E9AC] bg-[#DCF8C6] px-3 py-2.5 text-[13px] leading-snug text-[#17140F]">
                Parfait, je paie à la livraison.
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-border px-3.5 py-3 text-[11.5px] text-ink-muted">
              <Lock className="h-3.5 w-3.5" />
              Owo ne prend aucune commission sur votre paiement.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
