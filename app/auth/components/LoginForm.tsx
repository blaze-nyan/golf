/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button, Input, Checkbox, Link, Form } from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { fetchData } from "@/app/lib/api-placeholder-db";

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

      console.log("Login response:", response.data);

      if (response.data.clientId) {
        // Check for browser environment before using storage
        if (typeof window !== "undefined") {
          const clientIdStr = response.data.clientId.toString();

          if (formData.remember) {
            // If "Remember Me" is checked, use localStorage (persists indefinitely)
            window.localStorage.setItem("clientId", clientIdStr);

            // You can also set an expiration date if you want the "remember me" to last for a specific duration
            // For example, 30 days from now
            const expiration = new Date();
            expiration.setDate(expiration.getDate() + 30);
            window.localStorage.setItem(
              "clientIdExpiration",
              expiration.toISOString()
            );

            // Store the fact that user chose to be remembered
            window.localStorage.setItem("rememberMe", "true");

            // Clear any session storage to avoid conflicts
            window.sessionStorage.removeItem("clientId");
          } else {
            // If "Remember Me" is NOT checked, use sessionStorage (cleared when browser is closed)
            window.sessionStorage.setItem("clientId", clientIdStr);

            // Clear any persistent storage to avoid conflicts
            window.localStorage.removeItem("clientId");
            window.localStorage.removeItem("clientIdExpiration");
            window.localStorage.removeItem("rememberMe");
          }
        }

        const staffList = await fetchData("staffList");

        const clientIds = staffList.map(
          (staff: { [x: string]: any }) => staff["Client ID"]
        );
        console.log(staffList);
        console.log(clientIds);

        if (clientIds.includes(response.data.clientId.toString())) {
          router.push("/dashboard");
        } else {
          router.push("/profile");
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
