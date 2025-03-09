/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { logger } from "@/app/lib/logger";
const APIDatabase = "https://placeholderdatabase.onrender.com";

export const fetchData = async (apiRoute: string) => {
  try {
    const response = await axios.get(`${APIDatabase}/${apiRoute}`);
    logger.log(response.data);
    return response.data;
  } catch (error) {
    logger.error("Error fetching data:", error);
  }
};

export const postData = async (apiRoute: string, data: any) => {
  try {
    const response = await axios.post(`${APIDatabase}/${apiRoute}`, data);
    logger.log(response.data);
  } catch (error) {
    logger.error("Error fetching data:", error);
  }
};

export const cancelBooking = async (id: any) => {
  try {
    const response = await axios.patch(`${APIDatabase}/bookings/${id}`, {
      status: "cancelled",
    });
    logger.log(response.data);
  } catch (error) {
    logger.error("Error fetching data:", error);
  }
};
