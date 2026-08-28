"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartWhatsAppButton } from "@/components/cart/CartWhatsAppButton";
import { SafetyTips } from "@/components/safety/SafetyTips";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils/cn";

type PendingRemove =
  | { type: "item"; lineId: string; productName: string }
  | { type: "all" }
  | null;

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
  const [pendingRemove, setPendingRemove] = useState<PendingRemove>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setPendingRemove(null);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pendingRemove) closeCart();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart, pendingRemove]);

  if (!isOpen || !mounted) return null;

  const shopName = items[0]?.shopName;

  function confirmPendingRemove() {
    if (!pendingRemove) return;
    if (pendingRemove.type === "item") {
      removeItem(pendingRemove.lineId);
    } else {
      clearCart();
    }
    setPendingRemove(null);
  }

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
        className="relative flex h-full max-h-[100dvh] w-full max-w-md flex-col border-l border-ink bg-surface"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-ink px-4 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 id="cart-drawer-title" className="font-display text-[22px] font-extrabold tracking-[-0.03em]">
              Panier ({totalItems})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Fermer"
            className="p-1 text-ink-muted hover:bg-surface-muted"
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
                  <span className="mt-0.5 block text-caption">
                    Une seule boutique par panier
                  </span>
                </p>
              ) : null}
              <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                {items.map((item, index) => (
                  <li
                    key={item.lineId || `${item.productSlug}-${index}`}
                    className="border border-border bg-surface p-3"
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
                        onClick={() =>
                          setPendingRemove({
                            type: "item",
                            lineId: item.lineId,
                            productName: item.productName || "ce produit",
                          })
                        }
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
                        disabled={item.qty <= 1}
                        className="grid h-8 w-8 place-items-center border border-ink bg-surface text-ink disabled:opacity-40"
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
                        className="grid h-8 w-8 place-items-center border border-ink bg-surface text-ink"
                        onClick={() => updateQty(item.lineId, item.qty + 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0 space-y-3 border-t border-border bg-surface p-4">
              <SafetyTips compact id="cart-safety-tips" />
              <CartWhatsAppButton />
              <button
                type="button"
                onClick={() => setPendingRemove({ type: "all" })}
                className={cn("btn-ghost h-9 w-full text-body-sm text-ink-muted")}
              >
                Vider le panier
              </button>
            </div>
          </>
        )}
      </aside>

      <ConfirmDialog
        open={pendingRemove !== null}
        tone="danger"
        title={
          pendingRemove?.type === "all"
            ? "Vider le panier ?"
            : "Retirer ce produit ?"
        }
        description={
          pendingRemove?.type === "all"
            ? "Tous les articles seront retirés de votre panier. Cette action est irréversible."
            : `« ${pendingRemove?.type === "item" ? pendingRemove.productName : ""} » sera retiré de votre panier.`
        }
        confirmLabel={pendingRemove?.type === "all" ? "Vider le panier" : "Retirer"}
        cancelLabel="Annuler"
        onCancel={() => setPendingRemove(null)}
        onConfirm={confirmPendingRemove}
      />
    </div>,
    document.body,
  );
}
