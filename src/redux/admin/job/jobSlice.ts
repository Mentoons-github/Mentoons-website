import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  JobApplicationResponse,
  JobData,
  JobDataResponse,
  singleJobDataResponse,
} from "@/types/admin";

interface CareerState {
  jobs: JobDataResponse | null;
  job: singleJobDataResponse | null;
  appliedJobs: JobApplicationResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: CareerState = {
  jobs: null,
  job: null,
  appliedJobs: null,
  loading: false,
  error: null,
};

export const getJobs = createAsyncThunk(
  "career/getJobs",
  async (
    {
      sortOrder,
      searchTerm,
      page,
      limit,
    }: { sortOrder: string; searchTerm: string; page: number; limit: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/career/jobs`,
        {
          params: { sort: sortOrder, search: searchTerm, page, limit },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      return response.data as JobDataResponse;
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) ? error.message : "Failed to fetch jobs",
      );
    }
  },
);

export const getJobById = createAsyncThunk(
  "career/getJobById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/career/jobs/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      return response.data as singleJobDataResponse;
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) ? error.message : "Failed to fetch job",
      );
    }
  },
);

export const createJob = createAsyncThunk(
  "career/createJob",
  async (job: JobData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/career/jobs`,
        job,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) ? error.message : "Failed to create job",
      );
    }
  },
);

export const updateJob = createAsyncThunk(
  "career/updateJob",
  async (job: JobData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_PROD_URL}/career/jobs/${job._id}`,
        job,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) ? error.message : "Failed to update job",
      );
    }
  },
);

export const deleteJob = createAsyncThunk(
  "career/deleteJob",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${import.meta.env.VITE_PROD_URL}/career/jobs/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return { id };
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) ? error.message : "Failed to delete job",
      );
    }
  },
);

export const getAppliedJobs = createAsyncThunk(
  "career/getAppliedJobs",
  async (
    {
      sortOrder,
      sortField,
      searchTerm,
      page,
      limit,
    }: {
      sortOrder: number;
      sortField: string;
      searchTerm: string;
      page: number;
      limit: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/career/applied`,
        {
          params: { sortOrder, sortField, search: searchTerm, page, limit },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      return response.data as JobApplicationResponse;
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error)
          ? error.message
          : "Failed to fetch applied jobs",
      );
    }
  },
);

const careerSlice = createSlice({
  name: "career",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getJobs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getJobs.fulfilled, (state, action) => {
      state.loading = false;
      state.jobs = action.payload;
    });
    builder.addCase(getJobs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getJobById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getJobById.fulfilled, (state, action) => {
      state.loading = false;
      state.job = action.payload;
    });
    builder.addCase(getJobById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(createJob.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createJob.fulfilled, (state, action) => {
      state.loading = false;
      const newJob = action.payload.data;
      if (state.jobs?.data) {
        state.jobs.data.jobs = [newJob, ...(state.jobs.data.jobs || [])];
        state.jobs.data.currentPage = state.jobs.data.currentPage || 1;
        state.jobs.data.totalPages = state.jobs.data.totalPages || 1;
        state.jobs.data.totalJobs = (state.jobs.data.totalJobs || 0) + 1;
      } else {
        state.jobs = {
          success: true,
          message: "",
          data: {
            jobs: [newJob],
            currentPage: 1,
            totalPages: 1,
            totalJobs: 1,
          },
        };
      }
    });
    builder.addCase(createJob.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateJob.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateJob.fulfilled, (state, action) => {
      state.loading = false;
      const updatedJob = action.payload.data;
      if (state.jobs?.data?.jobs) {
        state.jobs.data.jobs = state.jobs.data.jobs.map((job) =>
          job._id === updatedJob._id ? updatedJob : job,
        );
      }
      if (state.job?.data && state.job.data._id === updatedJob._id) {
        state.job.data = updatedJob;
      }
    });
    builder.addCase(updateJob.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(deleteJob.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteJob.fulfilled, (state, action) => {
      state.loading = false;
      const id = action.payload.id;
      if (state.jobs?.data?.jobs) {
        state.jobs.data.jobs = state.jobs.data.jobs.filter(
          (job) => job._id !== id,
        );
        state.jobs.data.totalJobs = Math.max(
          (state.jobs.data.totalJobs || 0) - 1,
          0,
        );
      }
    });
    builder.addCase(deleteJob.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getAppliedJobs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAppliedJobs.fulfilled, (state, action) => {
      state.loading = false;
      state.appliedJobs = action.payload;
    });
    builder.addCase(getAppliedJobs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = careerSlice.actions;
export default careerSlice.reducer;
