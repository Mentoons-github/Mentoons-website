import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  checkAppliedOrNotApi,
  deleteBplApplicationApi,
  getAllBplApplicationApi,
  getInvoiceDetailsApi,
  submitBplVerificationFormApi,
  updateApplicationStatusApi,
} from "./workshopApi";
import { AxiosError } from "axios";
import { Invoice } from "@/types/workshopsV2/invoice";
import { BplVerificationTypes } from "@/types/workshopsV2/bplVerificationTypes";

export const getInvoiceDetailsThunk = createAsyncThunk<
  Invoice,
  { transactionId: string; token: string },
  { rejectValue: string }
>("getInvoice", async ({ transactionId, token }, { rejectWithValue }) => {
  try {
    const res = await getInvoiceDetailsApi(transactionId, token);
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error?.response?.data?.message || "Cant get invoice details",
    );
  }
});

// bpl verifcation form submission
export const submitBplVerificationFormThunk = createAsyncThunk<
  string,
  { details: BplVerificationTypes; token: string },
  { rejectValue: string }
>("bpl-form-submission", async ({ details, token }, { rejectWithValue }) => {
  try {
    const res = await submitBplVerificationFormApi(details, token);
    return res.data.message;
  } catch (err) {
    const error = err as AxiosError<{ error: string }>;
    return rejectWithValue(
      error?.response?.data?.error || "Cant submit bpl verification form",
    );
  }
});

//check applied or not
export const checkAppliedOrNotThunk = createAsyncThunk<
  BplVerificationTypes,
  { token: string },
  { rejectValue: string }
>("bpl-check", async ({ token }, { rejectWithValue }) => {
  try {
    const res = await checkAppliedOrNotApi(token);
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError<{ error: string }>;
    return rejectWithValue(
      error?.response?.data?.error || "Cant fetch bpl verification details",
    );
  }
});

//get all application
export const getAllBplApplicationThunk = createAsyncThunk<
  { data: BplVerificationTypes[]; total: number; totalPages: number },
  {
    token: string;
    limit: number;
    page: number;
    search: string;
    sortOrder: string;
    sortField: string;
    filter: string;
  },
  { rejectValue: string }
>(
  "bpl-verification/get-all",
  async (
    { token, limit, page, search, sortOrder, sortField, filter },
    { rejectWithValue },
  ) => {
    try {
      const res = await getAllBplApplicationApi(
        token,
        limit,
        page,
        search,
        sortOrder,
        sortField,
        filter,
      );
      return res.data.data;
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      return rejectWithValue(
        error?.response?.data?.error || "Cant fetch bpl verification details",
      );
    }
  },
);

//update application status
export const updateApplicationStatusThunk = createAsyncThunk<
  { data: BplVerificationTypes; message: string },
  { token: string; data: { applicationId: string; status: string } },
  { rejectValue: string }
>(
  "bpl-verification/update-status",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const res = await updateApplicationStatusApi(token, data);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      return rejectWithValue(
        error?.response?.data?.error || "Cant update bpl verification status",
      );
    }
  },
);

//delete application
export const deleteBplApplicationThunk = createAsyncThunk<
  string,
  { token: string; applicationId: string },
  { rejectValue: string }
>(
  "bpl-verification/delete-application",
  async ({ token, applicationId }, { rejectWithValue }) => {
    try {
      const res = await deleteBplApplicationApi(token, applicationId);
      return res.data.message;
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      return rejectWithValue(
        error?.response?.data?.error ||
          "Cant delete bpl verification application",
      );
    }
  },
);
