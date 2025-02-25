/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

// Placeholder images
const foodImage =
  "https://media.istockphoto.com/id/1184365682/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%AD%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%9A%E0%B8%A1%E0%B8%B8%E0%B8%A1%E0%B8%A1%E0%B8%AD%E0%B8%87%E0%B8%94%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%9A%E0%B8%99%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%AD%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%95%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%86%E0%B9%83%E0%B8%99%E0%B8%8A%E0%B8%B2%E0%B8%A1.jpg?s=1024x1024&w=is&k=20&c=CM0TXIFzZrQP6FQCgbZBdC6ezgbl7gLwgl-uFINLBWg=";
// const beverageImage =
//   "https://media.istockphoto.com/id/1184365682/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%AD%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%9A%E0%B8%A1%E0%B8%B8%E0%B8%A1%E0%B8%A1%E0%B8%AD%E0%B8%87%E0%B8%94%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%9A%E0%B8%99%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%AD%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%95%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%86%E0%B9%83%E0%B8%99%E0%B8%8A%E0%B8%B2%E0%B8%A1.jpg?s=1024x1024&w=is&k=20&c=CM0TXIFzZrQP6FQCgbZBdC6ezgbl7gLwgl-uFINLBWg=";

export default function FoodBeveragesPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-10 gap-6">
      {/* Section for introduction */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold mb-4">Food & Beverages</h2>
        <p>
          Indulge in a wide variety of food and beverage offerings at our
          resort. Whether you&apos;re craving a hearty meal or refreshing
          drinks, we have something for everyone.
        </p>
      </div>

      {/* Food & Beverages Sections */}
      <div className="flex gap-3 mb-8 justify-center">
        <div className="text-center w-[40%]">
          <img
            src={foodImage}
            alt="Food"
            className="w-[75%] h-100 object-cover mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold">Delicious Meals</h3>
          <p>
            A variety of local and international dishes prepared by our expert
            chefs.
          </p>
        </div>

        <div className="text-center w-[40%]">
          <img
            src={foodImage}
            alt="Food"
            className="w-[75%] h-100 object-cover mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold">Refreshing Beverages</h3>
          <p>
            Enjoy a selection of cocktails, mocktails, and fresh juices by the
            pool.
          </p>
        </div>
      </div>

      {/* Link to another page */}

      <Link href="/menu">
        <Button variant="solid" className="flex items-center gap-2">
          <span>Explore Our Full Menu</span>
          <Icon icon="mdi:arrow-right" />
        </Button>
      </Link>
    </div>
  );
}
