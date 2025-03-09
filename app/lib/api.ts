// app/lib/api.ts
import axios from "axios";
import {
  GolfCourse,
  RawGolfCourse,
  SignUpRequest,
  ProfileData,
  ClientInfo,
} from "./types";
import { logger } from "@/app/lib/logger";
export const BASE_URL = process.env.NEXT_PUBLIC_CIMSO_BASE_URL;
const headers = {
  Authorization: JSON.stringify({
    "Client Login ID": process.env.NEXT_PUBLIC_CIMSO_CLIENT_LOGIN_ID,
    "Client Password": process.env.NEXT_PUBLIC_CIMSO_CLIENT_PASSWORD,
    hg_pass: process.env.NEXT_PUBLIC_CIMSO_HG_PASS,
  }),
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const getGolfCourses = async (): Promise<GolfCourse[]> => {
  const response = await axios.get("/api/courses/get_all", {});
  return response.data.payload["Golf Courses"].map((course: RawGolfCourse) => ({
    golfCourseId: course["Golf Course ID"],
    golfCourseName: course["Golf Course Name"],
    golfCourseDescription: course["Golf Course Description"],
    golfCourseFeeStockId: course["Golf Course Fee Stock ID"],
    allowCrossOver: course["Allow Cross Over"],
    numberOfHoles: course["Number of Holes"],
    golfCoursePar: course["Golf Course Par"],
    isVirtual: course["Is Virtual"],
    golfCourseImageUid: course["Golf Course Image UID"],
    golfCourseStockStatusId: course["Golf Course Stock Status ID"],
    golfCourseHoles: course["Golf Course Holes"],
    golfCourseNotes: course["Golf Course Notes"],
  }));
};

export const getGolfCourseSingle = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  golf_course_id: any
): Promise<GolfCourse | null> => {
  const response = await axios.get("/api/courses/get_all");
  const courses: RawGolfCourse[] = response.data.payload["Golf Courses"];

  const course = courses.find(
    (course) => course["Golf Course ID"] === Number(golf_course_id)
  );

  if (!course) return null;

  return {
    golfCourseId: course["Golf Course ID"],
    golfCourseName: course["Golf Course Name"],
    golfCourseDescription: course["Golf Course Description"],
    golfCourseFeeStockId: course["Golf Course Fee Stock ID"],
    allowCrossOver: course["Allow Cross Over"],
    numberOfHoles: course["Number of Holes"],
    golfCoursePar: course["Golf Course Par"],
    isVirtual: course["Is Virtual"],
    golfCourseImageUid: course["Golf Course Image UID"],
    golfCourseStockStatusId: course["Golf Course Stock Status ID"],
    golfCourseHoles: course["Golf Course Holes"],
    golfCourseNotes: course["Golf Course Notes"],
  };
};

// app/lib/api.ts (update the signUp function)

export const signUp = async (userData: SignUpRequest) => {
  try {
    const response = await axios.post("/api/signup", userData);
    return response.data;
  } catch (error) {
    logger.error("Error in signup:", error);
    throw error;
  }
};
export const verifyEmail = async (token: string) => {
  try {
    const response = await axios.get(`/api/verify?token=${token}`);
    return response.data;
  } catch (error) {
    logger.error("Error verifying email:", error);
    throw error;
  }
};

// app/lib/api.ts
export const getClientInfo = async (clientId: number): Promise<ProfileData> => {
  try {
    // Call our Next.js API route instead of external API directly
    const response = await axios.post("/api/profile", {
      clientId: clientId,
    });
    return response.data.payload;
  } catch (error) {
    logger.error("Error fetching client info:", error);
    throw error;
  }
};

export const updateClientInfo = async (clientInfo: ClientInfo) => {
  logger.log(clientInfo);
  try {
    const response = await axios.post("/api/profile/update", {
      Client_Info: clientInfo,
    });
    return response.data;
  } catch (error) {
    logger.error("Error setting client image:", error);
    throw error;
  }
};

export const setClientImage = async (clientId: number) => {
  try {
    const response = await axios.post("/api/profile/image", {
      Client_ID: clientId,
    });
    return response.data;
  } catch (error) {
    logger.error("Error setting client image:", error);
    throw error;
  }
};

export const uploadBinaryObject = async (imageUID: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("imageUID", imageUID);

    const response = await axios.post("/api/profile/image/binary", formData);
    return response.data;
  } catch (error) {
    logger.error("Error uploading image:", error);
    throw error;
  }
};
export const getClientImage = async (clientId: number) => {
  try {
    const response = await axios.post("/api/profile/image/get", {
      Client_ID: clientId,
    });
    return response.data;
  } catch (error) {
    logger.error("Error getting client image:", error);
    throw error;
  }
};

