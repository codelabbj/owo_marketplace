import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketplaceLayout } from "@/components/layout/MarketplaceLayout";
import { SafetyTips } from "@/components/safety/SafetyTips";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "Sécurité des achats",
  description:
    "Comment acheter à distance sans se faire avoir : vendeurs vérifiés, paiement à la livraison, signalement.",
  alternates: { canonical: `${env.siteUrl}/help` },
};

const RULES = [
  {
    num: "01",
    title: "Payez à la livraison",
    body: "Aucun paiement d’avance, même « pour confirmer ». L’argent change de main quand le produit est dans les vôtres.",
  },
  {
    num: "02",
    title: "Demandez une photo réelle",
    body: "Une photo prise maintenant, avec un objet du quotidien à côté. Les visuels de catalogue ne suffisent pas.",
  },
  {
    num: "03",
    title: "Lieu public pour la remise",
    body: "Carrefour, station, devanture de boutique. Évitez les rendez-vous isolés la nuit.",
  },
  {
    num: "04",
    title: "Vérifiez avant de payer",
    body: "Ouvrez, comparez, essayez si c’est un vêtement. Ensuite seulement vous réglez.",
  },
  {
    num: "05",
    title: "Gardez la référence Owo",
    body: "Chaque commande WhatsApp porte une référence. Conservez-la : c’est ce qui permet de retrouver la boutique.",
  },
  {
    num: "06",
    title: "Signalez sans attendre",
    body: "Pression pour payer d’avance, numéro qui change, refus de se rencontrer : dites-le-nous.",
  },
];

export default function HelpPage() {
  return (
    <MarketplaceLayout>
      <article className="mp-wrap pb-20">
        <div className="border-b-2 border-ink pb-6 pt-14">
          <p className="mp-kicker mb-2.5">Sécurité des achats</p>
          <h1 className="max-w-[20ch] font-display text-[clamp(36px,5vw,52px)] font-extrabold tracking-[-0.045em]">
            Acheter à distance sans se faire avoir
          </h1>
        </div>
        <div className="grid border-l border-border md:grid-cols-2">
          {RULES.map((r) => (
            <div key={r.num} className="border-b border-r border-border px-7 py-7">
              <p className="font-display text-[12.5px] font-bold tracking-[0.14em] text-brand-500">{r.num}</p>
              <h2 className="mb-2 mt-2.5 font-display text-[22px] font-bold tracking-[-0.025em]">{r.title}</h2>
              <p className="m-0 text-[14.5px] leading-relaxed text-ink-muted">{r.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start gap-6 bg-ink px-8 py-8 text-surface md:flex-row md:items-center">
          <div className="flex-1">
            <h2 className="mb-2 font-display text-[26px] font-extrabold tracking-[-0.03em]">
              Un problème avec un vendeur ?
            </h2>
            <p className="m-0 max-w-[60ch] text-[14.5px] leading-relaxed text-surface/75">
              Envoyez-nous la référence de commande : on retrouve la boutique, on la contacte, et on la retire de la marketplace si nécessaire.
            </p>
          </div>
          <Link href="/about" className="inline-flex h-[52px] shrink-0 items-center gap-2.5 bg-brand-500 px-6 text-[14px] font-bold text-white hover:bg-brand-600">
            Signaler une boutique <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-14" id="safety-tips">
          <SafetyTips />
        </div>
      </article>
    </MarketplaceLayout>
  );
}
