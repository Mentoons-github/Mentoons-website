import { Invoice } from "@/types/workshopsV2/invoice";
import { createSlice } from "@reduxjs/toolkit";
import {
  checkAppliedOrNotThunk,
  deleteBplApplicationThunk,
  getAllBplApplicationThunk,
  getInvoiceDetailsThunk,
  submitBplVerificationFormThunk,
  updateApplicationStatusThunk,
} from "./workshopThunk";
import { BplVerificationTypes } from "@/types/workshopsV2/bplVerificationTypes";

interface initialStateType {
  loading: boolean;
  error: string | null;
  data: null | Invoice;
  message: string;
  verificationSubmitSuccess: boolean;
  userAppliedDetails: null | BplVerificationTypes;
  allApplications: BplVerificationTypes[];
  statusUpdateSuccess: boolean;
  totalApplications: number;
  totalApplicationPage: number;
  deleteSuccess: boolean;
}

const initialState: initialStateType = {
  loading: false,
  error: null,
  data: null,
  message: "",
  verificationSubmitSuccess: false,
  userAppliedDetails: null,
  allApplications: [],
  statusUpdateSuccess: false,
  totalApplicationPage: 0,
  totalApplications: 0,
  deleteSuccess: false,
};

export const invoiceSlice = createSlice({
  initialState,
  name: "invoice",
  reducers: {
    resetInvoiceReducer: (state) => {
      state.error = null;
      state.loading = false;
      state.message = "";
      state.verificationSubmitSuccess = false;
      state.statusUpdateSuccess = false;
      state.deleteSuccess = false;
    },
  },
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
      })

      //bpl verification form
      .addCase(submitBplVerificationFormThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.verificationSubmitSuccess = false;
      })
      .addCase(submitBplVerificationFormThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload;
        state.verificationSubmitSuccess = true;
      })
      .addCase(submitBplVerificationFormThunk.rejected, (state, action) => {
        state.loading = false;
        state.verificationSubmitSuccess = false;
        state.error = action.payload || "error for verification bpl ";
      })

      //check already upplied
      .addCase(checkAppliedOrNotThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAppliedOrNotThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userAppliedDetails = action.payload;
      })
      .addCase(checkAppliedOrNotThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "error for verification bpl ";
      })

      //get all applications
      .addCase(getAllBplApplicationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBplApplicationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allApplications = action.payload.data;
        state.totalApplicationPage = action.payload.totalPages;
        state.totalApplications = action.payload.total;
      })
      .addCase(getAllBplApplicationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "error for verification bpl ";
      })

      //update status
      .addCase(updateApplicationStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statusUpdateSuccess = false;
      })
      .addCase(updateApplicationStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.statusUpdateSuccess = true;

        const updatedApplication = action.payload.data;

        state.allApplications = state.allApplications.map((app) =>
          app._id === updatedApplication._id ? updatedApplication : app,
        );

        if (
          state.userAppliedDetails &&
          state.userAppliedDetails._id === updatedApplication._id
        ) {
          state.userAppliedDetails = updatedApplication;
        }
      })

      .addCase(updateApplicationStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.statusUpdateSuccess = false;
        state.error =
          action.payload || "error for updating status verification bpl ";
      })

      //delelte application
      .addCase(deleteBplApplicationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteBplApplicationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload;
        state.deleteSuccess = true;

        const deletedApplicationId = action.meta.arg;
        // If your thunk sends only id → this works

        state.allApplications = state.allApplications.filter(
          (app) => app._id !== deletedApplicationId.applicationId,
        );

        if (
          state.userAppliedDetails &&
          state.userAppliedDetails._id === deletedApplicationId.applicationId
        ) {
          state.userAppliedDetails = null;
        }
      })

      .addCase(deleteBplApplicationThunk.rejected, (state, action) => {
        state.loading = false;
        state.deleteSuccess = false;
        state.error =
          action.payload || "error for updating status verification bpl ";
      });
  },
});

export default invoiceSlice.reducer;
export const { resetInvoiceReducer } = invoiceSlice.actions;
