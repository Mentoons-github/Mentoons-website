// friendRequestSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axios";
import {
  RequestSender,
  FollowBackUser,
  AccessCheckResponse,
} from "@/types/adda/friendRequest";
import {
  updateNotification,
  deleteNotification,
  fetchNotifications,
} from "@/redux/adda/notificationSlice"; // Import notification actions

interface FriendRequestsState {
  requests: RequestSender[] | null;
  followBackUsers: FollowBackUser[] | null;
  loading: boolean;
  followBackLoading: boolean;
  hasMore: boolean;
  page: number;
  accessCheck: AccessCheckResponse | null;
  error: string | null;
}

const initialState: FriendRequestsState = {
  requests: null,
  followBackUsers: null,
  loading: false,
  followBackLoading: false,
  hasMore: true,
  page: 1,
  accessCheck: null,
  error: null,
};

export const fetchFriendRequests = createAsyncThunk<
  { pendingReceived: RequestSender[]; totalPages: number },
  { page: number; limit: number; token: string },
  { rejectValue: AccessCheckResponse }
>(
  "friendRequests/fetchFriendRequests",
  async ({ page, limit, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/adda/getMyFriendRequests?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { pendingReceived, totalPages } = response.data.data;
      const transformedRequests = pendingReceived.map((data: any) => ({
        requestId: data._id,
        senderDetails: {
          _id: data.senderId._id,
          name: data.senderId.name,
          picture: data.senderId.picture,
        },
        status: "pending" as const,
      }));
      return { pendingReceived: transformedRequests, totalPages };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || {
          message: "Failed to fetch friend requests",
        }
      );
    }
  }
);

export const fetchFollowBackUsers = createAsyncThunk<
  FollowBackUser[],
  string,
  { rejectValue: AccessCheckResponse }
>("friendRequests/fetchFollowBackUsers", async (token, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/adda/getFollowBackUsers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success && response.data.data) {
      return response.data.data.map((user: any) => ({
        _id: user._id,
        name: user.name,
        picture: user.picture,
      }));
    }
    return [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || {
        message: "Failed to fetch follow back users",
      }
    );
  }
});

export const acceptFriendRequest = createAsyncThunk<
  { requestId: string; notification?: { id: string; message: string } },
  { requestId: string; token: string },
  { rejectValue: AccessCheckResponse }
>(
  "friendRequests/acceptFriendRequest",
  async ({ requestId, token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.patch(
        `/adda/acceptRequest/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { notification } = response.data;

      // Update notification if it exists
      if (notification?.id) {
        dispatch(
          updateNotification({
            id: notification.id,
            data: {
              isRead: true,
              type: "friend_request_accepted",
              message: notification.message || "Friend request accepted",
            },
          })
        );
      }

      // Re-fetch notifications to ensure sync
      dispatch(fetchNotifications({ token, page: 1 }));

      return { requestId, notification };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || {
          message: "Failed to accept friend request",
        }
      );
    }
  }
);

export const declineFriendRequest = createAsyncThunk<
  { requestId: string; notification?: { id: string } },
  { requestId: string; token: string },
  { rejectValue: AccessCheckResponse }
>(
  "friendRequests/declineFriendRequest",
  async ({ requestId, token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.patch(
        `/adda/rejectRequest/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { notification } = response.data;

      // Delete notification if it exists
      if (notification?.id) {
        dispatch(
          deleteNotification({ notificationId: notification.id, token })
        );
      }

      // Re-fetch notifications to ensure sync
      dispatch(fetchNotifications({ token, page: 1 }));

      return { requestId, notification };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || {
          message: "Failed to decline friend request",
        }
      );
    }
  }
);

export const sendFollowBackRequest = createAsyncThunk<
  { userId: string; success: boolean },
  { userId: string; token: string },
  { rejectValue: AccessCheckResponse }
>(
  "friendRequests/sendFollowBackRequest",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/adda/request/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { userId, success: response.data.success };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || {
          message: "Failed to send follow back request",
        }
      );
    }
  }
);

export const declineFollowBackRequest = createAsyncThunk<
  { userId: string; success: boolean },
  { userId: string; token: string },
  { rejectValue: AccessCheckResponse }
>(
  "friendRequests/declineFollowBackRequest",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/adda/decline-follow-back",
        { targetUserId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { userId, success: response.data.success };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || {
          message: "Failed to decline follow back request",
        }
      );
    }
  }
);

