"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { updateKycRecord } from "@/lib/actions/admin";
import type { KycSubmission } from "@/types";

const editRecordSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  fatherName: z.string().min(2, "Father name is required"),
  mobileNumber: z
    .string()
    .regex(/^\+977\d{10}$/, "Mobile number must be +977 followed by 10 digits"),
  dateOfBirth: z.string(),
  status: z.enum(["Pending", "Approved", "Rejected"]),
});

type FormValues = z.infer<typeof editRecordSchema>;

interface EditRecordModalProps {
  record: KycSubmission | null;
  onClose: () => void;
  onSaved: () => void;
}

export function EditRecordModal({ record, onClose, onSaved }: EditRecordModalProps) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(editRecordSchema),
    values: record
      ? {
          fullName: record.full_name,
          fatherName: record.father_name,
          mobileNumber: record.mobile_number,
          dateOfBirth: record.date_of_birth || "",
          status: record.status,
        }
      : undefined,
  });

  if (!record) return null;

  async function onSubmit(values: FormValues) {
    if (!record) return;
    setSaving(true);
    const result = await updateKycRecord(record.id, values);
    if (result.error) {
      toast.error(
        typeof result.error === "string"
          ? result.error
          : "Failed to update KYC record"
      );
      setSaving(false);
      return;
    }
    toast.success("KYC record updated successfully.");
    onSaved();
  }

  return (
    <Modal title="Edit KYC Record" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="edit-fullName">Full Name</Label>
          <Input
            id="edit-fullName"
            {...register("fullName")}
            className={errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-fatherName">Father&apos;s Name</Label>
          <Input
            id="edit-fatherName"
            {...register("fatherName")}
            className={errors.fatherName ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.fatherName && (
            <p className="text-xs text-red-500 mt-1">{errors.fatherName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-mobileNumber">Mobile Number</Label>
          <Input
            id="edit-mobileNumber"
            placeholder="+977XXXXXXXXXX"
            {...register("mobileNumber")}
            className={errors.mobileNumber ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.mobileNumber && (
            <p className="text-xs text-red-500 mt-1">{errors.mobileNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-dateOfBirth">Date of Birth</Label>
          <Input
            id="edit-dateOfBirth"
            type="date"
            {...register("dateOfBirth")}
            className={errors.dateOfBirth ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-status">Status</Label>
          <Select id="edit-status" {...register("status")}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </Select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}