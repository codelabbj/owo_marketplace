import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Section({
  title,
  description,
  href,
  cta = "Voir tout",
  children,
}: {
  title: string;
  description?: string;
  href?: string;
  cta?: string;
  children: ReactNode;
}) {
  return (
    <section className="container py-10 md:py-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-h2">{title}</h2>
          {description ? (
            <p className="mt-1 text-body text-ink-muted">{description}</p>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-button text-brand-600 hover:text-brand-700"
          >
            {cta} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
