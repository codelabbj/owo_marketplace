import type { Metadata, Viewport } from "next";
import "./globals.css";
import { env } from "@/lib/config/env";
import { Providers } from "./providers";
import { ThemeProvider, THEME_STORAGE_KEY } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Owo Marketplace — Découvrez les boutiques près de chez vous",
    template: "%s · Owo Marketplace",
  },
  description:
    "Owo Marketplace regroupe les meilleures boutiques. Parcourez, choisissez, commandez en un clic via WhatsApp.",
  applicationName: "Owo Marketplace",
  openGraph: {
    type: "website",
    siteName: "Owo Marketplace",
    title: "Owo Marketplace",
    description:
      "Découvrez les boutiques de la marketplace Owo et commandez directement via WhatsApp.",
    url: env.siteUrl,
    locale: "fr_FR",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Owo" }],
  },
  twitter: {
    card: "summary",
    title: "Owo Marketplace",
    description:
      "Découvrez les boutiques de la marketplace Owo et commandez directement via WhatsApp.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `(() => {
  try {
    const k = ${JSON.stringify(THEME_STORAGE_KEY)};
    const stored = localStorage.getItem(k);
    const mode = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = mode === "dark" || (mode === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (_) {}
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:shadow-card"
        >
          Aller au contenu principal
        </a>
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
