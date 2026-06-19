import type { ReactNode } from "react";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";
import { CartShell } from "@/components/cart/CartShell";

export function MarketplaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Topbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <CartShell />
    </div>
  );
}
