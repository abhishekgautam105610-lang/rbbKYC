"use server";

import { createClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getSmsConfig(submissionId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("kyc_submissions")
    .select("id, full_name, sms_number, sms_template, sms_configured")
    .eq("id", submissionId)
    .single();

  if (error || !data) {
    return { error: "Submission not found" };
  }

  const template = data.sms_template || "KYC VERIFY {APPLICATION_ID} {CUSTOMER_NAME}";
  const message = template
    .replace(/\{APPLICATION_ID\}/g, data.id)
    .replace(/\{CUSTOMER_NAME\}/g, data.full_name);

  return {
    sms_number: data.sms_number || "32022",
    message,
    sms_configured: data.sms_configured,
  };
}

export async function updateSmsConfig(
  submissionId: string,
  smsNumber: string,
  smsTemplate: string
) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
          catch { /* ignore */ }
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("kyc_submissions")
    .update({
      sms_number: smsNumber,
      sms_template: smsTemplate,
      sms_configured: true,
    })
    .eq("id", submissionId);

  if (error) return { error: error.message };

  revalidatePath(`/admin/dashboard/records/${submissionId}`);
  return { success: true };
}
