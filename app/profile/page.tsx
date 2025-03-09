// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { encryptData } from "@/app/lib/dataEncrypt";
import AnimatedLoading from "../components/animated-loading";
import { logger } from "@/app/lib/logger";
export default function ProfileRedirect() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Debug all storage
    logger.log("=== PROFILE REDIRECT DEBUG ===");
    logger.log("localStorage clientId:", localStorage.getItem("clientId"));
    logger.log("sessionStorage clientId:", sessionStorage.getItem("clientId"));
    logger.log(
      "localStorage clientIdEncrypt:",
      localStorage.getItem("clientIdEncrypt")
    );

    // Get clientId from either storage
    const getClientId = () => {
      const localId = window.localStorage.getItem("clientId");
      if (localId) return localId;

      const sessionId = window.sessionStorage.getItem("clientId");
      if (sessionId) return sessionId;

      return null;
    };

    const clientId = getClientId();
    logger.log("Final clientId:", clientId);

    if (clientId) {
      try {
        const clientId_ = encryptData(clientId);
        logger.log("Encrypted Client ID:", clientId_);

        // Store encrypted ID where it's needed
        window.localStorage.setItem("clientIdEncrypt", clientId_.toString());

        // IMPORTANT: Mark auth check as complete before redirecting
        setAuthChecked(true);

        // Redirect to profile with the encrypted ID
        router.push(`/profile/${encodeURIComponent(clientId_)}`);
      } catch (error) {
        logger.error("Encryption error:", error);
        setAuthChecked(true);
        router.push("/auth/login");
      }
    } else {
      logger.log("No valid auth, redirecting to login");
      setAuthChecked(true);
      router.push("/auth/login");
    }
  }, [router]);

  // Show loading only if auth is still being checked
  if (!authChecked) {
    return (
      <div className="flex h-[90vh] items-center justify-center">
        <AnimatedLoading />
      </div>
    );
  }

  // Return null after auth check is complete to prevent any rendering flicker
  return null;
}
