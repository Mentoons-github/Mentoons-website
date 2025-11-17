import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUser } from "@/types";
import axios, { AxiosError } from "axios";

interface Place {
  houseName: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Psychologist {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  isActive: boolean;
  salary: number;
  place: Place;
}

export type SessionDetails = {
  _id: string;
  user: IUser;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  psychologistId: string | Psychologist;
  description: string;
  status: "booked" | "completed" | "cancelled" | "pending" | "aborted";
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  state: string;
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
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/sessionbookings/getbookings`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.session;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error?.response?.data.message || "unexpected error occured"
        );
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
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
