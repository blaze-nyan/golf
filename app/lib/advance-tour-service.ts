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
        title: "Welcome to Splash Golf Club!",
        description:
          "Discover a premium golfing experience. This tour will help you explore our platform.(will edit later)",
        position: "bottom",
      },
    },
    {
      element: ".burger-menu",
      popover: {
        title: "Welcome to Splash Golf Club!",
        description:
          "Discover a premium golfing experience. This tour will help you explore our platform.(will edit later)",
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
          "Check real-time weather conditions to plan your perfect golfing day.",
        position: "top",
      },
    },
    {
      element: ".faq-accordion",
      popover: {
        title: "Frequently Asked Questions",
        description:
          "Find answers to common questions about memberships, bookings, and course policies.",
        position: "top",
      },
    },
    {
      element: 'a[href="/auth/login"]',
      popover: {
        title: "User Account",
        description:
          "Log in or sign up to access personalized features, manage bookings, and view your profile.",
        position: "bottom",
      },
    },
    {
      element: ".light-dark",
      popover: {
        title: "Light And Dark Mode",
        description:
          "Log in or sign up to access personalized features, manage bookings, and view your profile.(will edit later)",
        position: "bottom",
      },
    },
    {
      element: ".chat-widget",
      popover: {
        title: "Chat",
        description:
          "Log in or sign up to access personalized features, manage bookings, and view your profile.(will edit later)",
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
          "Browse through our premium golf courses. Each card shows important course details like the number of holes and par.(will edit later)",
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
        title: "Golf Tour",
        description:
          "Browse through our premium golf courses. Each card shows important course details like the number of holes and par.(will edit later)",
        position: "bottom",
      },
    },
    // {
    //   element: ".hole",
    //   popover: {
    //     title: "Hole",
    //     description:
    //       "Browse through our premium golf courses. Each card shows important course details like the number of holes and par.(will edit later)",
    //     position: "bottom",
    //   },
    // },
    // {
    //   element: ".price",
    //   popover: {
    //     title: "Price",
    //     description:
    //       "Browse through our premium golf courses. Each card shows important course details like the number of holes and par.(will edit later)",
    //     position: "bottom",
    //   },
    // },
    // {
    //   element: ".panel-button",
    //   popover: {
    //     title: "Panel Button",
    //     description:
    //       "Browse through our premium golf courses. Each card shows important course details like the number of holes and par.(will edit later)",
    //     position: "bottom",
    //   },
    // },
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

// Profile page tour
export const createProfileTour = (forceStart: boolean = false): any => {
  if (!forceStart && !isFirstVisit("profile")) return null;

  // Define the steps
  const steps = [
    {
      element: ".profile-summary",
      popover: {
        title: "Your Profile",
        description:
          "This is your profile dashboard where you can manage your personal information.",
        position: "right",
      },
    },
    {
      element: 'button:contains("Edit")',
      popover: {
        title: "Edit Profile",
        description: "Click here to update your profile details.",
        position: "left",
      },
    },
    {
      element: 'h3:contains("Bookings")',
      popover: {
        title: "Your Bookings",
        description: "View and manage all your tee time bookings here.",
        position: "bottom",
      },
    },
  ];

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

// Booking process tour
export const createBookingProcessTour = (forceStart: boolean = false): any => {
  if (!forceStart && !isFirstVisit("booking-process")) return null;

  // Define the steps
  const steps = [
    {
      element: "h1",
      popover: {
        title: "Booking Process",
        description:
          "Follow these steps to complete your tee time reservation.",
        position: "bottom",
      },
    },
    {
      element: '.date-picker, [role="calendar"]',
      popover: {
        title: "Select Date",
        description: "Choose your preferred golf day from the available dates.",
        position: "right",
      },
    },
    {
      element: ".time-selector, select, .dropdown",
      popover: {
        title: "Choose Time",
        description: "Select your preferred tee time from the available slots.",
        position: "top",
      },
    },
  ];

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
