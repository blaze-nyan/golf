"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { Spinner } from "@heroui/react";
import CustomLoading from "../components/custom-loading";
import { encryptData } from "@/app/lib/dataEncrypt";

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const clientId = window.localStorage.getItem("clientId");
    if (clientId && clientId.trim()) {
      try {
        const clientId_ = encryptData(clientId);
        if (process.env.NODE_ENV === "development") {
          console.log("Encrypted Client ID:", clientId_);
        }
        router.push(`/profile/${clientId_}`);
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
      {/* <Spinner size="lg" /> */}
      <CustomLoading />
    </div>
  );
}
