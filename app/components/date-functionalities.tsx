import { CalendarDate } from "@heroui/react";

export const convertToDateEncodingCustom = (date: any): number => {
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

  export const convertCalendarDateToEncoding = (calendarDate: { year: number, month: number, day: number }): number => {
    const jsDate = new Date(Date.UTC(
      calendarDate.year, 
      calendarDate.month - 1,  // Convert from 1-based to 0-based month
      calendarDate.day
    ));
    
    return convertToDateEncodingCustom(jsDate);
  };
  
  export const convertCalendarDateToNumber = (calendarDate: any) => {
    const jsDate = new Date(Date.UTC(
      calendarDate.year, 
      calendarDate.month - 1,  // Convert from 1-based to 0-based month
      calendarDate.day
    ));
    return convertToDateEncodingCustom(jsDate);
  };
  
  export const convertMinutesToTimeWithAMPM = (minutes: any) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    // Convert 24-hour format to 12-hour format
    const formattedHours = hours % 12 || 12; // 0 becomes 12 for 12-hour format
    const ampm = hours < 12 ? 'AM' : 'PM';
    const formattedTime = `${formattedHours}:${remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes} ${ampm}`;
    
    return formattedTime;
  };
  
  export const compareTime = (timeCode: any, startTime: any, endTime: any) => {
    const startTimeCode = startTime.hour * 60 + startTime.minute;
    const endTimeCode = endTime.hour * 60 + endTime.minute;
    
    if (timeCode >= startTimeCode && timeCode <= endTimeCode) {
      return true;
    }
  
    return false;
  };
  
  export const convertTo24HrFormat = (time: any) => {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    if (modifier === 'PM' && hours !== '12') hours = (parseInt(hours) + 12).toString();
    if (modifier === 'AM' && hours === '12') hours = '00';
    return `${hours}:${minutes}`;
  };
  
  export const getDateList = (start: CalendarDate, end: CalendarDate) => {
    const dates = [];
    let currentDate = start;
    
    while (currentDate.compare(end) <= 0) {
      dates.push(currentDate);
      currentDate = currentDate.add({ days: 1 });
    }
    
    return dates;
  };
  
  export const convertExcelDateToJSDate = (excelDate: any) => {
    const startDate = new Date(Date.UTC(1899, 11, 30)); // Excel start date (December 30, 1899)
    const msPerDay = 86400000; // Milliseconds per day
    return new Date(startDate.getTime() + excelDate * msPerDay); // Convert to JavaScript date
  };

  export const dateToString = (teeDate: any) => {
    return new Date(teeDate).toLocaleDateString('en-US', {
      weekday: 'long', // Day of the week (optional)
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };