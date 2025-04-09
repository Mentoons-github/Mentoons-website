import axiosInstance from "@/api/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type SessionDetails = {
  id: string;
  name: string;
  email: string;
  phone: string;
  selectedDate: string;
  selectedTime: string;
  description?: string;
};

type SessionState = {
  sessions: SessionDetails[];
  loading: boolean;
  error: string | null;
};

const initialState: SessionState = {
  sessions: [],
  loading: false,
  error: null,
};

export const fetchSessions = createAsyncThunk(
  "session/fetchSessions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/sessionBooking");
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch sessions");
    }
  }
);

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSessions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSessions.fulfilled, (state, action) => {
      state.loading = false;
      state.sessions = action.payload;
    });
    builder.addCase(fetchSessions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default sessionSlice.reducer;
