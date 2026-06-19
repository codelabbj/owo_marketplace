"use client";

import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import type { WhatsAppMessagePayload } from "@/lib/whatsapp/buildWhatsAppMessage";
import type { CartItem } from "@/schemas/cart.schema";
import { cn } from "@/lib/utils/cn";

type ProductActionsProps = {
  cartItem: Omit<CartItem, "lineId">;
  shopSlug: string;
  productSlug: string;
  phoneE164?: string | null;
  whatsappUrl?: string | null;
  message: WhatsAppMessagePayload;
  disabled?: boolean;
  disabledReason?: string;
  size?: "sm" | "md" | "lg";
  layout?: "row" | "stack";
  className?: string;
};

export function ProductActions({
  cartItem,
  shopSlug,
  productSlug,
  phoneE164,
  whatsappUrl,
  message,
  disabled = false,
  disabledReason,
  size = "sm",
  layout = "row",
  className,
}: ProductActionsProps) {
  const addSize = size === "lg" ? "md" : size;

  return (
    <div
      className={cn(
        layout === "row" ? "flex items-start gap-2" : "flex flex-col gap-2",
        className,
      )}
    >
      <AddToCartButton
        item={cartItem}
        disabled={disabled}
        disabledReason={disabledReason}
        size={addSize}
        className="min-w-0 flex-1"
      />
      <WhatsAppButton
        shopSlug={shopSlug}
        productSlug={productSlug}
        phoneE164={phoneE164}
        whatsappUrl={whatsappUrl}
        message={message}
        size={size === "lg" ? "md" : "icon"}
        label="Commander sur WhatsApp"
        disabled={disabled}
        disabledReason={disabledReason}
        className={cn("shrink-0", size === "lg" && "h-[52px] w-[52px] md:h-12 md:w-12")}
      />
    </div>
  );
}
