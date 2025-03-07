/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { NextButton } from "../components/NextButton";
import { Image } from "@heroui/react";
import { useProgress } from "@/app/golfcourse/context/progress-context";
import { getGolfCourseSingle } from "@/app/lib/api";

import GolfFeesTable from "@/app/components/golf-fee-table";
import { usePlaceholderGolfCourseImageLink } from "@/app/lib/general";
import AnimatedLoading from "@/app/components/animated-loading";

// Placeholder data for the golf course
const placeholderGolfCourse = {
  golfCourseId: 1,
  golfCourseName: "Sunny Meadows Golf Club",
  golfCourseDescription:
    "Nestled in the heart of lush greenery, Hackathon Golf Course offers an exceptional golfing experience for players of all skill levels. This 18-hole, par-72 championship course is designed to challenge and inspire, featuring strategically placed bunkers, rolling fairways, and scenic water hazards. \n\nWith a picturesque landscape and meticulously maintained greens, golfers can enjoy a serene yet competitive round of golf...",
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
  const { courseId, setBookingDetails } = useProgress(); //currentStep, canAccess,
  const [golfCourse, setGolfCourse] = useState<any | null>();
  const [selectedHole, setSelectedHole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const data = await getGolfCourseSingle(courseId);
        setGolfCourse(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching golf courses:", error);
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [courseId]);

  useEffect(() => {
    if (golfCourse) {
      setBookingDetails((prevBookingDetails: any) => ({
        ...prevBookingDetails,
        courseId: courseId,
        courseName: golfCourse.golfCourseName,
        courseLocation:
          "52 347 Phahonyothin Rd, Tambon Lak Hok, Amphoe Mueang Pathum Thani",
      }));
    }
  }, [golfCourse, courseId, setBookingDetails]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <AnimatedLoading />
      </div>
    );
  }

  if (!golfCourse) {
    return (
      <div className="p-4 text-center text-red-600 dark:text-red-400">
        Only the Hackathon golf course is available in the prototype.
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const image = () => usePlaceholderGolfCourseImageLink();

  return (
    <div className="px-4 md:px-6 pb-2 max-w-6xl space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-4">
        {golfCourse.golfCourseName || placeholderGolfCourse.golfCourseName}
      </h1>

      <div className="flex flex-wrap gap-2 sm:gap-4">
        <div className="flex items-center">
          <span className="px-2 sm:px-4 py-1 sm:py-2 border border-green-500 text-green-500 dark:border-green-400 dark:text-green-400 text-xs sm:text-sm font-semibold rounded-full shadow-sm">
            Holes:{" "}
            {golfCourse.numberOfHoles || placeholderGolfCourse.numberOfHoles}
          </span>
        </div>
        <div className="flex items-center">
          <span className="px-2 sm:px-4 py-1 sm:py-2 border border-green-600 text-green-600 dark:border-green-500 dark:text-green-500 text-xs sm:text-sm font-semibold rounded-full shadow-sm">
            Par:{" "}
            {golfCourse.golfCoursePar || placeholderGolfCourse.golfCoursePar}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg shadow-md dark:shadow-gray-800">
        <Image
          removeWrapper
          className="h-auto w-full object-cover object-center"
          src={image()}
          alt="Golf course"
        />
      </div>

      <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
          {golfCourse.golfCourseDescription ||
            placeholderGolfCourse.golfCourseDescription}
        </p>
      </div>

      <div className="py-2">
        <GolfFeesTable />
      </div>

      <div className="overflow-hidden flex justify-between">
        <div className="h-auto w-[48%] space-y-3">
          <Image
            removeWrapper
            className=" object-cover object-center"
            src={"/1_0.webp"}
            alt="Golf course"
          />
          <h2 className="text-l font-semibold text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 pb-2">
            Outward Holes
          </h2>
        </div>
        <div className="h-auto w-[48%] space-y-3">
          <Image
            removeWrapper
            className=" object-cover object-center"
            src={"/2_0.webp"}
            alt="Golf course"
          />
          <h2 className="text-l font-semibold text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 pb-2">
            Inward Holes
          </h2>
        </div>
      </div>

      {/* Holes Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
            Outward Holes
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
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
                    className={`px-2 py-2 text-xs sm:text-sm font-medium sm:font-semibold shadow-sm rounded-md transition-all duration-300 ${
                      selectedHole === hole
                        ? "bg-green-500 text-white scale-105"
                        : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
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
          </div>

          <button
            className={`mt-2 px-3 py-2 text-sm font-semibold shadow-md rounded-md transition-all duration-300 transform ${
              selectedHole === "Outward Holes"
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
            }`}
            onClick={() => {
              let totalPar = 0;
              let totalStroke = 0;
              let totalDistance = 0;

              golfCourse.golfCourseHoles[0].Row.forEach(
                (hole: any, index: any) => {
                  const outIndex =
                    golfCourse.golfCourseHoles[0].Row.indexOf("Out");
                  if (
                    index < outIndex &&
                    !["Detail Type", "In", "Out", "Total"].includes(hole)
                  ) {
                    totalPar += parseInt(
                      golfCourse.golfCourseHoles[1].Row[index]
                    );
                    totalStroke += parseInt(
                      golfCourse.golfCourseHoles[2].Row[index]
                    );
                    totalDistance += parseInt(
                      golfCourse.golfCourseHoles[3].Row[index]
                    );
                  }
                }
              );

              const combinedData = `Total Par: ${totalPar}, Total Stroke: ${totalStroke}, Total Distance: ${totalDistance} yards`;
              setSelectedHole(combinedData);
            }}
          >
            View All Outward Holes
          </button>

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mt-6">
            Inward Holes
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
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
                    className={`px-2 py-2 text-xs sm:text-sm font-medium sm:font-semibold shadow-sm rounded-md transition-all duration-300 ${
                      selectedHole === hole
                        ? "bg-green-500 text-white scale-105"
                        : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
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
          </div>

          <button
            className={`mt-2 px-3 py-2 text-sm font-semibold shadow-md rounded-md transition-all duration-300 transform ${
              selectedHole === "Inward Holes"
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
            }`}
            onClick={() => {
              let totalPar = 0;
              let totalStroke = 0;
              let totalDistance = 0;

              golfCourse.golfCourseHoles[0].Row.forEach(
                (hole: any, index: any) => {
                  const outIndex =
                    golfCourse.golfCourseHoles[0].Row.indexOf("Out");
                  if (
                    index > outIndex &&
                    !["Detail Type", "In", "Out", "Total"].includes(hole)
                  ) {
                    totalPar += parseInt(
                      golfCourse.golfCourseHoles[1].Row[index]
                    );
                    totalStroke += parseInt(
                      golfCourse.golfCourseHoles[2].Row[index]
                    );
                    totalDistance += parseInt(
                      golfCourse.golfCourseHoles[3].Row[index]
                    );
                  }
                }
              );

              const combinedData = `Total Par: ${totalPar}, Total Stroke: ${totalStroke}, Total Distance: ${totalDistance} yards`;
              setSelectedHole(combinedData);
            }}
          >
            View All Inward Holes
          </button>
        </div>

        {selectedHole && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Hole Details
            </h4>
            <p className="text-gray-700 dark:text-gray-300">{selectedHole}</p>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="space-y-3">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
          Golf Course Notes
        </h3>
        {golfCourse.golfCourseNotes && golfCourse.golfCourseNotes.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-base md:text-lg text-gray-700 dark:text-gray-300">
            {golfCourse.golfCourseNotes.map((note: any, index: any) => (
              <li key={index} className="py-1">
                {note}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300">
            No notes available.
          </p>
        )}
        <div className="pt-4 md:hidden">
          <NextButton />
        </div>
        <div className="pt-4 hidden bottom-4 right-4 md:static md:bottom-auto md:right-auto md:flex md:justify-start">
          <NextButton />
        </div>
      </div>

      {/* Next Button with proper spacing */}
    </div>
  );
};

export default CoursePage;
