export function normalizePhoneE164(raw: string): string | null {
  if (!raw) return null;
  const trimmed = raw.replace(/\s+/g, "").replace(/[()-]/g, "");
  const digits = trimmed.startsWith("+") ? trimmed.slice(1) : trimmed;
  if (!/^\d{6,15}$/.test(digits)) return null;
  return digits;
}

export type BuildWhatsAppUrlInput = {
  phoneE164?: string | null;
  whatsappUrl?: string | null;
  message: string;
};

export function buildWhatsAppUrl({
  phoneE164,
  whatsappUrl,
  message,
}: BuildWhatsAppUrlInput): string | null {
  const encoded = encodeURIComponent(message);

  if (whatsappUrl && whatsappUrl.trim().length > 0) {
    try {
      const url = new URL(whatsappUrl);
      url.searchParams.set("text", message);
      return url.toString();
    } catch {
      // continue with phone fallback below
    }
  }

  const normalized = phoneE164 ? normalizePhoneE164(phoneE164) : null;
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encoded}`;
}
