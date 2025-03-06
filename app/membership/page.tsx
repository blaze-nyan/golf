/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Selection } from "@heroui/react";

// Placeholder images
const membershipImage =
  "https://media.istockphoto.com/id/1184365682/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%AD%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%9A%E0%B8%A1%E0%B8%B8%E0%B8%A1%E0%B8%A1%E0%B8%AD%E0%B8%87%E0%B8%94%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%9A%E0%B8%99%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%AD%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%95%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%86%E0%B9%83%E0%B8%99%E0%B8%8A%E0%B8%B2%E0%B8%A1.jpg?s=1024x1024&w=is&k=20&c=CM0TXIFzZrQP6FQCgbZBdC6ezgbl7gLwgl-uFINLBWg=";

// Membership options
const membershipOptions = [
  { key: "basic", label: "Basic Membership", price: "$500/year" },
  { key: "premium", label: "Premium Membership", price: "$1000/year" },
  { key: "vip", label: "VIP Membership", price: "$2000/year" },
];

export default function MembershipPage() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [selectedMembership, setSelectedMembership] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("Select Membership");

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
      setSelectedLabel("Select Membership");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 gap-6 min-h-screen transition-colors duration-300 ">
      {/* Section for introduction */}
      <div className="text-center mb-8 max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 dark:text-white">
          Become a Member
        </h2>
        <p className="dark:text-gray-300 text-gray-700 px-4 md:px-0">
          Join our exclusive golf club and enjoy special privileges, including
          discounted tee times, access to private events, and much more.
        </p>
      </div>

      {/* Membership Options */}
      <div className="text-center mb-8 max-w-md w-full">
        <div className="overflow-hidden rounded-lg shadow-md dark:shadow-primary-500/20 transition-transform duration-300 hover:scale-105 mb-6">
          <img
            src={membershipImage}
            alt="Membership"
            className="w-full h-48 md:h-64 object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold mb-4 dark:text-white">
          Choose Your Membership
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
            aria-label="Membership Options"
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
            Basic
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>Standard access to golf course</span>
            </li>
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>Member discounts</span>
            </li>
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>Basic club facilities</span>
            </li>
          </ul>
        </div>
        <div className="p-4 rounded-lg dark:bg-gray-800 bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <h4 className="font-semibold mb-2 dark:text-white text-center">
            Premium
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>Priority booking</span>
            </li>
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>Access to exclusive events</span>
            </li>
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>Guest passes included</span>
            </li>
          </ul>
        </div>
        <div className="p-4 rounded-lg dark:bg-gray-800 bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <h4 className="font-semibold mb-2 dark:text-white text-center">
            VIP
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>Unlimited course access</span>
            </li>
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>Private locker & storage</span>
            </li>
            <li className="flex items-center dark:text-gray-300">
              <Icon icon="mdi:check" className="text-primary-500 mr-2" />
              <span>Personal golf instructor</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Register Button */}
      {selectedMembership && (
        <Link href="/menu" className="mb-4">
          <Button
            variant="solid"
            color="primary"
            className="flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-white shadow-md hover:shadow-lg"
            endContent={<Icon icon="mdi:arrow-right" className="text-lg" />}
          >
            Register Now
          </Button>
        </Link>
      )}

      {/* Link to learn more */}
      <Link href="/menu">
        <Button
          variant="light"
          className="flex items-center gap-2 dark:text-gray-300 hover:dark:text-white transition-colors"
          endContent={<Icon icon="mdi:arrow-right" className="text-lg" />}
        >
          Learn More About Membership Benefits
        </Button>
      </Link>
    </div>
  );
}
