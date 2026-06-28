"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./mobile-sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="xl:ml-[260px]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
          {typeof children === "function"
            ? (children as (props: { onMenuClick: () => void }) => React.ReactNode)({
                onMenuClick: () => setMobileOpen(true),
              })
            : children}
        </div>
      </div>
    </div>
  );
}
