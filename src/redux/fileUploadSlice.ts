import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

type FileUploadState = {
  loading: boolean;
  error: string | null;
  success: boolean;
  file: File | null;
};

const initialState: FileUploadState = {
  loading: false,
  error: null,
  success: false,
  file: null,
};

export const uploadFile = createAsyncThunk(
  "career/uploadFile",
  async (
    payload: { file: File; getToken: () => Promise<string | null> },
    { rejectWithValue }
  ) => {
    const { file, getToken } = payload;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/upload/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("error found :", error);
      return rejectWithValue("Failed to upload file");
    }
  }
);

export const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(uploadFile.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(uploadFile.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      console.log(action.payload?.data?.fileDetails?.url, "action.payload");
      state.file = action.payload?.data?.fileDetails?.url;
    });
    builder.addCase(uploadFile.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Something went wrong!";
    });
  },
});

export default fileUploadSlice.reducer;
