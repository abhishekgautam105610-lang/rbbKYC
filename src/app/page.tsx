"use client";

import { useState } from "react";
import Image from "next/image";
import { KycForm } from "@/components/kyc-form";
import { SuccessCard } from "@/components/success-card";

export default function KycPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SuccessCard onDone={() => setSubmitted(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
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
          <KycForm onSuccess={() => setSubmitted(true)} />
        </div>
      </div>
    </div>
  );
}
