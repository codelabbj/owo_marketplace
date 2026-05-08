import type { Metadata } from "next";
import { MarketplaceLayout } from "@/components/layout/MarketplaceLayout";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Owo Marketplace — la marketplace béninoise qui connecte vendeurs et clients via WhatsApp.",
  alternates: { canonical: `${env.siteUrl}/about` },
};

export default function AboutPage() {
  return (
    <MarketplaceLayout>
      <article className="container max-w-3xl py-12">
        <h1 className="text-h1">À propos d&apos;Owo Marketplace</h1>
        <p className="mt-4 text-body-lg text-ink-muted">
          Owo Marketplace réunit les boutiques locales sur une vitrine commune.
          Notre mission : rendre l&apos;achat aussi simple qu&apos;un message
          WhatsApp.
        </p>
        <div className="mt-8 space-y-4 text-body text-ink-muted">
          <p>
            Pas de compte client à créer, pas de checkout compliqué : vous
            choisissez un produit, vous appuyez sur «&nbsp;Commander sur
            WhatsApp&nbsp;» et la conversation démarre directement avec le
            vendeur.
          </p>
          <p>
            Chaque boutique dispose d&apos;une page dédiée, simple à partager,
            avec son catalogue, ses informations et son contact direct.
          </p>
        </div>
      </article>
    </MarketplaceLayout>
  );
}
