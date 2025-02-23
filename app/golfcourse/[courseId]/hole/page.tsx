"use client";
import React, { useState, useEffect } from "react";
import { Card, Badge, Button, Divider, TimeInput, DateInput, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";

// components
import { DatePicker } from "@heroui/react";
import { NextButton } from "@/app/golfcourse/components/NextButton";
import { useProgress } from "../../context/progress-context";
import {DateRangePicker} from "@heroui/date-picker";
import { getGolfCourseAvailability } from "@/app/lib/api";
import { parseDate, CalendarDate, today, Time } from "@internationalized/date";
import { compareTime, convertCalendarDateToNumber, convertMinutesToTimeWithAMPM, convertCalendarDateToEncoding } from "@/app/components/date-functionalities";

const placeholderData = 
  [
    {
      "Tee Minute": 374,
      "Crossover Minute": 476,
      "Available": [],
      "Crossover Available": [],
      "Available Online": true,
      "Availability ID": -2147483647,
      "Availability Description": "AM",
      "Availability Blocking": false,
      "Online Golfer Count": 4,
      "Is Shotgun Availability": false,
      "Golf Bookings": [
      ],
      "Crossover Golf Bookings": [
      ]
    },
    {
      "Tee Minute": 382,
      "Crossover Minute": 484,
      "Available": [],
      "Crossover Available": [1, 2],
      "Available Online": true,
      "Availability ID": -2147483647,
      "Availability Description": "AM",
      "Availability Blocking": false,
      "Online Golfer Count": 4,
      "Is Shotgun Availability": false,
      "Golf Bookings": [
      ],
      "Crossover Golf Bookings": []
    },
    {
      "Tee Minute": 390,
      "Crossover Minute": 492,
      "Available": [1, 2],
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
          "Booking Time": "2025-02-18T08:30:00Z"
        }
      ],
      "Crossover Golf Bookings": []
    },
    {
      "Tee Minute": 398,
      "Crossover Minute": 500,
      "Available": [1, 2],
      "Crossover Available": [1, 2],
      "Available Online": true,
      "Availability ID": -2147483647,
      "Availability Description": "AM",
      "Availability Blocking": false,
      "Online Golfer Count": 4,
      "Is Shotgun Availability": false,
      "Golf Bookings": [],
      "Crossover Golf Bookings": [
      ]
    },
    {
      "Tee Minute": 406,
      "Crossover Minute": 508,
      "Available": [1, 2],
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
          "Booking Time": "2025-02-18T09:30:00Z"
        }
      ],
      "Crossover Golf Bookings": []
    }
  ]


