"use client";

import { Minus, Plus } from "lucide-react";
import { clamp } from "@/lib/utils/formatters";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  const setSafe = (n: number) => onChange(clamp(n, min, max));
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-surface">
      <button
        type="button"
        onClick={() => setSafe(value - 1)}
        disabled={value <= min}
        aria-label="Diminuer la quantité"
        className="grid h-10 w-10 place-items-center rounded-l-full text-ink-muted hover:bg-surface-subtle disabled:opacity-50"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n)) setSafe(n);
        }}
        aria-label="Quantité"
        className="h-10 w-12 border-x border-border bg-surface text-center text-button text-ink focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => setSafe(value + 1)}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
        className="grid h-10 w-10 place-items-center rounded-r-full text-ink-muted hover:bg-surface-subtle disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
