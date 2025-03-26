/* eslint-disable @typescript-eslint/no-explicit-any */
// app/auth/components/VerifyEmailForm.tsx
"use client";

import React, { useState } from "react";
import { Button, Input, Link } from "@heroui/react";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface VerifyEmailFormProps {
  onVerificationComplete: (email: string) => void;
}

export default function VerifyEmailForm({
  onVerificationComplete,
}: VerifyEmailFormProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsCheckingEmail(true);

    try {
      // First check if email already exists
      const checkResponse = await axios.post("/api/check-email-exists", {
        email,
      });

      if (checkResponse.data.exists) {
        // Create the error message with the actual email properly interpolated
        const errorText = t("emailAlreadyExists").replace("{{email}}", email);

        // Set the error state with the proper message
        setError(errorText);

        // Also show a toast with the same message
        addToast({
          title: t("emailAlreadyExistsProfile"),
          description: errorText,
          color: "danger",
          timeout: 5000,
        });

        setIsCheckingEmail(false);
        return;
      }

      // Email doesn't exist, proceed with sending OTP
      setIsCheckingEmail(false);
      setIsLoading(true);

      const response = await axios.post("/api/verify-email", { email });

      if (response.data.success) {
        setStep("otp");

        // Start countdown for resend button (2 minutes)
        setCountdown(120);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || t("failedToSendVerificationCode"));
      setIsCheckingEmail(false);
      setIsLoading(false);
    } finally {
      if (!error) {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.put("/api/verify-email", {
        email,
        otp,
      });

      if (response.data.success) {
        // Pass the verified email to parent component
        onVerificationComplete(email);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || t("failedToVerifyEmail"));
    } finally {
      setIsLoading(false);
    }
  };

  // Format countdown time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <p className="pb-4 text-center text-3xl font-semibold">
          {step === "email" ? t("verifyYourEmail") : t("enterVerificationCode")}
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
        )}

        {step === "email" ? (
          <form className="flex flex-col gap-4" onSubmit={handleSendOTP}>
            <Input
              isRequired
              label={t("email")}
              labelPlacement="outside"
              name="email"
              placeholder={t("enterEmail")}
              type="email"
              variant="bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isCheckingEmail}
            />

            <Button
              className="w-full bg-green-600 text-white"
              type="submit"
              isLoading={isLoading || isCheckingEmail}
            >
              {isCheckingEmail
                ? t("checking")
                : isLoading
                ? t("sending")
                : t("sendVerificationCode")}
            </Button>

            <p className="text-center text-small">
              <Link href="/auth/login" size="sm">
                {t("alreadyHaveAccount")}
              </Link>
            </p>
          </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleVerifyOTP}>
            <div className="text-center text-gray-600 dark:text-gray-300 mb-2">
              {t("verificationCodeSentTo")}{" "}
              <span className="font-semibold">{email}</span>
            </div>

            <Input
              isRequired
              label={t("verificationCode")}
              labelPlacement="outside"
              name="otp"
              placeholder={t("enter6DigitCode")}
              variant="bordered"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={isLoading}
              maxLength={6}
            />

            <Button
              className="w-full bg-green-600 text-white"
              type="submit"
              isLoading={isLoading}
            >
              {isLoading ? t("verifying") : t("verifyCode")}
            </Button>

            <div className="flex justify-between items-center">
              <Button
                variant="light"
                disabled={countdown > 0 || isLoading}
                onClick={() => handleSendOTP(new Event("submit") as any)}
                className="text-green-600"
              >
                {countdown > 0
                  ? `${t("resendCodeIn")} ${formatTime(countdown)}`
                  : t("resendCode")}
              </Button>

              <Button
                variant="light"
                onPress={() => setStep("email")}
                className="text-green-600"
              >
                {t("changeEmail")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
