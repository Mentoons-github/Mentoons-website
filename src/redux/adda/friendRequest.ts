import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  RequestSender,
  FollowBackUser,
  AccessCheckResponse,
} from "@/types/adda/friendRequest";
import {
  updateNotification,
  deleteNotification,
  fetchNotifications,
} from "@/redux/adda/notificationSlice";
import axios from "axios";

interface FriendRequestsState {
  requests: RequestSender[] | null;
  followBackUsers: FollowBackUser[] | null;
  loading: boolean;
  followBackLoading: boolean;
  hasMore: boolean;
  page: number;
  accessCheck: AccessCheckResponse | null;
  error: string | null;
  message: string;
  success: boolean;
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
  message: "",
  success: false,
};

const BASE_URL = import.meta.env.VITE_PROD_URL;

export const fetchFriendRequests = createAsyncThunk<
  { pendingReceived: RequestSender[]; totalPages: number },
  { page: number; limit: number; token: string },
  { rejectValue: AccessCheckResponse }
>(
  "friendRequests/fetchFriendRequests",
  async ({ page, limit, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/adda/getMyFriendRequests?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
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
        },
      );
    }
  },
);

export const fetchFollowBackUsers = createAsyncThunk<
  FollowBackUser[],
  string,
  { rejectValue: AccessCheckResponse }
>("friendRequests/fetchFollowBackUsers", async (token, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/adda/getFollowBackUsers`, {
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
      },
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
      const response = await axios.patch(
        `${BASE_URL}/adda/acceptRequest/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const { notification } = response.data;

      if (notification?.id) {
        dispatch(
          updateNotification({
            id: notification.id,
            data: {
              isRead: true,
              type: "friend_request_accepted",
              message: notification.message || "Friend request accepted",
            },
          }),
        );
      }

      dispatch(fetchNotifications({ token, page: 1 }));

      return { requestId, notification };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || {
          message: "Failed to accept friend request",
        },
      );
    }
  },
);

export const declineFriendRequest = createAsyncThunk<
  { requestId: string; notification?: { id: string } },
  { requestId: string; token: string },
  { rejectValue: AccessCheckResponse }
>(
  "friendRequests/declineFriendRequest",
  async ({ requestId, token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/adda/rejectRequest/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const { notification } = response.data;

      if (notification?.id) {
        dispatch(
          deleteNotification({ notificationId: notification.id, token }),
        );
      }

      dispatch(fetchNotifications({ token, page: 1 }));

      return { requestId, notification };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || {
          message: "Failed to decline friend request",
        },
      );
    }
  },
);

export const sendFollowBackRequest = createAsyncThunk<
  { userId: string; success: boolean },
  { userId: string; token: string },
  { rejectValue: AccessCheckResponse }
>(
  "friendRequests/sendFollowBackRequest",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/adda/followBack/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return { userId, success: response.data.success };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || {
          message: "Failed to send follow back request",
        },
      );
    }
  },
);

export const unfollowUserThunk = createAsyncThunk<
  { userId: string; success: boolean; message: string },
  { userId: string; token: string },
  { rejectValue: AccessCheckResponse }
>("friendRequests/unfollow", async ({ userId, token }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/adda/unfriend/${userId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return {
      userId,
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || {
        message: "Failed to unfriend user",
      },
    );
  }
});

export const cancelFriendRequestThunk = createAsyncThunk<
  { userId: string; success: boolean; message: string },
  { userId: string; token: string },
  { rejectValue: AccessCheckResponse }
>(
  "friendRequests/cancelRequest",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/adda/cancelRequest/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return {
        userId,
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || {
          message: "Failed to cancel friend request",
        },
      );
    }
  },
);

export const declineFollowBackRequest = createAsyncThunk<
  { userId: string; success: boolean },
  { userId: string; token: string },
  { rejectValue: AccessCheckResponse }
>(
  "friendRequests/declineFollowBackRequest",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/adda/declineFollowBack`,
        { targetUserId: userId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return { userId, success: response.data.success };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || {
          message: "Failed to decline follow back request",
        },
      );
    }
  },
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
    incrementPage(state) {
      state.page += 1;
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
        state.error = null;

        const incoming = action.payload.pendingReceived;

        if (!state.requests) {
          state.requests = incoming;
        } else {
          const existingIds = new Set(state.requests.map((r) => r.requestId));
          const uniqueIncoming = incoming.filter(
            (r) => !existingIds.has(r.requestId),
          );
          state.requests.push(...uniqueIncoming);
        }
        state.hasMore = state.page < action.payload.totalPages;
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch friend requests";
        state.accessCheck = action.payload || null;
      })

      .addCase(fetchFollowBackUsers.pending, (state) => {
        state.followBackLoading = true;
        state.followBackUsers = null;
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
              : request,
          );
        }
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        if (state.requests) {
          state.requests = state.requests.filter(
            (request) => request.requestId !== action.payload.requestId,
          );
        }
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        if (state.requests) {
          state.requests = state.requests.map((request) =>
            request.requestId === action.meta.arg.requestId
              ? { ...request, status: "pending" }
              : request,
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
              : request,
          );
        }
      })
      .addCase(declineFriendRequest.fulfilled, (state, action) => {
        if (state.requests) {
          state.requests = state.requests.filter(
            (request) => request.requestId !== action.payload.requestId,
          );
        }
      })
      .addCase(declineFriendRequest.rejected, (state, action) => {
        if (state.requests) {
          state.requests = state.requests.map((request) =>
            request.requestId === action.meta.arg.requestId
              ? { ...request, status: "pending" }
              : request,
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
              : user,
          );
        }
      })
      .addCase(sendFollowBackRequest.fulfilled, (state, action) => {
        if (state.followBackUsers) {
          state.followBackUsers = state.followBackUsers.filter(
            (user) => user._id !== action.payload.userId,
          );
        }
      })
      .addCase(sendFollowBackRequest.rejected, (state, action) => {
        if (state.followBackUsers) {
          state.followBackUsers = state.followBackUsers.map((user) =>
            user._id === action.meta.arg.userId
              ? { ...user, status: undefined }
              : user,
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
              : user,
          );
        }
      })
      .addCase(declineFollowBackRequest.fulfilled, (state, action) => {
        if (state.followBackUsers) {
          state.followBackUsers = state.followBackUsers.filter(
            (user) => user._id !== action.payload.userId,
          );
        }
      })
      .addCase(declineFollowBackRequest.rejected, (state, action) => {
        if (state.followBackUsers) {
          state.followBackUsers = state.followBackUsers.map((user) =>
            user._id === action.meta.arg.userId
              ? { ...user, status: undefined }
              : user,
          );
        }
        state.error =
          action.payload?.message || "Failed to decline follow back request";
        state.accessCheck = action.payload || null;
      })

      .addCase(unfollowUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(unfollowUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to unfriend user";
        state.accessCheck = action.payload || null;
      })

      .addCase(cancelFriendRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelFriendRequestThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(cancelFriendRequestThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to cancel friend request";
        state.accessCheck = action.payload || null;
      });
  },
});

export const { resetRequests, resetFollowBackUsers, incrementPage } =
  friendRequestSlice.actions;
export default friendRequestSlice.reducer;
