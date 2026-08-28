import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { listShops } from "@/lib/api/shops";
import { listCategories } from "@/lib/api/categories";
import { listTrendingProducts } from "@/lib/api/trending";
import { toShopSummary } from "@/lib/api/mappers";
import { ShopCard } from "@/components/shops/ShopCard";
import { ProductCard } from "@/components/products/ProductCard";
import { Hero } from "@/components/layout/Hero";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/states/EmptyState";
import { env } from "@/lib/config/env";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Achetez chez des vendeurs vérifiés du Bénin. Vous discutez sur WhatsApp, vous payez à la livraison.",
  alternates: {
    canonical: env.siteUrl,
  },
};

const TRUST_POINTS = [
  {
    num: "01",
    title: "Identité réelle",
    body: "Pièce d’identité, photo du vendeur, et correspondance avec le nom de la boutique.",
  },
  {
    num: "02",
    title: "Adresse physique",
    body: "Un agent Owo se rend sur place. Pas de boutique fantôme, pas de numéro jetable.",
  },
  {
    num: "03",
    title: "WhatsApp du commerce",
    body: "Le numéro affiché est celui vérifié en boutique. Vous parlez à la bonne personne.",
  },
];

export default async function HomePage() {
  let shopsError: string | null = null;
  const shops = await listShops({ page: 1 }).catch((err: unknown) => {
    shopsError =
      err instanceof Error ? err.message : "Impossible de charger les boutiques.";
    return null;
  });
  const allShops = (shops?.results ?? []).map(toShopSummary);
  const featured = allShops.slice(0, 4);
  const shopsCount = shops?.count ?? allShops.length;

  const [trending, categories] = await Promise.all([
    listTrendingProducts(8).catch(() => [] as Awaited<ReturnType<typeof listTrendingProducts>>),
    listCategories().catch(() => [] as Awaited<ReturnType<typeof listCategories>>),
  ]);

  const categoryTiles = categories.slice(0, 8);

  return (
    <>
      <Hero shopsCount={shopsCount} />

      {categoryTiles.length > 0 ? (
        <section className="border-b border-ink bg-surface-subtle">
          <div className="mp-wrap flex items-stretch overflow-x-auto">
            {categoryTiles.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shops?category=${encodeURIComponent(cat.slug)}`}
                className="flex min-w-[150px] flex-1 flex-col gap-0.5 border-r border-border py-[18px] pr-5 last:border-r-0"
              >
                <span className="font-display text-[16px] font-bold tracking-[-0.02em]">{cat.label}</span>
                <span className="text-[12px] text-ink-subtle">Voir les produits</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <Section
        kicker="01 — Les vendeurs"
        title="Boutiques vérifiées cette semaine"
        href="/shops"
        cta={shopsCount ? `Les ${shopsCount} boutiques` : "Toutes les boutiques"}
      >
        {featured.length === 0 ? (
          <EmptyState
            title={shopsError ? "Connexion API indisponible" : "Pas encore de boutiques"}
            description={
              shopsError
                ? `Vérifiez que l’API répond (${env.apiBaseUrl}) et redémarrez \`npm run dev\` après modification de .env.local. Détail : ${shopsError}`
                : "Aucune boutique active sur la marketplace pour le moment. Publiez une boutique depuis l’ERP (module marketplace)."
            }
            action={
              <Link href="/shops" className="btn-primary">
                Voir toutes les boutiques
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col">
            {featured.map((shop) => (
              <ShopCard key={shop.id} shop={shop} featured />
            ))}
          </div>
        )}
      </Section>

      <Section
        kicker="02 — La sélection"
        title="Produits du moment"
        description="Prix affichés par le vendeur. Négociation et livraison se règlent sur WhatsApp."
        href="/shops"
        cta="Explorer"
      >
        {trending.length === 0 ? (
          <EmptyState
            title="Aucun produit pour le moment"
            description="Les produits publiés dans les boutiques actives apparaîtront ici."
          />
        ) : (
          <div className="grid grid-cols-2 border-l border-border md:grid-cols-3 lg:grid-cols-4">
            {trending.map(({ shopSlug, shopName, whatsappPhoneE164, whatsappUrl, product }) => (
              <ProductCard
                key={`${shopSlug}-${product.id}`}
                shopSlug={shopSlug}
                shopName={shopName}
                whatsappPhoneE164={whatsappPhoneE164}
                whatsappUrl={whatsappUrl}
                product={product}
              />
            ))}
          </div>
        )}
      </Section>

      <section className="mp-band mt-20">
        <div className="mp-wrap py-16 md:py-[72px]">
          <p className="mp-kicker mb-2.5">03 — La confiance</p>
          <h2 className="mb-11 max-w-[22ch] font-display text-[clamp(28px,2.8vw,38px)] font-extrabold tracking-[-0.04em]">
            Ce qu&apos;on vérifie pour accorder le badge « Vérifié »
          </h2>
          <div className="grid border-t border-white/25 md:grid-cols-3">
            {TRUST_POINTS.map((tp) => (
              <div key={tp.num} className="border-white/15 py-7 pr-8 md:border-r md:last:border-r-0">
                <p className="font-display text-[13px] font-bold tracking-[0.14em] text-brand-500">{tp.num}</p>
                <h3 className="mb-2 mt-3 font-display text-[21px] font-bold tracking-[-0.02em]">{tp.title}</h3>
                <p className="text-[14px] leading-relaxed text-white/70">{tp.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-11 flex flex-col items-start gap-3.5 border border-white/25 px-5 py-[18px] md:flex-row md:items-center">
            <AlertTriangle className="h-[18px] w-[18px] shrink-0 text-brand-500" />
            <p className="flex-1 text-[13.5px] leading-snug text-white/85">
              Un vendeur vous demande un paiement d&apos;avance par mobile money ? Signalez-le. Ici, on paie à la livraison, en main propre.
            </p>
            <Link
              href="/help"
              className="shrink-0 text-[12.5px] font-bold uppercase tracking-[0.06em] text-brand-500 hover:text-white"
            >
              Signaler
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
