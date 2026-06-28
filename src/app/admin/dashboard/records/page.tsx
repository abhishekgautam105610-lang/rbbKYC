import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/admin/data-table";
import { Header } from "@/components/admin/header";
import type { KycSubmission } from "@/types";

export default async function KycRecordsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { data: records } = await supabase
    .from("kyc_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <Header
        title="KYC Records"
        description="Manage and review KYC submissions"
      />
      <DataTable data={(records as KycSubmission[]) || []} />
    </div>
  );
}
