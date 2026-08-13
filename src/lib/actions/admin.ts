"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

function createSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
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
}

export async function adminLogin(email: string, password: string) {
  const cookieStore = await cookies();
  const supabase = createSupabase(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  const supabase = createSupabase(cookieStore);

  await supabase.auth.signOut();
  revalidatePath("/admin/login");
}

export async function updateKycStatus(
  id: string,
  status: "Pending" | "Approved" | "Rejected"
) {
  const cookieStore = await cookies();
  const supabase = createSupabase(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("kyc_submissions")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard");
  return { success: true };
}

const updateRecordSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  fatherName: z.string().min(2, "Father name is required"),
  mobileNumber: z
    .string()
    .regex(/^\+977\d{10}$/, "Mobile number must be +977 followed by 10 digits"),
  dateOfBirth: z.string(),
  status: z.enum(["Pending", "Approved", "Rejected"]),
});

export async function updateKycRecord(
  id: string,
  input: {
    fullName: string;
    fatherName: string;
    mobileNumber: string;
    dateOfBirth: string;
    status: "Pending" | "Approved" | "Rejected";
  }
) {
  const cookieStore = await cookies();
  const supabase = createSupabase(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const parsed = updateRecordSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { error } = await supabase
    .from("kyc_submissions")
    .update({
      full_name: parsed.data.fullName,
      father_name: parsed.data.fatherName,
      mobile_number: parsed.data.mobileNumber,
      date_of_birth: parsed.data.dateOfBirth || null,
      status: parsed.data.status,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/dashboard/records");
  revalidatePath(`/admin/dashboard/records/${id}`);
  return { success: true };
}

export async function deleteKycSubmission(id: string) {
  const cookieStore = await cookies();
  const supabase = createSupabase(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("kyc_submissions")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/dashboard/records");
  revalidatePath(`/admin/dashboard/records/${id}`);
  return { success: true };
}
