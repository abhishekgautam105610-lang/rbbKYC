"use client";

import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function KycThankYou() {
  return (
    <Card className="w-full animate-in fade-in zoom-in duration-500">
      <CardContent className="pt-6 pb-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Thank you for submitting KYC
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Your KYC verification is complete. You can now access all banking services.
        </p>
      </CardContent>
    </Card>
  );
}
