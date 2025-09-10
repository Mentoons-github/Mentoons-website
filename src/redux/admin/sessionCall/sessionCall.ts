import { createSlice } from "@reduxjs/toolkit";
import { fetchSessionEnquiries } from "./thunkApi";
import { ISessionCall } from "@/types/admin";

interface SessionCallState {
  data: ISessionCall[] | null;
  error: string | null;
  loading: boolean;
}

const initialState: SessionCallState = {
  data: null,
  error: null,
  loading: false,
};

const sessionCallSlice = createSlice({
  name: "sessionCall",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionEnquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSessionEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default sessionCallSlice.reducer;
