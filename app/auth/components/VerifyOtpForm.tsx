/* eslint-disable @typescript-eslint/no-explicit-any */
// app/auth/components/VerifyOtpForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Link } from "@heroui/react";
import axios from "axios";
import { signUp } from "@/app/lib/api";
import { logger } from "@/app/lib/logger";
interface VerifyOtpFormProps {
  email: string;
  userData: {
    email: string;
    password: string;
    firstName: string;
    surname: string;
  };
  onVerificationComplete: () => void;
}

export default function VerifyOtpForm({
  email,
  userData,
  onVerificationComplete,
}: VerifyOtpFormProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(120); // 2 minute countdown
  const [devOtp, setDevOtp] = useState<string | null>(null); // For development testing

  // Start countdown for resend button
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // For development, get the OTP
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      logger.log("Development mode: checking for OTP...");
      // Find OTP in local storage or console logs
      // This is just a placeholder - in real production code
      // you should remove any debugging OTP features
    }
  }, []);

  const handleResendOTP = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/verify-email", { email });

      if (response.data.success) {
        // Store OTP if in development mode
        if (response.data.otp) {
          setDevOtp(response.data.otp);
        }

        // Reset countdown
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
      setError(
        err.response?.data?.error || "Failed to resend verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // First verify the OTP
      const verifyResponse = await axios.put("/api/verify-email", {
        email,
        otp,
      });

      if (verifyResponse.data.success) {
        // OTP verified, now create the account
        const signupResponse = await signUp(userData);

        if (signupResponse.success) {
          // Account created successfully
          onVerificationComplete();
        } else {
          setError("Failed to create account. Please try again.");
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to verify code or create account"
      );
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
          Verify Your Email
        </p>

        <div className="text-center text-gray-600 dark:text-gray-300 mb-2">
          We&apos;ve sent a verification code to{" "}
          <span className="font-semibold">{email}</span>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
        )}

        {/* Developer helper text - remove in production */}
        {devOtp && (
          <div className="text-center text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded">
            Developer Mode: Use code <span className="font-bold">{devOtp}</span>
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleVerifyOTP}>
          <Input
            isRequired
            label="Verification Code"
            labelPlacement="outside"
            name="otp"
            placeholder="Enter the 6-digit code"
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
            {isLoading ? "Verifying..." : "Verify & Create Account"}
          </Button>

          <div className="flex justify-between items-center">
            <Button
              variant="light"
              disabled={countdown > 0 || isLoading}
              onClick={handleResendOTP}
              className="text-green-600"
            >
              {countdown > 0
                ? `Resend in ${formatTime(countdown)}`
                : "Resend Code"}
            </Button>

            <Link href="/auth/signup" className="text-green-600">
              Change Email
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
