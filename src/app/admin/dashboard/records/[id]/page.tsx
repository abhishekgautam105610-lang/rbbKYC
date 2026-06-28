import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { RecordDetail } from "@/components/admin/record-detail";

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { data: record } = await supabase
    .from("kyc_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (!record) {
    notFound();
  }

  return <RecordDetail record={record} />;
}
