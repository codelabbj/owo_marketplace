import { describe, expect, it } from "vitest";
import {
  buildWhatsAppUrl,
  normalizePhoneE164,
} from "@/lib/whatsapp/buildWhatsAppUrl";

describe("normalizePhoneE164", () => {
  it("strips + and spaces", () => {
    expect(normalizePhoneE164("+229 60 00 00 00")).toBe("22960000000");
  });
  it("accepts pure digits", () => {
    expect(normalizePhoneE164("22960000000")).toBe("22960000000");
  });
  it("rejects too short numbers", () => {
    expect(normalizePhoneE164("123")).toBeNull();
  });
  it("rejects empty input", () => {
    expect(normalizePhoneE164("")).toBeNull();
  });
});

describe("buildWhatsAppUrl", () => {
  it("returns null when no phone and no whatsappUrl", () => {
    expect(buildWhatsAppUrl({ message: "Hi" })).toBeNull();
  });

  it("builds wa.me url with encoded message", () => {
    const url = buildWhatsAppUrl({
      phoneE164: "+229 60 00 00 00",
      message: "Bonjour, prix?",
    });
    expect(url).not.toBeNull();
    expect(url).toContain("https://wa.me/22960000000");
    expect(url).toContain("text=Bonjour%2C%20prix%3F");
  });

  it("encodes line breaks", () => {
    const url = buildWhatsAppUrl({
      phoneE164: "22960000000",
      message: "Line1\nLine2",
    });
    expect(url).toContain("Line1%0ALine2");
  });

  it("uses provided whatsappUrl and overrides text", () => {
    const url = buildWhatsAppUrl({
      whatsappUrl: "https://wa.me/22961000000?text=old",
      message: "new message",
    });
    expect(url).toContain("https://wa.me/22961000000");
    expect(url).toContain("text=new+message");
  });

  it("falls back to phone when whatsappUrl is malformed", () => {
    const url = buildWhatsAppUrl({
      whatsappUrl: "not-a-url",
      phoneE164: "22960000000",
      message: "ok",
    });
    expect(url).toContain("https://wa.me/22960000000");
  });
});
