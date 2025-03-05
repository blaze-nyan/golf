"use client";

import React, { useState, useEffect } from "react";
import Stepper from "@/app/components/stepper";
import { ProgressProvider, useProgress } from "../context/progress-context";
import BookingDetails from "@/app/components/booking-details";
import AuthRedirect from "@/app/components/auth-redirect";
import { ChevronLeft, X } from "lucide-react";

export default function GolfCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider>
      <AuthRedirect></AuthRedirect>
      <div className="flex flex-col min-h-[60%] m-4 mr-0 md:m-10 md:mr-0 md:mt-1 mb-5 mt-3">
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
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Set device type and default panel visibility
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);

      // Auto-hide panel on mobile
      if (width < 640) {
        setIsPanelVisible(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide panel for steps > 3
  useEffect(() => {
    if (currentStep > 3) {
      setIsPanelVisible(false);
    }
  }, [currentStep]);

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  // Set panel width based on device
  const getPanelWidth = () => {
    if (isMobile) return "100%";
    if (isTablet) return "50%"; // Changed from 60% to 50%
    return "33.333%";
  };

  // Calculate content width based on panel visibility and width
  const getContentWidth = () => {
    if (!isPanelVisible || currentStep > 3) return "100%";
    if (isMobile) return "0%"; // Hidden on mobile when panel is shown
    if (isTablet) return "50%"; // Changed from 40% to 50%
    return "66.667%";
  };

  return (
    <div
      style={{ height: "calc(100dvh - 130px)" }}
      className="w-full max-w-[100%]  relative  flex overflow-hidden"
    >
      {/* Main content area */}
      <div
        className="transition-all duration-300 ease-in-out overflow-y-auto px-2 font-sans "
        style={{
          width: getContentWidth(),
          display:
            isMobile && isPanelVisible && currentStep <= 3 ? "none" : "block",
        }}
      >
        {children}
      </div>

      {currentStep <= 3 && (
        <div
          className="absolute z-50 right-0 top-0 transition-all duration-300 ease-in-out flex"
          style={{
            transform: isPanelVisible ? "translateX(0)" : "translateX(100%)",
            width: getPanelWidth(),
            height: "calc(100dvh - 60px)",
          }}
        >
          {/* Toggle button - attached to the panel */}
          <button
            onClick={togglePanel}
            className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 z-50 
                      bg-green-500 hover:bg-green-600 text-white h-16 w-8 rounded-l-md 
                      flex items-center justify-center shadow-md sm:flex"
            style={{
              display: isMobile && isPanelVisible ? "none" : "flex", // Hide on mobile when panel is open
            }}
          >
            <ChevronLeft
              size={24}
              style={{
                transform: isPanelVisible ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </button>

          {/* Mobile close button (X) */}
          {isMobile && isPanelVisible && (
            <button
              onClick={togglePanel}
              className="absolute right-0 top-6 z-30  hover:bg-green-600 text-white h-8 w-8 rounded-full flex items-center justify-center"
            >
              <X size={22} />
            </button>
          )}

          {/* Booking details panel */}
          <div className="w-full h-full overflow-y-auto">
            <BookingDetails />
          </div>
        </div>
      )}
    </div>
  );
}
