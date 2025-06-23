import axiosInstance from "@/api/axios";
import { Message } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

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
  string,
  { rejectValue: string }
>(
  "conversation/fetchConversation",
  async (selectedUser, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/conversation/${selectedUser}`);
      return response.data;
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
