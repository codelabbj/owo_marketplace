import type { Metadata } from "next";
import { MarketplaceLayout } from "@/components/layout/MarketplaceLayout";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "Aide",
  description: "Comment utiliser Owo Marketplace en quelques étapes simples.",
  alternates: { canonical: `${env.siteUrl}/help` },
};

const STEPS = [
  {
    title: "Parcourez les boutiques",
    body: "Explorez la liste des boutiques actives, filtrez par catégorie ou recherchez un nom précis.",
  },
  {
    title: "Choisissez un produit",
    body: "Ouvrez la fiche produit, sélectionnez la variante (taille, couleur…) et la quantité.",
  },
  {
    title: "Commandez sur WhatsApp",
    body: "Cliquez sur «\u00a0Commander sur WhatsApp\u00a0» : un message pré-rempli s'ouvre vers le vendeur.",
  },
  {
    title: "Finalisez avec le vendeur",
    body: "Le vendeur confirme la disponibilité, le prix final et le mode de livraison directement sur WhatsApp.",
  },
];

export default function HelpPage() {
  return (
    <MarketplaceLayout>
      <article className="container max-w-3xl py-12">
        <h1 className="text-h1">Centre d&apos;aide</h1>
        <p className="mt-3 text-body text-ink-muted">
          Owo Marketplace est conçu pour simplifier au maximum vos achats.
        </p>
        <ol className="mt-8 space-y-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card flex gap-4 p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                {i + 1}
              </span>
              <div>
                <h2 className="text-h3">{step.title}</h2>
                <p className="text-body-sm text-ink-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </article>
    </MarketplaceLayout>
  );
}
