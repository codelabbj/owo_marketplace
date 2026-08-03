"use client";

import { useCallback, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { ContactFallbackModal } from "./ContactFallbackModal";
import { BuyerProfileModal } from "./BuyerProfileModal";
import { buildWhatsAppUrl } from "@/lib/whatsapp/buildWhatsAppUrl";
import {
  buildWhatsAppMessage,
  type WhatsAppMessagePayload,
} from "@/lib/whatsapp/buildWhatsAppMessage";
import { cn } from "@/lib/utils/cn";
import { getBuyerProfile, setBuyerProfile } from "@/lib/storage/buyerProfile";
import { submitContactIntent } from "@/lib/api/contactIntent";
import type { BuyerProfileStored } from "@/schemas/buyer-profile.schema";
import { useCart } from "@/contexts/CartContext";
import { generateOrderRef } from "@/lib/whatsapp/orderRef";

export type WhatsAppButtonProps = {
  shopSlug: string;
  productSlug: string;
  phoneE164?: string | null;
  whatsappUrl?: string | null;
  message: WhatsAppMessagePayload;
  size?: "sm" | "md" | "lg" | "icon";
  fullWidth?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
  disabledReason?: string;
  hideDisabledHint?: boolean;
  respectCartLock?: boolean;
};

export function WhatsAppButton({
  shopSlug,
  productSlug,
  phoneE164,
  whatsappUrl,
  message,
  size = "md",
  fullWidth = false,
  className,
  label = "Commander sur WhatsApp",
  disabled = false,
  disabledReason,
  hideDisabledHint = false,
  respectCartLock = true,
}: WhatsAppButtonProps) {
  const { totalItems } = useCart();
  const cartBlocksProduct = respectCartLock && totalItems > 0;
  const inFlightRef = useRef(false);
  const pendingRef = useRef<{ text: string; url: string } | null>(null);

  const [loading, setLoading] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const isContactAvailable = Boolean(phoneE164 || whatsappUrl);
  const effectivelyDisabled = disabled || cartBlocksProduct || !isContactAvailable;

  const resolvedDisabledReason = cartBlocksProduct
    ? "Commandez depuis votre panier"
    : disabledReason;

  const preparePayload = useCallback(() => {
    const orderRef = message.orderRef?.trim() || generateOrderRef(shopSlug);
    const text = buildWhatsAppMessage({ ...message, orderRef });
    const url = buildWhatsAppUrl({ phoneE164, whatsappUrl, message: text });
    if (!url) return null;
    pendingRef.current = { text, url };
    return pendingRef.current;
  }, [message, shopSlug, phoneE164, whatsappUrl]);

  const openWhatsApp = useCallback((url: string) => {
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setFallbackOpen(true);
      setErrorMsg("Impossible d'ouvrir WhatsApp");
    }
  }, []);

  const runSubmitAndOpen = useCallback(
    async (profile: BuyerProfileStored) => {
      if (inFlightRef.current) return;
      const pending = pendingRef.current ?? preparePayload();
      if (!pending) {
        setFallbackOpen(true);
        setErrorMsg("Impossible d'ouvrir WhatsApp");
        return;
      }
      inFlightRef.current = true;
      setLoading(true);
      setSubmitError(null);
      setErrorMsg(null);
      try {
        await submitContactIntent({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone_e164: profile.phoneE164,
          shop_slug: shopSlug,
          product_slug: productSlug,
          prefilled_message: pending.text,
          product_url: message.productUrl,
        });
        openWhatsApp(pending.url);
      } catch {
        setSubmitError(
          "L'enregistrement de votre demande a échoué. Vérifiez votre connexion et réessayez.",
        );
      } finally {
        inFlightRef.current = false;
        setLoading(false);
      }
    },
    [preparePayload, shopSlug, productSlug, message.productUrl, openWhatsApp],
  );

  const startFlow = useCallback(() => {
    if (loading || inFlightRef.current || profileModalOpen) return;
    const pending = preparePayload();
    if (!pending) {
      setFallbackOpen(true);
      setErrorMsg("Impossible d'ouvrir WhatsApp");
      return;
    }
    const stored = getBuyerProfile();
    if (!stored) {
      setProfileModalOpen(true);
      return;
    }
    void runSubmitAndOpen(stored);
  }, [preparePayload, runSubmitAndOpen, loading, profileModalOpen]);

  const onProfileSaved = useCallback(
    (profile: BuyerProfileStored) => {
      setBuyerProfile(profile);
      setProfileModalOpen(false);
      void runSubmitAndOpen(profile);
    },
    [runSubmitAndOpen],
  );

  const sizeClass =
    size === "icon"
      ? "h-10 w-10 shrink-0 px-0"
      : size === "lg"
        ? "h-[52px] md:h-12 px-6 text-button"
        : size === "sm"
          ? "h-9 px-3 text-body-sm"
          : "h-10 px-4 text-button";

  const iconOnly = size === "icon";

  if (effectivelyDisabled) {
    return (
      <div className={cn("inline-flex flex-col gap-1", fullWidth && "w-full")}>
        <button
          type="button"
          aria-disabled="true"
          disabled
          title={resolvedDisabledReason ?? label}
          className={cn(
            "btn-whatsapp",
            sizeClass,
            fullWidth && !iconOnly && "w-full",
            cartBlocksProduct ? "pointer-events-none opacity-40" : "opacity-50",
            className,
          )}
        >
          <WhatsAppIcon className="h-4 w-4" />
          {!iconOnly ? label : null}
          {iconOnly ? <span className="sr-only">{label}</span> : null}
        </button>
        {resolvedDisabledReason && !iconOnly && !hideDisabledHint ? (
          <p className="text-caption text-ink-muted" role="note" aria-live="polite">
            {resolvedDisabledReason}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <div className={cn("inline-flex flex-col gap-1", fullWidth && "w-full")}>
        <button
          type="button"
          onClick={startFlow}
          disabled={loading}
          aria-busy={loading}
          aria-label={label}
          title={iconOnly ? label : undefined}
          className={cn(
            "btn-whatsapp",
            sizeClass,
            fullWidth && !iconOnly && "w-full",
            className,
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {!iconOnly ? "Préparation…" : null}
            </>
          ) : (
            <>
              <WhatsAppIcon className="h-4 w-4" />
              {!iconOnly ? label : null}
              {iconOnly ? <span className="sr-only">{label}</span> : null}
            </>
          )}
        </button>
        {submitError ? (
          <p className="text-caption text-red-600" role="alert">
            {submitError}
          </p>
        ) : null}
      </div>
      <span aria-live="polite" className="sr-only">
        {errorMsg ?? ""}
      </span>
      <BuyerProfileModal
        open={profileModalOpen}
        initial={null}
        onClose={() => setProfileModalOpen(false)}
        onSave={onProfileSaved}
      />
      <ContactFallbackModal
        open={fallbackOpen}
        phoneE164={phoneE164}
        whatsappUrl={whatsappUrl}
        onClose={() => setFallbackOpen(false)}
        onRetry={() => {
          setFallbackOpen(false);
          const url = pendingRef.current?.url;
          if (url) openWhatsApp(url);
        }}
      />
    </>
  );
}
