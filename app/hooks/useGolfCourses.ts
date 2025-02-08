// app/hooks/useGolfCourses.ts
import { useQuery } from "@tanstack/react-query";
import { getGolfCourses } from "@/app/lib/api";

export function useGolfCourses() {
  return useQuery({
    queryKey: ["golfCourses"],
    queryFn: getGolfCourses,
  });
}
