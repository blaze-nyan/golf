"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Selection } from "@heroui/react";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Placeholder images
const membershipImage = "/membership.webp";

export default function MembershipPage() {
  const { t } = useLanguage();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [selectedMembership, setSelectedMembership] = useState("");
  // Remove initial translation from useState
  const [selectedLabel, setSelectedLabel] = useState("");

  // Update the label whenever language changes
  useEffect(() => {
    if (!selectedMembership) {
      setSelectedLabel(t("selectMembership"));
    } else {
      // Find the option and update the label with the new translation
      const option = membershipOptions.find(
        (option) => option.key === selectedMembership
      );
      if (option) {
        setSelectedLabel(`${option.label} - ${option.price}`);
      }
    }
  }, [t, selectedMembership]); // Depend on both t and selectedMembership

  // Membership options with translations - must be inside the component to access t
  const membershipOptions = [
    { key: "basic", label: t("basicMembership"), price: t("basicPrice") },
    { key: "premium", label: t("premiumMembership"), price: t("premiumPrice") },
    { key: "vip", label: t("vipMembership"), price: t("vipPrice") },
  ];

  const handleSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys);

    // Convert Selection to array and get the first key
    const selectedKey =
      keys instanceof Set ? (Array.from(keys)[0] as string) : "";

    if (selectedKey) {
      setSelectedMembership(selectedKey);

      const option = membershipOptions.find(
        (option) => option.key === selectedKey
      );
      if (option) {
        setSelectedLabel(`${option.label} - ${option.price}`);
      }
    } else {
      setSelectedMembership("");
      setSelectedLabel(t("selectMembership"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 gap-6 min-h-screen transition-colors duration-300 ">
      {/* Section for introduction */}
      <div className="text-center mb-8 max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 dark:text-white">
          {t("becomeMember")}
        </h2>
        <p className="dark:text-gray-300 text-gray-700 px-4 md:px-0">
          {t("membershipIntroDescription")}
        </p>
      </div>

      {/* Membership Options */}
      <div className="text-center mb-8 max-w-md w-full">
        <div className="overflow-hidden rounded-lg shadow-md dark:shadow-primary-500/20 transition-transform duration-300 hover:scale-105 mb-6">
          <Image
            src={membershipImage}
            alt={t("membershipImageAlt")}
            width={800}
            height={600}
            className="w-full h-64 object-cover"
            loading="lazy" // For below-the-fold images
          />
        </div>
        <h3 className="text-xl font-semibold mb-4 dark:text-white">
          {t("chooseYourMembership")}
        </h3>

        {/* HeroUI Dropdown */}
        <Dropdown className="w-full dark:bg-gray-800">
          <DropdownTrigger>
            <Button
              variant="bordered"
              color="primary"
              className="w-full md:w-72 justify-between font-normal dark:bg-gray-800 dark:text-white dark:border-gray-700"
              endContent={<Icon icon="mdi:chevron-down" className="text-lg" />}
            >
              {selectedLabel}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label={t("membershipOptions")}
            selectedKeys={selectedKeys}
            onSelectionChange={handleSelectionChange}
            selectionMode="single"
            variant="flat"
            className="w-full md:w-72 dark:bg-gray-800"
          >
            {membershipOptions.map((option) => (
              <DropdownItem
                key={option.key}
                className="dark:text-gray-200 dark:hover:bg-gray-700"
                startContent={
                  <Icon
                    icon="mdi:golf"
                    className="text-primary-500 dark:text-primary-400"
                  />
                }
              >
                <div className="flex justify-between items-center w-full">
                  <span>{option.label}</span>
                  <span className="text-primary-500 dark:text-primary-400 font-medium">
                    {option.price}
                  </span>
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Membership Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full max-w-3xl">
        <div className="p-4 rounded-lg dark:bg-gray-800 bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <h4 className="font-semibold mb-2 dark:text-white text-center">
            {t("basicTitle")}
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>{t("basicFeature1")}</span>
            </li>
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>{t("basicFeature2")}</span>
            </li>
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>{t("basicFeature3")}</span>
            </li>
          </ul>
        </div>
        <div className="p-4 rounded-lg dark:bg-gray-800 bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <h4 className="font-semibold mb-2 dark:text-white text-center">
            {t("premiumTitle")}
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>{t("premiumFeature1")}</span>
            </li>
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>{t("premiumFeature2")}</span>
            </li>
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>{t("premiumFeature3")}</span>
            </li>
          </ul>
        </div>
        <div className="p-4 rounded-lg dark:bg-gray-800 bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <h4 className="font-semibold mb-2 dark:text-white text-center">
            {t("vipTitle")}
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>{t("vipFeature1")}</span>
            </li>
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>{t("vipFeature2")}</span>
            </li>
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>{t("vipFeature3")}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Register Button */}
      {selectedMembership && (
        <Link href="https://demo.ob.cimsoweb.com/" className="mb-4">
          <Button
            variant="solid"
            color="primary"
            className="flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-white shadow-md hover:shadow-lg"
            endContent={<Icon icon="mdi:arrow-right" className="text-lg" />}
          >
            {t("registerNow")}
          </Button>
        </Link>
      )}

      {/* Link to learn more */}
      <Link href="https://demo.ob.cimsoweb.com/">
        <Button
          variant="light"
          className="flex items-center gap-2 dark:text-gray-300 hover:dark:text-white transition-colors"
          endContent={<Icon icon="mdi:arrow-right" className="text-lg" />}
        >
          {t("learnMoreAboutMembership")}
        </Button>
      </Link>
    </div>
  );
}
