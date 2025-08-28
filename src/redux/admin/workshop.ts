import axiosInstance from "@/api/axios";
import {
  AssesmentReport,
  CallRequestsResponse,
  SingleWorkshopEnquiryResponse,
  WorkshopEnquiriesListResponse,
  FeedbackFormValues,
} from "@/types/admin";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type WorkshopState = {
  loading: boolean;
  error: string | null;
  success: boolean;
  enquiries: WorkshopEnquiriesListResponse | null;
  enquiry: SingleWorkshopEnquiryResponse | null;
  callRequests: CallRequestsResponse | null;
  assessmentReports: AssesmentReport | null;
};

const initialState: WorkshopState = {
  loading: false,
  error: null,
  success: false,
  enquiries: null,
  enquiry: null,
  callRequests: null,
  assessmentReports: null,
};

export const getEnquiries = createAsyncThunk(
  "workshop/getEnquiries",
  async ({
    sort,
    page,
    limit,
  }: {
    sort: string;
    page: number;
    limit: number;
  }) => {
    try {
      const response = await axiosInstance.get(
        `/workshop?sort=${sort}&page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch workshop enquiries");
    }
  }
);

export const getEnquiryById = createAsyncThunk(
  "workshop/getEnquiryById",
  async ({ enquiryId }: { enquiryId: string | undefined }) => {
    try {
      if (!enquiryId) throw new Error("Enquiry ID is required");
      const response = await axiosInstance.get(`/workshop/${enquiryId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch enquiry by ID");
    }
  }
);

export const getCallRequests = createAsyncThunk(
  "workshop/getCallRequests",
  async ({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search: string;
  }) => {
    try {
      const response = await axiosInstance.get(
        `/call-requests?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch call requests");
    }
  }
);

export const updateCallRequest = createAsyncThunk(
  "workshop/updateCallRequest",
  async ({ id, status }: { id: string; status?: string }) => {
    try {
      const response = await axiosInstance.patch(`/call-requests/${id}`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to update call request");
    }
  }
);

export const assignCallRequest = createAsyncThunk(
  "workshop/assignCallRequest",
  async ({
    userId,
    callId,
    token,
  }: {
    userId: string;
    callId: string;
    token: string;
  }) => {
    try {
      const response = await axiosInstance.patch(
        `/call-requests/assign/${userId}`,
        { callId },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to assign call request");
    }
  }
);

export const reallocateCallRequest = createAsyncThunk(
  "workshop/reallocateCallRequest",
  async ({
    userId,
    callId,
    token,
  }: {
    userId: string;
    callId: string;
    token: string;
  }) => {
    try {
      const response = await axiosInstance.patch(
        `/call-requests/reallocate/${userId}`,
        { callId },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to reallocate call request");
    }
  }
);

export const addFeedback = createAsyncThunk(
  "workshop/addFeedback",
  async ({ values }: { values: FeedbackFormValues }) => {
    try {
      const response = await axiosInstance.post(`/evaluation`, values, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to add feedback");
    }
  }
);

export const getAssessmentReports = createAsyncThunk(
  "workshop/getAssessmentReports",
  async ({
    page,
    limit,
    search,
    sortField,
    sortDirection,
  }: {
    page: number;
    limit: number;
    search: string;
    sortField: string;
    sortDirection: "asc" | "desc";
  }) => {
    try {
      const response = await axiosInstance.get(
        `/evaluation?page=${page}&limit=${limit}&search=${search}&sortField=${sortField}&sortDirection=${sortDirection}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch assessment reports");
    }
  }
);

const workshopSlice = createSlice({
  name: "workshop",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getEnquiries
    builder.addCase(getEnquiries.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(getEnquiries.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.enquiries = action.payload;
    });
    builder.addCase(getEnquiries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong!";
    });

    // getEnquiryById
    builder.addCase(getEnquiryById.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(getEnquiryById.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.enquiry = action.payload;
    });
    builder.addCase(getEnquiryById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong!";
    });

    // getCallRequests
    builder.addCase(getCallRequests.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(getCallRequests.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.callRequests = action.payload;
    });
    builder.addCase(getCallRequests.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong!";
    });

    // updateCallRequest
    builder.addCase(updateCallRequest.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateCallRequest.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(updateCallRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong!";
    });

    // assignCallRequest
    builder.addCase(assignCallRequest.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(assignCallRequest.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(assignCallRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong!";
    });

    // reallocateCallRequest
    builder.addCase(reallocateCallRequest.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(reallocateCallRequest.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(reallocateCallRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong!";
    });

    // addFeedback
    builder.addCase(addFeedback.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(addFeedback.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(addFeedback.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong!";
    });

    // getAssessmentReports
    builder.addCase(getAssessmentReports.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(getAssessmentReports.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.assessmentReports = action.payload;
    });
    builder.addCase(getAssessmentReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong!";
    });
  },
});

export default workshopSlice.reducer;
