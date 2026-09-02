import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Plus } from "lucide-react";
import type { ProductSummary } from "@/types/domain";
import { formatPrice } from "@/lib/utils/currency";
import { shouldUseUnoptimizedImage } from "@/lib/utils/images";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { env } from "@/lib/config/env";

export type ProductCardProps = {
  product: ProductSummary;
  shopSlug: string;
  shopName: string;
  shopCity?: string | null;
  whatsappPhoneE164?: string | null;
  whatsappUrl?: string | null;
};

export function ProductCard({
  product,
  shopSlug,
  shopName,
  shopCity,
  whatsappPhoneE164,
  whatsappUrl,
}: ProductCardProps) {
  const productUrl = `${env.siteUrl}/${shopSlug}/products/${product.slug}`;
  const formattedPrice = formatPrice(product.price, product.currency);
  const formattedPromo = product.promoPrice
    ? formatPrice(product.promoPrice, product.currency)
    : null;
  const outOfStock = !product.inStock;

  return (
    <article className="flex h-full flex-col gap-3 border-b border-r border-border bg-surface p-4 hover:bg-surface-subtle">
      <Link
        href={`/${shopSlug}/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-surface-muted"
        aria-label={`Voir ${product.name}`}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized={shouldUseUnoptimizedImage(product.imageUrl)}
            className="object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-ink-subtle">Image indisponible</div>
        )}
        {outOfStock ? (
          <span className="badge-rupture absolute inset-x-0 top-0 z-10">Rupture</span>
        ) : formattedPromo ? (
          <span className="badge-promo absolute left-0 top-0">Promo</span>
        ) : null}
        {outOfStock && formattedPromo ? (
          <span className="badge-promo absolute left-0 top-9">Promo</span>
        ) : null}
      </Link>

      <Link
        href={`/${shopSlug}/products/${product.slug}`}
        className="line-clamp-2 text-[15px] font-semibold leading-snug text-ink hover:text-brand-600"
      >
        {product.name}
      </Link>
      <div className="flex items-baseline gap-2">
        {formattedPromo ? (
          <>
            <span className="font-display text-[19px] font-extrabold tracking-[-0.03em] text-brand-600">
              {formattedPromo}
            </span>
            <span className="text-[12.5px] text-ink-subtle line-through">{formattedPrice}</span>
          </>
        ) : (
          <span className="font-display text-[19px] font-extrabold tracking-[-0.03em] tabular-nums">
            {formattedPrice}
          </span>
        )}
      </div>
      <p className="flex items-center gap-1 text-[12px] text-ink-muted">
        <BadgeCheck className="h-3 w-3 text-[#1C7A4B]" />
        {shopName}
        {shopCity ? ` · ${shopCity}` : ""}
      </p>

      <AddToCartButton
        className="mt-auto"
        size="md"
        disabled={outOfStock}
        item={{
          shopSlug,
          shopName,
          productSlug: product.slug,
          productName: product.name,
          productUrl,
          qty: 1,
          formattedPrice,
          promoPrice: formattedPromo,
          currency: product.currency,
          whatsappPhoneE164: whatsappPhoneE164 ?? null,
          whatsappUrl: whatsappUrl ?? null,
        }}
      />
    </article>
  );
}

export function ProductCardAddLabel() {
  return (
    <span className="inline-flex items-center gap-2">
      <Plus className="h-3.5 w-3.5" />
      Ajouter
    </span>
  );
}
