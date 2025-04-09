import axiosInstance from "@/api/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUser } from "@/types";

export type SessionDetails = {
  _id: string;
  user: IUser;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  psychologistId: string;
  description: string;
  status: "booked" | "completed" | "cancelled" | "pending" | "aborted";
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
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
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/sessionbookings/getbookings",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("sesion response from backend :", response.data);
      return response.data.session;
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
