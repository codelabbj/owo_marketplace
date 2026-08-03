"use client";

import { useCallback, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { ContactFallbackModal } from "@/components/whatsapp/ContactFallbackModal";
import { BuyerProfileModal } from "@/components/whatsapp/BuyerProfileModal";
import { buildWhatsAppUrl } from "@/lib/whatsapp/buildWhatsAppUrl";
import { buildWhatsAppCartMessage } from "@/lib/whatsapp/buildWhatsAppCartMessage";
import { generateOrderRef } from "@/lib/whatsapp/orderRef";
import { getBuyerProfile, setBuyerProfile } from "@/lib/storage/buyerProfile";
import { submitContactIntent } from "@/lib/api/contactIntent";
import type { BuyerProfileStored } from "@/schemas/buyer-profile.schema";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils/cn";

export function CartWhatsAppButton({
  fullWidth = true,
  className,
}: {
  fullWidth?: boolean;
  className?: string;
}) {
  const { items, clearCart } = useCart();
  const inFlightRef = useRef(false);
  const pendingRef = useRef<{ text: string; url: string; orderRef: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const first = items[0];
  const phoneE164 = first?.whatsappPhoneE164;
  const whatsappUrl = first?.whatsappUrl;

  const preparePayload = useCallback(() => {
    if (!first) return null;
    const orderRef = generateOrderRef(first.shopSlug);
    const text = buildWhatsAppCartMessage(items, orderRef);
    const url = buildWhatsAppUrl({ phoneE164, whatsappUrl, message: text });
    if (!url) return null;
    pendingRef.current = { text, url, orderRef };
    return pendingRef.current;
  }, [first, items, phoneE164, whatsappUrl]);

  const openWhatsApp = useCallback((url: string) => {
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setFallbackOpen(true);
    }
  }, []);

  const runSubmitAndOpen = useCallback(
    async (profile: BuyerProfileStored) => {
      if (inFlightRef.current || !first) return;
      const pending = pendingRef.current ?? preparePayload();
      if (!pending) {
        setFallbackOpen(true);
        return;
      }
      inFlightRef.current = true;
      setLoading(true);
      setSubmitError(null);
      try {
        for (const item of items) {
          await submitContactIntent({
            first_name: profile.firstName,
            last_name: profile.lastName,
            phone_e164: profile.phoneE164,
            shop_slug: item.shopSlug,
            product_slug: item.productSlug,
            prefilled_message: pending.text,
            product_url: item.productUrl,
          });
        }
        openWhatsApp(pending.url);
        clearCart();
      } catch {
        setSubmitError(
          "L'enregistrement a échoué. Vérifiez votre connexion et réessayez.",
        );
      } finally {
        inFlightRef.current = false;
        setLoading(false);
      }
    },
    [first, items, preparePayload, openWhatsApp, clearCart],
  );

  const startFlow = useCallback(() => {
    if (loading || inFlightRef.current || profileModalOpen) return;
    if (!first) {
      setFallbackOpen(true);
      return;
    }
    const pending = preparePayload();
    if (!pending) {
      setFallbackOpen(true);
      return;
    }
    const stored = getBuyerProfile();
    if (!stored) {
      setProfileModalOpen(true);
      return;
    }
    void runSubmitAndOpen(stored);
  }, [first, preparePayload, runSubmitAndOpen, loading, profileModalOpen]);

  if (items.length === 0) return null;

  const contactOk = Boolean(phoneE164 || whatsappUrl);

  return (
    <>
      <button
        type="button"
        onClick={startFlow}
        disabled={loading || !contactOk}
        aria-busy={loading}
        className={cn(
          "btn-whatsapp h-11 px-4 text-button",
          fullWidth && "w-full",
          !contactOk && "opacity-50",
          className,
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Préparation…
          </>
        ) : (
          <>
            <WhatsAppIcon className="h-4 w-4" />
            Commander sur WhatsApp
          </>
        )}
      </button>
      {submitError ? (
        <p className="mt-1 text-caption text-red-600" role="alert">
          {submitError}
        </p>
      ) : null}
      {!contactOk ? (
        <p className="mt-1 text-caption text-ink-muted">
          Contact WhatsApp indisponible pour cette boutique.
        </p>
      ) : null}
      <BuyerProfileModal
        open={profileModalOpen}
        initial={null}
        onClose={() => setProfileModalOpen(false)}
        onSave={(profile) => {
          setBuyerProfile(profile);
          setProfileModalOpen(false);
          void runSubmitAndOpen(profile);
        }}
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
