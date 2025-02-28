/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button, Input, Checkbox, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { signUp } from "@/app/lib/api"; // Your existing import
import { useRouter } from "next/navigation";

export default function Component() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

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
      setError("Passwords don't match");
      return;
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms and Privacy Policy");
      return;
    }

    setIsLoading(true);

    try {
      // Your existing signUp function will now call our updated API endpoint
      const response = await signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        surname: formData.surname,
      });

      // Check if the response indicates email verification was sent
      if (response.success && response.message?.includes("check your email")) {
        setVerificationSent(true);
      } else {
        // If somehow the API hasn't been updated yet, maintain the original behavior
        router.push("/auth/login");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Render verification success screen if email sent
  if (verificationSent) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <Icon icon="mdi:email-check" className="h-8 w-8 text-success" />
          </div>

          <h2 className="text-2xl font-semibold">Verification Email Sent</h2>

          <p className="text-default-600 mt-2 mb-4">
            We&apos;ve sent a verification link to{" "}
            <strong>{formData.email}</strong>. Please check your inbox and click
            the link to verify your email.
          </p>

          <div className="mt-2 text-sm text-default-500">
            Don&apos;t see the email? Check your spam folder or
            <Button
              variant="light"
              size="sm"
              className="px-1"
              onClick={() =>
                handleSubmit({ preventDefault: () => {} } as React.FormEvent)
              }
            >
              resend the verification email
            </Button>
          </div>

          <Button
            color="primary"
            className="mt-4"
            onClick={() => router.push("/auth/login")}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Your existing form UI remains here...
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <p className="pb-4 text-center text-3xl font-semibold">Sign Up</p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="First Name"
            labelPlacement="outside"
            name="firstName"
            placeholder="Enter your First Name"
            type="text"
            variant="bordered"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Input
            isRequired
            label="Surname"
            labelPlacement="outside"
            name="surname"
            placeholder="Enter your Surname"
            type="text"
            variant="bordered"
            value={formData.surname}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Input
            isRequired
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Enter your email"
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
            label="Password"
            labelPlacement="outside"
            name="password"
            placeholder="Enter your password"
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
            label="Confirm Password"
            labelPlacement="outside"
            name="confirmPassword"
            placeholder="Confirm your password"
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
            I agree with the&nbsp;
            <Link href="#" size="sm">
              Terms
            </Link>
            &nbsp; and&nbsp;
            <Link href="#" size="sm">
              Privacy Policy
            </Link>
          </Checkbox>
          <Button color="primary" type="submit" isLoading={isLoading}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <p className="text-center text-small">
          <Link href="/auth/login" size="sm">
            Already have an account? Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
