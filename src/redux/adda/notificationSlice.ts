import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Notification } from "@/types";

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  status: string;
}

const initialState: NotificationState = {
  notifications: [],
  status: "",
  isLoading: false,
  error: null,
  hasMore: true,
};

export const fetchFriendRequest = createAsyncThunk<
  { status: string },
  { token: string; requestId: string },
  { rejectValue: string }
>(
  "notifications/fetchFriendRequest",
  async ({ token, requestId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/adda/request/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data.data.request,'its status of friend request')
      return res.data.data.request;
    } catch (error) {
      return rejectWithValue("Failed to fetch friend request details");
    }
  }
);

export const fetchNotifications = createAsyncThunk<
  { notifications: Notification[]; hasMore: boolean },
  { token: string | null; page: number; limit?: number },
  { rejectValue: string }
>(
  "notifications/fetch",
  async ({ token, page, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/adda/userNotifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { page, limit },
        }
      );

      const notifications = Array.isArray(res.data.data)
        ? res.data.data
        : res.data.notifications || [];
      return {
        notifications,
        hasMore: notifications.length === limit,
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch notifications");
    }
  }
);

export const markNotificationRead = createAsyncThunk<
  { notificationId: string },
  { notificationId: string; token: string },
  { rejectValue: string }
>(
  "notifications/markRead",
  async ({ notificationId, token }, { rejectWithValue }) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_PROD_URL
        }/adda/userNotifications/${notificationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { notificationId };
    } catch (error) {
      return rejectWithValue("Failed to mark notification as read");
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("notifications/markAllRead", async (token, { rejectWithValue }) => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_PROD_URL}/adda/markAllNotificationsRead`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    return rejectWithValue("Failed to mark all notifications as read");
  }
});

export const deleteNotification = createAsyncThunk<
  { notificationId: string },
  { notificationId: string; token: string },
  { rejectValue: string }
>(
  "notifications/delete",
  async ({ notificationId, token }, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_PROD_URL
        }/adda/userNotifications/${notificationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { notificationId };
    } catch (error) {
      return rejectWithValue("Failed to delete notification");
    }
  }
);

export const clearAllNotifications = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("notifications/clearAll", async (token, { rejectWithValue }) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_PROD_URL}/adda/delete-usernotifications`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    return rejectWithValue("Failed to clear all notifications");
  }
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    updateNotification: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Notification> }>
    ) => {
      const index = state.notifications.findIndex(
        (n) => n._id === action.payload.id
      );
      if (index !== -1) {
        state.notifications[index] = {
          ...state.notifications[index],
          ...action.payload.data,
        };
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n._id !== action.payload
      );
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFriendRequest.fulfilled, (state,action) => {
        state.status = action.payload.status;
        state.isLoading = false;
      })
      .addCase(fetchFriendRequest.rejected, (state, action) => {
        state.error = action.payload || "Failed to clear all notifications";
        state.isLoading = false;
      })
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.notifications = action.payload.notifications;
        } else {
          state.notifications = [
            ...state.notifications,
            ...action.payload.notifications,
          ];
        }
        state.hasMore = action.payload.hasMore;
        state.isLoading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch notifications";
        state.isLoading = false;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notif = state.notifications.find(
          (n) => n._id === action.payload.notificationId
        );
        if (notif) notif.isRead = true;
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.error = action.payload || "Failed to mark notification as read";
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.isRead = true;
        });
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.error =
          action.payload || "Failed to mark all notifications as read";
      })
      .addCase(deleteNotification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload.notificationId
        );
        state.isLoading = false;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete notification";
        state.isLoading = false;
      })
      .addCase(clearAllNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.hasMore = false;
        state.isLoading = false;
      })
      .addCase(clearAllNotifications.rejected, (state, action) => {
        state.error = action.payload || "Failed to clear all notifications";
        state.isLoading = false;
      });
  },
});

export const { updateNotification, removeNotification, addNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
