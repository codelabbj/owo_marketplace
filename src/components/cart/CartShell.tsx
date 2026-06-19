"use client";

import { CartDrawer } from "@/components/cart/CartDrawer";

/** Panier rendu hors du header pour éviter les problèmes de clipping / backdrop-filter. */
export function CartShell() {
  return <CartDrawer />;
}
