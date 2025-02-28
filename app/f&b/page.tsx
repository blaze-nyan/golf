/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

// Placeholder images
const foodImage =
  "https://media.gettyimages.com/id/1036722774/photo/three-women-making-a-celebratory-toast.jpg?s=612x612&w=gi&k=20&c=cNfAzj9DWcNAHaDPbFlubvvWBRw4L54jDtk8ey_yT44=";
const beverageImage =
  "https://media.istockphoto.com/id/1184365682/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%AD%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%9A%E0%B8%A1%E0%B8%B8%E0%B8%A1%E0%B8%A1%E0%B8%AD%E0%B8%87%E0%B8%94%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%9A%E0%B8%99%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%AD%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%95%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%86%E0%B9%83%E0%B8%99%E0%B8%8A%E0%B8%B2%E0%B8%A1.jpg?s=1024x1024&w=is&k=20&c=CM0TXIFzZrQP6FQCgbZBdC6ezgbl7gLwgl-uFINLBWg=";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 gap-6 min-h-screen transition-colors duration-300 ">
      {/* Section for introduction */}
      <div className="text-center mb-8 max-w-3xl">
        <h2 className="text-3xl font-semibold mb-4 dark:text-white">
          Food & Beverages
        </h2>
        <p className="dark:text-gray-300 text-gray-700 px-4 md:px-0">
          Indulge in a wide variety of food and beverage offerings at our
          resort. Whether you&apos;re craving a hearty meal or refreshing
          drinks, we have something for everyone.
        </p>
      </div>

      {/* Food & Beverages Sections */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 justify-center w-full max-w-4xl">
        <div className="text-center w-full md:w-1/2 px-4">
          <div className="overflow-hidden rounded-lg shadow-md dark:shadow-primary-500/20 transition-transform duration-300 hover:scale-105">
            <img
              src={beverageImage}
              alt="Food"
              className="w-full h-64 object-cover"
            />
          </div>
          <h3 className="text-xl font-semibold mt-6 mb-2 dark:text-white">
            Delicious Meals
          </h3>
          <p className="dark:text-gray-300 text-gray-700">
            A variety of local and international dishes prepared by our expert
            chefs.
          </p>
        </div>

        <div className="text-center w-full md:w-1/2 px-4">
          <div className="overflow-hidden rounded-lg shadow-md dark:shadow-primary-500/20 transition-transform duration-300 hover:scale-105">
            <img
              src={foodImage}
              alt="Beverages"
              className="w-full h-64 object-cover"
            />
          </div>
          <h3 className="text-xl font-semibold mt-6 mb-2 dark:text-white">
            Refreshing Beverages
          </h3>
          <p className="dark:text-gray-300 text-gray-700">
            Enjoy a selection of cocktails, mocktails, and fresh juices by the
            pool.
          </p>
        </div>
      </div>

      {/* Link to another page */}
      <Link href="https://demo.rest.cimsoweb.com/signin" className="mt-2">
        <Button
          variant="solid"
          color="primary"
          className="flex items-center gap-2 px-6 py-3 text-sm md:text-base font-medium transition-all duration-200 dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-white"
          endContent={<Icon icon="mdi:arrow-right" className="text-lg" />}
        >
          Explore Our Full Menu
        </Button>
      </Link>
    </div>
  );
}
