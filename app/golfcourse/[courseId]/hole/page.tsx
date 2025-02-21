"use client";
import React, { useState, useEffect } from "react";
import { Card, Badge, Button, Divider, TimeInput, DateInput } from "@heroui/react";
import { Icon } from "@iconify/react";

// components
import { DatePicker } from "@heroui/react";
import { NextButton } from "@/app/golfcourse/components/NextButton";
import { useProgress } from "../../context/progress-context";
import {DateRangePicker} from "@heroui/date-picker";
import { getGolfCourseAvailability } from "@/app/lib/api";
import { parseDate, CalendarDate, today, Time } from "@internationalized/date";

const placeholderData = 
  [
    {
      "Tee Minute": 374,
      "Crossover Minute": 476,
      "Available": [1, 2],
      "Crossover Available": [1, 2],
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
      "Available": [1, 2],
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

  const { currentStep, canAccess, courseId } = useProgress();
  const [availableTeeTimes, setAvailableTeeTimes] = useState(placeholderData);

  const [selectedTimeCode, setSelectedTimeCode] = useState<number | null>(null);

  const handleCardClick = (timeCode: number) => {
    // Set the selected time code, or reset if it's the same one that was clicked
    setSelectedTimeCode(timeCode === selectedTimeCode ? null : timeCode);
  };
  const convertToDateEncoding = (date: Date | string): number => {
    const baseDate = new Date(Date.UTC(1899, 11, 30));
    
    const inputDate = typeof date === 'string' ? new Date(date) : date;
    const utcInputDate = new Date(Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
    ));
    
    const timeDifference = utcInputDate.getTime() - baseDate.getTime();
    const days = timeDifference / (1000 * 60 * 60 * 24);
    
    return Math.floor(days);
};

  const convertCalendarDateToNumber = (calendarDate: any) => {
    const jsDate = new Date(Date.UTC(
        calendarDate.year, 
        calendarDate.month - 1,  // Convert from 1-based to 0-based month
        calendarDate.day
    ));
    return convertToDateEncoding(jsDate);
  };
  
  const convertMinutesToTimeWithAMPM = (minutes:any) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    // Convert 24-hour format to 12-hour format
    const formattedHours = hours % 12 || 12; // 0 becomes 12 for 12-hour format
    const ampm = hours < 12 ? 'AM' : 'PM';
    const formattedTime = `${formattedHours}:${remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes} ${ampm}`;
    
    return formattedTime;
  }

  const compareTime = (timeCode: any) => {
    const startTimeCode = startTime.hour * 60 + startTime.minute;
    const endTimeCode = endTime.hour * 60 + endTime.minute;
    
    if (timeCode >= startTimeCode && timeCode <= endTimeCode) {
      return true;
    }
  
    return false;
  };

  const [startTime, setStartTime] = useState(new Time(6, 0));
  const [endTime, setEndTime] = useState(new Time(17, 0));
  const minTime = '06:00 AM'; // Minimum time (6:00 AM)
  const maxTime = '05:00 PM'; // Maximum time (4:00 PM)

  const convertTo24HrFormat = (time: any) => {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    if (modifier === 'PM' && hours !== '12') hours = (parseInt(hours) + 12).toString();
    if (modifier === 'AM' && hours === '12') hours = '00';
    return `${hours}:${minutes}`;
  };

  const handleStartTimeChange = (value: any) => {
      setStartTime(value);
  };

  const handleEndTimeChange = (value: any) => {
      setEndTime(value);
  };

  useEffect(() => {
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
  }, []);

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
  
  const getDateList = (start: CalendarDate, end: CalendarDate) => {
    const dates = [];
    let currentDate = start;
    
    while (currentDate.compare(end) <= 0) {
      dates.push(currentDate);
      currentDate = currentDate.add({ days: 1 });
    }
    
    return dates;
  };

  return (
    <div className="space-y-5">

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Select Booking Time</h1>
      <div className="flex space-x-4">
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
      </h1>
      <div className="max-w-[900px] max-h-[255px] p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 overflow-y-auto bg-gray-50 rounded-md">
        {availableTeeTimes.map((data, index) => {
          if (!compareTime(data['Tee Minute'])){
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
                  {`${data["Golf Bookings"].length + data["Crossover Golf Bookings"].length}/${data["Online Golfer Count"]} Booked`}
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
