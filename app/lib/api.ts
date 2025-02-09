// app/lib/api.ts
import axios from "axios";
import { GolfCourse, RawGolfCourse, SignUpRequest } from "./types";
const BASE_URL = "https://ixschool.cimso.xyz";
const headers = {
  Authorization: JSON.stringify({
    "Client Login ID": "CiMSO.dev",
    "Client Password": "CiMSO.dev",
    hg_pass: "nGXUF1i^57I^ao^o",
  }),
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const getGolfCoursesRequest = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/get_golf_courses_request`,
      {
        hg_code: "ixschool",
        payload: {},
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching golf courses:", error);
    throw error;
  }
};
export const getGolfCourses = async (): Promise<GolfCourse[]> => {
  const response = await getGolfCoursesRequest();
  return response.payload["Golf Courses"].map((course: RawGolfCourse) => ({
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

export const signUp = async (userData: SignUpRequest) => {
  try {
    const response = await axios.post("/api/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Error in signup:", error);
    throw error;
  }
};
