import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key!);

  const { data, error } = await supabase
    .from("kyc_submissions")
    .select("id, full_name, sms_number, sms_template, sms_configured")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const resolvedMessage = data.sms_template
    ? data.sms_template
        .replace(/\{APPLICATION_ID\}/g, data.id)
        .replace(/\{CUSTOMER_NAME\}/g, data.full_name)
    : "";

  return NextResponse.json({
    sms_number: data.sms_number || "32022",
    message: resolvedMessage,
    sms_configured: data.sms_configured,
  });
}
