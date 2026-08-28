import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getShop } from "@/lib/api/shops";
import { ApiError } from "@/lib/api/client";
import { ShopAside, ShopHeader } from "@/components/shops/ShopHeader";
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
    <div>
      <ShopHeader shop={shop} />

      <div className="mp-wrap grid gap-12 py-10 md:py-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section>
          <div className="mb-0 flex items-end justify-between border-b-2 border-ink pb-3.5">
            <h2 className="font-display text-[28px] font-extrabold tracking-[-0.035em]">Catalogue</h2>
            <span className="text-[13px] text-ink-muted">
              {products.length} produit{products.length > 1 ? "s" : ""}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="Aucun produit pour le moment"
                description="Cette boutique n'a publié aucun produit."
                action={
                  <Link href="/shops" className="btn-primary">
                    Découvrir d&apos;autres boutiques
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 border-l border-border md:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  shopSlug={shop.slug}
                  shopName={shop.name}
                  shopCity={shop.city}
                  whatsappPhoneE164={shop.whatsappPhoneE164}
                  whatsappUrl={shop.whatsappUrl}
                />
              ))}
            </div>
          )}
        </section>

        <ShopAside shop={shop} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
