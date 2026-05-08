import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
      <div className="container flex h-[72px] items-center justify-between">
        <Link
          href="/"
          aria-label="Owo Marketplace - accueil"
          className="flex items-center gap-2 font-bold tracking-tight text-ink"
        >
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            priority
            className="h-9 w-9 object-contain"
          />
          <span className="text-h3">
            owo<span className="text-brand-500">.</span>bj
          </span>
        </Link>

        <nav aria-label="Principale" className="hidden items-center gap-6 md:flex">
          <Link
            href="/shops"
            className="text-body-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Boutiques
          </Link>
          <Link
            href="/help"
            className="text-body-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Aide
          </Link>
          <Link
            href="/about"
            className="text-body-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            À propos
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/shops" className="btn-primary">
            Explorer les boutiques
          </Link>
        </div>
      </div>
    </header>
  );
}
