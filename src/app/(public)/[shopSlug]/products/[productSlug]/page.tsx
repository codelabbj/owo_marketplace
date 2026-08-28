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
    <div className="mp-wrap pb-[72px]">
      <ProductBreadcrumbs
        shopName={product.shop.name}
        shopSlug={shopSlug}
        productName={product.name}
      />

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="lg:border-r lg:border-border lg:pr-10">
          <ProductGallery images={product.images} alt={product.name} />

          {product.description.trim() ? (
            <section className="mt-10">
              <h2 className="mb-3.5 border-b-2 border-ink pb-2.5 font-display text-[22px] font-extrabold tracking-[-0.03em]">
                Description du vendeur
              </h2>
              <p className="m-0 max-w-[62ch] whitespace-pre-line text-[15.5px] leading-relaxed text-ink-muted">
                {product.description}
              </p>
            </section>
          ) : null}

          {product.variants.length > 0 ? (
            <section className="mt-9">
              <h2 className="mb-3.5 border-b-2 border-ink pb-2.5 font-display text-[22px] font-extrabold tracking-[-0.03em]">
                Disponibilité
              </h2>
              <table className="w-full border-collapse text-[14px]">
                <tbody>
                  {product.variants.map((v) => (
                    <tr key={v.id} className="border-b border-border">
                      <td className="py-3 font-semibold">{v.label}</td>
                      <td className="py-3 tabular-nums text-ink-muted">
                        {formatPrice(v.price, product.currency)}
                      </td>
                      <td
                        className={`py-3 text-right font-semibold ${v.stock > 0 ? "text-[#1C7A4B]" : "text-red-700"}`}
                      >
                        {v.stock > 0 ? `${v.stock} en stock` : "Rupture"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : null}

          <p className="mt-8 text-[13px] text-ink-muted">
            Prix affiché :{" "}
            <strong className="text-ink">{formatPrice(product.price, product.currency)}</strong>
            . Le prix final et la livraison se confirment avec le vendeur sur WhatsApp.
          </p>
        </div>

        <div className="border-t border-border pt-8 lg:border-t-0 lg:pl-8 lg:pt-8">
          <ProductPurchasePanel product={product} />
        </div>
      </div>

      {otherProducts.length > 0 ? (
        <section className="mt-16">
          <div className="mp-section-head">
            <h2 className="font-display text-[28px] font-extrabold tracking-[-0.035em]">
              Dans la même boutique
            </h2>
          </div>
          <div className="grid grid-cols-2 border-l border-border md:grid-cols-3 lg:grid-cols-4">
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
