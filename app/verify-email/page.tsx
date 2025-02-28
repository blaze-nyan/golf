/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { verifyEmail } from "@/app/lib/api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await verifyEmail(token);

        if (response.success) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
        } else {
          setStatus("error");
          setMessage(response.error || "Failed to verify email.");
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.error ||
            "An error occurred during verification."
        );
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6 text-center">
        <h1 className="text-2xl font-semibold">Email Verification</h1>

        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-default-600">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
              <Icon
                icon="mdi:check-circle"
                className="h-10 w-10 text-success"
              />
            </div>
            <p className="text-lg">{message}</p>
            <Button
              color="primary"
              className="mt-4"
              onPress={() => router.push("/auth/login")}
            >
              Proceed to Login
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/20">
              <Icon icon="mdi:alert-circle" className="h-10 w-10 text-danger" />
            </div>
            <p className="text-lg">{message}</p>
            <Button
              className="mt-4"
              onPress={() => router.push("/auth/signup")}
              variant="flat"
            >
              Back to Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
