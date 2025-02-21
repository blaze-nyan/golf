// app/api/profile/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "https://ixschool.cimso.xyz";
const headers = {
  Authorization: JSON.stringify({
    "Client Login ID": "CiMSO.dev",
    "Client Password": "CiMSO.dev",
    hg_pass: "nGXUF1i^57I^ao^o",
  }),
  "Content-Type": "application/json",
};

interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

export async  function GET(request: Request) {
  try {

    const response = await axios.post(
        `${BASE_URL}/get_golf_courses_request`,
        {
          hg_code: "ixschool",
          payload: {},
        },
        { headers }
    );

    // Response will have the same structure as your Postman response
    // It includes Title, First Name, Surname, Given Name, Company, Gender, etc.
    return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Profile fetch error:", error.response?.data || error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
