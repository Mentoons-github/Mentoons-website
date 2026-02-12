import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDataCaptureReviewApi,
  addDataCaptureScoreApi,
  creatDataCaptureApi,
  editDataCaptureApi,
  fetchDataCaptureApi,
  fetchSingleDataCaptureApi,
} from "./dataCaptureApi";
import { AxiosError } from "axios";
import {
  DataCapturePagination,
  Details,
  ReviewMechanismFormValues,
  ScoringSubmission,
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
      err?.response?.data?.message || "Error creating data capture",
    );
  }
});

// edit data capture
export const editDataCaptureThunk = createAsyncThunk<
  { message: string; success: boolean; data: Details },
  { data: Details; token: string; dataCaptureId: string },
  { rejectValue: string }
>(
  "data-captue/edit",
  async ({ data, token, dataCaptureId }, { rejectWithValue }) => {
    try {
      const res = await editDataCaptureApi(data, token, dataCaptureId);
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err?.response?.data?.message || "Error updating data capture",
      );
    }
  },
);

//fetch dataCapture
export const fetchDataCaptureThunk = createAsyncThunk<
  {
    message: string;
    success: boolean;
    data: {
      data: Details[];
      pagination: DataCapturePagination;
    };
  },
  {
    token: string;
    sortBy: string;
    page: number;
    limit: number;
    search: string;
    order: string;
  },
  { rejectValue: string }
>(
  "data-captue/fetch",
  async (
    { token, sortBy, page, limit, search, order },
    { rejectWithValue },
  ) => {
    try {
      const res = await fetchDataCaptureApi(
        token,
        sortBy,
        page,
        limit,
        search,
        order,
      );
      console.log(res, "ress");
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err?.response?.data?.message || "Error fetching data capture",
      );
    }
  },
);

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
        err?.response?.data?.message || "Error fetching data capture",
      );
    }
  },
);

export const addDataCaptureReviewThunk = createAsyncThunk<
  { message: string; success: boolean; data: Details },
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
        reviewMechanism,
      );
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err?.response?.data?.message || "Error adding review on data capure",
      );
    }
  },
);

//add scoring
export const addDataCaptureScoringThunk = createAsyncThunk<
  { message: string; success: boolean; data: Details },
  {
    token: string;
    dataCaptureId: string;
    scoringData: ScoringSubmission;
  },
  { rejectValue: string }
>(
  "data-captue/add-scoring",
  async ({ token, dataCaptureId, scoringData }, { rejectWithValue }) => {
    try {
      const res = await addDataCaptureScoreApi(
        token,
        dataCaptureId,
        scoringData,
      );
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err?.response?.data?.message || "Error adding scoring on data capure",
      );
    }
  },
);
