// app/profile/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AnimatedLoading from "../components/animated-loading";

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    const clientId =
      typeof window !== "undefined"
        ? window.localStorage.getItem("clientId")
        : null;
    if (clientId) {
      router.push(`/profile/${clientId}`);
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="flex h-[90vh] items-center justify-center">
      {/* <Spinner size="lg" /> */}
      {/* <CustomLoading /> */}
      <AnimatedLoading />
    </div>
  );
}
