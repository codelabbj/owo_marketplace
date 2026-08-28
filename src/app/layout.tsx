import type { Metadata, Viewport } from "next";
import { Archivo, Public_Sans } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/config/env";
import { Providers } from "./providers";
import { ThemeProvider, THEME_STORAGE_KEY } from "@/components/theme/ThemeProvider";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Owo.Shop — Achetez chez des vendeurs que vous pouvez rencontrer",
    template: "%s · Owo.Shop",
  },
  description:
    "Marketplace des vendeurs vérifiés du Bénin. Vous discutez sur WhatsApp, vous payez à la livraison.",
  applicationName: "Owo.Shop",
  openGraph: {
    type: "website",
    siteName: "Owo.Shop",
    title: "Owo.Shop",
    description:
      "Achetez chez des vendeurs vérifiés. Paiement à la livraison, sans compte.",
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
    { media: "(prefers-color-scheme: light)", color: "#FBF9F6" },
    { media: "(prefers-color-scheme: dark)", color: "#14110D" },
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
    <html lang="fr" className={`${archivo.variable} ${publicSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans">
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
