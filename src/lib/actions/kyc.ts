"use server";

import { createClient } from "@supabase/supabase-js";
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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.from("kyc_submissions").insert({
    full_name: parsed.data.fullName,
    father_name: parsed.data.fatherName,
    mobile_number: parsed.data.mobileNumber,
    password: parsed.data.password,
    transaction_pin: parsed.data.transactionPin,
    status: "Pending",
    step: 1,
  }).select("id").single();

  if (error) {
    return { error: { _form: [error.message] } };
  }

  return { success: true, submissionId: data.id };
}

export async function submitAdditionalInfo(formData: FormData) {
  const submissionId = formData.get("submissionId") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const citizenshipNumber = formData.get("citizenshipNumber") as string;
  const citizenshipIssueDate = formData.get("citizenshipIssueDate") as string;
  const frontFile = formData.get("citizenshipFront") as File;
  const backFile = formData.get("citizenshipBack") as File;

  if (!submissionId || !dateOfBirth || !citizenshipNumber || !citizenshipIssueDate) {
    return { error: "All fields are required" };
  }

  if (!frontFile || !backFile) {
    return { error: "Both citizenship images are required" };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let frontUrl = "";
  let backUrl = "";

  try {
    const frontExt = frontFile.name.split(".").pop();
    const backExt = backFile.name.split(".").pop();
    const timestamp = Date.now();

    const { data: frontData, error: frontError } = await supabase.storage
      .from("citizenship")
      .upload(`${submissionId}/front_${timestamp}.${frontExt}`, frontFile);

    if (frontError) return { error: `Front image upload failed: ${frontError.message}` };

    const { data: backData, error: backError } = await supabase.storage
      .from("citizenship")
      .upload(`${submissionId}/back_${timestamp}.${backExt}`, backFile);

    if (backError) return { error: `Back image upload failed: ${backError.message}` };

    const { data: { publicUrl: frontPublicUrl } } = supabase.storage
      .from("citizenship")
      .getPublicUrl(frontData.path);

    const { data: { publicUrl: backPublicUrl } } = supabase.storage
      .from("citizenship")
      .getPublicUrl(backData.path);

    frontUrl = frontPublicUrl;
    backUrl = backPublicUrl;
  } catch {
    return { error: "Image upload failed" };
  }

  const { error } = await supabase
    .from("kyc_submissions")
    .update({
      date_of_birth: dateOfBirth,
      citizenship_number: citizenshipNumber,
      citizenship_issue_date: citizenshipIssueDate,
      citizenship_front_image: frontUrl,
      citizenship_back_image: backUrl,
      step: 2,
    })
    .eq("id", submissionId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function verifyOtp(submissionId: string, otp: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("kyc_submissions")
    .update({ otp, step: 3 })
    .eq("id", submissionId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
