import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({
  title = "Aucun résultat",
  description,
  action,
  icon,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 border border-dashed border-ink bg-surface-subtle px-6 py-16 text-center"
    >
      <div className="grid h-12 w-12 place-items-center border border-ink bg-surface text-ink-muted">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden />}
      </div>
      <h3 className="text-h3">{title}</h3>
      {description ? <p className="max-w-md text-body-sm text-ink-muted">{description}</p> : null}
      {action}
    </div>
  );
}
