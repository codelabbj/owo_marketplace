import type { Metadata } from "next";
import { MarketplaceLayout } from "@/components/layout/MarketplaceLayout";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions générales d'utilisation d'Owo Marketplace.",
  alternates: { canonical: `${env.siteUrl}/terms` },
};

export default function TermsPage() {
  return (
    <MarketplaceLayout>
      <article className="container max-w-3xl py-12 text-body text-ink-muted">
        <h1 className="text-h1 text-ink">Conditions d&apos;utilisation</h1>
        <p className="mt-4">
          En utilisant Owo Marketplace, vous reconnaissez que la marketplace agit
          comme une vitrine reliant vendeurs et clients. Toute transaction est
          réalisée directement entre vous et le vendeur via WhatsApp.
        </p>
        <h2 className="mt-8 text-h2 text-ink">Responsabilités</h2>
        <p className="mt-2">
          Les vendeurs sont responsables de leurs annonces, prix, disponibilités
          et conditions de livraison. Owo Marketplace ne garantit pas la
          disponibilité d&apos;un produit donné.
        </p>
        <h2 className="mt-8 text-h2 text-ink">Modifications</h2>
        <p className="mt-2">
          Ces conditions peuvent être mises à jour à tout moment. La version la
          plus récente est disponible sur cette page.
        </p>
      </article>
    </MarketplaceLayout>
  );
}
