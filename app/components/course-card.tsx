"use client";

import React from "react";
import { Card, Image, CardBody } from "@heroui/react";

interface CourseCardProps {
  course: any;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="w-full max-w-[90%] transition-all duration-300 hover:scale-[1.01] ">
      <CardBody className="flex flex-row flex-wrap p-5 sm:flex-nowrap">
        <Image
          removeWrapper
          alt={course.golfCourseName}
          className="h-auto w-full flex-none object-cover object-top md:w-[25%]"
          src={course.golfCourseImageUid || "https://media.istockphoto.com/id/176834848/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%81%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%9F%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%97%E0%B8%B5%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%99%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%87%E0%B8%9A%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%AA%E0%B8%87%E0%B9%81%E0%B8%94%E0%B8%94.jpg?s=1024x1024&w=is&k=20&c=gDNRJfz9zoIpb2VkGUTJ7bSnXGKk7AgNHLVBf1kAT8E="}
        />
        <div className="px-5 py-3">
          <h2 className="text-3xl font-medium">{course.golfCourseName}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              <strong>Holes:</strong> {course.numberOfHoles}
            </span>
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              <strong>Par:</strong> {course.golfCoursePar}
            </span>
            <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
              <strong>Virtual:</strong> {course.isVirtual ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <p className="text-m mt-3">
              {course.golfCourseDescription || "Nestled in the heart of lush greenery, Hackathon Golf Club offers an exceptional golfing experience for players of all skill levels. This 18-hole, par-72 championship course is designed to challenge and inspire, featuring strategically placed bunkers, rolling fairways, and scenic water hazards. \n\nWith a picturesque landscape and meticulously maintained greens, golfers can enjoy a serene yet competitive round of golf..."}
            </p>
          </div>

        </div>
      </CardBody>
    </Card>
  );
}
