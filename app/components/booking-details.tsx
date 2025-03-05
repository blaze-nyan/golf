/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Image } from "@heroui/react";
import { useProgress } from "../golfcourse/context/progress-context";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  dateToString,
  convertMinutesToTimeWithAMPM,
  convertExcelDateToJSDate,
} from "./date-functionalities";
import { usePlaceholderGolfCourseImageLink } from "../lib/general";

const BookingDetails = () => {
  const { bookingDetails, currentStep } = useProgress();

  // Helper function to determine if a section should be grayed out
  const isSectionDisabled = (step: any) => currentStep < step;

  return (
    <div className="flex justify-center h-full w-full pt-5 md:pt-0">
      <Card className="p-0 transition-transform duration-200 bg-white dark:bg-gray-800 w-full overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header Section */}
        <div className="bg-green-700 dark:bg-green-800 text-white py-3 text-center">
          <span className="font-semibold text-xl">Your Booking</span>
        </div>

        {/* Course Information Section */}
        <div
          className={`p-4 sm:p-5 border-b border-gray-300 dark:border-gray-700 flex items-center gap-3 sm:gap-4 ${
            isSectionDisabled(0) ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <Image
            removeWrapper
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-md object-cover"
            src={usePlaceholderGolfCourseImageLink()}
            alt="booking"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-base sm:text-lg text-gray-700 dark:text-gray-200">
              {bookingDetails.courseName || "Course Name Placeholder"}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
              {bookingDetails.courseLocation || "N/A"}
            </span>
          </div>
        </div>

        {/* Date & Time Section */}
        <div
          className={`p-3 px-4 sm:px-6 border-b border-gray-300 dark:border-gray-700 flex flex-col items-start space-y-2 ${
            isSectionDisabled(1) ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <span className="font-semibold text-sm sm:text-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Icon
              icon="mdi-golf"
              className="text-green-600 dark:text-green-500"
            />{" "}
            Booking Type:{" "}
            {bookingDetails.bookingType == 1 ? "9-Hole" : "18-Hole"}
          </span>
          <span className="font-semibold text-sm sm:text-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Icon
              icon="mdi-calendar"
              className="text-green-600 dark:text-green-500"
            />{" "}
            Tee Date:{" "}
            {bookingDetails.teeDate
              ? dateToString(convertExcelDateToJSDate(bookingDetails.teeDate))
              : "Select a date"}
          </span>
          <span className="font-semibold text-sm sm:text-medium text-gray-700 dark:text-gray-200 mt-2 flex items-center gap-2">
            <Icon
              icon="mdi-clock"
              className="text-green-600 dark:text-green-500"
            />{" "}
            Tee Time:{" "}
            {bookingDetails.teeTime
              ? convertMinutesToTimeWithAMPM(bookingDetails.teeTime)
              : "Select a time"}
          </span>
        </div>

        {/* Booking Details Section */}
        <div
          className={`p-3 px-4 sm:px-6 border-b border-gray-300 dark:border-gray-700 flex flex-col items-start space-y-2 ${
            isSectionDisabled(2) ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-medium flex items-center gap-2">
            <Icon
              icon="mdi-golf"
              className="text-green-600 dark:text-green-500"
            />{" "}
            <strong className="dark:text-gray-200">Golfers:</strong>{" "}
            {bookingDetails.numberOfGolfers || 1}
          </span>
          <span className="text-gray-700 dark:text-gray-300 mt-2 text-sm sm:text-medium flex items-center gap-2">
            <Icon
              icon="mdi-person"
              className="text-green-600 dark:text-green-500"
            />{" "}
            <strong className="dark:text-gray-200">
              Accompanying Persons:
            </strong>{" "}
            {bookingDetails.numberOfnonPlayers || 0}
          </span>
          <span className="text-gray-700 dark:text-gray-300 mt-2 text-sm sm:text-medium flex items-center gap-2">
            <Icon
              icon="mdi-backpack"
              className="text-green-600 dark:text-green-500"
            />{" "}
            <strong className="dark:text-gray-200">Caddies:</strong>{" "}
            {bookingDetails["Caddies"] || 0}
          </span>
          <span className="text-gray-700 dark:text-gray-300 mt-2 text-sm sm:text-medium flex items-center gap-2">
            <Icon
              icon="mdi-car"
              className="text-green-600 dark:text-green-500"
            />{" "}
            <strong className="dark:text-gray-200">Golf Carts:</strong>{" "}
            {bookingDetails["Golf Cart"] || 1}
          </span>
          <span className="text-gray-700 dark:text-gray-300 mt-2 text-sm sm:text-medium flex items-center gap-2">
            <Icon
              icon="mdi-food"
              className="text-green-600 dark:text-green-500"
            />{" "}
            <strong className="dark:text-gray-200">Food & Drinks:</strong>{" "}
            {bookingDetails["Food & Drinks"] || 0}
          </span>
        </div>

        {/* Price Section */}
        <div
          className={`p-3 px-4 sm:px-6 border-gray-300 dark:border-gray-700 flex flex-col items-start space-y-2 ${
            isSectionDisabled(3) ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <span className="font-semibold text-sm sm:text-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Icon
              icon="mdi-currency-btc"
              className="text-green-600 dark:text-green-500"
            />{" "}
            <strong>Total Price:</strong>{" "}
            {bookingDetails.price ? `${bookingDetails.price} THB` : "0 THB"}
          </span>
        </div>
      </Card>
    </div>
  );
};

export default BookingDetails;
