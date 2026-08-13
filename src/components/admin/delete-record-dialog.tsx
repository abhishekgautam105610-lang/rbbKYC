"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { deleteKycSubmission } from "@/lib/actions/admin";
import type { KycSubmission } from "@/types";

interface DeleteRecordDialogProps {
  record: KycSubmission | null;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteRecordDialog({
  record,
  onClose,
  onDeleted,
}: DeleteRecordDialogProps) {
  const [deleting, setDeleting] = useState(false);

  if (!record) return null;

  async function handleDelete() {
    if (!record) return;
    setDeleting(true);
    const result = await deleteKycSubmission(record.id);
    if (result.error) {
      toast.error(result.error);
      setDeleting(false);
      return;
    }
    toast.success("KYC record deleted successfully.");
    onDeleted();
  }

  return (
    <Modal title="Delete KYC Record" onClose={onClose}>
      <p className="text-sm text-gray-600">
        Are you sure you want to delete this KYC record? This action cannot be undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose} disabled={deleting}>
          Cancel
        </Button>
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting}>
          {deleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </Modal>
  );
}