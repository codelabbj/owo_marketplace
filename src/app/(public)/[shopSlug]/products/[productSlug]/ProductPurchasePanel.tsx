"use client";

import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ProductDetail } from "@/types/domain";
import { formatPrice } from "@/lib/utils/currency";
import { stockLabelFor } from "@/lib/utils/formatters";
import { VariantSelector } from "@/components/products/VariantSelector";
import { QuantityStepper } from "@/components/products/QuantityStepper";
import { ProductActions } from "@/components/products/ProductActions";
import { env } from "@/lib/config/env";

export function ProductPurchasePanel({
  product,
}: {
  product: ProductDetail;
}) {
  const hasVariants = product.variants.length > 0;
  const [variantId, setVariantId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? null,
    [product.variants, variantId],
  );

  const effectivePrice = selectedVariant?.price ?? product.price;
  const promoPrice = product.promoPrice ?? null;
  const formattedPrice = formatPrice(effectivePrice, product.currency);
  const formattedPromo =
    promoPrice && !selectedVariant
      ? formatPrice(promoPrice, product.currency)
      : null;

  const stockForState = selectedVariant?.stock ?? product.stock;
  const inStockGlobally =
    product.stock > 0 || product.variants.some((v) => v.stock > 0);
  const stockLabel = stockLabelFor(stockForState);

  const variantValid = !hasVariants || (selectedVariant !== null && stockForState > 0);
  const ctaDisabled = !inStockGlobally || !variantValid;
  const disabledReason = !inStockGlobally
    ? "Produit en rupture de stock"
    : hasVariants && !selectedVariant
      ? "Veuillez sélectionner une variante"
      : hasVariants && stockForState <= 0
        ? "Variante indisponible"
        : undefined;

  const productUrl = `${env.siteUrl}/${product.shop.slug}/products/${product.slug}`;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/${product.shop.slug}`}
          className="inline-flex items-center gap-1 text-body-sm text-ink-muted hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" /> Retour à {product.shop.name}
        </Link>
        <h1 className="mt-2 text-h1">{product.name}</h1>
        <div className="mt-2 flex items-baseline gap-3">
          {formattedPromo ? (
            <>
              <span className="text-h2 text-brand-600">{formattedPromo}</span>
              <span className="text-body-lg text-ink-muted line-through">
                {formattedPrice}
              </span>
            </>
          ) : (
            <span className="text-h2">{formattedPrice}</span>
          )}
        </div>
        {stockLabel ? (
          <p className="mt-1 text-body-sm text-ink-muted">{stockLabel}</p>
        ) : inStockGlobally ? (
          <p className="mt-1 text-body-sm text-emerald-700 dark:text-emerald-400">En stock</p>
        ) : (
          <p className="mt-1 text-body-sm text-red-600 dark:text-red-400">Rupture de stock</p>
        )}
      </div>

      {product.description ? (
        <p className="text-body text-ink-muted">{product.description}</p>
      ) : null}

      {hasVariants ? (
        <VariantSelector
          variants={product.variants}
          selectedId={variantId}
          onSelect={setVariantId}
        />
      ) : null}

      <div className="space-y-2">
        <span className="text-caption uppercase tracking-wide text-ink-subtle">
          Quantité
        </span>
        <QuantityStepper value={qty} onChange={setQty} />
      </div>

      <div className="sticky bottom-0 -mx-4 border-t border-border bg-surface px-4 py-3 md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <ProductActions
          size="lg"
          layout="row"
          shopSlug={product.shop.slug}
          productSlug={product.slug}
          phoneE164={product.shop.whatsappPhoneE164}
          whatsappUrl={product.shop.whatsappUrl}
          disabled={ctaDisabled}
          disabledReason={disabledReason}
          className="md:max-w-md"
          cartItem={{
            shopSlug: product.shop.slug,
            shopName: product.shop.name,
            productSlug: product.slug,
            productName: product.name,
            productUrl,
            qty,
            variantLabel: selectedVariant?.label ?? null,
            formattedPrice,
            promoPrice: formattedPromo,
            currency: product.currency,
            whatsappPhoneE164: product.shop.whatsappPhoneE164 ?? null,
            whatsappUrl: product.shop.whatsappUrl ?? null,
          }}
          message={{
            shopName: product.shop.name,
            productName: product.name,
            productUrl,
            qty,
            variantLabel: selectedVariant?.label ?? null,
            formattedPrice: formattedPromo ?? formattedPrice,
            promoPrice: formattedPromo ?? undefined,
            stockLabel,
          }}
        />
      </div>
    </div>
  );
}
