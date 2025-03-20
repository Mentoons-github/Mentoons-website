import axiosInstance from "@/api/axios";
import { StatusState, Status } from "@/types/adda/status";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: StatusState = {
  statuses: [],
  lastFetchedTime: null,
  status: "idle",
  error: null,
  watchedStatus: [],
};

export const fetchStatus = createAsyncThunk(
  "status/fetchStatuses",
  async (_, { getState }) => {
    const { status } = getState() as { status: StatusState };
    const CACHE_TIME = 5 * 60 * 1000;
    const now = Date.now();

    if (status.lastFetchedTime && now - status.lastFetchedTime < CACHE_TIME) {
      return status.statuses;
    }

    const response = axiosInstance.get("/user/statuses");
    return (await response).data as Status[];
  }
);

export const sendWatchedStatus = createAsyncThunk(
  "status/sendStatus",
  async (_, { getState }) => {
    const { status } = getState() as { status: StatusState };

    if (status.watchedStatus.length === 0) return;

    await axiosInstance.post("/user/status/watched", {
      watchedStatus: status.watchedStatus,
    });

    return status.watchedStatus;
  }
);

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    markAsWatched: (state, action: PayloadAction<{ id: string }>) => {
      const status = state.statuses.find(
        (item) => item.id === action.payload.id
      );
      if (status) {
        status.status = "watched";
        if (!state.watchedStatus.includes(action.payload.id)) {
          state.watchedStatus.push(action.payload.id);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lastFetchedTime = Date.now();
        state.statuses = action.payload;
      })
      .addCase(fetchStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
      })
      .addCase(sendWatchedStatus.fulfilled, (state) => {
        state.watchedStatus = [];
      });
  },
});

export const { markAsWatched } = statusSlice.actions;
export default statusSlice.reducer;
