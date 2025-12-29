import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDataCaptureReviewApi,
  creatDataCaptureApi,
  fetchDataCaptureApi,
  fetchSingleDataCaptureApi,
} from "./dataCaptureApi";
import { AxiosError } from "axios";
import {
  Details,
  ReviewMechanismFormValues,
} from "@/types/employee/dataCaptureTypes";

// create data capture
export const createDataCaptureThunk = createAsyncThunk<
  { message: string; success: boolean },
  { data: Details; token: string },
  { rejectValue: string }
>("data-captue/create", async ({ data, token }, { rejectWithValue }) => {
  try {
    const res = await creatDataCaptureApi(data, token);
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err?.response?.data?.message || "Error creating data capture"
    );
  }
});

//fetch dataCapture
export const fetchDataCaptureThunk = createAsyncThunk<
  { message: string; success: boolean; data: Details[] },
  string,
  { rejectValue: string }
>("data-captue/fetch", async (token, { rejectWithValue }) => {
  try {
    const res = await fetchDataCaptureApi(token);
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err?.response?.data?.message || "Error fetching data capture"
    );
  }
});

//fetch dataCapture
export const fetchSingleDataCaptureThunk = createAsyncThunk<
  { message: string; success: boolean; data: Details },
  { token: string; dataCaptureId: string },
  { rejectValue: string }
>(
  "data-captue/fetchSingle",
  async ({ token, dataCaptureId }, { rejectWithValue }) => {
    try {
      const res = await fetchSingleDataCaptureApi(token, dataCaptureId);
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err?.response?.data?.message || "Error fetching data capture"
      );
    }
  }
);

export const addDataCaptureReviewThunk = createAsyncThunk<
  { message: string; success: boolean; data:Details },
  {
    token: string;
    dataCaptureId: string;
    reviewMechanism: ReviewMechanismFormValues;
  },
  { rejectValue: string }
>(
  "data-captue/add-review",
  async ({ token, dataCaptureId, reviewMechanism }, { rejectWithValue }) => {
    try {
      const res = await addDataCaptureReviewApi(
        token,
        dataCaptureId,
        reviewMechanism
      );
      console.log(res.data,'daaaataaaa')
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err?.response?.data?.message || "Error adding review on data capure"
      );
    }
  }
);
