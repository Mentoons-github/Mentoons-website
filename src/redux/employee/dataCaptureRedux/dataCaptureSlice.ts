import { createSlice } from "@reduxjs/toolkit";
import {
  addDataCaptureReviewThunk,
  createDataCaptureThunk,
  fetchDataCaptureThunk,
  fetchSingleDataCaptureThunk,
} from "./dataCaptureThunk";
import { Details } from "@/types/employee/dataCaptureTypes";

type InitialState = {
  message: string;
  error: null | string;
  loading: boolean;
  success: boolean;
  fethLoading: boolean;
  fethSuccess: boolean;
  fetchSingleLoading: boolean;
  fetchSingleSuccess: boolean;
  data: Details[];
  singleData: Details | null;
};

const initialState: InitialState = {
  message: "",
  error: null,
  loading: false,
  success: false,
  data: [],
  singleData: null,
  fetchSingleLoading: false,
  fethLoading: false,
  fetchSingleSuccess: false,
  fethSuccess: false,
};

const dataCaptureSlice = createSlice({
  name: "data_capture",
  initialState,
  reducers: {
    resetDataCaptureSlice: (state) => {
      state.error = null;
      state.loading = false;
      state.message = "";
      state.success = false;
      state.fetchSingleLoading = false;
      state.fethLoading = false;
      state.fetchSingleSuccess = false;
      state.fethSuccess = false;
    },
  },
  extraReducers(builder) {
    builder
      // create data capture
      .addCase(createDataCaptureThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createDataCaptureThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(createDataCaptureThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Faild to create data capture";
        state.success = false;
      })

      //fetch datacapture
      .addCase(fetchDataCaptureThunk.pending, (state) => {
        state.fethLoading = true;
        state.error = null;
        state.fethSuccess = false;
      })
      .addCase(fetchDataCaptureThunk.fulfilled, (state, action) => {
        state.fethLoading = false;
        state.error = null;
        state.data = action.payload.data;
        state.fethSuccess = action.payload.success;
      })
      .addCase(fetchDataCaptureThunk.rejected, (state, action) => {
        state.fethLoading = false;
        state.error = action.payload || "Faild to create data capture";
        state.fethSuccess = false;
      })

      //fetch single datacapture
      .addCase(fetchSingleDataCaptureThunk.pending, (state) => {
        state.fetchSingleLoading = true;
        state.error = null;
        state.fetchSingleSuccess = false;
      })
      .addCase(fetchSingleDataCaptureThunk.fulfilled, (state, action) => {
        state.fetchSingleLoading = false;
        state.error = null;
        state.singleData = action.payload.data;
        state.fetchSingleSuccess = action.payload.success;
      })
      .addCase(fetchSingleDataCaptureThunk.rejected, (state, action) => {
        state.fetchSingleLoading = false;
        state.error = action.payload || "Faild to create data capture";
        state.fetchSingleSuccess = false;
      })

      //add review on data capture
      .addCase(addDataCaptureReviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addDataCaptureReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.success = action.payload.success;
        if (state.singleData) {
          state.singleData.reviewMechanism =
            action.payload.data.reviewMechanism;
        }
      })
      .addCase(addDataCaptureReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Faild to create data capture";
        state.success = false;
      });
  },
});

export const { resetDataCaptureSlice } = dataCaptureSlice.actions;

export default dataCaptureSlice.reducer;
