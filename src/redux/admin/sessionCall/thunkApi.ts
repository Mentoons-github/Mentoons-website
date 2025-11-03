import { ISessionCall } from "@/types/admin";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/sessions`;

export const fetchSessionEnquiries = createAsyncThunk<
  ISessionCall[],
  string,
  { rejectValue: string }
>("sessionCall/fetch", async (token, { rejectWithValue }) => {
  try {
    const response = await axios.get<ISessionCall[]>(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);

    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch session enquiries"
    );
  }
});
