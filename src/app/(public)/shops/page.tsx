import type { Metadata } from "next";
import { ShopsBrowser } from "./ShopsBrowser";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: "Boutiques",
  description: "Toutes les boutiques de la marketplace Owo, filtrables par catégorie.",
  alternates: {
    canonical: `${env.siteUrl}/shops`,
  },
};

type SearchParams = Promise<{ query?: string }>;

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  return <ShopsBrowser initialQuery={sp.query ?? ""} />;
}
