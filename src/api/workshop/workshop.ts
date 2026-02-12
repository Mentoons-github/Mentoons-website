import { BASE_URL } from "../game/postScore";
import axios, { AxiosError } from "axios";

export const fetchAllPlans = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/workshop/plans`);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    return err?.response?.data?.error;
  }
};