const page = () => {
  const today = parseDate(new Date().toISOString().split("T")[0]);

  const [selectedDate, setSelectedDate] = useState(today);
  const [bookingType, setBookingType] = useState(1);

  const { currentStep, canAccess, courseId, setBookingDetails } = useProgress();
  const [availableTeeTimes, setAvailableTeeTimes] = useState(placeholderData);

  const [selectedTimeCode, setSelectedTimeCode] = useState<number | null>(null);

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
  }, [selectedTimeCode]);

  useEffect(() => {
    if (bookingType) {
      setBookingDetails((prevBookingDetails: any) => ({
        ...prevBookingDetails,
        bookingType: bookingType,
      }));
    }
  }, [bookingType]);

  useEffect(() => {
    if (selectedDate) {
      setBookingDetails((prevBookingDetails: any) => ({
        ...prevBookingDetails,
        teeDate: convertCalendarDateToEncoding(selectedDate),
      }));
    }
  }, [selectedDate]);

  const [startTime, setStartTime] = useState(new Time(6, 0));
  const [endTime, setEndTime] = useState(new Time(17, 0));
  const minTime = '06:00 AM'; // Minimum time (6:00 AM)
  const maxTime = '05:00 PM'; // Maximum time (4:00 PM)


  const handleStartTimeChange = (value: any) => {
      setStartTime(value);
  };

  const handleEndTimeChange = (value: any) => {
      setEndTime(value);
  };

  const handleDateChange = (newDate: any) => {

    setSelectedDate(newDate);

    const fetchCourses = async () => {
      try {
        const data = await getGolfCourseAvailability(courseId, convertCalendarDateToNumber(selectedDate));
        console.log(data);
        setAvailableTeeTimes(data.availabilities);
      } catch (error) {
        console.error("Error fetching golf courses:", error);
      }
    };
  
    fetchCourses();
  };

  const handleBookingTypeChange = (event: any) => {
    const value = event.target.value;
    setBookingType(value === "9 Hole" ? 1 : 2); // Update the booking type value based on selection
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getGolfCourseAvailability(courseId, convertCalendarDateToNumber(selectedDate));
        setAvailableTeeTimes(data.availabilities);
      } catch (error) {
        console.error("Error fetching golf courses:", error);
      }
    };
  
    fetchCourses();
  }, []);


  return (
    <div className="space-y-5">

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Select Booking</h1>
      <div className="flex space-x-4">
        <div className="flex flex-col w-36"> 
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

        <DatePicker 
          isRequired 
          className="max-w-[284px]" 
          label="Booking Date" 
          value={selectedDate}
          defaultValue={selectedDate}
          onChange={handleDateChange}
        />
        <div className="flex flex-col">
          <TimeInput
            id="start-time"
            isRequired
            value={startTime}
            onChange={handleStartTimeChange}
            className="max-w-[284px]"
            label="Start Time Range"
          />
        </div>

        <div className="flex flex-col">
          <TimeInput
            id="end-time"
            isRequired
            value={endTime}
            onChange={handleEndTimeChange}
            className="max-w-[284px]"
            label="End Time Range"
          />
        </div>

      </div>

      <h1 className="text-l text-gray-800 pt-2">Showing available tee times for
        <span className="px-4 mx-2 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full shadow-md">
          {selectedDate.toDate("UTC").toLocaleDateString()}
        </span> 
        between 
        <span className="px-4 mx-2 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full shadow-md">
        {startTime.hour % 12 === 0 ? 12 : startTime.hour % 12}:{startTime.minute < 10 ? '0' : ''}{startTime.minute} {startTime.hour < 12 ? 'AM' : 'PM'} 
        </span> 
        and 
        <span className="px-4 mx-2 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full shadow-md">
        {endTime.hour % 12 === 0 ? 12 : endTime.hour % 12}:{endTime.minute < 10 ? '0' : ''}{endTime.minute} {endTime.hour < 12 ? 'AM' : 'PM'}
        </span> 
        , for a        
        <span className="px-4 mx-2 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full shadow-md">
          {bookingType == 1? "9-Hole": "18-Hole"}
        </span> 
        booking.
      </h1>
      <div className="max-w-[900px] max-h-[255px] p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 overflow-y-auto bg-gray-50 rounded-md">
        {availableTeeTimes.map((data, index) => {
          if (!compareTime(data['Tee Minute'], startTime, endTime)){
            return null
          }          
          
          if (!data['Available'].includes(bookingType)){
            return null
          }
          
          return(
          <Card  
            key={index}
            className={`p-2 cursor-pointer transition-transform duration-200 h-[115px] 
              ${selectedTimeCode === data["Tee Minute"] ? "bg-green-200 scale-105" : "hover:scale-105"}`}
          >
            <div onClick={() => handleCardClick(data["Tee Minute"])}>
              <div className="flex mb-1">
                <div className={`w-full flex items-center justify-center rounded-md p-1 ${selectedTimeCode === data["Tee Minute"] ? "bg-green-200" : "bg-green-100"}`}>
                  <span className="px-2 font-semibold">
                    {`${convertMinutesToTimeWithAMPM(data["Tee Minute"])}`}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div>
                  <Icon icon="mdi:account" className="text-4xl" />
                </div>
                <span className="px-2 font-semibold text-small">
                  {`${data["Online Golfer Count"]} Maximum.`}
                </span>
              </div>
            </div>
          </Card>

        )})}
      </div>
      <NextButton />
    
    </div>
  );
};

export default page;
