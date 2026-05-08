"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-lg bg-surface-muted" />
    );
  }
  const main = images[active] ?? images[0]!;
  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-muted">
        <Image
          src={main}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 720px"
          priority
          className="object-cover"
        />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`Voir image ${idx + 1}`}
              aria-pressed={active === idx}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border bg-surface-muted transition-all duration-160",
                active === idx
                  ? "border-brand-500 ring-2 ring-brand-500/30"
                  : "border-border hover:border-ink-subtle",
              )}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
