/* eslint-disable @typescript-eslint/no-explicit-any */
// components/BookingModal.tsx

import React, { useState } from "react";
import { Button, Card, Modal, ModalContent, Image } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  dateToString,
  convertExcelDateToJSDate,
  convertMinutesToTimeWithAMPM,
} from "./date-functionalities";
import { usePlaceholderGolfCourseImageLink } from "../lib/general";
import { cancelBooking } from "../lib/api-placeholder-db";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any | null;
  forceReload: any;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  booking,
  forceReload,
}) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const cancelBookingButton = (bookingId: any) => {
    cancelBooking(bookingId);
    forceReload();
    setIsConfirmationModalOpen(false); // Close the confirmation modal after canceling
  };

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true); // Open confirmation modal when cancel is clicked
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false); // Close confirmation modal
  };
  const image = usePlaceholderGolfCourseImageLink();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-[80%] max-w-[800px] md:h-[85%] h-[90%]"
    >
      <ModalContent className="w-[100%]">
        {booking ? (
          <div className="flex flex-col items-center space-y-4 m-0 w-[100%] h-[100%] text-white">
            <Card className="p-0 w-[100%] h-[100%] bg-white dark:bg-gray-800 shadow-md  overflow-auto">
              {/* Header */}
              <div className="bg-green-700 text-white py-3 text-center text-lg font-bold">
                Booking Details
              </div>

              <div className="p-4 text-sm text-gray-700 dark:text-white space-y-3 mx-5">
                {/* Course Section */}
                <div className="flex flex-col md:flex-row gap-3 border-b border-gray-300 py-2">
                  <Image
                    className="md:h-32 md:w-32 rounded-md object-cover "
                    src={image}
                    alt="Course"
                  />
                  <div className="my-3 space-y-2">
                    <div className="font-semibold text-xl">
                      {booking.courseName || "Course Name"}
                    </div>
                    <div className="text-gray-500 dark:text-white ">
                      {booking.courseLocation || "N/A"}
                    </div>
                    <InfoItem
                      icon="mdi-golf"
                      label="Type"
                      value={booking.bookingType === 1 ? "9-Hole" : "18-Hole"}
                    />
                    <InfoItem
                      icon="mdi-money"
                      label="Status"
                      value={booking.status ? `${booking.status}` : "N/A"}
                    />
                  </div>
                </div>

                {/* Date & Time Section */}
                <div className="grid grid-cols-2 gap-2 border-b border-gray-300 pb-3">
                  <h3 className="font-semibold text-lg col-span-2">
                    Tee Time:
                  </h3>
                  <InfoItem
                    icon="mdi-calendar"
                    label="Date"
                    value={
                      dateToString(convertExcelDateToJSDate(booking.teeDate)) ||
                      "N/A"
                    }
                  />
                  <InfoItem
                    icon="mdi-clock"
                    label="Time"
                    value={
                      convertMinutesToTimeWithAMPM(booking.teeTime) || "N/A"
                    }
                  />
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-2 gap-2 border-b border-gray-300 pb-3">
                  <h3 className="font-semibold text-lg col-span-2">
                    Booking Details:
                  </h3>
                  <InfoItem
                    icon="mdi-golf"
                    label="Golfers"
                    value={booking.numberOfGolfers}
                  />
                  <InfoItem
                    icon="mdi-person"
                    label="Guests"
                    value={booking.numberOfnonPlayers}
                  />
                  <InfoItem
                    icon="mdi-backpack"
                    label="Caddies"
                    value={booking.Caddies}
                  />
                  <InfoItem
                    icon="mdi-car"
                    label="Carts"
                    value={booking["Golf Cart"]}
                  />
                  <InfoItem
                    icon="mdi-food"
                    label="Food"
                    value={booking["Food & Drinks"]}
                  />
                </div>

                {/* List of Golfers */}
                {booking["Golfer Names"] &&
                  booking["Golfer Names"].length > 0 && (
                    <div className="border-b grid grid-cols-2 border-gray-300 pb-3 gap-2">
                      <h3 className="font-semibold text-lg col-span-2">
                        Golfers:
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {booking["Golfer Names"].map(
                          (golfer: string, index: number) => (
                            <li key={index}>
                              <strong>{golfer}</strong>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {/* Price */}
                <div className="grid grid-cols-2 gap-2 border-b border-gray-300 pb-3">
                  <h3 className="font-semibold text-lg col-span-2">
                    Payment Info:
                  </h3>
                  <div className=" col-span-2">
                    <InfoItem
                      icon="mdi-money"
                      label="Payment Type"
                      value={
                        booking.paymentType ? `${booking.paymentType}` : "N/A"
                      }
                    />
                  </div>
                  <InfoItem
                    icon="mdi-currency-btc"
                    label="Paid Amount"
                    value={booking.paid ? `${booking.paid} THB` : "N/A"}
                  />
                  <InfoItem
                    icon="mdi-currency-btc"
                    label="Price"
                    value={booking.price ? `${booking.price} THB` : "N/A"}
                  />
                </div>

                <div className="text-red-600 font-bold text-md p-4 border border-red-500 rounded-md my-1">
                  There will be no refund after payment is made.
                </div>

                <div className="mt-6 flex justify-between">
                  <Button
                    onPress={openConfirmationModal}
                    className="text-white  bg-red-500"
                    color="primary"
                  >
                    Cancel Booking
                  </Button>
                  <Button
                    onPress={onClose}
                    className="text-white "
                    color="primary"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>No booking data available.</p>
          </div>
        )}
      </ModalContent>

      <Modal
        isOpen={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        className="w-[80%] max-w-[400px]"
      >
        <ModalContent className="w-[100%] p-5 text-center">
          <h2 className="font-semibold text-lg">
            Are you sure you want to cancel this booking?
          </h2>
          <div className="text-red-600 font-bold text-md rounded-md my-1">
            This action cannot be reversed.
          </div>
          <div className="flex justify-around mt-4">
            <Button
              onPress={closeConfirmationModal}
              className="bg-gray-500 text-white"
            >
              No
            </Button>
            <Button
              onPress={() => cancelBookingButton(booking.id)}
              className="bg-red-600 text-white"
            >
              Yes, Cancel
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </Modal>
  );
};

// Info Item Component
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
    <Icon icon={icon} className="text-lg" color="primary" />
    <span>
      <strong>{label}:</strong> {value}
    </span>
  </div>
);

export default BookingModal;
