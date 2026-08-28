"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils/cn";

export function CartTrigger({ className }: { className?: string }) {
  const { totalItems, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Ouvrir le panier${totalItems > 0 ? `, ${totalItems} article${totalItems > 1 ? "s" : ""}` : ""}`}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 border border-ink px-3 text-[13px] font-bold leading-none tracking-[0.02em] sm:px-4",
        totalItems > 0
          ? "bg-brand-500 text-white hover:bg-brand-600"
          : "bg-surface text-ink hover:bg-ink hover:text-surface",
        className,
      )}
    >
      <ShoppingBag className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
      <span className="hidden whitespace-nowrap sm:inline">
        {totalItems > 0 ? `Panier · ${totalItems}` : "Panier"}
      </span>
      {totalItems > 0 ? (
        <span className="grid min-h-[1.125rem] min-w-[1.125rem] place-items-center bg-white px-1 text-[10px] font-semibold text-brand-700 sm:hidden">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
    </button>
  );
}
