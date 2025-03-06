/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hotel",
  description: "HotelPage",
};
// Placeholder images
const hotelImage =
  "https://media.istockphoto.com/id/1184365682/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%AD%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%9A%E0%B8%A1%E0%B8%B8%E0%B8%A1%E0%B8%A1%E0%B8%AD%E0%B8%87%E0%B8%94%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%9A%E0%B8%99%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%AD%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%95%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%86%E0%B9%83%E0%B8%99%E0%B8%8A%E0%B8%B2%E0%B8%A1.jpg?s=1024x1024&w=is&k=20&c=CM0TXIFzZrQP6FQCgbZBdC6ezgbl7gLwgl-uFINLBWg=";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-8 py-10 gap-6 min-h-screen transition-colors duration-300 ">
      {/* Section for introduction */}
      <div className="text-center mb-8 max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 dark:text-white">
          Stay With Us
        </h2>
        <p className="dark:text-gray-300 text-gray-700 px-4 md:px-0">
          Enjoy a luxurious stay at our resort hotel. We offer modern amenities,
          beautiful views, and exceptional service for a memorable experience.
        </p>
      </div>

      {/* Hotel Image and Description */}
      <div className="text-center mb-8 max-w-xl w-full">
        <div className="overflow-hidden rounded-lg shadow-md dark:shadow-primary-500/20 transition-transform duration-300 hover:scale-105 mb-6">
          <img
            src={hotelImage}
            alt="Hotel"
            className="w-full h-52 md:h-64 lg:h-72 object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2 dark:text-white">
          Comfortable Rooms
        </h3>
        <p className="dark:text-gray-300 text-gray-700 max-w-md mx-auto">
          Relax in our spacious, fully-equipped rooms with stunning views of the
          golf course.
        </p>
      </div>

      {/* Room features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 w-full max-w-2xl">
        <div className="flex flex-col items-center p-3 rounded-lg dark:bg-gray-800 bg-gray-100">
          <Icon
            icon="mdi:wifi"
            className="text-2xl mb-2 text-primary-500 dark:text-primary-400"
          />
          <span className="text-sm dark:text-gray-300">Free WiFi</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg dark:bg-gray-800 bg-gray-100">
          <Icon
            icon="mdi:air-conditioner"
            className="text-2xl mb-2 text-primary-500 dark:text-primary-400"
          />
          <span className="text-sm dark:text-gray-300">AC</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg dark:bg-gray-800 bg-gray-100">
          <Icon
            icon="mdi:room-service"
            className="text-2xl mb-2 text-primary-500 dark:text-primary-400"
          />
          <span className="text-sm dark:text-gray-300">Room Service</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg dark:bg-gray-800 bg-gray-100">
          <Icon
            icon="mdi:television"
            className="text-2xl mb-2 text-primary-500 dark:text-primary-400"
          />
          <span className="text-sm dark:text-gray-300">Smart TV</span>
        </div>
      </div>

      {/* Link to reservation page */}
      <Link href="https://demo.ob.cimsoweb.com/" className="mt-4">
        <Button
          variant="solid"
          color="primary"
          className="flex items-center gap-2 px-6 py-3 text-sm md:text-base font-medium transition-all duration-200 dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-white shadow-md hover:shadow-lg"
          endContent={<Icon icon="mdi:arrow-right" className="text-lg" />}
        >
          Book Your Stay Now
        </Button>
      </Link>
    </div>
  );
}
