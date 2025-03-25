/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/advanced-tour-service.ts
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// Store for the translation function that will be set from components
let translationFunction: ((key: string) => string) | null = null;

// Function to set the translation function from a component
export const setTranslationFunction = (fn: (key: string) => string): void => {
  translationFunction = fn;
};

// Helper function to get translations with fallback
const t = (key: string): string => {
  if (translationFunction) {
    return translationFunction(key);
  }
  return key; // Fallback to key if translation function not set
};

// Helper type for tracking visited pages
interface VisitedPages {
  [key: string]: boolean;
}

// Helper function to check if it's the user's first visit to a specific page
const isFirstVisit = (pageKey: string): boolean => {
  if (typeof window === "undefined") return false;

  const visitedPages = localStorage.getItem("visitedPages");
  const visited: VisitedPages = visitedPages ? JSON.parse(visitedPages) : {};

  if (!visited[pageKey]) {
    // Mark as visited
    visited[pageKey] = true;
    localStorage.setItem("visitedPages", JSON.stringify(visited));
    return true;
  }

  return false;
};

// Function to reset tours for testing purposes
export const resetTours = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("visitedPages");
};

// Home page tour
export const createHomeTour = (forceStart: boolean = false): any => {
  if (!forceStart && !isFirstVisit("home")) return null;

  // Define the steps
  let steps = [
    {
      element: ".nav-section",
      popover: {
        title: t("navMenuTitle"),
        description: t("navMenuDescription"),
        position: "bottom",
      },
    },
    {
      element: ".burger-menu",
      popover: {
        title: t("mobileMenuTitle"),
        description: t("mobileMenuDescription"),
        position: "left",
      },
    },
    {
      element: ".book-tee-time",
      popover: {
        title: t("bookTeeTimeTitle"),
        description: t("bookTeeTimeDescription"),
        position: "bottom",
      },
    },
    {
      element: ".weather-widget",
      popover: {
        title: t("weatherForecastTitle"),
        description: t("weatherForecastDescription"),
        position: "top",
      },
    },
    {
      element: ".faq-accordion",
      popover: {
        title: t("faqTitleTour"),
        description: t("faqDescription"),
        position: "top",
      },
    },
    {
      element: ".light-dark",
      popover: {
        title: t("themeSwitcherTitle"),
        description: t("themeSwitcherDescription"),
        position: "bottom",
      },
    },
    {
      element: ".chat-widget",
      popover: {
        title: t("golfAssistantTitle"),
        description: t("golfAssistantDescription"),
        position: "left",
      },
    },
  ];

  // **Filter out steps where:**
  // - The element does not exist
  // - The element has the `hidden` class
  // - The element is `display: none` or `visibility: hidden`
  steps = steps.filter((step) => {
    const el = document.querySelector(step.element);
    if (!el) return false; // Skip if element doesn't exist

    const computedStyle = window.getComputedStyle(el);
    return (
      !el.classList.contains("hidden") && // Skip if element has "hidden" class
      computedStyle.display !== "none" && // Skip if element is display: none
      computedStyle.visibility !== "hidden" // Skip if element is visibility: hidden
    );
  });
  if (steps.length === 0) return null;

  // Create driver instance with the custom theme class
  const driverObj = driver({
    animate: true,
    opacity: 0.75,
    padding: 5,
    showButtons: ["next", "previous", "close"],
    doneBtnText: t("finishButton"),
    closeBtnText: t("skipButton"),
    nextBtnText: t("nextButton"),
    prevBtnText: t("previousButton"),
    keyboardControl: true,
    overlayClickNext: false,
    stagePadding: 10,
    smoothScroll: true,
    popoverClass: "driver-popover-custom", // This matches our CSS class
    steps: steps,
  });

  return driverObj;
};

// Golf course page tour
export const createGolfCourseTour = (forceStart: boolean = false): any => {
  if (!forceStart && !isFirstVisit("golfcourse")) return null;

  // Define the steps
  let steps = [
    {
      element: ".course-card",
      popover: {
        title: t("realCourseTitle"),
        description: t("realCourseDescription"),
        position: "bottom",
      },
    },
  ];

  // **Filter out steps where:**
  // - The element does not exist
  // - The element has the `hidden` class
  // - The element is `display: none` or `visibility: hidden`
  steps = steps.filter((step) => {
    const el = document.querySelector(step.element);
    if (!el) return false; // Skip if element doesn't exist

    const computedStyle = window.getComputedStyle(el);
    return (
      !el.classList.contains("hidden") && // Skip if element has "hidden" class
      computedStyle.display !== "none" && // Skip if element is display: none
      computedStyle.visibility !== "hidden" // Skip if element is visibility: hidden
    );
  });
  if (steps.length === 0) return null;

  const driverObj = driver({
    animate: true,
    opacity: 0.75,
    padding: 5,
    showButtons: ["next", "previous", "close"],
    doneBtnText: t("finishButton"),
    closeBtnText: t("skipButton"),
    nextBtnText: t("nextButton"),
    prevBtnText: t("previousButton"),
    keyboardControl: true,
    overlayClickNext: false,
    stagePadding: 10,
    smoothScroll: true,
    popoverClass: "driver-popover-custom",
    steps: steps,
  });

  return driverObj;
};

// Individual Golf course page tour
export const createSingleGolfCourseTour = (
  forceStart: boolean = false
): any => {
  if (!forceStart && !isFirstVisit("golfcourse")) return null;

  // Define the steps
  let steps = [
    {
      element: ".stepper",
      popover: {
        title: t("bookingProgressTitle"),
        description: t("bookingProgressDescription"),
        position: "bottom",
      },
    },
  ];

  // **Filter out steps where:**
  // - The element does not exist
  // - The element has the `hidden` class
  // - The element is `display: none` or `visibility: hidden`
  steps = steps.filter((step) => {
    const el = document.querySelector(step.element);
    if (!el) return false; // Skip if element doesn't exist

    const computedStyle = window.getComputedStyle(el);
    return (
      !el.classList.contains("hidden") && // Skip if element has "hidden" class
      computedStyle.display !== "none" && // Skip if element is display: none
      computedStyle.visibility !== "hidden" // Skip if element is visibility: hidden
    );
  });
  if (steps.length === 0) return null;

  const driverObj = driver({
    animate: true,
    opacity: 0.75,
    padding: 5,
    showButtons: ["next", "previous", "close"],
    doneBtnText: t("finishButton"),
    closeBtnText: t("skipButton"),
    nextBtnText: t("nextButton"),
    prevBtnText: t("previousButton"),
    keyboardControl: true,
    overlayClickNext: false,
    stagePadding: 10,
    smoothScroll: true,
    popoverClass: "driver-popover-custom",
    steps: steps,
  });

  return driverObj;
};
