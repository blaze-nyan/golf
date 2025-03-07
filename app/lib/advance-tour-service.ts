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
  const steps = [
    {
      element: ".hero-section",
      popover: {
        title: "Welcome to Splash Golf Club!",
        description:
          "Discover a premium golfing experience. This tour will help you explore our platform.",
        position: "bottom",
      },
    },
    {
      element: 'a[href="/golfcourse"]',
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
  ];

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
  const steps = [
    {
      element: ".course-card",
      popover: {
        title: "Golf Course Selection",
        description:
          "Browse through our premium golf courses. Each card shows important course details like the number of holes and par.",
        position: "right",
      },
    },
    {
      element: ".course-card span.border.border-green-500",
      popover: {
        title: "Course Information",
        description:
          "These badges indicate key course information like the number of holes and par rating.",
        position: "bottom",
      },
    },
    {
      element: ".course-card p.text-m",
      popover: {
        title: "Course Description",
        description:
          "Read about what makes each course special, including terrain features and difficulty level.",
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
