import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface-subtle">
      <div className="container grid gap-8 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold">
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-h3">
              owo<span className="text-brand-500">.</span>bj
            </span>
          </div>
          <p className="text-body-sm text-ink-muted">
            La marketplace qui connecte vendeurs et clients en un clic via WhatsApp.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-caption uppercase tracking-wide text-ink-subtle">
            Découvrir
          </h3>
          <ul className="space-y-2 text-body-sm">
            <li>
              <Link href="/shops" className="text-ink-muted hover:text-ink">
                Toutes les boutiques
              </Link>
            </li>
            <li>
              <Link href="/" className="text-ink-muted hover:text-ink">
                Accueil
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-caption uppercase tracking-wide text-ink-subtle">
            Aide
          </h3>
          <ul className="space-y-2 text-body-sm">
            <li>
              <Link href="/help" className="text-ink-muted hover:text-ink">
                Centre d&apos;aide
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-ink-muted hover:text-ink">
                À propos
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-caption uppercase tracking-wide text-ink-subtle">
            Légal
          </h3>
          <ul className="space-y-2 text-body-sm">
            <li>
              <Link href="/terms" className="text-ink-muted hover:text-ink">
                Conditions d&apos;utilisation
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-ink-muted hover:text-ink">
                Politique de confidentialité
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-caption text-ink-subtle md:flex-row">
          <p>© {new Date().getFullYear()} Owo Marketplace. Tous droits réservés.</p>
          <p>
            Développé par{" "}
            <a
              href="https://codelab.bj/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline"
            >
              codelabbj
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
