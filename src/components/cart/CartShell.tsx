"use client";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { FloatingCartButton } from "@/components/cart/FloatingCartButton";

/** Panier rendu hors du header (drawer + FAB bas-droite). */
export function CartShell() {
  return (
    <>
      <CartDrawer />
      <FloatingCartButton />
    </>
  );
}
