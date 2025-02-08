// app/components/stepper.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import RowSteps from "./row-steps";
import { STEPS, useProgress } from "@/app/golfcourse/context/progress-context";

export default function Stepper() {
  const router = useRouter();
  const { currentStep, canAccess, courseId } = useProgress();

  if (!courseId) return null; // Don't show stepper if no courseId

  const handleStepChange = (stepIndex: number) => {
    if (canAccess(stepIndex)) {
      router.push(STEPS[stepIndex].path(courseId));
    }
  };

  // Transform steps to include actual paths
  const stepsWithPaths = STEPS.map((step) => ({
    ...step,
    path: step.path(courseId),
  }));

  return (
    <RowSteps
      currentStep={currentStep}
      onStepChange={handleStepChange}
      steps={stepsWithPaths}
      stepClassName={(index) =>
        !canAccess(index) ? "pointer-events-none opacity-50" : ""
      }
    />
  );
}
