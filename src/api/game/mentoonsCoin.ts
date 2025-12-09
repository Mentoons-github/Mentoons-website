import axios, { AxiosError } from "axios";
import { BASE_URL } from "./postScore";

export const fetchCandyCoin = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/game/coins/candycoins`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return err?.response?.data?.message;
  }
};
