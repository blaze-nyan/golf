"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react"; // Import Iconify for icons
import Link from "next/link";
import { getGolfCourses } from "@/app/lib/api";
// components
import CourseCard from "../components/course-card";
import { Spinner } from "@heroui/react";

interface GolfCourse {
  golfCourseId: number;
  golfCourseName: string;
  golfCourseDescription: string;
  golfCourseFeeStockId: number;
  allowCrossOver: boolean;
  numberOfHoles: number;
  golfCoursePar: number;
  isVirtual: boolean;
  golfCourseImageUid: string;
  golfCourseStockStatusId: number;
  golfCourseHoles: any[];
  golfCourseNotes: any[];
}

export default function GolfCoursesPage() {
  const [courses, setCourses] = useState<GolfCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State to track if courses are still loading

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getGolfCourses();

        const comingSoonCourse: GolfCourse = {
          golfCourseId: -1,
          golfCourseName: "Coming Soon...",
          golfCourseDescription: "New exciting course on the way!",
          golfCourseFeeStockId: 0,
          allowCrossOver: false,
          numberOfHoles: 18,
          golfCoursePar: 72,
          isVirtual: false,
          golfCourseImageUid: "", // Optionally, add a placeholder image UID
          golfCourseStockStatusId: 0,
          golfCourseHoles: [],
          golfCourseNotes: [],
        };

        // Append the placeholder course to the courses array
        setCourses([...data, comingSoonCourse]);
      } catch (error) {
        console.error("Error fetching golf courses:", error);
      } finally {
        setLoading(false); // Once the data is fetched, set loading to false
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-10 gap-4">
      {/* Section for explanation about golf courses */}
      <section className="text-center mb-5 max-w-4xl">
        <h2 className="text-4xl font-semibold">Discover Our Golf Courses</h2>
        <p className="text-lg text-gray-600 mt-3">
          We offer a wide selection of beautifully designed golf courses that cater to players of all skill levels. Whether you’re looking for a challenging championship course or a relaxing day on the links, our courses promise an unforgettable experience. Our facilities include stunning fairways, state-of-the-art driving ranges, and clubhouses equipped with everything you need for a great round of golf.
        </p>
        <p className="text-lg text-gray-600 mt-3">
          Explore our courses below and find the perfect course for your next round!
        </p>
      </section>

      {/* Dropdown Icon to indicate scrolling down */}
      {!loading && (
        <div className="flex justify-center mb-2">
          <Icon
            icon="mdi:chevron-down"
            className="text-4xl cursor-pointer animate-bounce"
          />
        </div>
      )}

      {/* Loading state */}
      {loading ? (
      <div className="flex justify-center mb-5">
        <Spinner size="lg" />
      </div>
      ) : (
        // Golf Course Cards Section
        courses.map((course) => (
          <Link
            key={course.golfCourseId}
            href={
              course.golfCourseId === -1
                ? "#"
                : `/golfcourse/${course.golfCourseId}`
            }
            className="flex justify-center w-full"
          >
            <CourseCard course={course} />
          </Link>
        ))
      )}
    </div>
  );
}
