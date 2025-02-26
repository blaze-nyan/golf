/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Image } from "@heroui/react";
import { useProgress } from "../../context/progress-context";
import { Icon } from "@iconify/react/dist/iconify.js";
import Confetti from "react-confetti";
import {
  dateToString,
  convertMinutesToTimeWithAMPM,
  convertExcelDateToJSDate,
} from "../../../components/date-functionalities";
import { useRouter } from "next/navigation";
import { usePlaceholderGolfCourseImageLink } from "@/app/lib/general";

const page = () => {
  const { bookingDetails, currentStep } = useProgress();
  const isSectionDisabled = (step: any) => currentStep < step;
  const router = useRouter();

  // State for triggering confetti and window dimensions
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimension, setWindowDimension] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const goToProfile = () => {
    router.push("/profile");
  };

  const detectSize = () => {
    if (typeof window !== "undefined") {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  };

  useEffect(() => {
    // Set up window resize listener for responsive confetti
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, []);

  useEffect(() => {
    // Trigger the confetti effect once the page has successfully loaded
    setShowConfetti(true);

    // Optionally, stop the confetti after a few seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Stop after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen py-6 px-4 flex flex-col items-center justify-center bg-gray-50">
      {/* Confetti effect */}
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          gravity={0.2}
          numberOfPieces={150} // Reduced for mobile performance
          recycle={false}
          initialVelocityX={5}
          initialVelocityY={20}
          confettiSource={{
            x: 0,
            y: windowDimension.height,
            w: windowDimension.width,
            h: 0,
          }}
        />
      )}

      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-green-700 text-white py-4 text-center text-lg md:text-xl font-bold">
          Your Booking was Successful!
        </div>

        <div className="p-4 space-y-4 text-sm md:text-base text-gray-700">
          {/* Course Section */}
          <SectionWrapper disabled={isSectionDisabled(0)}>
            <div className="flex gap-3 items-center">
              <Image
                removeWrapper
                className="h-16 w-16 rounded-md object-cover"
                src={usePlaceholderGolfCourseImageLink()}
                alt="golf course"
              />
              <div>
                <div className="font-semibold">
                  {bookingDetails.courseName || "Course Name"}
                </div>
                <div className="text-gray-500 text-sm">
                  {bookingDetails.courseLocation || "N/A"}
                </div>
              </div>
            </div>
          </SectionWrapper>

          {/* Date & Time Section */}
          <SectionWrapper disabled={isSectionDisabled(1)}>
            <InfoGrid>
              <InfoItem
                icon="mdi-golf"
                label="Type"
                value={bookingDetails.bookingType === 1 ? "9-Hole" : "18-Hole"}
              />
              <InfoItem
                icon="mdi-calendar"
                label="Date"
                value={
                  dateToString(
                    convertExcelDateToJSDate(bookingDetails.teeDate)
                  ) || "Select"
                }
              />
              <InfoItem
                icon="mdi-clock"
                label="Time"
                value={
                  convertMinutesToTimeWithAMPM(bookingDetails.teeTime) ||
                  "Select"
                }
              />
            </InfoGrid>
          </SectionWrapper>

          {/* Booking Details */}
          <SectionWrapper disabled={isSectionDisabled(2)}>
            <InfoGrid>
              <InfoItem
                icon="mdi-golf"
                label="Golfers"
                value={bookingDetails.numberOfGolfers}
              />
              <InfoItem
                icon="mdi-person"
                label="Guests"
                value={bookingDetails.numberOfnonPlayers}
              />
              <InfoItem
                icon="mdi-backpack"
                label="Caddies"
                value={bookingDetails["Caddies"]}
              />
              <InfoItem
                icon="mdi-car"
                label="Carts"
                value={bookingDetails["Golf Cart"]}
              />
              <InfoItem
                icon="mdi-food"
                label="Food"
                value={bookingDetails["Food & Drinks"]}
              />
            </InfoGrid>
          </SectionWrapper>

          {/* Price */}
          <SectionWrapper disabled={isSectionDisabled(3)}>
            <div className="flex items-center justify-center gap-2 font-semibold text-base md:text-lg">
              <Icon
                icon="mdi-currency-btc"
                className="text-green-600 text-xl"
              />
              <span>
                Total:{" "}
                {bookingDetails.price ? `${bookingDetails.price} THB` : "N/A"}
              </span>
            </div>
          </SectionWrapper>

          <div className="pt-2">
            <Button
              className="w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-800 text-base"
              onPress={goToProfile}
            >
              Back to Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Booking ID */}
      <div className="mt-4 text-sm text-gray-500">
        Booking ID: #{bookingDetails.id || "000000"}
      </div>
    </div>
  );
};

export default page;

/** Section Wrapper */
const SectionWrapper = ({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled: boolean;
}) => (
  <div
    className={`p-3 border border-gray-200 rounded-lg ${
      disabled ? "opacity-50 pointer-events-none" : "bg-gray-50"
    }`}
  >
    {children}
  </div>
);

/** Info Grid for compact layout */
const InfoGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
);

/** Info Item */
const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center gap-2">
    <Icon icon={icon} className="text-green-600 text-lg flex-shrink-0" />
    <span className="truncate">
      <strong>{label}:</strong> {value}
    </span>
  </div>
);
