/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Card, TimeInput, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";

// components
import { DatePicker } from "@heroui/react";
import { NextButton } from "@/app/golfcourse/components/NextButton";
import { useProgress } from "../../context/progress-context";

import { getGolfCourseAvailability } from "@/app/lib/api";
import { parseDate, Time } from "@internationalized/date";
import {
  compareTime,
  convertCalendarDateToNumber,
  convertMinutesToTimeWithAMPM,
  convertCalendarDateToEncoding,
} from "@/app/components/date-functionalities";
import { fetchData } from "@/app/lib/api-placeholder-db";
import AnimatedLoading from "@/app/components/animated-loading";

// Placeholder data (unchanged)
const placeholderData = [
  {
    "Tee Minute": 374,
    "Crossover Minute": 476,
    Available: [],
    "Crossover Available": [],
    "Available Online": true,
    "Availability ID": -2147483647,
    "Availability Description": "AM",
    "Availability Blocking": false,
    "Online Golfer Count": 4,
    "Is Shotgun Availability": false,
    "Golf Bookings": [],
    "Crossover Golf Bookings": [],
  },
  {
    "Tee Minute": 382,
    "Crossover Minute": 484,
    Available: [],
    "Crossover Available": [1, 2],
    "Available Online": true,
    "Availability ID": -2147483647,
    "Availability Description": "AM",
    "Availability Blocking": false,
    "Online Golfer Count": 4,
    "Is Shotgun Availability": false,
    "Golf Bookings": [],
    "Crossover Golf Bookings": [],
  },
  {
    "Tee Minute": 390,
    "Crossover Minute": 492,
    Available: [1, 2],
    "Crossover Available": [1, 2],
    "Available Online": true,
    "Availability ID": -2147483647,
    "Availability Description": "AM",
    "Availability Blocking": false,
    "Online Golfer Count": 4,
    "Is Shotgun Availability": false,
    "Golf Bookings": [
      {
        "Booking ID": 103,
        "Golfer Name": "Emily White",
        "Booking Status": "Confirmed",
        "Booking Time": "2025-02-18T08:30:00Z",
      },
    ],
    "Crossover Golf Bookings": [],
  },
  {
    "Tee Minute": 398,
    "Crossover Minute": 500,
    Available: [1, 2],
    "Crossover Available": [1, 2],
    "Available Online": true,
    "Availability ID": -2147483647,
    "Availability Description": "AM",
    "Availability Blocking": false,
    "Online Golfer Count": 4,
    "Is Shotgun Availability": false,
    "Golf Bookings": [],
    "Crossover Golf Bookings": [],
  },
  {
    "Tee Minute": 406,
    "Crossover Minute": 508,
    Available: [1, 2],
    "Crossover Available": [1, 2],
    "Available Online": true,
    "Availability ID": -2147483647,
    "Availability Description": "AM",
    "Availability Blocking": false,
    "Online Golfer Count": 4,
    "Is Shotgun Availability": false,
    "Golf Bookings": [
      {
        "Booking ID": 104,
        "Golfer Name": "Alice Green",
        "Booking Status": "Pending",
        "Booking Time": "2025-02-18T09:30:00Z",
      },
    ],
    "Crossover Golf Bookings": [],
  },
];

