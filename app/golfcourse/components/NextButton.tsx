// app/golfcourse/components/NextButton.tsx
"use client";

import { useProgress } from "../context/progress-context";
import { useRouter } from "next/navigation";
import { STEPS } from "../context/progress-context";
import { Button } from "@heroui/button";

export function NextButton({ disabled = false }) {
  const { currentStep, completeStep, courseId } = useProgress();
  const router = useRouter();

  const handleNext = () => {
    // Complete current step
    if (!disabled){
      completeStep(currentStep);
  
      // Move to next step if not on last step
      if (currentStep < STEPS.length - 1) {
        const nextStep = STEPS[currentStep + 1];
        router.push(nextStep.path(courseId));
      }
    }
  };


  // Don't show button on last step
  if (currentStep === STEPS.length - 1) {
    return null;
  }

  return (

    <Button onPress={handleNext} color={disabled? "default":`primary`}>
      Next
    </Button>
  );
}
