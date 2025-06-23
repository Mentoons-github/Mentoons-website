import axiosInstance from "@/api/axios";
import { Message } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

// Slice state interface
interface MessageI {
  data: Message[];
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: MessageI = {
  data: [],
  error: null,
  status: "idle",
};


export const fetchConversation = createAsyncThunk<
  Message[], 
  { conversationId: string; token: string }, 
  { rejectValue: string } 
>(
  "conversation/fetchConversation",
  async ({ conversationId, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/conversation/${conversationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError;
      return rejectWithValue(
        error.response?.data
          ? (error.response.data as { message?: string }).message ||
              "Failed to fetch conversation"
          : "Failed to fetch conversation"
      );
    }
  }
);

// Slice
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch conversation";
        state.status = "failed";
      });
  },
});

export default conversationSlice.reducer;
