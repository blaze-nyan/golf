/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Card, Image, CardBody } from "@heroui/react";
import { usePlaceholderGolfCourseImageLink } from "../lib/general";
import { useLanguage } from "../contexts/LanguageContext";
//tour
import { createGolfCourseTour } from "@/app/lib/advance-tour-service";
import { logger } from "@/app/lib/logger";

interface CourseCardProps {
  course: any;
  ready: boolean;
}

export default function CourseCard({ course, ready }: CourseCardProps) {
  const image = usePlaceholderGolfCourseImageLink();
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  // Get description from course or use fallback
  const description =
    course.golfCourseDescription || t("defaultCourseDescription");

  // Check if description is long enough to potentially need truncation
  // This is a simple heuristic - if text is over 200 chars, assume it might overflow
  const isLongDescription = description.length > 200;

  useEffect(() => {
    if (!ready) return; // Ensure data is loaded and component is mounted
    if (ready) {
      logger.log("i am ready");
    }

    // Start the tour only after golf courses are ready
    const tour = createGolfCourseTour();
    if (tour) {
      const tourTimeout = setTimeout(() => {
        tour.drive();
      }, 3000); // Short delay to ensure DOM is updated

      return () => clearTimeout(tourTimeout);
    }
  }, [ready]);

  return (
    <Card className="w-full max-w-[90%] transition-all duration-300 hover:scale-[1.01] sm:min-h-[250px] sm:max-h-[250px] min-h-[550px] max-h-[550px] course-card">
      <CardBody className="flex flex-row flex-wrap p-5 sm:flex-nowrap h-full overflow-hidden">
        <Image
          removeWrapper
          alt={course.golfCourseName}
          className="h-auto w-full flex-none object-cover object-top md:w-[25%] min-w-[210px] "
          src={course.golfCourseImageUid || image}
        />
        <div className="px-5 py-3 flex flex-col overflow-hidden w-full">
          <h2 className="text-3xl font-medium">{course.golfCourseName}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="border border-green-500 text-green-500 px-3 py-1 rounded-full text-sm">
              <strong>{t("holes")}:</strong> {course.numberOfHoles}
            </span>
            <span className="border border-green-600 text-green-600 px-3 py-1 rounded-full text-sm">
              <strong>{t("par")}:</strong> {course.golfCoursePar}
            </span>
          </div>
          <div className="relative flex-grow overflow-hidden">
            <p
              className={`text-m mt-3 ${
                !isExpanded ? "line-clamp-3 sm:line-clamp-2" : ""
              }`}
            >
              {description}
            </p>

            {isLongDescription && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-green-500 hover:text-green-600 mt-1 font-medium"
              >
                {isExpanded ? t("seeLess") : t("seeMore")}
              </button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
