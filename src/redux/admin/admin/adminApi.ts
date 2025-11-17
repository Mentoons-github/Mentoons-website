import { Notification } from "@/types";
import { Admin } from "@/types/admin";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/admin`;

export const fetchAdminProfile = createAsyncThunk<Admin, { token: string }>(
  "admin/profile",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await axios(`${BASE_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      console.error("error found fetch admin :", error);
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err?.response?.data?.message || "Failed fetch admin profile"
      );
    }
  }
);

interface ChangePasswordResponse {
  message: string;
}
export const changePassword = createAsyncThunk<
  { message: ChangePasswordResponse },
  { newPassword: string; token: string }
>("admin/changePass", async ({ newPassword, token }, { rejectWithValue }) => {
  try {
    console.log(newPassword);
    const response = await axios.patch(
      `${BASE_URL}/change-password`,
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("error found fetch admin :", error);
    const err = error as AxiosError<{ error: string }>;
    return rejectWithValue(
      err?.response?.data?.error || "Failed to update password"
    );
  }
});

export const editAdminDetails = createAsyncThunk<
  Admin,
  { data: Partial<Admin>; token: string }
>("admin/edit", async ({ token, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/edit`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error found fetch admin :", error);
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err?.response?.data?.message || "Failed to update password"
    );
  }
});

export const adminFetchNotifications = createAsyncThunk<
  Notification[],
  { token: string }
>("adminNotifications/fetch", async ({ token }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const notifications = Array.isArray(response.data.notifications)
      ? response.data.notifications
      : Array.isArray(response.data)
      ? response.data
      : [];
    return notifications;
  } catch (error: unknown) {
    console.error("Error fetching notifications:", error);
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err?.response?.data?.message || "Failed to fetch notifications"
    );
  }
});

export const adminMarkNotificationRead = createAsyncThunk<
  { message: string },
  { token: string; notificationId: string }
>(
  "adminNotifications/markRead",
  async ({ token, notificationId }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error marking notification read:", error);
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err?.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }
);

export const handleProfileEdit = createAsyncThunk<
  { message: string },
  { token: string; action: "approved" | "rejected"; employeeId: string },
  { rejectValue: string }
>(
  "admin/profileEdit",
  async ({ token, action, employeeId }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/employees/${employeeId}/profileEditRequest`,
        { action },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.message;
    } catch (error: unknown) {
      console.error("Error marking notification read:", error);
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err?.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }
);
