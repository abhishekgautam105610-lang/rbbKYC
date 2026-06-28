"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, FileText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminLogout } from "@/lib/actions/admin";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/records", label: "KYC Records", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await adminLogout();
    router.push("/admin/login");
  }

  return (
    <aside className="hidden xl:fixed xl:inset-y-0 xl:z-30 xl:flex xl:w-[260px] xl:flex-col">
      <div className="flex flex-col h-full bg-white border-r border-gray-200">
        <div className="flex items-center gap-3 px-6 pt-6 pb-5">
          <Image
            src="/1731390437-339067.png"
            alt="Rastriya Banijya Bank"
            width={40}
            height={40}
            className="object-contain shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-gray-900 truncate">Rastriya Banijya Bank</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
