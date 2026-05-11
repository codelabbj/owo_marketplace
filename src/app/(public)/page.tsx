import type { Metadata } from "next";
import Link from "next/link";
import { listShops } from "@/lib/api/shops";
import { toShopSummary } from "@/lib/api/mappers";
import { ShopCard } from "@/components/shops/ShopCard";
import { ProductCard } from "@/components/products/ProductCard";
import { Hero } from "@/components/layout/Hero";
import { Section } from "@/components/layout/Section";
import { GlobalSearch } from "@/components/home/GlobalSearch";
import { EmptyState } from "@/components/states/EmptyState";
import {
  getTrendingProductsMock,
  MOCK_CATEGORIES,
} from "@/lib/api/mocks";
import { env } from "@/lib/config/env";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Découvrez les boutiques de la marketplace Owo et commandez en un clic via WhatsApp.",
  alternates: {
    canonical: env.siteUrl,
  },
};

export default async function HomePage() {
  const shops = await listShops({ page: 1 }).catch(() => null);
  const featured = (shops?.results ?? []).slice(0, 4).map(toShopSummary);
  const trending = getTrendingProductsMock();

  return (
    <>
      <Hero />

      <section className="container -mt-4 pb-2 md:-mt-8">
        <GlobalSearch />
      </section>

      <Section
        title="Boutiques en vedette"
        description="Une sélection des boutiques actives ce mois-ci."
        href="/shops"
      >
        {featured.length === 0 ? (
          <EmptyState
            title="Pas encore de boutiques"
            description="Revenez bientôt — de nouvelles boutiques arrivent chaque semaine."
            action={
              <Link href="/shops" className="btn-primary">
                Voir toutes les boutiques
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 wide:grid-cols-4">
            {featured.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Produits tendances"
        description="Ce que nos clients regardent en ce moment."
        href="/shops"
        cta="Explorer"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {trending.map(({ shopSlug, shopName, product }) => (
            <ProductCard
              key={product.id}
              shopSlug={shopSlug}
              shopName={shopName}
              whatsappPhoneE164={product.shop.whatsapp_phone_e164 ?? null}
              whatsappUrl={product.shop.whatsapp_url ?? null}
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                imageUrl: product.images[0] ?? null,
                price: product.price,
                promoPrice: product.promo_price ?? null,
                currency: product.currency,
                inStock: product.stock > 0 || product.variants.some((v) => v.stock > 0),
                stockLabel:
                  product.stock > 0 && product.stock <= 5
                    ? "Stock limité"
                    : null,
              }}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Catégories principales"
        description="Trouvez ce que vous cherchez par univers."
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shops?query=${encodeURIComponent(cat.label)}`}
              className="card flex items-center justify-between gap-2 p-4 text-body font-medium text-ink hover:border-brand-500"
            >
              {cat.label}
              <span className="text-brand-600">→</span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
