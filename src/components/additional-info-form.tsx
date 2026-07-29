"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitAdditionalInfo } from "@/lib/actions/kyc";

const additionalInfoSchema = z.object({
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

type FormValues = z.infer<typeof additionalInfoSchema>;

interface AdditionalInfoFormProps {
  submissionId: string;
  onSuccess: () => void;
}

export function AdditionalInfoForm({ submissionId, onSuccess }: AdditionalInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(additionalInfoSchema),
  });

  async function onSubmit(data: FormValues) {
    const formData = new FormData();
    formData.append("submissionId", submissionId);
    formData.append("dateOfBirth", data.dateOfBirth);

    const result = await submitAdditionalInfo(formData);
    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Additional information submitted!");
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

      <Button type="submit" className="w-full h-12 text-base">
        Submit
      </Button>
    </form>
  );
}
