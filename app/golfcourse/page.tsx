// app/golfcourse/page.tsx
import Link from "next/link";
import { getGolfCourses } from "@/app/lib/api";
//components
import CourseCard from "../components/course-card";
export default async function GolfCoursesPage() {
  const courses = await getGolfCourses();
  const courseName = courses[0].golfCourseName;
  const courseId = courses[0].golfCourseId;

  return (
    <div>
      {courses.map(() => (
        <Link key={courseId} href={`/golfcourse/${courseId}`}>
          <CourseCard key={courseName} title={courseName} content="hello" />
        </Link>
      ))}
    </div>
  );
}
