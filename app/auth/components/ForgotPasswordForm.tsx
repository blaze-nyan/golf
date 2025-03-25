/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button, Input, Link, Form } from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useLanguage } from "@/app/contexts/LanguageContext";

enum ForgotPasswordStep {
  EMAIL_INPUT = "email_input",
  OTP_VERIFICATION = "otp_verification",
  NEW_PASSWORD = "new_password",
  SUCCESS = "success",
}

export default function ForgotPasswordForm() {
  const { t } = useLanguage();
  const [step, setStep] = useState<ForgotPasswordStep>(
    ForgotPasswordStep.EMAIL_INPUT
  );
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [clientId, setClientId] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null); // For development testing

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/verify-email", { email });

      if (response.data.success) {
        // Store OTP if in development mode (makes testing easier)
        if (response.data.otp) {
          setDevOtp(response.data.otp);
        }

        setStep(ForgotPasswordStep.OTP_VERIFICATION);

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
      setError(err.response?.data?.error || t("failedToSendCode"));
    } finally {
      setIsLoading(false);
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
        // Get client ID associated with this email
        const userResponse = await axios.post("/api/get-client-by-email", {
          email,
        });

        if (userResponse.data.success && userResponse.data.clientId) {
          setClientId(userResponse.data.clientId);
          setStep(ForgotPasswordStep.NEW_PASSWORD);
        } else {
          setError(t("accountNotFound"));
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || t("failedToVerifyCode"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("passwordsMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("passwordTooShort"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/reset-password", {
        clientId,
        password,
      });

      if (response.data.success) {
        setStep(ForgotPasswordStep.SUCCESS);
      } else {
        setError(t("failedToResetPassword"));
      }
    } catch (err: any) {
      setError(err.response?.data?.error || t("failedToResetPassword"));
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
        {step === ForgotPasswordStep.EMAIL_INPUT && (
          <>
            <p className="pb-4 text-center text-3xl font-semibold">
              {t("forgotPassword")}
            </p>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-2">
              {t("forgotPasswordInstructions")}
            </p>

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
            )}

            <Form className="flex flex-col gap-4" onSubmit={handleSendOTP}>
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
                disabled={isLoading}
              />

              <Button
                className="w-full bg-green-600 text-white"
                type="submit"
                isLoading={isLoading}
              >
                {isLoading ? t("sending") : t("sendVerificationCode")}
              </Button>

              <p className="text-center text-small">
                <Link href="/auth/login" size="sm">
                  {t("rememberPasswordLogin")}
                </Link>
              </p>
            </Form>
          </>
        )}

        {step === ForgotPasswordStep.OTP_VERIFICATION && (
          <>
            <p className="pb-4 text-center text-3xl font-semibold">
              {t("verifyEmail")}
            </p>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
              {t("codeSentTo")} <span className="font-semibold">{email}</span>
            </p>

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
            )}

            {/* Developer helper text - remove in production */}
            {devOtp && (
              <div className="text-center text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                {t("developerMode")} <span className="font-bold">{devOtp}</span>
              </div>
            )}

            <Form className="flex flex-col gap-4" onSubmit={handleVerifyOTP}>
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
                    ? t("resendInTime", { time: formatTime(countdown) })
                    : t("resendCode")}
                </Button>

                <Button
                  variant="light"
                  onPress={() => setStep(ForgotPasswordStep.EMAIL_INPUT)}
                  className="text-green-600"
                >
                  {t("changeEmail")}
                </Button>
              </div>
            </Form>
          </>
        )}

        {step === ForgotPasswordStep.NEW_PASSWORD && (
          <>
            <p className="pb-4 text-center text-3xl font-semibold">
              {t("resetPassword")}
            </p>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
              {t("createNewPassword")}
            </p>

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
            )}

            <Form
              className="flex flex-col gap-4"
              onSubmit={handleResetPassword}
            >
              <Input
                isRequired
                label={t("newPassword")}
                labelPlacement="outside"
                name="password"
                placeholder={t("enterNewPassword")}
                type="password"
                variant="bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />

              <Input
                isRequired
                label={t("confirmPassword")}
                labelPlacement="outside"
                name="confirmPassword"
                placeholder={t("confirmNewPassword")}
                type="password"
                variant="bordered"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />

              <Button
                className="w-full bg-green-600 text-white"
                type="submit"
                isLoading={isLoading}
              >
                {isLoading ? t("resetting") : t("resetPassword")}
              </Button>
            </Form>
          </>
        )}

        {step === ForgotPasswordStep.SUCCESS && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Icon
                icon="mdi:check"
                className="h-8 w-8 text-green-600 dark:text-green-400"
              />
            </div>
            <p className="text-xl font-semibold">{t("passwordResetSuccess")}</p>
            <p className="text-center text-gray-600 dark:text-gray-300">
              {t("passwordResetSuccessMessage")}
            </p>
            <Button
              as={Link}
              href="/auth/login"
              className="w-full bg-green-600 text-white"
            >
              {t("goToLogin")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
