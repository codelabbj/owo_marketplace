import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const SAFETY_TIPS = [
  "Évitez de payer à l’avance, même pour la livraison.",
  "Rencontrez le vendeur dans un lieu public sûr.",
  "Inspectez l’article et vérifiez qu’il correspond exactement à ce que vous voulez.",
  "Assurez-vous que l’article emballé est bien celui que vous avez inspecté.",
  "Ne payez que si vous êtes satisfait.",
] as const;

type SafetyTipsProps = {
  /** Version courte pour panier / fiche produit */
  compact?: boolean;
  className?: string;
  id?: string;
};

export function SafetyTips({ compact = false, className, id = "safety-tips" }: SafetyTipsProps) {
  if (compact) {
    return (
      <aside
        id={id}
        className={cn(
          "rounded-lg border border-border bg-surface-subtle px-3 py-3 text-body-sm text-ink-muted",
          className,
        )}
      >
        <p className="flex items-start gap-2 font-medium text-ink">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
          Conseils de sécurité
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {SAFETY_TIPS.slice(0, 3).map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        <Link
          href="/help#safety-tips"
          className="mt-2 inline-block text-caption font-medium text-brand-600 hover:text-brand-700"
        >
          Voir tous les conseils
        </Link>
      </aside>
    );
  }

  return (
    <section
      id={id}
      className={cn("scroll-mt-24", className)}
      aria-labelledby={`${id}-title`}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-600">
          <ShieldCheck className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 id={`${id}-title`} className="text-h2">
            Conseils de sécurité
          </h2>
          <p className="mt-1 text-body text-ink-muted">
            Owo met en relation acheteurs et vendeurs. Les échanges et paiements
            se font directement entre vous. Pour votre sécurité&nbsp;:
          </p>
        </div>
      </div>
      <ul className="mt-6 space-y-3">
        {SAFETY_TIPS.map((tip, index) => (
          <li
            key={tip}
            className="flex gap-3 rounded-lg border border-border bg-surface px-4 py-3"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-subtle text-caption font-semibold text-ink-muted">
              {index + 1}
            </span>
            <p className="text-body text-ink pt-0.5">{tip}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
