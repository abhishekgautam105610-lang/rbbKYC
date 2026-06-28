import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

const cards = [
  { label: "Total KYC", key: "total" as const, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Pending", key: "pending" as const, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
  { label: "Approved", key: "approved" as const, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  { label: "Rejected", key: "rejected" as const, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stats[card.key]}</p>
            </div>
            <div className={`rounded-xl p-3 ${card.bg}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
