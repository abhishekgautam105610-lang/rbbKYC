"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 xl:hidden p-2 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div className="xl:ml-[260px]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 pt-20 xl:pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
