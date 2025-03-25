"use client";

import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/button";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Placeholder images
const hotelImage = "/hotel.webp";

export default function HotelPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-8 py-10 gap-6 min-h-screen transition-colors duration-300 ">
      {/* Section for introduction */}
      <div className="text-center mb-8 max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 dark:text-white">
          {t("stayWithUs")}
        </h2>
        <p className="dark:text-gray-300 text-gray-700 px-4 md:px-0">
          {t("hotelIntroDescription")}
        </p>
      </div>

      {/* Hotel Image and Description */}
      <div className="text-center mb-8 max-w-xl w-full">
        <div className="overflow-hidden rounded-lg shadow-md dark:shadow-primary-500/20 transition-transform duration-300 hover:scale-105 mb-6">
          <Image
            src={hotelImage}
            alt={t("hotelImageAlt")}
            width={800}
            height={600}
            className="w-full h-64 object-cover"
            loading="lazy" // For below-the-fold images
          />
        </div>
        <h3 className="text-xl font-semibold mb-2 dark:text-white">
          {t("comfortableRooms")}
        </h3>
        <p className="dark:text-gray-300 text-gray-700 max-w-md mx-auto">
          {t("roomsDescription")}
        </p>
      </div>

      {/* Room features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 w-full max-w-2xl">
        <div className="flex flex-col items-center p-3 rounded-lg dark:bg-gray-800 bg-gray-100">
          <Icon
            icon="mdi:wifi"
            className="text-2xl mb-2 text-primary-500 dark:text-primary-400"
          />
          <span className="text-sm dark:text-gray-300">{t("freeWifi")}</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg dark:bg-gray-800 bg-gray-100">
          <Icon
            icon="mdi:air-conditioner"
            className="text-2xl mb-2 text-primary-500 dark:text-primary-400"
          />
          <span className="text-sm dark:text-gray-300">
            {t("airConditioning")}
          </span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg dark:bg-gray-800 bg-gray-100">
          <Icon
            icon="mdi:room-service"
            className="text-2xl mb-2 text-primary-500 dark:text-primary-400"
          />
          <span className="text-sm dark:text-gray-300">{t("roomService")}</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg dark:bg-gray-800 bg-gray-100">
          <Icon
            icon="mdi:television"
            className="text-2xl mb-2 text-primary-500 dark:text-primary-400"
          />
          <span className="text-sm dark:text-gray-300">{t("smartTV")}</span>
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
          {t("bookYourStayNow")}
        </Button>
      </Link>
    </div>
  );
}
