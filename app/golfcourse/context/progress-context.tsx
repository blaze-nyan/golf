/* eslint-disable @typescript-eslint/no-explicit-any */
// app/golfcourse/context/progress-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export const STEPS = [
  {
    title: "Course",
    path: (courseId: string) => `/golfcourse/${courseId}`,
  },
  {
    title: "Booking",
    path: (courseId: string) => `/golfcourse/${courseId}/booking-time`,
  },
  {
    title: "Details",
    path: (courseId: string) => `/golfcourse/${courseId}/other-services`,
  },
  {
    title: "Payment",
    path: (courseId: string) => `/golfcourse/${courseId}/booking-payment`,
  },
  {
    title: "Done",
    path: (courseId: string) => `/golfcourse/${courseId}/success`,
  },
] as const;

type ProgressContextType = {
  currentStep: number;
  maxCompletedStep: number;
  courseId: string;
  completeStep: (step: number) => void;
  canAccess: (step: number) => boolean;
  bookingDetails: any;
  setBookingDetails: (bookingDetails: any) => void;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [maxCompletedStep, setMaxCompletedStep] = useState(-1);

  const [bookingDetails, setBookingDetails] = useState({
    courseId: "",
    courseImageUID: "",
    courseLocation: "",
    courseName: "",
    bookingType: null,
    clientID: null,
    teeDate: null,
    teeTime: null,
    numberOfGolfers: null,
    numberOfnonPlayers: null,
    "Golf Cart": null,
    Caddies: null,
    "Food & Drinks": null,
    "Golfer Names": [],
    status: "prepaid",
    paymentType: null,
    paid: 0,
    price: 0,
  });

  const pathname = usePathname();
  const router = useRouter();

  // Extract courseId from pathname
  const courseId = pathname.split("/")[2]; // Gets the ID from /golfcourse/[courseId]/*

  // Find current step index based on the path pattern
  const currentStep = STEPS.findIndex((step) =>
    pathname.match(new RegExp(step.path(courseId).replace(/\//g, "\\/") + "$"))
  );

  const [hydrated, setHydrated] = useState(false);

  // Effect to indicate initial render is done
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Load progress from window.localStorage on mount
  useEffect(() => {
    if (courseId && typeof window !== "undefined") {
      const saved = window.localStorage.getItem(
        `golfCourseProgress_${courseId}`
      );
      if (saved) {
        setMaxCompletedStep(Number(saved));
      } else {
        setMaxCompletedStep(-1); // Reset for new course
      }
    }
  }, [courseId]);

  useEffect(() => {
    console.log("HYdaration", hydrated);
    if (courseId && typeof window !== "undefined" && hydrated) {
      const savedBookingDetails = window.localStorage.getItem(
        `bookingDetails_${courseId}`
      );
      console.log(savedBookingDetails);
      console.log(bookingDetails);
      window.localStorage.setItem(
        `bookingDetails_${courseId}`,
        JSON.stringify(bookingDetails)
      );
    }
    if (!hydrated) {
      if (courseId && typeof window !== "undefined") {
        const savedBookingDetails = window.localStorage.getItem(
          `bookingDetails_${courseId}`
        );
        if (savedBookingDetails) {
          setBookingDetails(JSON.parse(savedBookingDetails));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingDetails, courseId]);

  useEffect(() => {
    if (courseId && currentStep >= 0 && typeof window !== "undefined") {
      window.localStorage.setItem(
        `golfCourseProgress_${courseId}`,
        String(currentStep)
      );
    }
  }, [currentStep, courseId]);

  useEffect(() => {
    if (courseId && currentStep > maxCompletedStep + 1) {
      let step = 0;
      if (typeof window !== "undefined") {
        step = Number(
          window.localStorage.getItem(`golfCourseProgress_${courseId}`)
        );
      }
      const allowedPath = STEPS[step].path(courseId);
      router.replace(allowedPath);
    }
  }, [currentStep, maxCompletedStep, router, courseId]);

  const completeStep = (step: number) => {
    setMaxCompletedStep(step);
  };

  const canAccess = (step: number) => {
    return step <= maxCompletedStep + 1;
  };

  return (
    <ProgressContext.Provider
      value={{
        currentStep,
        maxCompletedStep,
        courseId,
        completeStep,
        canAccess,
        bookingDetails,
        setBookingDetails,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
