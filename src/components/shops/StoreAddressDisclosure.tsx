"use client";

import { useId, useState } from "react";
import { ChevronDown, Store } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function StoreAddressDisclosure({
  address,
  className,
}: {
  address: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div
      className={cn(
        "border-y border-border bg-surface-subtle",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 py-3">
        <div className="flex min-w-0 items-center gap-2 text-ink">
          <Store className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
          <span className="text-body-sm font-medium">Adresse de la boutique</span>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex shrink-0 items-center gap-1 text-body-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {open ? "Masquer" : "Afficher"}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-160",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </div>
      {open ? (
        <p
          id={panelId}
          className="border-t border-border pb-3 pt-3 text-body-sm text-ink-muted"
        >
          {address}
        </p>
      ) : null}
    </div>
  );
}
