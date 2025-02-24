// components/BookingModal.tsx

import React from "react";
import { Button, Card, Modal, ModalContent, Image } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { dateToString, convertExcelDateToJSDate, convertMinutesToTimeWithAMPM } from "./date-functionalities";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, booking }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-[80%] max-w-[800px] h-[80%]">
      <ModalContent className="w-[100%]">
        {booking ? (
          <div className="flex flex-col items-center space-y-4 m-0 w-[100%] h-[100%]">
            <Card className="p-0 w-[100%] h-[100%] bg-white shadow-md  overflow-auto">
              {/* Header */}
              <div className="bg-green-700 text-white py-3 text-center text-lg font-bold">
                Booking Details
              </div>

              <div className="p-4 text-sm text-gray-700 space-y-3 mx-5">
                {/* Course Section */}
                <div className="flex gap-3 border-b border-gray-300 py-2">
                  <Image
                    className="h-32 w-32 rounded-md object-cover"
                    src={"https://media.istockphoto.com/id/176834848/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%81%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%9F%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%97%E0%B8%B5%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%99%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%87%E0%B8%9A%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%AA%E0%B8%87%E0%B9%81%E0%B8%94%E0%B8%94.jpg?s=1024x1024&w=is&k=20&c=gDNRJfz9zoIpb2VkGUTJ7bSnXGKk7AgNHLVBf1kAT8E="}
                    alt="Course"
                  />
                  <div className="my-3 space-y-2">
                    <div className="font-semibold text-xl">{booking.courseName || "Course Name"}</div>
                    <div className="text-gray-500">{booking.courseLocation || "N/A"}</div>
                    <InfoItem icon="mdi-golf" label="Type" value={booking.bookingType === 1 ? "9-Hole" : "18-Hole"} />
                    <InfoItem icon="mdi-money" label="Status" value={booking.status ? `${booking.status}` : "N/A"} />
                  </div>
                </div>

                {/* Date & Time Section */}
                <div className="grid grid-cols-2 gap-2 border-b border-gray-300 pb-3">
                    <h3 className="font-semibold text-lg col-span-2">Tee Time:</h3>
                  <InfoItem icon="mdi-calendar" label="Date" value={dateToString(convertExcelDateToJSDate(booking.teeDate)) || "N/A"} />
                  <InfoItem icon="mdi-clock" label="Time" value={convertMinutesToTimeWithAMPM(booking.teeTime) || "N/A"} />
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-2 gap-2 border-b border-gray-300 pb-3">
                    <h3 className="font-semibold text-lg col-span-2">Booking Details:</h3>
                  <InfoItem icon="mdi-golf" label="Golfers" value={booking.numberOfGolfers} />
                  <InfoItem icon="mdi-person" label="Guests" value={booking.numberOfnonPlayers} />
                  <InfoItem icon="mdi-backpack" label="Caddies" value={booking.Caddies} />
                  <InfoItem icon="mdi-car" label="Carts" value={booking["Golf Cart"]} />
                  <InfoItem icon="mdi-food" label="Food" value={booking["Food & Drinks"]} />
                </div>

                {/* List of Golfers */}
                {booking["Golfer Names"] && booking["Golfer Names"].length > 0 && (
                  <div className="border-b grid grid-cols-2 border-gray-300 pb-3 gap-2">
                    <h3 className="font-semibold text-lg col-span-2" >Golfers:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {booking["Golfer Names"].map((golfer: string, index: number) => (
                        <li key={index} ><strong>{golfer}</strong></li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Price */}
                <div className="grid grid-cols-2 gap-2 border-b border-gray-300 pb-3">
                <h3 className="font-semibold text-lg col-span-2" >Payment Info:</h3>
                    <div className=" col-span-2">
                    <InfoItem icon="mdi-money" label="Payment Type" value={booking.paymentType ? `${booking.paymentType}` : "N/A"} />
                    </div>
                  <InfoItem icon="mdi-currency-btc" label="Paid Amount" value={booking.paid ? `${booking.paid} THB` : "N/A"} />
                  <InfoItem icon="mdi-currency-btc" label="Price" value={booking.price ? `${booking.price} THB` : "N/A"} />
                </div>
                <Button onClick={onClose} className="text-white hidden sm:block" color="primary">
                    Close
                </Button>

              </div>
            </Card>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>No booking data available.</p>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

// Info Item Component
const InfoItem = ({ icon, label, value }: { icon: string, label: string, value: string | number }) => (
  <div className="flex items-center gap-2">
    <Icon icon={icon} className="text-lg" color="primary" />
    <span>
      <strong>{label}:</strong> {value}
    </span>
  </div>
);

export default BookingModal;
