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
      <legend className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
        Taille / variante
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
                "inline-flex h-11 min-w-[56px] items-center justify-center border px-3.5 text-[14px] font-bold",
                selected
                  ? "border-ink bg-ink text-surface"
                  : "border-ink bg-transparent text-ink hover:bg-surface-muted",
                disabled && "opacity-40 line-through",
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
