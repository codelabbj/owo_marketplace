"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartWhatsAppButton } from "@/components/cart/CartWhatsAppButton";
import { cn } from "@/lib/utils/cn";

export function CartDrawer() {
  const {
    items,
    totalItems,
    isOpen,
    closeCart,
    updateQty,
    removeItem,
    clearCart,
  } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  if (!isOpen || !mounted) return null;

  const shopName = items[0]?.shopName;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Fermer le panier"
        onClick={closeCart}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="relative flex h-full max-h-[100dvh] w-full max-w-md flex-col border-l border-border bg-surface shadow-card-hover"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-600" />
            <h2 id="cart-drawer-title" className="text-h3">
              Panier ({totalItems})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Fermer"
            className="rounded-md p-1 text-ink-muted hover:bg-surface-subtle"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
            <ShoppingBag className="h-10 w-10 text-ink-subtle" />
            <p className="text-body text-ink-muted">Votre panier est vide.</p>
          </div>
        ) : (
          <>
            <div className="flex min-h-0 flex-1 flex-col">
              {shopName ? (
                <p className="shrink-0 border-b border-border px-4 py-2 text-body-sm text-ink-muted">
                  Boutique : <span className="font-medium text-ink">{shopName}</span>
                </p>
              ) : null}
              <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                {items.map((item, index) => (
                  <li
                    key={item.lineId || `${item.productSlug}-${index}`}
                    className="rounded-lg border border-border bg-surface-subtle p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/${item.shopSlug}/products/${item.productSlug}`}
                          onClick={closeCart}
                          className="font-medium text-ink hover:text-brand-600"
                        >
                          {item.productName || "Produit"}
                        </Link>
                        {item.variantLabel ? (
                          <p className="text-caption text-ink-muted">{item.variantLabel}</p>
                        ) : null}
                        <p className="mt-1 text-body-sm font-medium text-brand-600">
                          {item.promoPrice ?? item.formattedPrice}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.lineId)}
                        aria-label={`Retirer ${item.productName}`}
                        className="shrink-0 rounded p-1 text-ink-muted hover:bg-surface hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Diminuer la quantité"
                        className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface text-ink"
                        onClick={() => updateQty(item.lineId, item.qty - 1)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[2rem] text-center text-body-sm text-ink">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Augmenter la quantité"
                        className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface text-ink"
                        onClick={() => updateQty(item.lineId, item.qty + 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0 space-y-2 border-t border-border bg-surface p-4">
              <CartWhatsAppButton />
              <button
                type="button"
                onClick={clearCart}
                className={cn("btn-ghost h-9 w-full text-body-sm text-ink-muted")}
              >
                Vider le panier
              </button>
            </div>
          </>
        )}
      </aside>
    </div>,
    document.body,
  );
}
