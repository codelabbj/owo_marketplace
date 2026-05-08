import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getShop } from "@/lib/api/shops";
import { ApiError } from "@/lib/api/client";
import { ShopHeader } from "@/components/shops/ShopHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { EmptyState } from "@/components/states/EmptyState";
import {
  toProductSummary,
  toShopFromBundle,
} from "@/lib/api/mappers";
import { env } from "@/lib/config/env";

type Params = Promise<{ shopSlug: string }>;

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { shopSlug } = await params;
  try {
    const bundle = await getShop(shopSlug);
    const shop = toShopFromBundle(bundle);
    return {
      title: shop.name,
      description:
        shop.shortDescription ??
        shop.description ??
        `Découvrez les produits de ${shop.name} sur Owo Marketplace.`,
      alternates: {
        canonical: `${env.siteUrl}/${shop.slug}`,
      },
      openGraph: {
        title: shop.name,
        description: shop.shortDescription ?? undefined,
        url: `${env.siteUrl}/${shop.slug}`,
        images: shop.coverUrl ? [{ url: shop.coverUrl }] : undefined,
      },
    };
  } catch {
    return { title: "Boutique introuvable" };
  }
}

export default async function ShopPage({ params }: { params: Params }) {
  const { shopSlug } = await params;

  let bundle;
  try {
    bundle = await getShop(shopSlug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  const shop = toShopFromBundle(bundle);
  const products = bundle.products.results.map(toProductSummary);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: shop.name,
    url: `${env.siteUrl}/${shop.slug}`,
    logo: shop.logoUrl ?? undefined,
    description: shop.description ?? shop.shortDescription ?? undefined,
    address: shop.address
      ? { "@type": "PostalAddress", addressLocality: shop.address }
      : undefined,
    contactPoint: shop.contactPhone
      ? {
          "@type": "ContactPoint",
          telephone: shop.contactPhone,
          contactType: "customer service",
        }
      : undefined,
  };

  return (
    <div className="container py-8">
      <ShopHeader shop={shop} />

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-h2">Catalogue</h2>
          <span className="text-body-sm text-ink-muted">
            {products.length} produit{products.length > 1 ? "s" : ""}
          </span>
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="Aucun produit pour le moment"
            description="Cette boutique n'a publié aucun produit."
            action={
              <Link href="/shops" className="btn-primary">
                Découvrir d&apos;autres boutiques
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                shopSlug={shop.slug}
                shopName={shop.name}
                whatsappPhoneE164={shop.whatsappPhoneE164}
                whatsappUrl={shop.whatsappUrl}
              />
            ))}
          </div>
        )}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
