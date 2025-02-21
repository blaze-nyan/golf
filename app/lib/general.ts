const convertToDateEncoding = (date: Date | string): number => {
    // Base date: 30 December 1899
    const baseDate = new Date(1899, 11, 30); // Month is 0-indexed, so 11 represents December
  
    // If the date is passed as a string, convert it to a Date object
    const inputDate = typeof date === 'string' ? new Date(date) : date;
  
    // Calculate the difference in time (milliseconds)
    const timeDifference = inputDate.getTime() - baseDate.getTime();
  
    // Convert milliseconds to days (1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const days = timeDifference / (1000 * 60 * 60 * 24);
  
    return Math.floor(days);
  };
  
  // Example Usage
  const date = new Date("2023-02-18");
  const encodedDate = convertToDateEncoding(date);
  
  console.log(encodedDate); // Encoded date as a number
  