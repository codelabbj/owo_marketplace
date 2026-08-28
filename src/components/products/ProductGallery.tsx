"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ProductImage } from "@/components/products/ProductImage";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const count = images.length;
  const hasMultiple = count > 1;
  const main = images[active] ?? images[0];

  const goPrev = useCallback(() => {
    if (count <= 1) return;
    setActive((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    if (count <= 1) return;
    setActive((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen, goPrev, goNext]);

  if (count === 0 || !main) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center bg-surface-muted text-ink-subtle">
        Aucune image
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-[88px_minmax(0,1fr)]">
        {hasMultiple ? (
          <div
            className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col md:overflow-visible"
            role="tablist"
            aria-label="Miniatures du produit"
          >
            {images.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                type="button"
                role="tab"
                onClick={() => setActive(idx)}
                aria-label={`Voir image ${idx + 1}`}
                aria-selected={active === idx}
                className={cn(
                  "relative aspect-square w-16 shrink-0 overflow-hidden border-2 bg-surface-muted md:w-full",
                  active === idx ? "border-ink" : "border-transparent hover:border-border",
                )}
              >
                <ProductImage
                  src={img}
                  alt=""
                  fill
                  sizes="88px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}

        <div className={cn("relative order-1 md:order-2", !hasMultiple && "md:col-span-2")}>
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="group relative block aspect-[4/5] w-full overflow-hidden bg-surface-muted"
            aria-label="Agrandir l'image"
          >
            <ProductImage
              src={main}
              alt={`${alt} — image ${active + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 720px"
              priority
              className="object-cover"
            />
            <span className="absolute right-0 top-0 inline-flex items-center gap-1 bg-ink px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-surface">
              <Expand className="h-3.5 w-3.5" />
              {hasMultiple ? `${active + 1} / ${count}` : "Agrandir"}
            </span>
          </button>

          {hasMultiple ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 border border-ink bg-surface p-2"
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 border border-ink bg-surface p-2"
                aria-label="Image suivante"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label={`Photos de ${alt}`}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-body-sm">
              {active + 1} / {count} — {alt}
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="rounded-full p-2 hover:bg-white/10"
              aria-label="Fermer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-4">
            <div className="relative h-full w-full max-h-[min(80vh,900px)] max-w-5xl">
              <ProductImage
                src={main}
                alt={`${alt} — image ${active + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {hasMultiple ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:left-6"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="h-7 w-7" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:right-6"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="h-7 w-7" />
                </button>
              </>
            ) : null}
          </div>

          {hasMultiple ? (
            <div className="border-t border-white/10 px-4 py-3">
              <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={`lb-${img}-${idx}`}
                    type="button"
                    onClick={() => setActive(idx)}
                    aria-label={`Voir image ${idx + 1}`}
                    className={cn(
                      "relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2",
                      active === idx ? "border-brand-500" : "border-transparent opacity-70 hover:opacity-100",
                    )}
                  >
                    <ProductImage
                      src={img}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
