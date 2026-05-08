"use client";

import { AlertCircle } from "lucide-react";

export function ErrorState({
  title = "Une erreur est survenue",
  description = "Nous n'avons pas pu charger ces données. Réessayez dans un instant.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-500/30 dark:bg-red-500/10"
    >
      <div className="grid h-12 w-12 place-items-center rounded-full bg-surface text-red-600 dark:text-red-400">
        <AlertCircle className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="text-h3 text-red-900 dark:text-red-200">{title}</h3>
      <p className="max-w-md text-body-sm text-red-800 dark:text-red-300">{description}</p>
      {onRetry ? (
        <button type="button" className="btn-outline mt-2" onClick={onRetry}>
          Réessayer
        </button>
      ) : null}
    </div>
  );
}
