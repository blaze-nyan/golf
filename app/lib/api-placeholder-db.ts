import axios from 'axios';

const APIDatabase = "http://localhost:3001";

export const fetchData = async (apiRoute: String) => {
  try {
    const response = await axios.get(`${APIDatabase}/${apiRoute}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const postData = async (apiRoute: String, data: any) => {
  try {
    const response = await axios.post(`${APIDatabase}/${apiRoute}`, data);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


export const cancelBooking = async (id: any) => {
  try {
    const response = await axios.patch(`${APIDatabase}/bookings/${id}`, { "status": "cancelled" });
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};



