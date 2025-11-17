import { createSlice } from "@reduxjs/toolkit";
import { Admin } from "@/types/admin";
import { Notification } from "@/types";
import {
  fetchAdminProfile,
  changePassword,
  editAdminDetails,
  adminFetchNotifications,
  adminMarkNotificationRead,
  handleProfileEdit,
} from "./adminApi";

interface AdminInterface {
  admin: Admin | null;
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  message?: string;
}

const initialState: AdminInterface = {
  admin: null,
  notifications: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Admin profile actions
    builder
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(editAdminDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAdminDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(editAdminDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Notifications
    builder
      .addCase(adminFetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminFetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(adminFetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(adminMarkNotificationRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminMarkNotificationRead.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.map((notif) =>
          notif._id === action.meta.arg.notificationId
            ? { ...notif, isRead: true }
            : notif
        );
      })
      .addCase(adminMarkNotificationRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //profileEdit submission admin
    builder
      .addCase(handleProfileEdit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleProfileEdit.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(handleProfileEdit.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to process profile edit request";
      });
  },
});

export default adminSlice.reducer;
