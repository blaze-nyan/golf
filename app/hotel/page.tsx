/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@heroui/button";

// Placeholder images
const hotelImage =
  "https://media.istockphoto.com/id/1184365682/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%AD%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%9A%E0%B8%A1%E0%B8%B8%E0%B8%A1%E0%B8%A1%E0%B8%AD%E0%B8%87%E0%B8%94%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%9A%E0%B8%99%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%AD%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%95%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%86%E0%B9%83%E0%B8%99%E0%B8%8A%E0%B8%B2%E0%B8%A1.jpg?s=1024x1024&w=is&k=20&c=CM0TXIFzZrQP6FQCgbZBdC6ezgbl7gLwgl-uFINLBWg=";

export default function HotelPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-10 gap-6">
      {/* Section for introduction */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold mb-4">Stay With Us</h2>
        <p>
          Enjoy a luxurious stay at our resort hotel. We offer modern amenities,
          beautiful views, and exceptional service for a memorable experience.
        </p>
      </div>

      {/* Hotel Image and Description */}
      <div className="text-center mb-8">
        <img
          src={hotelImage}
          alt="Hotel"
          className="w-96 h-52 object-cover mb-4 mx-auto"
        />
        <h3 className="text-xl font-semibold">Comfortable Rooms</h3>
        <p>
          Relax in our spacious, fully-equipped rooms with stunning views of the
          golf course.
        </p>
      </div>

      {/* Link to reservation page */}
      <Link href="/menu">
        <Button variant="solid" className="flex items-center gap-2">
          <span>Book Your Stay Now</span>
          <Icon icon="mdi:arrow-right" />
        </Button>
      </Link>
    </div>
  );
}
