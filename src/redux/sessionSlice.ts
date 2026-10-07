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
  profilePicture?: string;
}

export interface SlotAvailability {
  time: string;
  available: boolean;
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
  psychologists: Psychologist[];
  psychologistsLoading: boolean;
  psychologistsError: string | null;
  slots: SlotAvailability[];
  slotsLoading: boolean;
  slotsError: string | null;
};

const initialState: SessionState = {
  sessions: [],
  loading: false,
  error: null,
  psychologists: [],
  psychologistsLoading: false,
  psychologistsError: null,
  slots: [],
  slotsLoading: false,
  slotsError: null,
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
        },
      );

      return response.data.session;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error?.response?.data.message || "unexpected error occured",
        );
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  },
);

export const fetchPsychologists = createAsyncThunk(
  "session/fetchPsychologists",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/sessionbookings/psychologists`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data.psychologists as Psychologist[];
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error?.response?.data.message || "unexpected error occured",
        );
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  },
);

export const fetchAvailableSlots = createAsyncThunk(
  "session/fetchAvailableSlots",
  async (
    params: {
      token: string;
      date: string;
      duration: "30 Minutes" | "1 Hour";
      psychologistId?: string;
      state?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { token, date, duration, psychologistId, state } = params;
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/sessionbookings/available-slots`,
        {
          params: { date, duration, psychologistId, state },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data.slots as SlotAvailability[];
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error?.response?.data.message || "unexpected error occured",
        );
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  },
);

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    clearSlots: (state) => {
      state.slots = [];
      state.slotsError = null;
    },
  },
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

    builder.addCase(fetchPsychologists.pending, (state) => {
      state.psychologistsLoading = true;
      state.psychologistsError = null;
    });
    builder.addCase(fetchPsychologists.fulfilled, (state, action) => {
      state.psychologistsLoading = false;
      state.psychologists = action.payload;
    });
    builder.addCase(fetchPsychologists.rejected, (state, action) => {
      state.psychologistsLoading = false;
      state.psychologistsError = action.payload as string;
    });

    builder.addCase(fetchAvailableSlots.pending, (state) => {
      state.slotsLoading = true;
      state.slotsError = null;
    });
    builder.addCase(fetchAvailableSlots.fulfilled, (state, action) => {
      state.slotsLoading = false;
      state.slots = action.payload;
    });
    builder.addCase(fetchAvailableSlots.rejected, (state, action) => {
      state.slotsLoading = false;
      state.slotsError = action.payload as string;
    });
  },
});

export const { clearSlots } = sessionSlice.actions;
export default sessionSlice.reducer;
