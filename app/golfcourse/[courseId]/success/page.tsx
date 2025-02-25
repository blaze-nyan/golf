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

const Page = () => {
  const { bookingDetails, currentStep } = useProgress();
  const isSectionDisabled = (step: any) => currentStep < step;
  const router = useRouter();

  // State for triggering confetti
  const [showConfetti, setShowConfetti] = useState(false);

  const goToProfile = () => {
    router.push("/profile");
  };

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
    <div>
      {/* Confetti effect */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth} // Dynamically set width
          height={window.innerHeight} // Dynamically set height
          gravity={0.2} // Adjust gravity for direction
          numberOfPieces={200} // Adjust the number of confetti pieces
          recycle={false} // Make it fall only once
          initialVelocityX={5} // Customize confetti's starting angle
          initialVelocityY={20} // Customize confetti's upward motion
          confettiSource={{
            x: 0,
            y: window.innerHeight,
            w: window.innerWidth,
            h: 0,
          }} // Start from the bottom left
        />
      )}
      <div className="flex flex-col items-center space-y-4 m-0">
        <Card className="p-0 w-[80%] bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-700 text-white py-3 text-center text-lg font-bold">
            Your Booking was Successful!
          </div>

          <div className="p-4 space-y-2 text-sm text-gray-700">
            {/* Course Section */}
            <SectionWrapper disabled={isSectionDisabled(0)}>
              <div className="flex gap-3 items-center">
                <Image
                  removeWrapper
                  className="h-16 w-16 rounded-md object-cover"
                  src={usePlaceholderGolfCourseImageLink()}
                  alt="image"
                />
                <div>
                  <div className="font-semibold">
                    {bookingDetails.courseName || "Course Name"}
                  </div>
                  <div className="text-gray-500">
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
                  value={
                    bookingDetails.bookingType === 1 ? "9-Hole" : "18-Hole"
                  }
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
              <div className="flex items-center gap-2 font-semibold text-medium">
                <Icon
                  icon="mdi-currency-btc"
                  className="text-green-600 textlg"
                />
                <span>
                  Total:{" "}
                  {bookingDetails.price ? `${bookingDetails.price} THB` : "N/A"}
                </span>
              </div>
            </SectionWrapper>
            <Button
              className="w-full bg-green-700 text-white py-2 rounded-md mt-4 hover:bg-green-800"
              onClick={goToProfile}
            >
              Back to Profile
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page;

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
  <div className="grid grid-cols-2 gap-2">{children}</div>
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
    <Icon icon={icon} className="text-green-600 text-lg" />
    <span>
      <strong>{label}:</strong> {value}
    </span>
  </div>
);
