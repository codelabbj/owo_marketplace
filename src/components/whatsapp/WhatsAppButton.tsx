"use client";

import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { ContactFallbackModal } from "./ContactFallbackModal";
import { buildWhatsAppUrl } from "@/lib/whatsapp/buildWhatsAppUrl";
import {
  buildWhatsAppMessage,
  type WhatsAppMessagePayload,
} from "@/lib/whatsapp/buildWhatsAppMessage";
import { cn } from "@/lib/utils/cn";

export type WhatsAppButtonProps = {
  phoneE164?: string | null;
  whatsappUrl?: string | null;
  message: WhatsAppMessagePayload;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
  disabledReason?: string;
};

export function WhatsAppButton({
  phoneE164,
  whatsappUrl,
  message,
  size = "md",
  fullWidth = false,
  className,
  label = "Commander sur WhatsApp",
  disabled = false,
  disabledReason,
}: WhatsAppButtonProps) {
  const [loading, setLoading] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isContactAvailable = Boolean(phoneE164 || whatsappUrl);
  const effectivelyDisabled = disabled || !isContactAvailable;

  const text = buildWhatsAppMessage(message);
  const url = buildWhatsAppUrl({ phoneE164, whatsappUrl, message: text });

  const handleClick = useCallback(() => {
    if (!url) {
      setFallbackOpen(true);
      setErrorMsg("Impossible d'ouvrir WhatsApp");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    window.setTimeout(() => setLoading(false), 800);
  }, [url]);

  const retryOpen = useCallback(() => {
    if (!url) return;
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setFallbackOpen(true);
      setErrorMsg("Impossible d'ouvrir WhatsApp");
    }
  }, [url]);

  const sizeClass =
    size === "lg"
      ? "h-[52px] md:h-12 px-6 text-button"
      : size === "sm"
        ? "h-9 px-3 text-body-sm"
        : "h-10 px-4 text-button";

  if (effectivelyDisabled) {
    return (
      <div className={cn("inline-flex flex-col gap-1", fullWidth && "w-full")}>
        <button
          type="button"
          aria-disabled="true"
          disabled
          className={cn(
            "btn-whatsapp",
            sizeClass,
            fullWidth && "w-full",
            "opacity-50",
            className,
          )}
        >
          <WhatsAppIcon className="h-4 w-4" /> {label}
        </button>
        <p
          className="text-caption text-ink-muted"
          role="note"
          aria-live="polite"
        >
          {disabledReason ?? "Contact WhatsApp indisponible"}
        </p>
      </div>
    );
  }

  return (
    <>
      <a
        href={url ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label={label}
        className={cn(
          "btn-whatsapp",
          sizeClass,
          fullWidth && "w-full",
          className,
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Ouverture WhatsApp…
          </>
        ) : (
          <>
            <WhatsAppIcon className="h-4 w-4" />
            {label}
          </>
        )}
      </a>
      <span aria-live="polite" className="sr-only">
        {errorMsg ?? ""}
      </span>
      <ContactFallbackModal
        open={fallbackOpen}
        phoneE164={phoneE164}
        whatsappUrl={whatsappUrl}
        onClose={() => setFallbackOpen(false)}
        onRetry={() => {
          setFallbackOpen(false);
          retryOpen();
        }}
      />
    </>
  );
}
