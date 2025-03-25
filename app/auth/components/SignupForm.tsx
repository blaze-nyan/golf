/* eslint-disable @typescript-eslint/no-explicit-any */
// app/auth/components/SignupForm.tsx
"use client";

import React, { useState } from "react";
import { Button, Input, Checkbox, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface SignupFormProps {
  onProceedToVerification: (userData: {
    email: string;
    password: string;
    firstName: string;
    surname: string;
  }) => void;
}

export default function SignupForm({
  onProceedToVerification,
}: SignupFormProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordsMismatch"));
      return;
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      setError(t("agreeToTermsError"));
      return;
    }

    setIsLoading(true);

    try {
      // First check if email already exists
      const checkResponse = await axios.post("/api/check-email-exists", {
        email: formData.email,
      });

      if (checkResponse.data.exists) {
        setError(t("emailAlreadyExists", { email: formData.email }));
        setIsLoading(false);
        return;
      }

      // If email doesn't exist, send OTP
      const otpResponse = await axios.post("/api/verify-email", {
        email: formData.email,
      });

      if (otpResponse.data.success) {
        // Proceed to verification step with the form data
        onProceedToVerification({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          surname: formData.surname,
        });
      } else {
        setError(t("verificationSendFailed"));
      }
    } catch (err: any) {
      setError(err.response?.data?.error || t("generalError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <p className="pb-4 text-center text-3xl font-semibold">{t("signUp")}</p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            isRequired
            label={t("firstName")}
            labelPlacement="outside"
            name="firstName"
            placeholder={t("enterFirstName")}
            type="text"
            variant="bordered"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Input
            isRequired
            label={t("surname")}
            labelPlacement="outside"
            name="surname"
            placeholder={t("enterSurname")}
            type="text"
            variant="bordered"
            value={formData.surname}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Input
            isRequired
            label={t("email")}
            labelPlacement="outside"
            name="email"
            placeholder={t("enterEmail")}
            type="email"
            variant="bordered"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label={t("password")}
            labelPlacement="outside"
            name="password"
            placeholder={t("enterPassword")}
            type={isVisible ? "text" : "password"}
            variant="bordered"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleConfirmVisibility}>
                {isConfirmVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label={t("confirmPassword")}
            labelPlacement="outside"
            name="confirmPassword"
            placeholder={t("confirmYourPassword")}
            type={isConfirmVisible ? "text" : "password"}
            variant="bordered"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Checkbox
            isRequired
            className="py-4"
            size="sm"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            disabled={isLoading}
          >
            {t("iAgreeWithThe")}&nbsp;
            <Link href="#" size="sm">
              {t("terms")}
            </Link>
            &nbsp;{t("and")}&nbsp;
            <Link href="#" size="sm">
              {t("privacyPolicy")}
            </Link>
          </Checkbox>
          <Button color="primary" type="submit" isLoading={isLoading}>
            {isLoading ? t("processing") : t("signUp")}
          </Button>
        </form>
        <p className="text-center text-small">
          <Link href="/auth/login" size="sm">
            {t("alreadyHaveAccount")}
          </Link>
        </p>
      </div>
    </div>
  );
}
