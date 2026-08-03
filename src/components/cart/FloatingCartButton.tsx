"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils/cn";

/** Bouton flottant bas-droite pour rappeler le panier en cours. */
export function FloatingCartButton() {
  const { totalItems, openCart, attentionTick, shopSlug } = useCart();
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (attentionTick === 0) return;
    setBump(true);
    const t = window.setTimeout(() => setBump(false), 700);
    return () => window.clearTimeout(t);
  }, [attentionTick]);

  if (totalItems <= 0) return null;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Ouvrir le panier, ${totalItems} article${totalItems > 1 ? "s" : ""}`}
      className={cn(
        "fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-card-hover transition-transform duration-200 hover:bg-brand-600 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 md:bottom-8 md:right-8",
        bump && "animate-[cart-bump_0.65s_ease-out]",
      )}
    >
      <ShoppingCart className="h-6 w-6" aria-hidden />
      <span className="absolute -right-1 -top-1 grid min-h-6 min-w-6 place-items-center rounded-full border-2 border-surface bg-ink px-1.5 text-[11px] font-bold text-white">
        {totalItems > 99 ? "99+" : totalItems}
      </span>
      {shopSlug ? (
        <span className="sr-only">Boutique : {shopSlug}</span>
      ) : null}
    </button>
  );
}
