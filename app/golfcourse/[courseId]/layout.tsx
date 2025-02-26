// components
"use client";

import Stepper from "@/app/components/stepper";
import { ProgressProvider, useProgress } from "../context/progress-context";
import BookingDetails from "@/app/components/booking-details";
import AuthRedirect from "@/app/components/auth-redirect";

export default function GolfCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider>
      <AuthRedirect></AuthRedirect>
      <div className="flex flex-col min-h-[60%] m-4 md:m-10 mb-5 mt-3">
        <div className="hidden md:block">
          <Stepper />
        </div>
        <ProgressConsumer>{children}</ProgressConsumer>
      </div>
    </ProgressProvider>
  );
}

function ProgressConsumer({ children }: { children: React.ReactNode }) {
  const { currentStep } = useProgress();

  return (
    <div
      className={`w-full max-w-[100%] grid grid-cols-1 transition-all duration-300 ${
        currentStep > 3 ? "sm:grid-cols-1" : "sm:grid-cols-6"
      }`}
    >
      <div
        className={`transition-all duration-300 ${
          currentStep > 3 ? "col-span-1" : "col-span-4"
        } h-[74vh] overflow-y-auto px-2 font-sans pb-5`}
      >
        {children}
      </div>
      {currentStep <= 3 && (
        <div className="col-span-2 transition-all duration-300">
          <BookingDetails />
        </div>
      )}
    </div>
  );
}
