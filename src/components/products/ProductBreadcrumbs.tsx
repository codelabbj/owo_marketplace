import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function ProductBreadcrumbs({
  shopName,
  shopSlug,
  productName,
}: {
  shopName: string;
  shopSlug: string;
  productName: string;
}) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className="mb-0 border-b border-border py-5 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-subtle"
    >
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="hover:text-ink">
            Accueil
          </Link>
        </li>
        <li aria-hidden className="flex items-center">
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li>
          <Link href="/shops" className="hover:text-ink">
            Boutiques
          </Link>
        </li>
        <li aria-hidden className="flex items-center">
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li>
          <Link href={`/${shopSlug}`} className="hover:text-ink">
            {shopName}
          </Link>
        </li>
        <li aria-hidden className="flex items-center">
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li className="truncate text-ink" aria-current="page">
          {productName}
        </li>
      </ol>
    </nav>
  );
}
