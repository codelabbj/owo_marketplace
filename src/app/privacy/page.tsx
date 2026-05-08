import type { Metadata } from "next";
import { MarketplaceLayout } from "@/components/layout/MarketplaceLayout";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité d'Owo Marketplace.",
  alternates: { canonical: `${env.siteUrl}/privacy` },
};

export default function PrivacyPage() {
  return (
    <MarketplaceLayout>
      <article className="container max-w-3xl py-12 text-body text-ink-muted">
        <h1 className="text-h1 text-ink">Politique de confidentialité</h1>
        <p className="mt-4">
          Owo Marketplace ne demande pas de création de compte côté visiteur.
          Aucun panier n&apos;est stocké côté client.
        </p>
        <h2 className="mt-8 text-h2 text-ink">Données collectées</h2>
        <p className="mt-2">
          La marketplace peut collecter des données techniques anonymes (pages
          visitées, performance) à des fins d&apos;amélioration du service. Aucune
          donnée d&apos;identification personnelle n&apos;est demandée pour
          parcourir les boutiques.
        </p>
        <h2 className="mt-8 text-h2 text-ink">WhatsApp</h2>
        <p className="mt-2">
          Lorsque vous cliquez sur «&nbsp;Commander sur WhatsApp&nbsp;», la
          conversation est lancée par votre application WhatsApp. Owo
          Marketplace ne lit ni ne stocke vos échanges avec le vendeur.
        </p>
      </article>
    </MarketplaceLayout>
  );
}
