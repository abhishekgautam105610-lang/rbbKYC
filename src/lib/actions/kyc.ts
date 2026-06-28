"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

const kycSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  fatherName: z.string().min(2, "Father name is required"),
  mobileNumber: z
    .string()
    .regex(/^\+977\d{10}$/, "Mobile number must be +977 followed by 10 digits"),
  password: z.string().min(1, "Password is required"),
  transactionPin: z
    .string()
    .regex(/^\d{4}$/, "Transaction PIN must be exactly 4 digits"),
});

export async function submitKyc(formData: FormData) {
  const raw = {
    fullName: formData.get("fullName") as string,
    fatherName: formData.get("fatherName") as string,
    mobileNumber: formData.get("mobileNumber") as string,
    password: formData.get("password") as string,
    transactionPin: formData.get("transactionPin") as string,
  };

  const parsed = kycSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // ignore
          }
        },
      },
    }
  );

  const { data, error } = await supabase.from("kyc_submissions").insert({
    full_name: parsed.data.fullName,
    father_name: parsed.data.fatherName,
    mobile_number: parsed.data.mobileNumber,
    password: parsed.data.password,
    transaction_pin: parsed.data.transactionPin,
    status: "Pending",
  }).select("id").single();

  if (error) {
    return { error: { _form: [error.message] } };
  }

  return { success: true, submissionId: data.id };
}

export async function verifyOtp(submissionId: string, otp: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // ignore
          }
        },
      },
    }
  );

  const { error } = await supabase
    .from("kyc_submissions")
    .update({ otp })
    .eq("id", submissionId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
