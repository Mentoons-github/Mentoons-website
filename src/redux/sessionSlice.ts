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

export const addSesion = createAsyncThunk(
  "sesion/addSession",
  async (sessionData: SessionDetails, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/sessionBooking",
        sessionData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to book session");
    }
  }
);

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addSesion.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addSesion.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(addSesion.fulfilled, (state, action) => {
      state.sessions.push(action.payload);
    });
  },
});

export default sessionSlice.reducer;
