import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mp-band mt-0">
      <div className="mp-wrap grid gap-10 py-14 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="font-display text-[20px] font-extrabold tracking-[-0.045em]">
              Owo<span className="text-brand-500">.</span>Shop
            </span>
          </div>
          <p className="max-w-[34ch] text-[14px] leading-relaxed text-white/65">
            La marketplace des vendeurs vérifiés du Bénin. Vous discutez, vous vérifiez, vous payez à la livraison.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">Découvrir</h3>
          <ul className="space-y-2 text-[14px] text-white/70">
            <li>
              <Link href="/shops" className="hover:text-brand-500">
                Toutes les boutiques
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-brand-500">
                Accueil
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">Confiance</h3>
          <ul className="space-y-2 text-[14px] text-white/70">
            <li>
              <Link href="/help" className="hover:text-brand-500">
                Comment on vérifie
              </Link>
            </li>
            <li>
              <Link href="/help#safety-tips" className="hover:text-brand-500">
                Conseils de sécurité
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-500">
                À propos
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">Légal</h3>
          <ul className="space-y-2 text-[14px] text-white/70">
            <li>
              <Link href="/terms" className="hover:text-brand-500">
                Conditions d&apos;utilisation
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-brand-500">
                Politique de confidentialité
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mp-wrap flex flex-col items-start justify-between gap-2 py-6 text-[11.5px] text-white/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Owo.Shop. Tous droits réservés.</p>
          <p>
            Construit avec{" "}
            <a
              href="https://codelab.bj/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-500 hover:text-white"
            >
              CodeLab
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