//Get Golf Booking Types Request
export async function getGolfBookingTypes() {
  const response = await axios.post(
    `${BASE_URL}/get_golf_booking_types_requests`,
    {
      hg_code: "ixschool",
      payload: {},
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Get Golf Course Availability Request
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getGolfCourseAvailability(GolfCourseID: any, day: any) {
  try {
    const response = await axios.post("/api/courses/course_availability", {
      ["Golf Course ID"]: GolfCourseID,
      Day: day,
    });
    return response.data;
  } catch (error) {
    logger.error("Error getting client image:", error);
    throw error;
  }
}

//Get Golf Day Guests Request
export async function getGolfCourseAvailabilityResponse() {
  const response = await axios.post(
    `${BASE_URL}/get_golf_day_guests_request`,
    {
      hg_code: "ixschool",
      payload: {},
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Set Golf Course Date Lock Request
export async function setGolfCourseDateLock(
  BookerID: string,
  GolfCourseID: string,
  Crossover: string,
  LockMinute: string
) {
  const response = await axios.post(
    `${BASE_URL}/set_golf_course_date_lock_request`,
    {
      hg_code: "ixschool",
      payload: {
        "Booker ID": BookerID,
        "Golf Course ID": GolfCourseID,
        Crossover,
        "Lock Minute": LockMinute,
      },
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Get Recent Golfers For Client Request
export async function getRecentGolfersForClient(ClientID: string) {
  const response = await axios.post(
    `${BASE_URL}/get_recent_golfers_for_client_request`,
    {
      hg_code: "ixschool",
      payload: { "Client ID": ClientID },
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Get Golf Bookings For Client Request
//Gets all bookings of a client of the same booking status from X day to Y day
export async function getGolfBookingsForClient(
  ClientID: string,
  BookkingStatuses: string,
  FromDay: string,
  UntilBeforeDay: string
) {
  const response = await axios.post(
    `${BASE_URL}/get_golf_bookings_for_client_request`,
    {
      hg_code: "ixschool",
      payload: {
        "Client ID": ClientID,
        "Booking Statuses": BookkingStatuses,
        "From Day": FromDay,
        "Until Before Day": UntilBeforeDay,
      },
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Gets the golf booking using an ID
export async function getstheGolfBooking() {
  const response = await axios.post(
    `${BASE_URL}/get_golf_booking_request`,
    {
      hg_code: "ixschool",
      payload: {},
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Set Golf Booking Request
export async function setGolfBooking(
  GolfBookingID: string,
  GolfBookingDisplay: string,
  BookerID: string,
  BookerDisplay: string,
  Notes: string,
  BookingStatus: string,
  RoomBookingID: string,
  CancelMinute: string,
  CancelReason: string,
  CancelStaffDisplay: string,
  GolfBookingTypeID: string,
  GolfCourseID: string,
  Crossover: string,
  StartMinute: string,
  GolfShotgun: string,
  CurrentyCode: string,
  GolferList: string,
  ChargesList: string
) {
  const response = await axios.post(
    `${BASE_URL}/set_golf_booking_request`,
    {
      hg_code: "ixschool",
      payload: {
        "Golf Booking ID": GolfBookingID,
        "Golf Booking Display": GolfBookingDisplay,
        "Booker ID": BookerID,
        "Booker Display": BookerDisplay,
        Notes,
        "Booking Status": BookingStatus,
        "Room Booking ID": RoomBookingID,
        "Cancel Minute": CancelMinute,
        "Cancel Reason": CancelReason,
        "Cancel Staff Display": CancelStaffDisplay,
        "Golf Booking Type ID": GolfBookingTypeID,
        "Golf Course ID": GolfCourseID,
        Crossover,
        "Start Minute": StartMinute,
        "Golf Shotgun ID": GolfShotgun,
        "Currency Code": CurrentyCode,
        "Golfer List": GolferList,
        "Charges List": ChargesList,
      },
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Gets the total amount of payment for the booking by using golf booking id and client id.
export async function getTheTotalAmountOfPpaymentForTheBooking(
  GolfBookingID: string,
  ClientID: string
) {
  const response = await axios.post(
    `${BASE_URL}/get_golf_payment_request`,
    {
      hg_code: "ixschool",
      payload: { "Golf Booking ID": GolfBookingID, "Client ID": ClientID },
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Sets the payment, done after the client has paid the payment.
export async function SetThepPaymentForTheBooking(
  GolfBookingID: string,
  ClientID: string,
  ClientAccountID: string,
  TotalPaymentAmount: string,
  PaymentReference: string,
  LocationID: string,
  GeneralLedgerID: string,
  PaymentItemIDs: string[]
) {
  const response = await axios.post(
    `${BASE_URL}/set_golf_payment_request`,
    {
      hg_code: "ixschool",
      payload: {
        "Golf Booking ID": GolfBookingID,
        "Client ID": ClientID,
        "Client Account ID": ClientAccountID,
        "Total Payment Amount": TotalPaymentAmount,
        "Payment Reference": PaymentReference,
        "Location ID": LocationID,
        "General Ledger ID": GeneralLedgerID,
        "Payment Item IDs": PaymentItemIDs,
      },
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

// Get Golf Effective Course Request
// Gets what the actual course the golfer will play on. In case of a 9 hole course being requested for 18 holes it will join //two golf courses together. Not relevant for us since we only have one course.

export async function getGolfEffectiveCourse(
  SourceCourseID: string,
  GolfBookingTypeID: string,
  StartMinute: string
) {
  const response = await axios.post(
    `${BASE_URL}/get_golf_effective_course_request`,
    {
      hg_code: "ixschool",
      payload: {
        "Source Course ID": SourceCourseID,
        "Golf Booking Type ID": GolfBookingTypeID,
        "Start Minute": StartMinute,
      },
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Get golf booking items associated with the golf booking.
export async function getGolfBookingItems(GolfBookingID: string) {
  const response = await axios.post(
    `${BASE_URL}/get_golf_booking_items_request`,
    {
      hg_code: "ixschool",
      payload: { "Golf Booking ID": GolfBookingID },
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Sets golf booking items to golf booking id.
export async function setGolfBookingItems(
  GolfBookingID: string,
  GolfBookingItems: string
) {
  const response = await axios.post(
    `${BASE_URL}/set_golf_booking_items_request`,
    {
      hg_code: "ixschool",
      payload: {
        "Golf Booking ID": GolfBookingID,
        "Golf Booking Items": GolfBookingItems,
      },
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Set Golf Booking Lock Request
//Set a lock to prevent the golf booking for being edited by other sources.
export async function setGolfBookingLock(
  GolfBookingID: string,
  GolfBookingItems: string
) {
  const response = await axios.post(
    `${BASE_URL}/set_golf_booking_lock_request`,
    {
      hg_code: "ixschool",
      payload: {
        "Golf Booking ID": GolfBookingID,
        "Set Lock": GolfBookingItems,
      },
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Gets whether or not client is part of Handicap Network of Africa. Can be used to check whether or not the client is handicapped useful for tournaments.
export async function getHnaLookup(
  GolfBookingID: string,
  GolfBookingItems: string
) {
  const response = await axios.post(
    `${BASE_URL}/get_hna_lookup_request`,
    {
      hg_code: "ixschool",
      payload: {
        "Golf Booking ID": GolfBookingID,
        "Set Lock": GolfBookingItems,
      },
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Gets golf booking details using a list of golf booking ids and golf shotgun ids. Shotguns are like tournaments which might not be relevant for us.
export async function makeFolfBookingPrepayment(
  GolfBookingID: string,
  ClientID: string,
  Amount: string,
  OverridePaymentMethodID: string,
  WithholdTaxScheduleID: string
) {
  const response = await axios.post(
    `${BASE_URL}/make_golf_booking_prepayment_request`,
    {
      hg_code: "ixschool",
      payload: {
        "Golf Booking ID": GolfBookingID,
        " Client ID": ClientID,
        Amount,
        "Override Payment Method ID": OverridePaymentMethodID,
        "Withhold Tax Schedule ID": WithholdTaxScheduleID,
      },
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Requests the change logs for any number of golf bookings. [Change Log Modified From Minute, Change Log Modified Until Before Minute, Change Log Modified From Second, Change Log Modified Until Before Second, Golf Booking Modified From Minute, Golf Booking Modified Until Before Minute] can be specified optionally.

export async function getGolfBookingChangeLog(GolfBookingID: string) {
  const response = await axios.post(
    `${BASE_URL}/get_golf_booking_change_log_request`,
    {
      hg_code: "ixschool",
      payload: { "Golf Booking ID": GolfBookingID },
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}

//Requests a list of golf shotguns.
export async function getGolfShotguns(
  GolfShotgunID: string,
  GolfCourseID: string,
  GolfBookingTypeID: string,
  FromDay: string,
  UntilBeforeDay: string
) {
  const response = await axios.post(
    `${BASE_URL}/get_golf_shotguns_request`,
    {
      hg_code: "ixschool",
      payload: {
        "Golf Shotgun ID": GolfShotgunID,
        "Golf Course ID": GolfCourseID,
        "Golf Booking Type ID": GolfBookingTypeID,
        "From Day": FromDay,
        "Until Before Day": UntilBeforeDay,
      },
    },
    { headers }
  );
  logger.log(response);
  if (!response.data.payload) return undefined;
  return response.data.payload;
}
