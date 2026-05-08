"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[app/error]", error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <div className="container flex min-h-screen flex-col items-center justify-center gap-4 py-16 text-center">
          <h1 className="text-h1">Une erreur est survenue</h1>
          <p className="max-w-md text-body text-ink-muted">
            Nous sommes désolés. Vous pouvez réessayer dans un instant.
          </p>
          <button type="button" className="btn-primary" onClick={reset}>
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
