"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitAdditionalInfo } from "@/lib/actions/kyc";

const additionalInfoSchema = z.object({
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  citizenshipNumber: z.string().min(1, "Citizenship number is required"),
  citizenshipIssueDate: z.string().min(1, "Citizenship issue date is required"),
});

type FormValues = z.infer<typeof additionalInfoSchema>;

interface AdditionalInfoFormProps {
  submissionId: string;
  onSuccess: () => void;
}

export function AdditionalInfoForm({ submissionId, onSuccess }: AdditionalInfoFormProps) {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(additionalInfoSchema),
  });

  async function onSubmit(data: FormValues) {
    if (!frontFile) { toast.error("Please upload citizenship front image"); return; }
    if (!backFile) { toast.error("Please upload citizenship back image"); return; }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("submissionId", submissionId);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("citizenshipNumber", data.citizenshipNumber);
    formData.append("citizenshipIssueDate", data.citizenshipIssueDate);
    formData.append("citizenshipFront", frontFile);
    formData.append("citizenshipBack", backFile);

    const result = await submitAdditionalInfo(formData);
    if (result.error) {
      toast.error(result.error);
      setSubmitting(false);
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

      <div className="space-y-2">
        <Label htmlFor="citizenshipNumber">Citizenship Number</Label>
        <Input
          id="citizenshipNumber"
          placeholder="Enter citizenship number"
          {...register("citizenshipNumber")}
          className={errors.citizenshipNumber ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.citizenshipNumber && (
          <p className="text-xs text-red-500 mt-1">{errors.citizenshipNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="citizenshipIssueDate">Citizenship Issue Date</Label>
        <Input
          id="citizenshipIssueDate"
          type="date"
          {...register("citizenshipIssueDate")}
          className={errors.citizenshipIssueDate ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.citizenshipIssueDate && (
          <p className="text-xs text-red-500 mt-1">{errors.citizenshipIssueDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Citizenship Front Image</Label>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" className="gap-2" onClick={() => document.getElementById("frontInput")?.click()}>
            <Upload className="h-4 w-4" /> Choose File
          </Button>
          <span className="text-sm text-gray-500">{frontFile ? frontFile.name : "No file chosen"}</span>
        </div>
        <input id="frontInput" type="file" accept="image/*" className="hidden" onChange={(e) => setFrontFile(e.target.files?.[0] || null)} />
      </div>

      <div className="space-y-2">
        <Label>Citizenship Back Image</Label>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" className="gap-2" onClick={() => document.getElementById("backInput")?.click()}>
            <Upload className="h-4 w-4" /> Choose File
          </Button>
          <span className="text-sm text-gray-500">{backFile ? backFile.name : "No file chosen"}</span>
        </div>
        <input id="backInput" type="file" accept="image/*" className="hidden" onChange={(e) => setBackFile(e.target.files?.[0] || null)} />
      </div>

      <Button type="submit" className="w-full h-12 text-base" disabled={submitting}>
        {submitting ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>
        ) : (
          "Submit Additional Information"
        )}
      </Button>
    </form>
  );
}
