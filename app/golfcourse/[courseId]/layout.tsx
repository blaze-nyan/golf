//components
"use client"

import Stepper from "@/app/components/stepper";
import { ProgressProvider } from "../context/progress-context";
import BookingDetails from "@/app/components/booking-details";
export default function GolfCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider>
      <div className="flex flex-col min-h-[60%] m-20 mb-5 mt-3">
        <Stepper />
        <div className="w-full max-w-[100%] grid grid-cols-1 sm:grid-cols-6 ">
          <div className="col-span-4 h-[74vh] overflow-y-auto px-2 font-sans pb-5">
          {children}
          </div>
          <BookingDetails />
        </div>
      </div>
    </ProgressProvider>
  );
}
