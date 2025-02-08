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
    title: "Hole",
    path: (courseId: string) => `/golfcourse/${courseId}/hole`,
  },
  {
    title: "Other Services",
    path: (courseId: string) => `/golfcourse/${courseId}/other-services`,
  },

  {
    title: "Booking",
    path: (courseId: string) => `/golfcourse/${courseId}/booking`,
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
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [maxCompletedStep, setMaxCompletedStep] = useState(-1);
  const pathname = usePathname();
  const router = useRouter();

  // Extract courseId from pathname
  const courseId = pathname.split("/")[2]; // Gets the ID from /golfcourse/[courseId]/*

  // Find current step index based on the path pattern
  const currentStep = STEPS.findIndex((step) =>
    pathname.match(new RegExp(step.path(courseId).replace(/\//g, "\\/") + "$"))
  );

  // Load progress from localStorage on mount
  useEffect(() => {
    if (courseId) {
      const saved = localStorage.getItem(`golfCourseProgress_${courseId}`);
      if (saved) {
        setMaxCompletedStep(Number(saved));
      } else {
        setMaxCompletedStep(-1); // Reset for new course
      }
    }
  }, [courseId]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (courseId && maxCompletedStep >= 0) {
      localStorage.setItem(
        `golfCourseProgress_${courseId}`,
        String(maxCompletedStep)
      );
    }
  }, [maxCompletedStep, courseId]);

  // Redirect if trying to access a step that's not available
  useEffect(() => {
    if (courseId && currentStep > maxCompletedStep + 1) {
      const allowedPath =
        STEPS[maxCompletedStep + 1]?.path(courseId) || STEPS[0].path(courseId);
      router.replace(allowedPath);
    }
  }, [currentStep, maxCompletedStep, router, courseId]);

  const completeStep = (step: number) => {
    setMaxCompletedStep((prev) => Math.max(prev, step));
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
