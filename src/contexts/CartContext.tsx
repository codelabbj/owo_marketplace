"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  cartLineId,
  type CartItem,
} from "@/schemas/cart.schema";
import {
  cartShopSlug,
  clearCartStorage,
  getCart,
  mergeCartItem,
  normalizeCartItems,
  setCart,
} from "@/lib/storage/cart";

type AddToCartInput = Omit<CartItem, "lineId">;

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  isOpen: boolean;
  /** Incrémente à chaque ajout réussi — pour animer le FAB. */
  attentionTick: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (input: AddToCartInput) => { ok: true } | { ok: false; reason: string };
  updateQty: (lineId: string, qty: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  shopSlug: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [attentionTick, setAttentionTick] = useState(0);

  useEffect(() => {
    setItems(normalizeCartItems(getCart().items));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setCart({ items });
  }, [items, hydrated]);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
  }, []);

  const addItem = useCallback(
    (input: AddToCartInput): { ok: true } | { ok: false; reason: string } => {
      const currentShop = cartShopSlug({ items });
      if (currentShop && currentShop !== input.shopSlug) {
        return {
          ok: false,
          reason:
            "Le panier n’accepte qu’une seule boutique. Videz-le pour ajouter des produits d’une autre boutique.",
        };
      }

      const lineId = cartLineId({
        shopSlug: input.shopSlug,
        productSlug: input.productSlug,
        variantLabel: input.variantLabel,
      });

      const incoming: CartItem = {
        ...input,
        lineId,
        currency: input.currency || "XOF",
        formattedPrice: input.formattedPrice || "—",
      };
      persist(mergeCartItem(items, incoming));
      setAttentionTick((n) => n + 1);
      // Ne pas ouvrir le tiroir : l’utilisateur finalise via le bouton panier.
      return { ok: true };
    },
    [items, persist],
  );

  const updateQty = useCallback(
    (lineId: string, qty: number) => {
      if (qty < 1) {
        persist(items.filter((i) => i.lineId !== lineId));
        return;
      }
      persist(
        items.map((i) =>
          i.lineId === lineId ? { ...i, qty: Math.min(99, qty) } : i,
        ),
      );
    },
    [items, persist],
  );

  const removeItem = useCallback(
    (lineId: string) => {
      persist(items.filter((i) => i.lineId !== lineId));
    },
    [items, persist],
  );

  const clearCart = useCallback(() => {
    persist([]);
    clearCartStorage();
  }, [persist]);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      isOpen,
      attentionTick,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQty,
      removeItem,
      clearCart,
      shopSlug: cartShopSlug({ items }),
    }),
    [
      items,
      totalItems,
      isOpen,
      attentionTick,
      addItem,
      updateQty,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
