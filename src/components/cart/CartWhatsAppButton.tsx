"use client";

import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { ContactFallbackModal } from "@/components/whatsapp/ContactFallbackModal";
import { BuyerProfileModal } from "@/components/whatsapp/BuyerProfileModal";
import { buildWhatsAppUrl } from "@/lib/whatsapp/buildWhatsAppUrl";
import { buildWhatsAppCartMessage } from "@/lib/whatsapp/buildWhatsAppCartMessage";
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
  const [loading, setLoading] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const first = items[0];
  const phoneE164 = first?.whatsappPhoneE164;
  const whatsappUrl = first?.whatsappUrl;
  const text = buildWhatsAppCartMessage(items);
  const url = buildWhatsAppUrl({
    phoneE164,
    whatsappUrl,
    message: text,
  });

  const openWhatsApp = useCallback(() => {
    if (!url) return;
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setFallbackOpen(true);
    }
  }, [url]);

  const runSubmitAndOpen = useCallback(
    async (profile: BuyerProfileStored) => {
      if (!url || !first) return;
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
            prefilled_message: text,
            product_url: item.productUrl,
          });
        }
        openWhatsApp();
        clearCart();
      } catch {
        setSubmitError(
          "L'enregistrement a échoué. Vérifiez votre connexion et réessayez.",
        );
      } finally {
        setLoading(false);
      }
    },
    [url, first, items, text, openWhatsApp, clearCart],
  );

  const startFlow = useCallback(() => {
    if (!url || !first) {
      setFallbackOpen(true);
      return;
    }
    const stored = getBuyerProfile();
    if (!stored) {
      setProfileModalOpen(true);
      return;
    }
    void runSubmitAndOpen(stored);
  }, [url, first, runSubmitAndOpen]);

  if (items.length === 0) return null;

  const contactOk = Boolean(phoneE164 || whatsappUrl);

  return (
    <>
      <button
        type="button"
        onClick={startFlow}
        disabled={loading || !contactOk}
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
          openWhatsApp();
        }}
      />
    </>
  );
}
