import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

type FileUploadState = {
  loading: boolean;
  error: string | null;
  success: boolean;
  file: File | null;
  progress: number;
};

const initialState: FileUploadState = {
  loading: false,
  error: null,
  success: false,
  file: null,
  progress: 0,
};

export const uploadFile = createAsyncThunk(
  "career/uploadFile",
  async (
    payload: {
      file: File;
      getToken?: () => Promise<string | null>;
      action?: "profile" | "cover";
      contestUpload?: boolean;
    },
    { rejectWithValue, dispatch }
  ) => {
    const { file, getToken, action, contestUpload } = payload;

    try {
      const formData = new FormData();
      formData.append("file", file);

      let token = null;
      if (!contestUpload && getToken) {
        token = await getToken();
      }

      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/upload/file${
          contestUpload ? "?contest=true" : ""
        }`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },

          ...(action && {
            onUploadProgress: (event) => {
              const total = event.total ?? 1;
              const loaded = event.loaded ?? 0;
              const percent = Math.round((loaded / total) * 100);

              dispatch(updateProgress(percent));
            },
          }),
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to upload file");
    }
  }
);

export const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState,
  reducers: {
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
    startUpload: (state, action) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.progress = 0;
      state.file = action.payload.file;
    },
    completeUpload: (state) => {
      state.loading = false;
      state.success = true;
      state.progress = 100;
    },
    failUpload: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetUpload: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.file = null;
      state.progress = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadFile.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.progress = 0;
    });
    builder.addCase(uploadFile.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.file = action.payload?.data?.fileDetails?.url;
      state.progress = 100;
    });
    builder.addCase(uploadFile.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Something went wrong!";
      state.progress = 0;
    });
  },
});

export const {
  updateProgress,
  startUpload,
  completeUpload,
  failUpload,
  resetUpload,
} = fileUploadSlice.actions;
export default fileUploadSlice.reducer;
