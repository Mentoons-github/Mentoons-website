import axiosInstance from "@/api/axios";
import { IPODCAST } from "@/components/shared/PodcastSection/PodcastCardExp";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: {
  loading: boolean;
  error: string | null;
  success: boolean;
  podcasts: IPODCAST[];
} = {
  loading: false,
  error: null,
  success: false,
  podcasts: [],
};

export const getAllPodcast = createAsyncThunk(
  "podcast/getAllPodcast",
  async () => {
    try {
      const response = await axiosInstance.get("/podcasts");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch all podcasts");
    }
  }
);

export const getPodcast = createAsyncThunk(
  "podcast/getPodcast",
  async (id: string) => {
    try {
      const response = await axiosInstance.get(`/podcast/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch the podcast");
    }
  }
);

export const createYourWonPodcast = createAsyncThunk("podcast/createYourWonPodcast", async (data: IPODCAST) => {
  try {
    const response = await axiosInstance.post("/podcast/create", data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create your podcast");
  }
});

//Todo: create your won podcast form;

const podcastSlice = createSlice({
  name: "podcast",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPodcast.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(getAllPodcast.fulfilled, (state, action) => {
      state.loading = false;

      state.success = true;
      state.podcasts = action.payload?.data?.data;
    });
    builder.addCase(getAllPodcast.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong!";
    });
    builder.addCase(getPodcast.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(getPodcast.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.podcasts = action.payload?.data?.data;
    });

    builder.addCase(getPodcast.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong!";
    });
  builder.addCase(createYourWonPodcast.pending, (state) => {
    state.loading = true;
    state.error = null;
    state.success = false;
  });
  builder.addCase(createYourWonPodcast.fulfilled, (state, action) => {
    state.loading = false;
    state.success = true;
    state.podcasts = action.payload?.data?.data;
  });
  builder.addCase(createYourWonPodcast.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message || "Something went wrong!";
  });
  },
});

export default podcastSlice.reducer;
