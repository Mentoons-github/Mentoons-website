import axiosInstance from "@/api/axios";
import { HiringFormData } from "@/components/shared/FAQSection/FAQCard";
import { RewardEventType } from "@/types/rewards";
import { triggerReward } from "@/utils/rewardMiddleware";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export type TPOSITION = {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  slug: string;
  jobType: "FULLTIME" | "PARTTIME" | "CONTRACT" | "INTERNSHIP";
  location: string;
  skillsRequired: string[];
  applicationCount: number;
  thumbnail: string;
  responsibilities?: string[];
  requirements?: string[];
  whatWeOffer: string[];
  applicationSource?: string[];
};

export interface CareerState {
  loading: boolean;
  error: string | null;
  success: boolean;
  openPositions: TPOSITION[];
  selectedJob: TPOSITION | null;
  currentPage: number;
  totalPages: number;
  totalJobs: number;
}

const initialState: CareerState = {
  loading: false,
  error: null,
  success: false,
  openPositions: [],
  selectedJob: null,
  currentPage: 1,
  totalPages: 1,
  totalJobs: 0,
};

export const getOpenPositions = createAsyncThunk(
  "career/getOpenPositions",
  async ({
    page = 1,
    limit = 10,
    search = "",
    source,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    source?: string;
  }) => {
    try {
      const response = await axiosInstance.get("/career/jobs", {
        params: { page, limit, search, source },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch open positions");
    }
  },
);

export const applyForJob = createAsyncThunk(
  "career/applyForJob",
  async (data: {
    jobId: string;
    formData: Partial<HiringFormData>;
    source?: string;
  }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/career/jobs/apply/${data.jobId}`,
        {
          ...data.formData,
          source: data.source,
        },
      );

      if (response.status === 200 || response.status === 201) {
        triggerReward(RewardEventType.APPLY_JOB, response.data.jobId);
      }

      return response.data;
    } catch (error) {
      throw new Error("Failed to apply for job");
    }
  },
);

export const getJobBySlug = createAsyncThunk(
  "career/getJobBySlug",
  async (slug: string) => {
    try {
      const response = await axiosInstance.get(`/career/jobs/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch job details");
    }
  },
);

const careerSlice = createSlice({
  name: "career",
  initialState,
  reducers: {
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOpenPositions.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(getOpenPositions.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.openPositions = action.payload?.data?.jobs || [];
      state.currentPage = action.payload?.data?.currentPage || 1;
      state.totalPages = action.payload?.data?.totalPages || 1;
      state.totalJobs = action.payload?.data?.totalJobs || 0;
    });
    builder.addCase(getOpenPositions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong!";
    });
    builder.addCase(applyForJob.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(applyForJob.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      console.log(action.payload);
    });
    builder.addCase(applyForJob.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong!";
    });
    builder.addCase(getJobBySlug.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getJobBySlug.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedJob = action.payload?.data || null;
    });

    builder.addCase(getJobBySlug.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong!";
    });
  },
});

export const { clearSelectedJob } = careerSlice.actions;
export default careerSlice.reducer;
