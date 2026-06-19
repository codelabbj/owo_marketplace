import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api/products";
import { getShop } from "@/lib/api/shops";
import { ApiError } from "@/lib/api/client";
import { toProductDetail, toProductSummary } from "@/lib/api/mappers";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductBreadcrumbs } from "@/components/products/ProductBreadcrumbs";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductPurchasePanel } from "./ProductPurchasePanel";
import { env } from "@/lib/config/env";
import { formatPrice } from "@/lib/utils/currency";

type Params = Promise<{ shopSlug: string; productSlug: string }>;

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { shopSlug, productSlug } = await params;
  try {
    const dto = await getProduct(shopSlug, productSlug);
    const product = toProductDetail(dto);
    return {
      title: `${product.name} · ${product.shop.name}`,
      description:
        product.description.slice(0, 160) ||
        `Découvrez ${product.name} chez ${product.shop.name}.`,
      alternates: {
        canonical: `${env.siteUrl}/${shopSlug}/products/${productSlug}`,
      },
      openGraph: {
        title: product.name,
        description: product.description.slice(0, 160) || undefined,
        url: `${env.siteUrl}/${shopSlug}/products/${productSlug}`,
        images: product.images.length
          ? product.images.map((url) => ({ url }))
          : undefined,
      },
    };
  } catch {
    return { title: "Produit introuvable" };
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { shopSlug, productSlug } = await params;

  let dto;
  try {
    dto = await getProduct(shopSlug, productSlug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  const product = toProductDetail(dto);

  const shopBundle = await getShop(shopSlug).catch(() => null);
  const otherProducts =
    shopBundle?.products.results
      .filter((p) => p.slug !== product.slug)
      .slice(0, 4)
      .map(toProductSummary) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: product.shop.name },
    offers: {
      "@type": "Offer",
      price: product.promoPrice ?? product.price,
      priceCurrency: product.currency,
      availability:
        product.stock > 0 || product.variants.some((v) => v.stock > 0)
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${env.siteUrl}/${shopSlug}/products/${productSlug}`,
    },
  };

  return (
    <div className="container py-8">
      <ProductBreadcrumbs
        shopName={product.shop.name}
        shopSlug={shopSlug}
        productName={product.name}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <ProductGallery images={product.images} alt={product.name} />
        <div className="lg:pt-2">
          <ProductPurchasePanel product={product} />
        </div>
      </div>

      {product.description.trim() ? (
        <section className="mt-12 rounded-lg border border-border bg-surface-subtle p-6">
          <h2 className="text-h2">Description</h2>
          <div className="mt-4 whitespace-pre-line text-body leading-relaxed text-ink-muted">
            {product.description}
          </div>
        </section>
      ) : null}

      {product.variants.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-h2">Variantes disponibles</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {product.variants.map((v) => (
              <li
                key={v.id}
                className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
              >
                <span className="font-medium text-ink">{v.label}</span>
                <span className="text-body-sm text-ink-muted">
                  {formatPrice(v.price, product.currency)}
                  {v.stock > 0 ? ` · ${v.stock} en stock` : " · Rupture"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="mt-8 text-body-sm text-ink-muted">
        Prix indicatif :{" "}
        <strong>{formatPrice(product.price, product.currency)}</strong>. Le
        prix final sera confirmé par le vendeur sur WhatsApp.
      </p>

      {otherProducts.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-h2">Autres produits de cette boutique</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {otherProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                shopSlug={shopSlug}
                shopName={product.shop.name}
                whatsappPhoneE164={product.shop.whatsappPhoneE164}
                whatsappUrl={product.shop.whatsappUrl}
              />
            ))}
          </div>
        </section>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
