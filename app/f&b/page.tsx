"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";

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
            <Image
              src="/beverage.webp"
              alt="Food"
              width={800}
              height={600}
              className="w-full h-64 object-cover"
              loading="lazy" // For below-the-fold images
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
            <Image
              src="/food.webp"
              alt="Food"
              width={800}
              height={600}
              className="w-full h-64 object-cover"
              loading="lazy" // For below-the-fold images
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
