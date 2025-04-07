// import axiosInstance from "@/api/axios";
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// type SessionDetails = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   selectedDate: string;
//   selectedTime: string;
//   description?: string;
// };

// type SessionState = {
//   sessions: SessionDetails[];
//   loading: boolean;
//   error: string | null;
// };

// const initialState: SessionState = {
//   sessions: [],
//   loading: false,
//   error: null,
// };

// const addSesion = createAsyncThunk(
//   "sesion/addSession",
//   (sessionId, thunkAPI) => {
//     const response = axiosInstance.post("/api/v1/sessionBooking", sessionId);
//   }
// );

// const sessionSlice = createSlice({
//   name: "session",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase();
//   },
// });
