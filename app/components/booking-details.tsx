import { Card, Image } from "@heroui/react";
import { useProgress } from "../golfcourse/context/progress-context";
import { Icon } from "@iconify/react/dist/iconify.js";
import { dateToString, convertMinutesToTimeWithAMPM, convertToDateEncodingCustom, convertExcelDateToJSDate } from "./date-functionalities";
import { usePlaceholderGolfCourseImageLink } from "../lib/general";

const BookingDetails = () => {
  const { bookingDetails, currentStep } = useProgress();

  // Helper function to determine if a section should be grayed out
  const isSectionDisabled = (step: any) => currentStep < step;

  return (
    <div className="col-span-2 flex justify-center">
      <Card className="p-0 hover:scale-[1.01] transition-transform duration-200 bg-white w-[80%] overflow-hidden">
        {/* Header Section */}
        <div className="bg-green-700 text-white py-3 text-center">
          <span className="font-semibold text-xl">Your Booking</span>
        </div>

        {/* Course Information Section (Gray out if currentStep < 1) */}
        <div
          className={`p-5 px-6 border-b border-gray-300 flex items-center gap-4 ${isSectionDisabled(0) ? "opacity-50 pointer-events-none" : ""}`}
        >
          <Image
            removeWrapper
            className="h-20 w-20 rounded-md object-cover"
            src={usePlaceholderGolfCourseImageLink()}
          />
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-gray-700">
              {bookingDetails.courseName || "Course Name Placeholder"}
            </span>
            <span className="text-gray-500 text-sm mt-1">
              {bookingDetails.courseLocation || "N/A"}
            </span>
          </div>
        </div>

        {/* Date & Time Section (Gray out if currentStep < 2) */}
        <div
          className={`p-3 px-6 border-b border-gray-300 flex flex-col items-start space-y-2 ${isSectionDisabled(1) ? "opacity-50 pointer-events-none" : ""}`}
        >
          <span className="font-semibold text-medium text-gray-700 flex items-center gap-2">
            <Icon icon="mdi-golf" /> Booking Type: {bookingDetails.bookingType == 1? "9-Hole":"18-Hole"}
          </span>
          <span className="font-semibold text-medium text-gray-700 flex items-center gap-2">
            <Icon icon="mdi-calendar" /> Tee Date: {bookingDetails.teeDate? dateToString(convertExcelDateToJSDate(bookingDetails.teeDate)) : "Select a date"}
          </span>
          <span className="font-semibold text-medium text-gray-700 mt-2 flex items-center gap-2">
            <Icon icon="mdi-clock" /> Tee Time: {bookingDetails.teeTime? convertMinutesToTimeWithAMPM(bookingDetails.teeTime) : "Select a time"}
          </span>
        </div>

        {/* Booking Details Section (Gray out if currentStep < 3) */}
        <div
          className={`p-3 px-6 border-b border-gray-300 flex flex-col items-start space-y-2 ${isSectionDisabled(2) ? "opacity-50 pointer-events-none" : ""}`}
        >
          <span className="text-gray-700 text-medium flex items-center gap-2">
            <Icon icon="mdi-golf" /> <strong>Golfers:</strong> {bookingDetails.numberOfGolfers}
          </span>
          <span className="text-gray-700 mt-2 text-medium flex items-center gap-2">
            <Icon icon="mdi-person" /> <strong>Accompanying Persons:</strong> {bookingDetails.numberOfnonPlayers}
          </span>
          <span className="text-gray-700 mt-2 text-medium flex items-center gap-2">
            <Icon icon="mdi-backpack" /> <strong>Caddies:</strong> {bookingDetails["Caddies"]}
          </span>
          <span className="text-gray-700 mt-2 text-medium flex items-center gap-2">
            <Icon icon="mdi-car" /> <strong>Golf Carts:</strong> {bookingDetails["Golf Cart"]}
          </span>
          <span className="text-gray-700 mt-2 text-medium flex items-center gap-2">
            <Icon icon="mdi-food" /> <strong>Food & Drinks:</strong> {bookingDetails["Food & Drinks"]}
          </span>
        </div>

        {/* Price Section (Gray out if currentStep < 4) */}
        <div
          className={`p-3 px-6 border-gray-300 flex flex-col items-start space-y-2 ${isSectionDisabled(3) ? "opacity-50 pointer-events-none" : ""}`}
        >
          <span className="font-semibold text-medium text-gray-700 flex items-center gap-2">
            <Icon icon="mdi-currency-btc" /> <strong>Total Price:</strong> {bookingDetails.price ? `${bookingDetails.price} THB` : "Price not available"}
          </span>
        </div>
      </Card>
    </div>
  );
};

export default BookingDetails;
