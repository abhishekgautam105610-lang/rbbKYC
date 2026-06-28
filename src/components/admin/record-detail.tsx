"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { KycSubmission } from "@/types";

interface RecordDetailProps {
  record: KycSubmission;
}

export function RecordDetail({ record }: RecordDetailProps) {
  const router = useRouter();

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
    </div>
  );
}
