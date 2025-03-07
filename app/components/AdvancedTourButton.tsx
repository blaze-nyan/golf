// app/components/AdvancedTourButton.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  createHomeTour,
  createGolfCourseTour,
  createBookingProcessTour,
  createProfileTour,
  resetTours,
} from "@/app/lib/advance-tour-service";

export default function AdvancedTourButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme;

  // Auto-start tour when page loads (only for first visit)
  useEffect(() => {
    // Short delay to ensure the DOM is fully loaded
    const tourTimeout = setTimeout(() => {
      let tourDriver;

      if (pathname === "/") {
        tourDriver = createHomeTour(false);
      } else if (pathname === "/golfcourse") {
        tourDriver = createGolfCourseTour(false);
      } else if (
        pathname.startsWith("/golfcourse/") &&
        pathname.includes("/hole")
      ) {
        tourDriver = createBookingProcessTour(false);
      } else if (pathname.startsWith("/profile")) {
        tourDriver = createProfileTour(false);
      }

      if (tourDriver) {
        tourDriver.drive();
      }
    }, 800);

    return () => clearTimeout(tourTimeout);
  }, [pathname, isDarkMode]);

  const startTour = () => {
    let tourDriver;

    if (pathname === "/") {
      tourDriver = createHomeTour(true);
    } else if (pathname === "/golfcourse") {
      tourDriver = createGolfCourseTour(true);
    } else if (
      pathname.startsWith("/golfcourse/") &&
      pathname.includes("/hole")
    ) {
      tourDriver = createBookingProcessTour(true);
    } else if (pathname.startsWith("/profile")) {
      tourDriver = createProfileTour(true);
    }

    if (tourDriver) {
      tourDriver.drive();
    } else {
      // Fallback if no specific tour is available for this page
      alert("Tour guide is not available for this page yet.");
    }
  };

  const handleResetTours = () => {
    resetTours();
    setIsOpen(false);
  };

  return (
    <Dropdown isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DropdownTrigger>
        <Button
          variant="light"
          size="sm"
          className="fixed bottom-4 left-4 z-40 bg-white/80 dark:bg-gray-800/80 shadow-md backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all"
          startContent={
            <Icon
              icon="heroicons:light-bulb"
              className="text-xl text-green-600 dark:text-green-400"
            />
          }
        >
          Interactive Guide
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Tour options">
        <DropdownItem
          key="start"
          startContent={<Icon icon="heroicons:play" />}
          onPress={startTour}
        >
          Start Page Guide
        </DropdownItem>
        <DropdownItem
          key="reset"
          startContent={<Icon icon="heroicons:arrow-path" />}
          onPress={handleResetTours}
          className="text-red-500 dark:text-red-400"
        >
          Reset All Guides
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
