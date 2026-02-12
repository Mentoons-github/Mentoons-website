import { BASE_URL } from "../game/postScore";
import axios, { AxiosError } from "axios";

export const fetchWorkshopPlans = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/workshop/plans`);
    console.log(response.data);
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return error?.response?.data?.message;
  }
};
