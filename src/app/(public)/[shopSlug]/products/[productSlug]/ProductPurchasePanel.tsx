"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, CircleCheck, Eye, HandCoins, Shield } from "lucide-react";
import type { ProductDetail } from "@/types/domain";
import { formatPrice } from "@/lib/utils/currency";
import { stockLabelFor } from "@/lib/utils/formatters";
import { VariantSelector } from "@/components/products/VariantSelector";
import { QuantityStepper } from "@/components/products/QuantityStepper";
import { ProductActions } from "@/components/products/ProductActions";
import { buildWhatsAppMessage } from "@/lib/whatsapp/buildWhatsAppMessage";
import { env } from "@/lib/config/env";

export function ProductPurchasePanel({
  product,
}: {
  product: ProductDetail;
}) {
  const hasVariants = product.variants.length > 0;
  const [variantId, setVariantId] = useState<string | null>(() =>
    product.variants.find((v) => v.stock > 0)?.id ?? null,
  );
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

  const message = {
    shopName: product.shop.name,
    productName: product.name,
    productUrl,
    qty,
    variantLabel: selectedVariant?.label ?? null,
    formattedPrice: formattedPromo ?? formattedPrice,
    promoPrice: formattedPromo ?? undefined,
    stockLabel,
  };

  const waPreview = buildWhatsAppMessage(message);

  return (
    <div className="flex flex-col gap-[22px] lg:sticky lg:top-[100px]">
      <div>
        <Link
          href={`/${product.shop.slug}`}
          className="inline-flex items-center gap-2.5 border border-border bg-surface-subtle px-2.5 py-2"
        >
          <span className="grid h-[30px] w-[30px] place-items-center bg-surface-muted text-[11px] font-bold">
            {product.shop.name.slice(0, 1)}
          </span>
          <span className="text-[13.5px] font-bold">{product.shop.name}</span>
          <span className="mp-verified">
            <BadgeCheck className="h-3 w-3" />
            Vérifié
          </span>
        </Link>
        <h1 className="mt-4 font-display text-[clamp(28px,3vw,36px)] font-extrabold leading-[1.05] tracking-[-0.04em]">
          {product.name}
        </h1>
        <div className="mt-3.5 flex items-baseline gap-3">
          <span className="font-display text-[clamp(28px,2.8vw,38px)] font-extrabold tabular-nums tracking-[-0.04em]">
            {formattedPromo ?? formattedPrice}
          </span>
          {formattedPromo ? (
            <span className="text-[13px] text-ink-muted line-through">{formattedPrice}</span>
          ) : (
            <span className="text-[13px] text-ink-muted">prix affiché · livraison à convenir</span>
          )}
        </div>
        {stockLabel ? (
          <p className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-muted">
            <CircleCheck className="h-3.5 w-3.5" />
            {stockLabel}
          </p>
        ) : inStockGlobally ? (
          <p className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1C7A4B]">
            <CircleCheck className="h-3.5 w-3.5" />
            En stock
          </p>
        ) : (
          <p className="mt-2.5 text-[13px] font-semibold text-red-700">Rupture de stock</p>
        )}
      </div>

      {hasVariants ? (
        <div className="border-t border-border pt-5">
          <VariantSelector
            variants={product.variants}
            selectedId={variantId}
            onSelect={setVariantId}
          />
        </div>
      ) : null}

      <div className="flex items-center gap-4">
        <p className="m-0 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-subtle">Quantité</p>
        <QuantityStepper value={qty} onChange={setQty} />
      </div>

      <div className="border border-ink bg-surface-subtle">
        <div className="flex items-center justify-between border-b border-border px-3.5 py-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-ink-subtle">
            Message qui sera envoyé
          </span>
        </div>
        <p className="m-0 whitespace-pre-line bg-[#F7F4EF] px-3.5 py-3.5 text-[13px] leading-relaxed text-ink dark:bg-surface-muted">
          {waPreview}
        </p>
      </div>

      <ProductActions
        size="lg"
        shopSlug={product.shop.slug}
        productSlug={product.slug}
        phoneE164={product.shop.whatsappPhoneE164}
        whatsappUrl={product.shop.whatsappUrl}
        disabled={ctaDisabled}
        disabledReason={disabledReason}
        className="w-full"
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
        message={message}
      />

      <ul className="m-0 flex list-none flex-col gap-2.5 border-t border-border p-0 pt-4 text-[13px] text-ink-muted">
        <li className="flex gap-2.5">
          <HandCoins className="h-[15px] w-[15px] shrink-0 text-ink" />
          Paiement à la livraison, en main propre.
        </li>
        <li className="flex gap-2.5">
          <Eye className="h-[15px] w-[15px] shrink-0 text-ink" />
          Vous vérifiez le produit avant de payer.
        </li>
        <li className="flex gap-2.5">
          <Shield className="h-[15px] w-[15px] shrink-0 text-ink" />
          Vendeur vérifié par Owo · signalement en 1 clic.
        </li>
      </ul>
    </div>
  );
}
