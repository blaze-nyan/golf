import GolfCoursesPage from "@/app/components/golf";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Golf",
  description:
    "GolfPage",
};
export default function GolfCourse(){
  return (
    <GolfCoursesPage></GolfCoursesPage>
  )
}