"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitKyc } from "@/lib/actions/kyc";

const kycFormSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  mobileNumber: z
    .string()
    .regex(/^\+977\d{10}$/, "Must be +977 followed by 10 digits"),
  password: z.string().min(1, "Password is required"),
  transactionPin: z
    .string()
    .regex(/^\d{4}$/, "Transaction PIN must be exactly 4 digits"),
});

type FormValues = z.infer<typeof kycFormSchema>;

interface KycFormProps {
  onSuccess: () => void;
}

type SubmitResult = {
  error?: Record<string, string[]> | string;
  success?: boolean;
};

export function KycForm({ onSuccess }: KycFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      mobileNumber: "+977",
    },
  });

  async function onSubmit(data: FormValues) {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("mobileNumber", data.mobileNumber);
    formData.append("password", data.password);
    formData.append("transactionPin", data.transactionPin);

    const result: SubmitResult = await submitKyc(formData);

    if (result.error) {
      if (typeof result.error === "string") {
        toast.error(result.error);
      } else {
        toast.error(result.error._form?.[0] || "Submission failed");
      }
      return;
    }

    toast.success("KYC submitted successfully!");
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="Enter your full name"
          {...register("fullName")}
          className={errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.fullName && (
          <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          {...register("dateOfBirth")}
          className={errors.dateOfBirth ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.dateOfBirth && (
          <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobileNumber">Mobile Number</Label>
        <Input
          id="mobileNumber"
          placeholder="+977XXXXXXXXXX"
          {...register("mobileNumber")}
          className={errors.mobileNumber ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.mobileNumber && (
          <p className="text-xs text-red-500 mt-1">{errors.mobileNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            {...register("password")}
            className={errors.password ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="transactionPin">Transaction PIN</Label>
        <div className="relative">
          <Input
            id="transactionPin"
            type={showPin ? "text" : "password"}
            placeholder="Enter 4-digit PIN"
            maxLength={4}
            {...register("transactionPin")}
            className={errors.transactionPin ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.transactionPin && (
          <p className="text-xs text-red-500 mt-1">{errors.transactionPin.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit KYC"
        )}
      </Button>
    </form>
  );
}
