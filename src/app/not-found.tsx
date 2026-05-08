import Link from "next/link";
import { MarketplaceLayout } from "@/components/layout/MarketplaceLayout";

export default function NotFound() {
  return (
    <MarketplaceLayout>
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-caption uppercase tracking-wide text-brand-600">
          Erreur 404
        </p>
        <h1 className="text-h1">Page introuvable</h1>
        <p className="max-w-md text-body text-ink-muted">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
      </div>
    </MarketplaceLayout>
  );
}
