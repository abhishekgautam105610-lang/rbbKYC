import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatsCards } from "@/components/admin/stats-cards";
import { Header } from "@/components/admin/header";
import type { DashboardStats } from "@/types";

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { data: all } = await supabase.from("kyc_submissions").select("*");

  const today = new Date().toISOString().split("T")[0];

  const stats: DashboardStats = {
    total: all?.length || 0,
    pending: all?.filter((r) => r.status === "Pending").length || 0,
    approved: all?.filter((r) => r.status === "Approved").length || 0,
    rejected: all?.filter((r) => r.status === "Rejected").length || 0,
    today: all?.filter((r) => r.created_at?.startsWith(today)).length || 0,
  };

  return (
    <div className="space-y-6">
      <Header
        title="Dashboard"
        description={`Welcome back, ${session.user.email}`}
      />
      <StatsCards stats={stats} />
    </div>
  );
}
