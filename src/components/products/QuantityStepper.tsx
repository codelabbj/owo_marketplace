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
    <div className="inline-flex items-center border border-ink bg-surface">
      <button
        type="button"
        onClick={() => setSafe(value - 1)}
        disabled={value <= min}
        aria-label="Diminuer la quantité"
        className="grid h-10 w-10 place-items-center text-ink hover:bg-surface-muted disabled:opacity-50"
      >
        <Minus className="h-3.5 w-3.5" />
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
        className="h-10 w-10 bg-surface text-center text-[15px] font-bold tabular-nums text-ink focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => setSafe(value + 1)}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
        className="grid h-10 w-10 place-items-center text-ink hover:bg-surface-muted disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
