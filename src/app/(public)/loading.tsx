import { SkeletonGrid } from "@/components/states/SkeletonGrid";

export default function PublicLoading() {
  return (
    <div className="container py-12">
      <div className="mb-6 h-9 w-48 animate-pulse rounded bg-surface-muted" />
      <SkeletonGrid count={8} />
    </div>
  );
}
