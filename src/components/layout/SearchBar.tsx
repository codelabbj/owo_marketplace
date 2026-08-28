"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cn } from "@/lib/utils/cn";

export function SearchBar({
  initialValue = "",
  placeholder = "Chercher un produit, une boutique, une ville…",
  onChangeDebounced,
  delay = 350,
  ariaLabel = "Recherche",
  compact = false,
}: {
  initialValue?: string;
  placeholder?: string;
  onChangeDebounced: (value: string) => void;
  delay?: number;
  ariaLabel?: string;
  compact?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const debounced = useDebouncedValue(value, delay);

  useEffect(() => {
    onChangeDebounced(debounced.trim());
  }, [debounced, onChangeDebounced]);

  return (
    <div className="relative w-full">
      <Search
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-ink-subtle",
          compact ? "left-3 h-4 w-4" : "left-4 h-5 w-5",
        )}
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn("input", compact ? "h-10 pl-10" : "pl-11")}
      />
    </div>
  );
}