const friendRequestSlice = createSlice({
  name: "friendRequests",
  initialState,
  reducers: {
    resetRequests(state) {
      state.requests = null;
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
      state.error = null;
    },
    resetFollowBackUsers(state) {
      state.followBackUsers = null;
      state.followBackLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = state.requests
          ? [...state.requests, ...action.payload.pendingReceived]
          : action.payload.pendingReceived;
        state.page += 1;
        state.hasMore = state.page <= action.payload.totalPages;
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch friend requests";
        state.accessCheck = action.payload || null;
      })
      .addCase(fetchFollowBackUsers.pending, (state) => {
        state.followBackLoading = true;
        state.error = null;
      })
      .addCase(fetchFollowBackUsers.fulfilled, (state, action) => {
        state.followBackUsers = action.payload;
        state.followBackLoading = false;
      })
      .addCase(fetchFollowBackUsers.rejected, (state, action) => {
        state.followBackUsers = [];
        state.followBackLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch follow back users";
        state.accessCheck = action.payload || null;
      })
      .addCase(acceptFriendRequest.pending, (state, action) => {
        if (state.requests) {
          state.requests = state.requests.map((request) =>
            request.requestId === action.meta.arg.requestId
              ? { ...request, status: "accepting" }
              : request
          );
        }
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        if (state.requests) {
          state.requests = state.requests.filter(
            (request) => request.requestId !== action.payload.requestId
          );
        }
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        if (state.requests) {
          state.requests = state.requests.map((request) =>
            request.requestId === action.meta.arg.requestId
              ? { ...request, status: "pending" }
              : request
          );
        }
        state.error =
          action.payload?.message || "Failed to accept friend request";
        state.accessCheck = action.payload || null;
      })
      .addCase(declineFriendRequest.pending, (state, action) => {
        if (state.requests) {
          state.requests = state.requests.map((request) =>
            request.requestId === action.meta.arg.requestId
              ? { ...request, status: "declining" }
              : request
          );
        }
      })
      .addCase(declineFriendRequest.fulfilled, (state, action) => {
        if (state.requests) {
          state.requests = state.requests.filter(
            (request) => request.requestId !== action.payload.requestId
          );
        }
      })
      .addCase(declineFriendRequest.rejected, (state, action) => {
        if (state.requests) {
          state.requests = state.requests.map((request) =>
            request.requestId === action.meta.arg.requestId
              ? { ...request, status: "pending" }
              : request
          );
        }
        state.error =
          action.payload?.message || "Failed to decline friend request";
        state.accessCheck = action.payload || null;
      })
      .addCase(sendFollowBackRequest.pending, (state, action) => {
        if (state.followBackUsers) {
          state.followBackUsers = state.followBackUsers.map((user) =>
            user._id === action.meta.arg.userId
              ? { ...user, status: "following-in-progress" }
              : user
          );
        }
      })
      .addCase(sendFollowBackRequest.fulfilled, (state, action) => {
        if (state.followBackUsers) {
          state.followBackUsers = state.followBackUsers.filter(
            (user) => user._id !== action.payload.userId
          );
        }
      })
      .addCase(sendFollowBackRequest.rejected, (state, action) => {
        if (state.followBackUsers) {
          state.followBackUsers = state.followBackUsers.map((user) =>
            user._id === action.meta.arg.userId
              ? { ...user, status: undefined }
              : user
          );
        }
        state.error =
          action.payload?.message || "Failed to send follow back request";
        state.accessCheck = action.payload || null;
      })
      .addCase(declineFollowBackRequest.pending, (state, action) => {
        if (state.followBackUsers) {
          state.followBackUsers = state.followBackUsers.map((user) =>
            user._id === action.meta.arg.userId
              ? { ...user, status: "declining" }
              : user
          );
        }
      })
      .addCase(declineFollowBackRequest.fulfilled, (state, action) => {
        if (state.followBackUsers) {
          state.followBackUsers = state.followBackUsers.filter(
            (user) => user._id !== action.payload.userId
          );
        }
      })
      .addCase(declineFollowBackRequest.rejected, (state, action) => {
        if (state.followBackUsers) {
          state.followBackUsers = state.followBackUsers.map((user) =>
            user._id === action.meta.arg.userId
              ? { ...user, status: undefined }
              : user
          );
        }
        state.error =
          action.payload?.message || "Failed to decline follow back request";
        state.accessCheck = action.payload || null;
      });
  },
});

export const { resetRequests, resetFollowBackUsers } =
  friendRequestSlice.actions;
export default friendRequestSlice.reducer;
