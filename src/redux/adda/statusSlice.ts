import axiosInstance from "@/api/axios";
import {
  CreateStatusParams,
  DeleteStatusParams,
  FileUploadResponse,
  SingleStatusApiResponse,
  StatusApiResponse,
  StatusState,
  UserStatusInterface,
  WatchStatusParams,
} from "@/types";
import { RewardEventType } from "@/types/rewards";
import { triggerReward } from "@/utils/rewardMiddleware";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const VIDEO_MAX_BYTES = 10 * 1024 * 1024;

const initialState: StatusState = {
  statusGroups: [],
  status: "idle",
  error: null,
  deletingStatusIds: [],
};

export const fetchStatus = createAsyncThunk<
  UserStatusInterface[],
  string,
  { rejectValue: string }
>("status/fetchStatuses", async (token, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<StatusApiResponse>(
      "/adda/status",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch statuses",
      );
    }
    return rejectWithValue("Failed to fetch statuses");
  }
});

export const sendWatchedStatus = createAsyncThunk<
  string,
  WatchStatusParams,
  { rejectValue: string }
>(
  "status/sendWatchedStatus",
  async ({ statusId, token }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/adda/watchStatus/${statusId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("Status marked as watched:", response.data);
      dispatch(fetchStatus(token));
      return statusId;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to mark status as watched",
        );
      }
      return rejectWithValue("Failed to mark status as watched");
    }
  },
);

export const createStatus = createAsyncThunk<
  any,
  CreateStatusParams,
  { rejectValue: string }
>(
  "status/createStatus",
  async ({ file, caption, token }, { dispatch, rejectWithValue }) => {
    const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const videoTypes = ["video/mp4", "video/webm"];
    const validTypes = [...imageTypes, ...videoTypes];

    if (!validTypes.includes(file.type)) {
      return rejectWithValue(
        "Invalid file type. Please upload a JPG, PNG, WEBP image or MP4/WEBM video.",
      );
    }

    const isImage = imageTypes.includes(file.type);
    const isVideo = videoTypes.includes(file.type);

    if (isImage && file.size > IMAGE_MAX_BYTES) {
      return rejectWithValue(
        "Image is too large. Maximum size for images is 5MB.",
      );
    }

    if (isVideo && file.size > VIDEO_MAX_BYTES) {
      return rejectWithValue(
        "Video is too large. Maximum size for videos is 10MB.",
      );
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await axiosInstance.post<FileUploadResponse>(
        "/upload/file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const fileUrl = uploadResponse.data.data.fileDetails.url;

      const data = {
        content: fileUrl,
        type: file.type.startsWith("image/") ? "image" : "video",
        caption: caption || "",
      };

      const statusResponse = await axiosInstance.post<SingleStatusApiResponse>(
        "/adda/addStatus",
        data,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      triggerReward(
        RewardEventType.CREATE_STATUS,
        statusResponse.data.data._id,
      );

      dispatch(fetchStatus(token));

      return statusResponse.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to create status",
        );
      }
      return rejectWithValue("Failed to create status");
    }
  },
);

export const deleteStatus = createAsyncThunk<
  string,
  DeleteStatusParams,
  { rejectValue: string }
>(
  "status/deleteStatus",
  async ({ statusId, token }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(statusSlice.actions.setDeletingStatus(statusId));

      await axiosInstance.delete(`/adda/deleteStatus/${statusId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(statusSlice.actions.removeDeletedStatus(statusId));
      dispatch(fetchStatus(token));

      return statusId;
    } catch (error) {
      dispatch(statusSlice.actions.clearDeletingStatus(statusId));

      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to delete status",
        );
      }
      return rejectWithValue("Failed to delete status");
    }
  },
);

const statusSlice = createSlice({
  name: "userStatus",
  initialState,
  reducers: {
    setDeletingStatus: (state, action) => {
      state.deletingStatusIds.push(action.payload);
    },
    clearDeletingStatus: (state, action) => {
      state.deletingStatusIds = state.deletingStatusIds.filter(
        (id) => id !== action.payload,
      );
    },
    removeDeletedStatus: (state, action) => {
      const statusIdToRemove = action.payload;
      state.statusGroups = state.statusGroups
        .map((group) => ({
          ...group,
          statuses: group.statuses.filter(
            (status) => status._id !== statusIdToRemove,
          ),
        }))
        .filter((group) => group.statuses.length > 0);

      state.deletingStatusIds = state.deletingStatusIds.filter(
        (id) => id !== statusIdToRemove,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStatus.fulfilled, (state, action) => {
        if (state.deletingStatusIds.length > 0) {
          state.statusGroups = action.payload
            .map((group) => ({
              ...group,
              statuses: group.statuses.filter(
                (status) => !state.deletingStatusIds.includes(status._id),
              ),
            }))
            .filter((group) => group.statuses.length > 0);
        } else {
          state.statusGroups = action.payload;
        }
        state.status = "succeeded";
      })
      .addCase(fetchStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload! || "Something went wrong";
      })
      .addCase(sendWatchedStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendWatchedStatus.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(sendWatchedStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to mark status as watched";
      })
      .addCase(createStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createStatus.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create status";
      })
      .addCase(deleteStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteStatus.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete status";
      });
  },
});

export const { setDeletingStatus, clearDeletingStatus, removeDeletedStatus } =
  statusSlice.actions;
export default statusSlice.reducer;
