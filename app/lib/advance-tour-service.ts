/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/advanced-tour-service.ts
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

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
        title: "Navigation Menu",
        description:
          "Access different sections of our website including Golf Courses, F&B, Hotel, and Membership options.",
        position: "bottom",
      },
    },
    {
      element: ".burger-menu",
      popover: {
        title: "Mobile Menu",
        description:
          "On smaller screens, tap here to access the navigation menu with all site sections.",
        position: "left",
      },
    },
    {
      element: ".book-tee-time",
      popover: {
        title: "Book a Tee Time",
        description:
          "Click here to browse our selection of golf courses and book your preferred tee time.",
        position: "bottom",
      },
    },
    {
      element: ".weather-widget",
      popover: {
        title: "Weather Forecast",
        description:
          "Check real-time weather conditions to plan your perfect golfing day. Includes current temperature and playing conditions.",
        position: "top",
      },
    },
    {
      element: ".faq-accordion",
      popover: {
        title: "Frequently Asked Questions",
        description:
          "Find answers to common questions about bookings, cancellations, and course policies.",
        position: "top",
      },
    },
    {
      element: 'a[href="/auth/login"]',
      popover: {
        title: "Login / Sign Up",
        description:
          "Create an account or sign in to book tee times, manage reservations, and view your profile.",
        position: "bottom",
      },
    },
    {
      element: ".light-dark",
      popover: {
        title: "Theme Switcher",
        description:
          "Toggle between light and dark mode for your preferred viewing experience.",
        position: "bottom",
      },
    },
    {
      element: ".chat-widget",
      popover: {
        title: "Golf Assistant",
        description:
          "Need help? Chat with our virtual assistant for immediate answers to your questions about courses, bookings, or amenities.",
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
    doneBtnText: "Finish",
    closeBtnText: "Skip",
    nextBtnText: "Next",
    prevBtnText: "Previous",
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
        title: "Real Course From Api",
        description:
          "This is the only real course that we got form the api. Rest of the courses are fake we created to demonstrate the designs if we have multiple courses",
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
    doneBtnText: "Finish",
    closeBtnText: "Skip",
    nextBtnText: "Next",
    prevBtnText: "Previous",
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
        title: "Booking Progress",
        description:
          "This navigation bar tracks your progress through the booking process. Complete each step to finalize your tee time reservation.",
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
    doneBtnText: "Finish",
    closeBtnText: "Skip",
    nextBtnText: "Next",
    prevBtnText: "Previous",
    keyboardControl: true,
    overlayClickNext: false,
    stagePadding: 10,
    smoothScroll: true,
    popoverClass: "driver-popover-custom",
    steps: steps,
  });

  return driverObj;
};
