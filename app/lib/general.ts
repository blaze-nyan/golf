import { getClientId } from "./auth";

export const checkClientId = (): string | null => {
  return getClientId();
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
