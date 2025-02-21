"use client";
import React, { useEffect, useState } from "react";
import { NextButton } from "../components/NextButton";
import { DatePicker, Image } from "@heroui/react";
import { STEPS, useProgress } from "@/app/golfcourse/context/progress-context";
import { getGolfCourseSingle } from "@/app/lib/api";
import { Spinner } from "@heroui/react";

// Placeholder data for the golf course
const placeholderGolfCourse = {
  golfCourseId: 1,
  golfCourseName: "Sunny Meadows Golf Club",
  golfCourseDescription:
    "A beautiful 18-hole course with scenic views and challenging holes.",
  golfCourseFeeStockId: 12345,
  allowCrossOver: true,
  numberOfHoles: 18,
  golfCoursePar: 72,
  isVirtual: false,
  golfCourseImageUid: "abc123xyz456", // This would be a unique ID, but here it's just a placeholder.
  golfCourseStockStatusId: 789,
  golfCourseHoles: [
    "Hole 1: Par 4, 400 yards",
    "Hole 2: Par 3, 150 yards",
    "Hole 3: Par 5, 500 yards",
    "Hole 4: Par 4, 420 yards",
    "Hole 5: Par 4, 380 yards",
    "Hole 6: Par 3, 175 yards",
    "Hole 7: Par 5, 550 yards",
    "Hole 8: Par 4, 440 yards",
    "Hole 9: Par 4, 400 yards",
    "Hole 10: Par 3, 160 yards",
    "Hole 11: Par 4, 420 yards",
    "Hole 12: Par 4, 410 yards",
    "Hole 13: Par 5, 520 yards",
    "Hole 14: Par 4, 430 yards",
    "Hole 15: Par 4, 450 yards",
    "Hole 16: Par 3, 180 yards",
    "Hole 17: Par 5, 510 yards",
    "Hole 18: Par 4, 460 yards",
  ],
  golfCourseNotes: [
    "Golf carts available for rent.",
    "The course is open every day from 7 AM to 7 PM.",
    "Dress code is enforced; collared shirts and golf shoes required.",
  ],
};


