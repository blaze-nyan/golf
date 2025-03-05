/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, Image, CardBody } from "@heroui/react";
import { usePlaceholderGolfCourseImageLink } from "../lib/general";

interface CourseCardProps {
  course: any;
}

export default function CourseCard({ course }: CourseCardProps) {
  const image = usePlaceholderGolfCourseImageLink();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const description =
    course.golfCourseDescription ||
    "Nestled in the heart of lush greenery, Hackathon Golf Course offers an exceptional golfing experience for players of all skill levels. This 18-hole, par-72 championship course is designed to challenge and inspire, featuring strategically placed bunkers, rolling fairways, and scenic water hazards. \n\nWith a picturesque landscape and meticulously maintained greens, golfers can enjoy a serene yet competitive round of golf...";

  // Check if content overflows
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const hasTextOverflow =
          textRef.current.scrollHeight > textRef.current.clientHeight;
        setHasOverflow(hasTextOverflow);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [description]);

  return (
    <Card className="w-full max-w-[90%] transition-all duration-300 hover:scale-[1.01] sm:min-h-0 min-h-[550px] max-h-[550px] ">
      <CardBody className="flex flex-row flex-wrap p-5 sm:flex-nowrap overflow-hidden">
        <Image
          removeWrapper
          alt={course.golfCourseName}
          className="h-auto w-full flex-none object-cover object-top md:w-[25%]"
          src={course.golfCourseImageUid || image}
        />
        <div className="px-5 py-3 flex flex-col overflow-hidden">
          <h2 className="text-3xl font-medium">{course.golfCourseName}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="border border-green-500 text-green-500 px-3 py-1 rounded-full text-sm">
              <strong>Holes:</strong> {course.numberOfHoles}
            </span>
            <span className="border border-green-600 text-green-600 px-3 py-1 rounded-full text-sm">
              <strong>Par:</strong> {course.golfCoursePar}
            </span>
          </div>
          <div className="relative flex-grow overflow-hidden">
            <p
              ref={textRef}
              className={`text-m mt-3 ${!isExpanded ? "line-clamp-5" : ""}`}
            >
              {description}
            </p>

            {hasOverflow && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-green-500 hover:text-green-600 mt-1 font-medium"
              >
                {isExpanded ? "See less" : "See more..."}
              </button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
