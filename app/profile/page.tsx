// app/profile/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { encryptData } from "@/app/lib/dataEncrypt";
import AnimatedLoading from "../components/animated-loading";

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check localStorage first (for remembered users)
    let clientId = window.localStorage.getItem("clientId");

    // If there's no clientId in localStorage, check sessionStorage
    if (!clientId) {
      clientId = window.sessionStorage.getItem("clientId");
    }

    if (clientId) {
      try {
        const clientId_ = encryptData(clientId);
        console.log("ClientIdEncypeteINprofilePage", clientId_);
        window.localStorage.setItem("clientIdEncrypt", clientId_.toString());
        if (process.env.NODE_ENV === "development") {
          console.log("Encrypted Client ID:", clientId_);
        }
        router.push(`/profile/${encodeURIComponent(clientId_)}`);
      } catch (error) {
        console.error("Encryption error:", error);
        router.push("/auth/login");
      }
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="flex h-[90vh] items-center justify-center">
      <AnimatedLoading />
    </div>
  );
}
