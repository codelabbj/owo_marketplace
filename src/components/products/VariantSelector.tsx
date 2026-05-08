"use client";

import type { ProductVariant } from "@/types/domain";
import { cn } from "@/lib/utils/cn";

export function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: {
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (variants.length === 0) return null;

  return (
    <fieldset className="space-y-2">
      <legend className="text-caption uppercase tracking-wide text-ink-subtle">
        Variante
      </legend>
      <div role="radiogroup" className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const disabled = variant.stock <= 0;
          const selected = selectedId === variant.id;
          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={disabled}
              disabled={disabled}
              onClick={() => onSelect(variant.id)}
              className={cn(
                "inline-flex h-10 min-w-[56px] items-center justify-center rounded-full border px-4 text-button transition-all duration-160 ease-out",
                selected
                  ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                  : "border-border bg-surface text-ink hover:border-ink-subtle",
                disabled && "opacity-50",
              )}
            >
              {variant.label}
              {disabled ? (
                <span className="ml-1 text-caption text-ink-subtle">
                  (Indisponible)
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
