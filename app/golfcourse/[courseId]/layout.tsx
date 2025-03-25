"use client";

import React, { useState, useEffect } from "react";
import Stepper from "@/app/components/stepper";
import { ProgressProvider, useProgress } from "../context/progress-context";
import BookingDetails from "@/app/components/booking-details";
import AuthRedirect from "@/app/components/auth-redirect";
import { ChevronLeft, X, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function GolfCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider>
      <AuthRedirect></AuthRedirect>
      <div className="flex flex-col min-h-[60%] m-4 mr-0 md:m-10 md:mr-0 md:mt-1  mt-3">
        <div className="">
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
  const { t } = useLanguage();

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

  // Enhanced mobile adaptation for the booking details panel
  // In app/golfcourse/[courseId]/layout.tsx

  // Mobile panel as a bottom sheet that slides up
  // Improved mobile adaptation for the booking details panel
  // In app/golfcourse/[courseId]/layout.tsx

  return (
    <div
      style={{ height: "calc(100dvh - 167px)" }}
      className="w-full max-w-[100%] relative flex overflow-hidden"
    >
      {/* Main content area */}
      <div
        className="transition-all duration-300 ease-in-out overflow-y-auto px-2 font-sans"
        style={{
          width: isMobile ? "100%" : getContentWidth(),
          opacity: isMobile && isPanelVisible ? 0.5 : 1,
        }}
      >
        {children}
      </div>

      {currentStep <= 3 && (
        <>
          {/* Mobile panel toggle button */}
          {isMobile && !isPanelVisible && (
            <button
              onClick={togglePanel}
              className="fixed bottom-20 right-4 z-50 bg-green-600 text-white h-12 w-12 rounded-full flex items-center justify-center shadow-lg"
            >
              <ShoppingBag className="text-xl" />
            </button>
          )}

          <div
            className={`transition-all duration-300 ease-in-out flex flex-col
                      ${
                        isMobile
                          ? "fixed bottom-0 left-0 right-0 z-50 rounded-t-xl shadow-lg"
                          : "fixed top-[60px] right-0 z-40"
                      }`}
            style={{
              transform: isPanelVisible
                ? "translateY(0)"
                : isMobile
                ? "translateY(100%)"
                : "translateX(100%)",
              width: isMobile ? "100%" : getPanelWidth(),
              height: isMobile ? "80%" : "calc(100vh - 60px)", // Full height minus navbar
              maxHeight: isMobile ? "80vh" : "calc(100vh - 60px)",
              borderRadius: 0,
            }}
          >
            {/* Single unified header for mobile */}
            {isMobile && (
              <div className="flex items-center justify-between bg-green-700 text-white rounded-t-xl px-4 py-3">
                <div className="w-8"></div> {/* Empty space for centering */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-1 bg-white/50 rounded-full mb-1"></div>
                  <span className="text-base font-medium">
                    {t("yourBooking")}
                  </span>
                </div>
                <button
                  onClick={togglePanel}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20"
                >
                  <X size={18} color="white" />
                </button>
              </div>
            )}

            {/* Toggle button for desktop */}
            {!isMobile && (
              <button
                onClick={togglePanel}
                className="absolute left-0 top-[15%] transform -translate-x-full -translate-y-1/2 z-50 
                        bg-green-500 hover:bg-green-600 text-white h-16 w-8 rounded-l-md 
                        flex items-center justify-center shadow-md"
              >
                <ChevronLeft
                  size={24}
                  style={{
                    transform: isPanelVisible
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </button>
            )}

            {/* Content area */}
            <div className="flex-grow overflow-y-auto">
              <BookingDetails showHeader={!isMobile} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
