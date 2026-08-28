"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingBag, BadgeCheck, HandCoins, UserRoundX, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { CartTrigger } from "@/components/cart/CartTrigger";
import { GlobalSearch } from "@/components/home/GlobalSearch";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/shops", label: "Boutiques" },
  { href: "/help", label: "Sécurité" },
  { href: "/about", label: "Aide" },
];

export function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface">
      <div className="hidden border-b border-ink bg-ink text-surface md:block">
        <div className="mp-wrap flex h-[34px] items-center justify-between text-[11.5px] font-semibold uppercase tracking-[0.08em]">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5 text-brand-500" aria-hidden />
              Vendeurs vérifiés en personne
            </span>
            <span className="inline-flex items-center gap-1.5 opacity-70">
              <HandCoins className="h-3.5 w-3.5" aria-hidden />
              Paiement à la livraison
            </span>
            <span className="inline-flex items-center gap-1.5 opacity-70">
              <UserRoundX className="h-3.5 w-3.5" aria-hidden />
              Aucun compte requis
            </span>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-brand-500 hover:text-white"
          >
            Vendre sur OwoDesk <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="border-b border-ink">
        <div className="mp-wrap flex h-[68px] items-center gap-4 md:gap-7">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-ink" aria-label="Owo.Shop — accueil">
            <Image src="/logo.png" alt="" width={30} height={30} priority className="h-[30px] w-[30px] object-contain" />
            <span className="font-display text-[21px] font-extrabold tracking-[-0.045em]">
              Owo<span className="text-brand-500">.</span>Shop
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 md:block">
            <GlobalSearch embedded />
          </div>

          <nav aria-label="Principale" className="ml-auto hidden items-center gap-5 text-[14px] font-semibold lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "pb-0.5 text-ink hover:text-brand-600",
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    ? "border-b-2 border-ink"
                    : "border-b-2 border-transparent",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex h-10 items-center gap-2 lg:ml-0">
            <ThemeToggle />
            <CartTrigger />
            <button
              type="button"
              className="grid h-10 w-10 shrink-0 place-items-center border border-ink lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="border-t border-border px-4 py-2 md:hidden">
          <GlobalSearch embedded />
        </div>
      </div>

      {open ? (
        <div className="border-b border-ink bg-surface px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1 text-[16px] font-semibold">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-2">
                {item.label}
              </Link>
            ))}
            <Link href="/about" onClick={() => setOpen(false)} className="py-2 text-brand-600">
              Vendre sur OwoDesk
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function CartLabel({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <ShoppingBag className="h-4 w-4" />
      {count > 0 ? `Panier · ${count}` : "Panier"}
    </span>
  );
}
