"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { CartItem } from "@/schemas/cart.schema";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils/cn";

type AddToCartButtonProps = {
  item: Omit<CartItem, "lineId">;
  disabled?: boolean;
  disabledReason?: string;
  size?: "sm" | "md";
  className?: string;
};

export function AddToCartButton({
  item,
  disabled = false,
  disabledReason,
  size = "sm",
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    setFeedback(null);
    const result = addItem(item);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    setFeedback("Ajouté au panier");
    window.setTimeout(() => setFeedback(null), 2000);
  }

  const sizeClass = size === "md" ? "h-10 text-button" : "h-9 text-body-sm";

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={cn("btn-outline flex-1", sizeClass)}
      >
        <ShoppingCart className="h-4 w-4" aria-hidden />
        Ajouter au panier
      </button>
      {feedback ? (
        <p className="text-caption text-emerald-700 dark:text-emerald-400" role="status">
          {feedback}
        </p>
      ) : null}
      {error ? (
        <p className="text-caption text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {disabled && disabledReason ? (
        <p className="text-caption text-ink-muted">{disabledReason}</p>
      ) : null}
    </div>
  );
}
