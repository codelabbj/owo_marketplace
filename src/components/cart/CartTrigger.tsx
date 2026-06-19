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
        "relative grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink",
        className,
      )}
    >
      <ShoppingBag className="h-4 w-4" />
      {totalItems > 0 ? (
        <span className="absolute -right-1 -top-1 grid min-h-[1.125rem] min-w-[1.125rem] place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
    </button>
  );
}
