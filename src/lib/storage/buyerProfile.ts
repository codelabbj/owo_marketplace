import {
  BuyerProfileStoredSchema,
  type BuyerProfileStored,
} from "@/schemas/buyer-profile.schema";

const STORAGE_KEY = "owo-marketplace-buyer-profile";

export function getBuyerProfile(): BuyerProfileStored | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    const r = BuyerProfileStoredSchema.safeParse(parsed);
    return r.success ? r.data : null;
  } catch {
    return null;
  }
}

export function setBuyerProfile(profile: BuyerProfileStored): void {
  if (typeof window === "undefined") return;
  const validated = BuyerProfileStoredSchema.parse(profile);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
}

export function clearBuyerProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
