"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function SearchBar({
  initialValue = "",
  placeholder = "Rechercher une boutique ou un produit",
  onChangeDebounced,
  delay = 350,
  ariaLabel = "Recherche",
}: {
  initialValue?: string;
  placeholder?: string;
  onChangeDebounced: (value: string) => void;
  delay?: number;
  ariaLabel?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const debounced = useDebouncedValue(value, delay);

  useEffect(() => {
    onChangeDebounced(debounced.trim());
  }, [debounced, onChangeDebounced]);

  return (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-subtle"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="input pl-11"
      />
    </div>
  );
}
