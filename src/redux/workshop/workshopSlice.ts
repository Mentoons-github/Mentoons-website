import { Invoice } from "@/types/workshopsV2/invoice";
import { createSlice } from "@reduxjs/toolkit";
import { getInvoiceDetailsThunk } from "./workshopThunk";

interface initialStateType {
  loading: boolean;
  error: string | null;
  data: null | Invoice;
}

const initialState: initialStateType = {
  loading: false,
  error: null,
  data: null,
};

export const invoiceSlice = createSlice({
  initialState,
  name: "invoice",
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInvoiceDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvoiceDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(getInvoiceDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "error from fetching invoice";
      });
  },
});

export default invoiceSlice.reducer;
