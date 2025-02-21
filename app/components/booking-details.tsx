import { Card, Image } from "@heroui/react";
import { useProgress } from "../golfcourse/context/progress-context";
import { Icon } from "@iconify/react/dist/iconify.js";
import { dateToString, convertMinutesToTimeWithAMPM, convertToDateEncodingCustom } from "./date-functionalities";

const BookingDetails = () => {
  const { bookingDetails } = useProgress();

    if (bookingDetails.teeDate) {
        console.log(bookingDetails.teeDate)
    }

  return (
    <div className="col-span-2 flex justify-center">
      <Card className="p-0 hover:scale-[1.01] transition-transform duration-200 bg-white w-[80%] overflow-hidden">
        {/* Header Section */}
        <div className="bg-green-700 text-white py-3 text-center">
          <span className="font-semibold text-xl">Your Booking</span>
        </div>

        {/* Course Information Section */}
        <div className="p-6 border-b border-gray-300 flex items-center gap-4">
            <Image
                removeWrapper
                className="h-20 w-20 rounded-md object-cover"
                src={"https://media.istockphoto.com/id/176834848/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%81%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%9F%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%97%E0%B8%B5%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%99%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%87%E0%B8%9A%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%AA%E0%B8%87%E0%B9%81%E0%B8%94%E0%B8%94.jpg?s=1024x1024&w=is&k=20&c=gDNRJfz9zoIpb2VkGUTJ7bSnXGKk7AgNHLVBf1kAT8E="}
            />

            <div className="flex flex-col">
                <span className="font-semibold text-lg text-gray-700">
                {bookingDetails.courseName || "Course Name Placeholder"}
                </span>
                <span className="text-gray-500 text-sm mt-1">
                Course UID: {bookingDetails.courseImageUID || "N/A"}
                </span>
            </div>
        </div>
        {/* Date & Time Section */}
        <div className="p-6 border-b border-gray-300 flex flex-col items-start">
          <span className="font-semibold text-lg text-gray-700 flex items-center gap-2">
            <Icon icon="mdi-calendar" />Tee Date: {bookingDetails.teeDate || "Select a date"}
          </span>
          <span className="font-semibold text-lg text-gray-700 mt-2 flex items-center gap-2">
            <Icon icon="mdi-clock" /> Tee Time: {convertMinutesToTimeWithAMPM(bookingDetails.teeTime) || "Select a time"}
          </span>
        </div>

        {/* Booking Details Section */}
        <div className="p-6 flex flex-col items-start">
          <span className="text-gray-700 text-medium flex items-center gap-2">
            <Icon icon="mdi-golf" /> <strong>Golfers:</strong> {bookingDetails.numberOfGolfers}
          </span>
          <span className="text-gray-700 mt-2 text-medium flex items-center gap-2">
            <Icon icon="mdi-person" /> <strong>Caddies:</strong> {bookingDetails.caddies}
          </span>
          <span className="text-gray-700 mt-2 text-medium flex items-center gap-2">
            <Icon icon="mdi-car" /> <strong>Golf Carts:</strong> {bookingDetails.golfCart}
          </span>
          <span className="text-gray-700 mt-2 text-medium flex items-center gap-2">
            <Icon icon="mdi-food" /> <strong>Food & Drinks:</strong> {bookingDetails.foodAndDrinks || "None"}
          </span>
        </div>
      </Card>
    </div>
  );
};

export default BookingDetails;
