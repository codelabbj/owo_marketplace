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
  layout,
  className,
}: ProductActionsProps) {
  const isDetail = size === "lg";
  const resolvedLayout = layout ?? (isDetail ? "stack" : "row");
  const sharedHint = isDetail && disabled && disabledReason;

  return (
    <div
      className={cn(
        resolvedLayout === "stack"
          ? "flex w-full flex-col gap-3"
          : "flex items-stretch gap-2.5",
        className,
      )}
    >
      <AddToCartButton
        item={cartItem}
        disabled={disabled}
        hideDisabledHint={Boolean(sharedHint)}
        size={isDetail ? "lg" : size === "md" ? "md" : "sm"}
        className={isDetail ? "w-full" : "min-w-0 flex-1"}
      />

      <WhatsAppButton
        shopSlug={shopSlug}
        productSlug={productSlug}
        phoneE164={phoneE164}
        whatsappUrl={whatsappUrl}
        message={message}
        size={isDetail ? "lg" : "icon"}
        fullWidth={isDetail}
        label="Commander sur WhatsApp"
        disabled={disabled}
        disabledReason={disabledReason}
        hideDisabledHint={Boolean(sharedHint)}
        className={isDetail ? "w-full" : "shrink-0 self-stretch"}
      />

      {sharedHint ? (
        <p className="text-body-sm text-ink-muted" role="note">
          {disabledReason}
        </p>
      ) : null}
    </div>
  );
}