const CoursePage = () => {
  const { currentStep, canAccess, courseId, setBookingDetails } = useProgress();
  const [golfCourse, setGolfCourse] = useState<any | null>();
  const [selectedHole, setSelectedHole] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {

        const data = await getGolfCourseSingle(courseId);
        // Append the placeholder course to the courses array

        setGolfCourse(data);
      } catch (error) {
        console.error("Error fetching golf courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (golfCourse) {
      setBookingDetails((prevBookingDetails: any) => ({
        ...prevBookingDetails,
        courseName: golfCourse.golfCourseName,
      }));
    }
  }, [golfCourse]);

  if (!golfCourse) {
    return (
      <div className="flex justify-center items-center h-[100%]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-[100%] mx-auto space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">{golfCourse.golfCourseName || placeholderGolfCourse.numberOfHoles}</h1>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full shadow-md">
            Number of Holes: {golfCourse.numberOfHoles || placeholderGolfCourse.numberOfHoles}
          </span>
        </div>
        <div className="flex items-center">
          <span className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full shadow-md">
            Golf Course Par: {golfCourse.golfCoursePar || placeholderGolfCourse.numberOfHoles}
          </span>
        </div>
        <div className="flex items-center">
          <span className="px-4 py-2 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full shadow-md">
            {golfCourse.isVirtual ? "Virtual" : "Non-Virtual"}
          </span>
        </div>
        <div className="flex items-center">
          <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full shadow-md">
            {golfCourse.allowCrossOver ? "Cross Over" : "Non-Cross Over"}
          </span>
        </div>
      </div>

      <Image
        removeWrapper
        className="h-auto w-full flex-none object-cover object-top md:w-[100%]"
        src={"https://media.istockphoto.com/id/176834848/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%81%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%9F%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%97%E0%B8%B5%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%99%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%87%E0%B8%9A%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%AA%E0%B8%87%E0%B9%81%E0%B8%94%E0%B8%94.jpg?s=1024x1024&w=is&k=20&c=gDNRJfz9zoIpb2VkGUTJ7bSnXGKk7AgNHLVBf1kAT8E="}
      />
      <p className="text-xl text-gray-600">{golfCourse.golfCourseDescription || placeholderGolfCourse.golfCourseDescription}</p>

      <div className="space-y-4">

        <div className="">
          <h1 className="text-xl text-gray-800 mb-2">Outward Holes</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {golfCourse.golfCourseHoles[0].Row.map((hole: any, index: any) => {
              // Skip the "Detail Type", "In", "Out", and "Total" items
              if (["Detail Type", "In", "Out", "Total"].includes(hole)) {
                return null;
              }

              // Get the index of "Out"
              const outIndex = golfCourse.golfCourseHoles[0].Row.indexOf("Out");

              // Check if the current hole is before "Out"
              const isOutHole = index < outIndex;

              if (isOutHole) {
                return (
                  <button
                    key={index}
                    className={`px-4 py-2 text-sm font-semibold shadow-md rounded-md transition-all duration-300 transform ${
                      selectedHole === hole
                        ? "bg-green-500 text-white scale-105"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                    onClick={() =>
                      setSelectedHole(
                        `${golfCourse.golfCourseHoles[1].Row[index]} - Par: Regular, 
                        ${golfCourse.golfCourseHoles[2].Row[index]} - Stroke: Regular, 
                        ${golfCourse.golfCourseHoles[3].Row[index]} - Distance: Regular`
                      )
                    }
                  >
                    Hole {hole}
                  </button>
                );
              }
              return null;
            })}
            <button
              className={`px-4 py-2 text-sm font-semibold shadow-md rounded-md transition-all duration-300 transform ${
                selectedHole === "Inward Holes"
                  ? "bg-green-500 text-white scale-105"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
              onClick={() => {
                let totalPar = 0;
                let totalStroke = 0;
                let totalDistance = 0;

                golfCourse.golfCourseHoles[0].Row.forEach((hole: any, index: any) => {
                  const outIndex = golfCourse.golfCourseHoles[0].Row.indexOf("Out");
                  if (index < outIndex && !["Detail Type", "In", "Out", "Total"].includes(hole)) {
                    totalPar += parseInt(golfCourse.golfCourseHoles[1].Row[index]);
                    totalStroke += parseInt(golfCourse.golfCourseHoles[2].Row[index]);
                    totalDistance += parseInt(golfCourse.golfCourseHoles[3].Row[index]);
                  }
                });

                const combinedData = `Total Par: ${totalPar}, Total Stroke: ${totalStroke}, Total Distance: ${totalDistance} yards`;
                setSelectedHole(combinedData);
              }}
            >
              Outward Holes
            </button>
          </div>
          
          <h1 className="text-xl text-gray-800 mb-2">Inward Holes</h1>
          <div className="flex flex-wrap gap-2">
            {golfCourse.golfCourseHoles[0].Row.map((hole: any, index: any) => {
              if (["Detail Type", "In", "Out", "Total"].includes(hole)) {
                return null;
              }

              const outIndex = golfCourse.golfCourseHoles[0].Row.indexOf("Out");

              const isInHole = index > outIndex;

              if (isInHole) {
                return (
                  <button
                    key={index}
                    className={`px-4 py-2 text-sm font-semibold shadow-md rounded-md transition-all duration-300 transform ${
                      selectedHole === hole
                        ? "bg-green-500 text-white scale-105"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                    onClick={() =>
                      setSelectedHole(
                        `${golfCourse.golfCourseHoles[1].Row[index]} - Par: Regular, 
                        ${golfCourse.golfCourseHoles[2].Row[index]} - Stroke: Regular, 
                        ${golfCourse.golfCourseHoles[3].Row[index]} - Distance: Regular`
                      )
                    }
                  >
                    Hole {hole}
                  </button>
                );
              }
              return null;
            })}
            <button
              className={`px-4 py-2 text-sm font-semibold shadow-md rounded-md transition-all duration-300 transform ${
                selectedHole === "Inward Holes"
                  ? "bg-green-500 text-white scale-105"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
              onClick={() => {
                let totalPar = 0;
                let totalStroke = 0;
                let totalDistance = 0;

                golfCourse.golfCourseHoles[0].Row.forEach((hole: any, index: any) => {
                  const outIndex = golfCourse.golfCourseHoles[0].Row.indexOf("Out");
                  if (index > outIndex && !["Detail Type", "In", "Out", "Total"].includes(hole)) {
                    totalPar += parseInt(golfCourse.golfCourseHoles[1].Row[index]);
                    totalStroke += parseInt(golfCourse.golfCourseHoles[2].Row[index]);
                    totalDistance += parseInt(golfCourse.golfCourseHoles[3].Row[index]);
                  }
                });

                const combinedData = `Total Par: ${totalPar}, Total Stroke: ${totalStroke}, Total Distance: ${totalDistance} yards`;
                setSelectedHole(combinedData);
              }}
            >
              Inward Holes
            </button>
          </div>
        </div>

        {selectedHole && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-gray-800">Hole Details</h4>
            <p className="text-gray-700">{selectedHole}</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">Golf Course Notes</h3>
        {golfCourse.golfCourseNotes.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
            {golfCourse.golfCourseNotes.map((note: any, index: any) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-gray-700">No notes available.</p>
        )}
      </div>

      <div className="mb-10">
        <NextButton />
      </div>
    </div>
  );
};

export default CoursePage;
