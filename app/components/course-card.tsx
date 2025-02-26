/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Card, Image, CardBody } from "@heroui/react";
import { usePlaceholderGolfCourseImageLink } from "../lib/general";

interface CourseCardProps {
  course: any;
}

export default function CourseCard({ course }: CourseCardProps) {
  const image = usePlaceholderGolfCourseImageLink();
  return (
    <Card className="w-full max-w-[90%] transition-all duration-300 hover:scale-[1.01] ">
      <CardBody className="flex flex-row flex-wrap p-5 sm:flex-nowrap">
        <Image
          removeWrapper
          alt={course.golfCourseName}
          className="h-auto w-full flex-none object-cover object-top md:w-[25%]"
          src={course.golfCourseImageUid || image}
        />
        <div className="px-5 py-3">
          <h2 className="text-3xl font-medium">{course.golfCourseName}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="border border-green-500 text-green-500 px-3 py-1 rounded-full text-sm">
              <strong>Holes:</strong> {course.numberOfHoles}
            </span>
            <span className="border border-green-600 text-green-600 px-3 py-1 rounded-full text-sm">
              <strong>Par:</strong> {course.golfCoursePar}
            </span>
          </div>
          <div>
            <p className="text-m mt-3">
              {course.golfCourseDescription ||
                "Nestled in the heart of lush greenery, Hackathon Golf Course offers an exceptional golfing experience for players of all skill levels. This 18-hole, par-72 championship course is designed to challenge and inspire, featuring strategically placed bunkers, rolling fairways, and scenic water hazards. \n\nWith a picturesque landscape and meticulously maintained greens, golfers can enjoy a serene yet competitive round of golf..."}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
