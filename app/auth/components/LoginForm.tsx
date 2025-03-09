/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button, Input, Checkbox, Link, Form } from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { fetchData } from "@/app/lib/api-placeholder-db";
import { logger } from "@/app/lib/logger";
// import { setClientId } from "@/app/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/login", {
        email: formData.email,
        password: formData.password,
      });

      logger.log("Login response:", response.data);

      if (response.data.clientId) {
        const clientIdStr = response.data.clientId.toString();

        // Set to both storage mechanisms temporarily (to debug the issue)
        // In production, you'd use only one based on remember me
        if (formData.remember) {
          window.localStorage.setItem("clientId", clientIdStr);
        } else {
          window.sessionStorage.setItem("clientId", clientIdStr);
        }

        // Debug storage after setting
        logger.log(
          "After login - localStorage:",
          localStorage.getItem("clientId")
        );
        logger.log(
          "After login - sessionStorage:",
          sessionStorage.getItem("clientId")
        );

        const staffList = await fetchData("staffList");
        const clientIds = staffList.map(
          (staff: { [x: string]: any }) => staff["Client ID"]
        );

        // Use router.replace instead of push for more reliable navigation
        if (clientIds.includes(response.data.clientId.toString())) {
          router.replace("/dashboard");
        } else {
          router.replace("/profile");
        }
      } else {
        setError("Login failed - no client ID received");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <p className="pb-4 text-center text-3xl font-semibold">Log In</p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
        )}

        <Form
          className="flex flex-col gap-4"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
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
          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox
              name="remember"
              size="sm"
              isSelected={formData.remember}
              onChange={handleInputChange}
              disabled={isLoading}
            >
              Remember me
            </Checkbox>
            <Link
              className="text-default-500"
              href="/auth/forgot-password"
              size="sm"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            className="w-full"
            color="primary"
            type="submit"
            isLoading={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </Form>
        <p className="text-center text-small">
          <Link href="/auth/signup" size="sm">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
