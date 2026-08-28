import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Clock, MapPin, Phone, RotateCcw, Truck } from "lucide-react";
import type { ShopDetail } from "@/types/domain";
import { shouldUseUnoptimizedImage } from "@/lib/utils/images";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";

function shopWhatsAppHref(shop: ShopDetail): string | null {
  if (shop.whatsappUrl) return shop.whatsappUrl;
  const digits = shop.whatsappPhoneE164?.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export function ShopHeader({ shop }: { shop: ShopDetail }) {
  const waHref = shopWhatsAppHref(shop);

  return (
    <header>
      <div className="relative h-[220px] border-b border-ink bg-surface-muted md:h-[280px]">
        {shop.coverUrl ? (
          <Image
            src={shop.coverUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            unoptimized={shouldUseUnoptimizedImage(shop.coverUrl)}
            className="object-cover"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/45 to-ink/15"
        />
        <div className="relative mx-auto flex h-full max-w-[1320px] items-end px-4 pb-[26px] md:px-8">
          <div className="max-w-[60ch] text-white">
            <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-white/70">
              <Link href="/shops" className="text-inherit hover:text-white">
                Boutiques
              </Link>
              {shop.city ? ` / ${shop.city}` : ""}
            </p>
            <h1 className="font-display text-[clamp(32px,5vw,52px)] font-extrabold leading-none tracking-[-0.045em]">
              {shop.name}
            </h1>
            {shop.shortDescription ? (
              <p className="mt-3 text-[16px] text-white/85">{shop.shortDescription}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-b border-ink bg-surface-subtle">
        <div className="mp-wrap flex flex-wrap items-stretch">
          <div className="flex min-w-0 flex-[1_1_230px] items-center gap-2.5 border-b border-border px-0 py-3.5 md:border-b-0 md:border-r md:pr-6">
            <BadgeCheck className="h-[18px] w-[18px] shrink-0 text-[#1C7A4B]" />
            <div className="leading-tight">
              <p className="text-[13px] font-bold">Vendeur vérifié</p>
              <p className="text-[11.5px] text-ink-muted">Identité + boutique sur place</p>
            </div>
          </div>
          <div className="flex min-w-0 flex-[1_1_230px] items-center gap-2.5 border-b border-border px-0 py-3.5 md:border-b-0 md:border-r md:px-6">
            <Clock className="h-[18px] w-[18px] shrink-0" />
            <div className="leading-tight">
              <p className="text-[13px] font-bold">Répond sur WhatsApp</p>
              <p className="text-[11.5px] text-ink-muted">Commande en quelques messages</p>
            </div>
          </div>
          <div className="flex min-w-0 flex-[1_1_230px] items-center gap-2.5 border-b border-border px-0 py-3.5 md:border-b-0 md:border-r md:px-6">
            <MapPin className="h-[18px] w-[18px] shrink-0" />
            <div className="leading-tight">
              <p className="text-[13px] font-bold">{shop.address || shop.city || "Adresse sur demande"}</p>
              <p className="text-[11.5px] text-ink-muted">
                {shop.address ? "Retrait en boutique possible" : "Ville indiquée par le vendeur"}
              </p>
            </div>
          </div>
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[56px] flex-[1_1_280px] items-center justify-center gap-2.5 bg-whatsapp px-[26px] py-3 text-[13.5px] font-bold tracking-[0.02em] text-white hover:bg-whatsapp-dark"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              Écrire à {shop.name}
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function ShopAside({ shop }: { shop: ShopDetail }) {
  return (
    <aside className="flex flex-col gap-6">
      <div className="border border-ink p-5">
        <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-subtle">La boutique</p>
        {shop.description ? (
          <p className="text-[14px] leading-relaxed text-ink-muted">{shop.description}</p>
        ) : shop.shortDescription ? (
          <p className="text-[14px] leading-relaxed text-ink-muted">{shop.shortDescription}</p>
        ) : (
          <p className="text-[14px] leading-relaxed text-ink-muted">
            Boutique vérifiée sur Owo.Shop. Discutez directement avec le vendeur sur WhatsApp.
          </p>
        )}
        <div className="mt-[18px] flex flex-col gap-2.5 border-t border-border pt-4 text-[13px]">
          {shop.contactPhone ? (
            <span className="flex items-center gap-2.5">
              <Phone className="h-3.5 w-3.5 text-brand-500" />
              {shop.contactPhone}
            </span>
          ) : null}
          <span className="flex items-center gap-2.5">
            <Truck className="h-3.5 w-3.5 text-brand-500" />
            Livraison à convenir sur WhatsApp
          </span>
          <span className="flex items-center gap-2.5">
            <RotateCcw className="h-3.5 w-3.5 text-brand-500" />
            Conditions d&apos;échange avec le vendeur
          </span>
        </div>
      </div>
      <div className="bg-ink p-5 text-surface">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-500">Avant d&apos;acheter</p>
        <ul className="flex flex-col gap-2.5 text-[13px] leading-snug text-surface/80">
          <li className="flex gap-2.5">
            <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
            Demandez une photo réelle du produit.
          </li>
          <li className="flex gap-2.5">
            <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
            Convenez d&apos;un lieu de remise public.
          </li>
          <li className="flex gap-2.5">
            <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
            Payez seulement après vérification.
          </li>
        </ul>
        <Link
          href="/help"
          className="mt-[18px] inline-flex items-center gap-2 border-t border-white/20 pt-4 text-[12px] font-bold uppercase tracking-[0.06em] text-brand-500"
        >
          Signaler cette boutique
        </Link>
      </div>
    </aside>
  );
}
