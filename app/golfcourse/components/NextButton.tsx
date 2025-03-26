"use client";

import { useState } from "react";
import { useProgress } from "../context/progress-context";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Icon } from "@iconify/react";

export function NextButton({ disabled = false, hideBackButton = false }) {
  const { currentStep, completeStep, courseId, STEPS } = useProgress();
  const router = useRouter();
  const { t } = useLanguage();
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [isBackLoading, setIsBackLoading] = useState(false);

  const handleNext = async () => {
    if (isNextLoading || isBackLoading) return;

    setIsNextLoading(true);
    try {
      // Complete current step
      completeStep(currentStep);

      // We need to ensure all state/context is updated before navigating
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Use router.replace instead of push to prevent going back
      if (window.location.pathname.includes("booking-payment")) {
        router.replace(`/golfcourse/${courseId}`);
      } else if (currentStep < STEPS.length - 1) {
        const nextStep = STEPS[currentStep + 1];
        router.push(nextStep.path(courseId));
      }
    } catch (error) {
      console.error("Error navigating to next step:", error);
      setIsNextLoading(false);
    }
  };

  const handleBack = async () => {
    if (isNextLoading || isBackLoading) return;

    setIsBackLoading(true);
    try {
      // Navigate immediately to previous step if not on first step
      if (currentStep > 0) {
        const prevStep = STEPS[currentStep - 1];
        router.push(prevStep.path(courseId));
      } else {
        // If we're on the first step, go back to course selection
        router.push("/golfcourse");
      }
    } catch (error) {
      console.error("Error navigating to previous page:", error);
      setIsBackLoading(false);
    }
  };

  // Don't show next button on last step
  if (currentStep === STEPS.length - 1) {
    return null;
  }

  return (
    <div className="flex gap-3">
      {/* Back button - only show if not hidden and not on first step */}
      {!hideBackButton && currentStep > 0 && (
        <Button
          onPress={handleBack}
          variant="bordered"
          color="default"
          isDisabled={isNextLoading || isBackLoading}
          isLoading={isBackLoading}
          startContent={
            !isBackLoading && <Icon icon="mdi:arrow-left" className="text-lg" />
          }
          className="min-w-20"
        >
          {t("back")}
        </Button>
      )}

      {/* Next button */}
      <Button
        onPress={handleNext}
        color={disabled ? "default" : "primary"}
        isDisabled={disabled || isNextLoading || isBackLoading}
        isLoading={isNextLoading}
        endContent={
          !isNextLoading && <Icon icon="mdi:arrow-right" className="text-lg" />
        }
      >
        {t("nextButton")}
      </Button>
    </div>
  );
}
