//components
"use client"

import Stepper from "@/app/components/stepper";
import { ProgressProvider } from "../context/progress-context";
import { Card } from "@heroui/react";
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
          <div className="col-span-2 flex justify-center bg-gray-50">
            <Card className="p-8 cursor-pointer hover:scale-[1.01] transition-transform duration-200 bg-gray-300 w-[70%] ">
              <div className="flex mb-4">
                <div className="w-full bg-gray-200 flex items-center justify-center p-3">
                  <span className="px-4 font-semibold text-xl text-gray-600">Tee Time Placeholder</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-400 w-24 h-24 rounded-full mb-4"></div> {/* Larger placeholder icon */}
                <span className="px-4 font-semibold text-xl text-gray-600">Available Slots: Placeholder</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProgressProvider>
  );
}
