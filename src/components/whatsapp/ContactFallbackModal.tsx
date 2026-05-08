"use client";

import { useEffect, useState } from "react";
import { Copy, X, RefreshCw, Check } from "lucide-react";

export type ContactFallbackModalProps = {
  open: boolean;
  phoneE164?: string | null;
  whatsappUrl?: string | null;
  onClose: () => void;
  onRetry: () => void;
};

export function ContactFallbackModal({
  open,
  phoneE164,
  whatsappUrl,
  onClose,
  onRetry,
}: ContactFallbackModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const displayed = phoneE164 ? `+${phoneE164}` : whatsappUrl ?? "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(displayed);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-fallback-title"
    >
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-card-hover">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 id="contact-fallback-title" className="text-h3">
              Impossible d&apos;ouvrir WhatsApp
            </h2>
            <p className="mt-1 text-body-sm text-ink-muted">
              Vous pouvez copier le numéro du vendeur ou réessayer.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-md p-1 text-ink-muted hover:bg-surface-subtle hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 rounded-md border border-border bg-surface-subtle p-4">
          <p className="text-caption uppercase tracking-wide text-ink-subtle">
            Contact vendeur
          </p>
          <p className="mt-1 break-all text-body font-medium text-ink">
            {displayed || "—"}
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn-outline"
            onClick={handleCopy}
            disabled={!displayed}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Copié
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copier le numéro
              </>
            )}
          </button>
          <button type="button" className="btn-primary" onClick={onRetry}>
            <RefreshCw className="h-4 w-4" /> Réessayer
          </button>
        </div>
      </div>
    </div>
  );
}
