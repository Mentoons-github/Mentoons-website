import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addScoringWorkshopApi,
  assignWorkshopBatchApi,
  getAllWorkshopBatchesApi,
  getPsychologistWorkshopBatchesApi,
  getSingleWorkshopBatchApi,
  updateScoringWorkshopApi,
} from "./workshopBatchApi";
import { AxiosError } from "axios";
import {
  SessionScoringType,
  WorkshopBatchTypes,
  WorkshopPagination,
  WorkshopStudentsTypes,
} from "@/types/workshopsV2/workshopBatchTypes";

//get all workshop batches
export const getAllWorkshopBatchesThunk = createAsyncThunk<
  { data: WorkshopBatchTypes[]; pagination: WorkshopPagination },
  {
    token: string;
    search: string;
    sort: string;
    filter: string;
    page: number;
    limit: number;
  },
  { rejectValue: string }
>(
  "workshopBatches",
  async ({ token, filter, limit, page, search, sort }, { rejectWithValue }) => {
    try {
      const res = await getAllWorkshopBatchesApi(
        token,
        search,
        sort,
        filter,
        page,
        limit,
      );
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string; error: string }>;
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Cant score workshop",
      );
    }
  },
);

// assign workshop
export const assignWorkshopBatchThunk = createAsyncThunk<
  { data: WorkshopBatchTypes; message: string },
  {
    token: string;
    data: {
      workshopBatchId: string;
      psychologistId: string;
      startDate: string;
    };
  },
  { rejectValue: string }
>("workshopBatch/assign", async ({ token, data }, { rejectWithValue }) => {
  try {
    const res = await assignWorkshopBatchApi(token, data);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string; error: string }>;
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Cant score workshop",
    );
  }
});

// get psychologist workshop batches
export const getPsychologistWorkshopBatchesThunk = createAsyncThunk<
  {
    data: WorkshopBatchTypes[];
    pagination: WorkshopPagination;
  },
  {
    token: string;
    search: string;
    sort: string;
    filter: string;
    page: number;
    limit: number;
  },
  { rejectValue: string }
>(
  "workshopBatch/psychologist",
  async ({ token, filter, limit, page, search, sort }, { rejectWithValue }) => {
    try {
      const res = await getPsychologistWorkshopBatchesApi(
        token,
        search,
        sort,
        filter,
        page,
        limit,
      );
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string; error: string }>;
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Cant score workshop",
      );
    }
  },
);

// get psychologist workshop batches
export const getSingleWorkshopBatchThunk = createAsyncThunk<
  WorkshopBatchTypes,
  { token: string; workshopBatchId: string },
  { rejectValue: string }
>(
  "workshopBatch/single",
  async ({ token, workshopBatchId }, { rejectWithValue }) => {
    try {
      const res = await getSingleWorkshopBatchApi(token, workshopBatchId);
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string; error: string }>;
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Cant score workshop",
      );
    }
  },
);

// add workshop score
export const addScoringWorkshopThunk = createAsyncThunk<
  { message: string; data: WorkshopStudentsTypes },
  { token: string; studentId: string; sessionScore: SessionScoringType },
  { rejectValue: string }
>(
  "workshopBatch/addscore",
  async ({ token, studentId, sessionScore }, { rejectWithValue }) => {
    try {
      const res = await addScoringWorkshopApi(token, studentId, sessionScore);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string; error: string }>;
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Cant score workshop",
      );
    }
  },
);

// update workshop score
export const updateScoringWorkshopThunk = createAsyncThunk<
  { message: string; data: WorkshopStudentsTypes },
  {
    token: string;
    studentId: string;
    sessionScore: SessionScoringType;
    sessionId: string;
  },
  { rejectValue: string }
>(
  "workshopBatch/updateScore",
  async (
    { token, studentId, sessionScore, sessionId },
    { rejectWithValue },
  ) => {
    try {
      const res = await updateScoringWorkshopApi(
        token,
        studentId,
        sessionId,
        sessionScore,
      );
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string; error: string }>;
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Cant score workshop",
      );
    }
  },
);
