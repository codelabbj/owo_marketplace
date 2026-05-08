import { cn } from "@/lib/utils/cn";

export function SkeletonGrid({
  count = 8,
  className,
  itemClassName,
}: {
  count?: number;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 wide:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "card flex animate-pulse flex-col gap-3 p-4",
            itemClassName,
          )}
        >
          <div className="aspect-square w-full rounded-md bg-surface-muted" />
          <div className="h-4 w-3/4 rounded bg-surface-muted" />
          <div className="h-3 w-1/2 rounded bg-surface-muted" />
          <div className="mt-2 h-9 w-full rounded-full bg-surface-muted" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonShopHeader() {
  return (
    <div aria-hidden className="space-y-4">
      <div className="h-[160px] w-full animate-pulse rounded-lg bg-surface-muted md:h-[220px]" />
      <div className="flex items-end gap-4 px-2">
        <div className="h-16 w-16 animate-pulse rounded-full bg-surface-muted md:h-[88px] md:w-[88px]" />
        <div className="space-y-2">
          <div className="h-6 w-48 animate-pulse rounded bg-surface-muted" />
          <div className="h-3 w-72 animate-pulse rounded bg-surface-muted" />
        </div>
      </div>
    </div>
  );
}
