import type { ReactNode } from "react";
import { MarketplaceLayout } from "@/components/layout/MarketplaceLayout";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <MarketplaceLayout>{children}</MarketplaceLayout>;
}
