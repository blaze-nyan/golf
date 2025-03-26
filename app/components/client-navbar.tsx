"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Import with no SSR to prevent hydration issues
const NavBar = dynamic(() => import("./nav-bar"), {
  ssr: false,
});

export default function ClientNavBar() {
  return (
    <Suspense
      fallback={<div className="h-16 border-b border-default-100"></div>}
    >
      <NavBar />
    </Suspense>
  );
}
