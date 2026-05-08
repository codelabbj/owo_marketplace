import type { ReactNode } from "react";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";

export function MarketplaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Topbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
