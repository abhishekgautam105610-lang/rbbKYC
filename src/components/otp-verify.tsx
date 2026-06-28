"use client";

import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { verifyOtp } from "@/lib/actions/kyc";

interface OtpVerifyProps {
  submissionId: string;
  onVerified: () => void;
}

export function OtpVerify({ submissionId, onVerified }: OtpVerifyProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setSubmitting(true);

    const result = await verifyOtp(submissionId, otp);

    if (result.error) {
      toast.error(result.error);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onVerified();
  }

  return (
    <Card className="w-full animate-in fade-in zoom-in duration-500">
      <CardContent className="pt-6 pb-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-100 p-3">
            <ShieldCheck className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          OTP Verification
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Enter the 6-digit OTP sent to your mobile number
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="text-center text-lg tracking-[0.5em]"
          />
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
          <Button type="submit" className="w-full h-12 text-base" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
