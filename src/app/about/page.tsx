import type { Metadata } from "next";
import Link from "next/link";
import { MarketplaceLayout } from "@/components/layout/MarketplaceLayout";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "Aide",
  description:
    "Comment fonctionne Owo.Shop : boutiques vérifiées, commande WhatsApp, paiement à la livraison.",
  alternates: { canonical: `${env.siteUrl}/about` },
};

const STEPS = [
  {
    title: "Parcourez les boutiques vérifiées",
    body: "Chaque vendeur a été vu sur place. Filtrez par ville ou cherchez un produit.",
  },
  {
    title: "Choisissez, sans créer de compte",
    body: "Ouvrez une fiche, choisissez la variante et la quantité. Rien n’est débité ici.",
  },
  {
    title: "Écrivez sur WhatsApp",
    body: "Un message pré-rempli s’ouvre vers le numéro vérifié de la boutique, avec une référence de commande.",
  },
  {
    title: "Payez à la livraison",
    body: "Vous voyez l’article, vous payez en main propre. Owo ne prend aucune commission sur votre paiement.",
  },
];

export default function AboutPage() {
  return (
    <MarketplaceLayout>
      <article className="mp-wrap max-w-3xl pb-20 pt-14">
        <p className="mp-kicker mb-2.5">Comment ça marche</p>
        <h1 className="font-display text-[clamp(36px,5vw,52px)] font-extrabold tracking-[-0.045em]">
          Owo.Shop, la vitrine. WhatsApp, la caisse.
        </h1>
        <p className="mt-5 max-w-[56ch] text-[17px] leading-relaxed text-ink-muted">
          Owo réunit des boutiques du Bénin déjà vérifiées : identité, adresse, WhatsApp.
          Vous discutez avec le vendeur, vous vous rencontrez, vous payez à la livraison.
        </p>
        <ol className="mt-10">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-5 border-b border-border py-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center border border-ink font-display text-[15px] font-extrabold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-display text-[20px] font-bold tracking-[-0.03em]">{step.title}</h2>
                <p className="mt-1 text-[14.5px] leading-relaxed text-ink-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 border border-ink p-6">
          <p className="font-display text-[18px] font-bold">Vous vendez déjà au Bénin ?</p>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
            La vérification se fait dans votre boutique, sur place. Ensuite vos produits apparaissent sur Owo.Shop.
          </p>
          <Link href="/help" className="mt-4 inline-flex text-[13px] font-bold uppercase tracking-[0.06em] text-brand-700 hover:text-brand-500">
            Lire les règles de confiance
          </Link>
        </div>
      </article>
    </MarketplaceLayout>
  );
}
