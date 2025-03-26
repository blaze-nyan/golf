import { getClientId } from "./auth";

// Return a boolean instead of string|null to avoid conditional rendering issues
export const checkClientId = (): boolean => {
  return !!getClientId();
};

export const checkClientProfilePicture = (): string | null => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("clientProfilePicture");
  }
  return null;
};

export const usePlaceholderGolfCourseImageLink = () => {
  return "/golf-course.webp";
};
