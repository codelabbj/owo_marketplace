import Link from "next/link";
import Image from "next/image";
import type { ProductSummary } from "@/types/domain";
import { formatPrice } from "@/lib/utils/currency";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { env } from "@/lib/config/env";

export type ProductCardProps = {
  product: ProductSummary;
  shopSlug: string;
  shopName: string;
  whatsappPhoneE164?: string | null;
  whatsappUrl?: string | null;
};

export function ProductCard({
  product,
  shopSlug,
  shopName,
  whatsappPhoneE164,
  whatsappUrl,
}: ProductCardProps) {
  const productUrl = `${env.siteUrl}/${shopSlug}/products/${product.slug}`;
  const formattedPrice = formatPrice(product.price, product.currency);
  const formattedPromo = product.promoPrice
    ? formatPrice(product.promoPrice, product.currency)
    : null;

  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <Link
        href={`/${shopSlug}/products/${product.slug}`}
        className="group relative block aspect-square overflow-hidden bg-surface-muted"
        aria-label={`Voir ${product.name}`}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-160 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-ink-subtle">
            Image indisponible
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {formattedPromo ? <span className="badge-promo">Promo</span> : null}
          {!product.inStock ? (
            <span className="badge-rupture">Rupture</span>
          ) : product.stockLabel ? (
            <span className="badge-stock">{product.stockLabel}</span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link
          href={`/${shopSlug}/products/${product.slug}`}
          className="text-body font-medium text-ink hover:text-brand-600"
        >
          <span className="line-clamp-2">{product.name}</span>
        </Link>
        <div className="flex items-baseline gap-2">
          {formattedPromo ? (
            <>
              <span className="text-body font-semibold text-brand-600">
                {formattedPromo}
              </span>
              <span className="text-caption text-ink-muted line-through">
                {formattedPrice}
              </span>
            </>
          ) : (
            <span className="text-body font-semibold text-ink">{formattedPrice}</span>
          )}
        </div>
        <WhatsAppButton
          fullWidth
          size="sm"
          shopSlug={shopSlug}
          productSlug={product.slug}
          phoneE164={whatsappPhoneE164}
          whatsappUrl={whatsappUrl}
          message={{
            shopName,
            productName: product.name,
            productUrl,
            qty: 1,
            formattedPrice,
            promoPrice: formattedPromo ?? undefined,
            stockLabel: product.stockLabel ?? undefined,
          }}
          disabled={!product.inStock}
          disabledReason={
            !product.inStock
              ? "Produit en rupture"
              : "Contact WhatsApp indisponible"
          }
          className="mt-1"
        />
      </div>
    </article>
  );
}
