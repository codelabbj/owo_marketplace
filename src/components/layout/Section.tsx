import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Section({
  kicker,
  title,
  description,
  href,
  cta = "Voir tout",
  children,
  dark = false,
  flush = false,
}: {
  kicker?: string;
  title: string;
  description?: string;
  href?: string;
  cta?: string;
  children: ReactNode;
  dark?: boolean;
  flush?: boolean;
}) {
  return (
    <section className={dark ? "bg-ink text-surface" : undefined}>
      <div className={flush ? "" : "mp-wrap py-14 md:py-16"}>
        <div className="mp-section-head">
          <div>
            {kicker ? <p className="mp-kicker mb-2">{kicker}</p> : null}
            <h2 className="font-display text-[clamp(28px,2.8vw,38px)] font-extrabold tracking-[-0.04em]">
              {title}
            </h2>
            {description ? (
              <p className={`mt-2 max-w-[40ch] text-[14px] ${dark ? "text-surface/70" : "text-ink-muted"}`}>
                {description}
              </p>
            ) : null}
          </div>
          {href ? (
            <Link
              href={href}
              className="inline-flex items-center gap-2 pb-1 text-[13px] font-bold uppercase tracking-[0.04em] hover:text-brand-500"
            >
              {cta} <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
        <div className="mt-0">{children}</div>
      </div>
    </section>
  );
}