const page = () => {
  const today = new Date();
  today.setDate(today.getDate() + 2); // Adds one day to today's date

  const formattedDate = parseDate(today.toISOString().split("T")[0]);

  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const [bookingType, setBookingType] = useState(1);

  const { courseId, setBookingDetails } = useProgress(); //currentStep, canAccess,
  const [availableTeeTimes, setAvailableTeeTimes] = useState(placeholderData);

  const [selectedTimeCode, setSelectedTimeCode] = useState<number | null>(null);

  const [isLoading, setLoading] = useState(true);
  const [showTimeFilters, setShowTimeFilters] = useState(false);

  const titles = ["9 Hole", "18 Hole"]; // Options for booking type

  const handleCardClick = (timeCode: number) => {
    setSelectedTimeCode(timeCode === selectedTimeCode ? null : timeCode);
  };

  useEffect(() => {
    if (selectedTimeCode) {
      setBookingDetails((prevBookingDetails: any) => ({
        ...prevBookingDetails,
        teeTime: selectedTimeCode,
      }));
    }
  }, [selectedTimeCode, setBookingDetails]);

  useEffect(() => {
    if (bookingType) {
      setBookingDetails((prevBookingDetails: any) => ({
        ...prevBookingDetails,
        bookingType: bookingType,
      }));
    }
  }, [bookingType, setBookingDetails]);

  useEffect(() => {
    if (selectedDate) {
      setBookingDetails((prevBookingDetails: any) => ({
        ...prevBookingDetails,
        teeDate: convertCalendarDateToEncoding(selectedDate),
        teeTime: null,
      }));
      setSelectedTimeCode(null);
    }
  }, [selectedDate, setBookingDetails]);

  useEffect(() => {
    // Set min date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2); // Set date to tomorrow
    const minDate = parseDate(tomorrow.toISOString().split("T")[0]);
    fetchCourses();
    setSelectedDate(minDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [startTime, setStartTime] = useState(new Time(6, 0));
  const [endTime, setEndTime] = useState(new Time(17, 0));

  const fetchCourses = async () => {
    try {
      const data = await getGolfCourseAvailability(
        courseId,
        convertCalendarDateToNumber(selectedDate)
      );
      console.log(data);
      setAvailableTeeTimes(data.availabilities);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching golf courses:", error);
      setLoading(false);
    }
  };

  const handleStartTimeChange = (value: any) => {
    setStartTime(value);
  };

  const handleEndTimeChange = (value: any) => {
    setEndTime(value);
  };

  const handleDateChange = (newDate: any) => {
    setLoading(true);
    setSelectedDate(newDate);
    fetchCourses();
  };

  const handleBookingTypeChange = (event: any) => {
    const value = event.target.value;
    setBookingType(value === "9 Hole" ? 1 : 2); // Update the booking type value based on selection
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getGolfCourseAvailability(
          courseId,
          convertCalendarDateToNumber(selectedDate)
        );
        setAvailableTeeTimes(data.availabilities);
      } catch (error) {
        console.error("Error fetching golf courses:", error);
      }
    };

    fetchCourses();
  }, [courseId, selectedDate]);

  //Temporary
  const [unavailableTeeDates, setUnavailableTeeDates] = useState<any>({});
  const [unavailableTeeTimes, setUnavailableTeeTimes] = useState<number[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const bookings = await fetchData("bookings"); // Assuming fetchData is defined elsewhere
      const result = bookings.reduce(
        (
          acc: { [x: string]: any[] },
          booking: { teeDate: any; teeTime: any }
        ) => {
          const { teeDate, teeTime } = booking;
          if (!acc[teeDate]) {
            acc[teeDate] = [];
          }
          acc[teeDate].push(teeTime);
          return acc;
        },
        {}
      );

      setUnavailableTeeDates(result); // Set unavailable tee dates after processing
    };

    fetchBookings(); // Call the fetchBookings function
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const encodedDate = convertCalendarDateToEncoding(selectedDate); // Assuming the function is defined elsewhere
      setUnavailableTeeTimes(unavailableTeeDates[encodedDate] || []); // Set tee times for the selected date
    }
  }, [selectedDate, unavailableTeeDates]); // This will rerun when selectedDate or unavailableTeeDates changes

  // Toggle time filter visibility on mobile
  const toggleTimeFilters = () => {
    setShowTimeFilters(!showTimeFilters);
  };

  // Function to get filtered tee times
  const getFilteredTeeTimes = () => {
    return availableTeeTimes.filter(
      (data) =>
        compareTime(data["Tee Minute"], startTime, endTime) &&
        data["Available"].includes(bookingType)
    );
  };

  const filteredTeeTimes = getFilteredTeeTimes();

  return (
    <div className="space-y-4 sm:space-y-5 p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2">
        Select Booking
      </h1>

      {/* Primary filters - Always visible */}
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="w-full">
            <Select
              label="Booking Type"
              defaultSelectedKeys={[bookingType === 1 ? "9 Hole" : "18 Hole"]}
              onChange={handleBookingTypeChange}
              className="w-full"
            >
              {titles.map((title: any) => (
                <SelectItem key={title} value={title}>
                  {title}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="w-full">
            <DatePicker
              isRequired
              className="w-full"
              label="Booking Date"
              value={selectedDate}
              minValue={formattedDate}
              defaultValue={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>

        {/* Mobile toggle for time filters */}
        <button
          onClick={toggleTimeFilters}
          className="flex items-center justify-between w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 md:hidden"
        >
          <span>Time Range Filters</span>
          <Icon
            icon={showTimeFilters ? "mdi:chevron-up" : "mdi:chevron-down"}
            className="text-lg"
          />
        </button>

        {/* Time filters - toggleable on mobile, always visible on larger screens */}
        <div className={`${showTimeFilters ? "block" : "hidden"} md:block`}>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:flex md:space-x-4">
            <div className="w-full md:w-auto">
              <TimeInput
                id="start-time"
                isRequired
                value={startTime}
                onChange={handleStartTimeChange}
                className="w-full"
                label="Start Time"
              />
            </div>

            <div className="w-full md:w-auto">
              <TimeInput
                id="end-time"
                isRequired
                value={endTime}
                onChange={handleEndTimeChange}
                className="w-full"
                label="End Time"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Selection summary - responsive layout */}
      <div className="text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-200 pt-1 sm:pt-2">
        <p className="mb-1 sm:mb-2">Showing available tee times for:</p>
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-1 sm:mb-2">
          <span className="inline-block px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs sm:text-sm font-semibold rounded-full shadow-sm">
            {selectedDate.toDate("UTC").toLocaleDateString()}
          </span>

          <span className="inline-block px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs sm:text-sm font-semibold rounded-full shadow-sm">
            {startTime.hour % 12 === 0 ? 12 : startTime.hour % 12}:
            {startTime.minute < 10 ? "0" : ""}
            {startTime.minute} {startTime.hour < 12 ? "AM" : "PM"}
            {" to "}
            {endTime.hour % 12 === 0 ? 12 : endTime.hour % 12}:
            {endTime.minute < 10 ? "0" : ""}
            {endTime.minute} {endTime.hour < 12 ? "AM" : "PM"}
          </span>

          <span className="inline-block px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs sm:text-sm font-semibold rounded-full shadow-sm">
            {bookingType == 1 ? "9-Hole" : "18-Hole"}
          </span>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="w-full h-48 sm:h-64 flex flex-col align-middle items-center justify-center">
          <AnimatedLoading />
        </div>
      ) : (
        <>
          {/* Results count */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredTeeTimes.length} available time
              {filteredTeeTimes.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Empty state */}
          {filteredTeeTimes.length === 0 && !isLoading && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 text-center">
              <Icon
                icon="mdi:calendar-clock"
                className="text-4xl mb-2 text-gray-400 dark:text-gray-500 mx-auto"
              />
              <p className="text-gray-600 dark:text-gray-300">
                No available tee times match your criteria.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Try adjusting your filters.
              </p>
            </div>
          )}

          {/* Tee time grid - responsive grid with different column counts */}
          {filteredTeeTimes.length > 0 && (
            <div className="w-full max-h-[350px] sm:max-h-[400px] md:max-h-[255px] p-2 sm:p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-md">
              {availableTeeTimes.map((data, index) => {
                if (!compareTime(data["Tee Minute"], startTime, endTime)) {
                  return null;
                }

                if (!data["Available"].includes(bookingType)) {
                  return null;
                }

                return (
                  <Card
                    key={index}
                    className={`p-2 cursor-pointer transition-transform duration-200 h-[95px] sm:h-[115px] border border-gray-200 dark:border-gray-700 sm:min-w-[120px] flex-wrap gap-1
                    ${
                      selectedTimeCode === data["Tee Minute"]
                        ? "bg-green-200 dark:bg-green-800 scale-105"
                        : "hover:scale-105 dark:bg-gray-700"
                    }
                    ${
                      unavailableTeeTimes.includes(data["Tee Minute"])
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
                    <div
                      onClick={() => {
                        if (!unavailableTeeTimes.includes(data["Tee Minute"])) {
                          handleCardClick(data["Tee Minute"]);
                        }
                      }}
                      className="w-full"
                    >
                      <div className="flex mb-1">
                        <div
                          className={`w-full flex items-center justify-center rounded-md p-1 ${
                            selectedTimeCode === data["Tee Minute"]
                              ? "bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100"
                              : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                          }`}
                        >
                          <span className="px-1 sm:px-2 text-xs sm:text-sm font-semibold">
                            {`${convertMinutesToTimeWithAMPM(
                              data["Tee Minute"]
                            )}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center ">
                        <div>
                          <Icon
                            icon="mdi:account"
                            className="text-2xl sm:text-3xl md:text-4xl text-gray-700 dark:text-gray-300"
                          />
                        </div>
                        <span className="px-1 sm:px-2 font-semibold text-xs md:text-sm text-gray-800 dark:text-gray-200">
                          {`${data["Online Golfer Count"]} Maximum`}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Next button - fixed position at bottom for mobile */}
      <div className="pt-4 md:hidden sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-2 shadow-md z-10">
        <NextButton />
      </div>

      {/* Desktop next button */}
      <div className="pt-4 hidden md:flex md:justify-end">
        <NextButton />
      </div>
    </div>
  );
};

export default page;
