import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInvoiceDetailsApi } from "./workshopApi";
import { AxiosError } from "axios";
import { Invoice } from "@/types/workshopsV2/invoice";

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
      error?.response?.data?.message || "Cant create blog"
    );
  }
});
