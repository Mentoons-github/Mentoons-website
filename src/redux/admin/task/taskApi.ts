import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const API_BASE_URL = `${
  import.meta.env.VITE_PROD_URL
}/employee/task-assignments`;
const ASSIGN_TASK_URL = `${import.meta.env.VITE_PROD_URL}/employee/assign-task`;

export interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  createdAt: string;
  assignedTo: {
    _id: string;
    name: string;
    department?: string;
    role?: string;
  } | null;
  assignedBy: {
    _id: string;
    name: string;
  } | null;
  attachments: Attachment[];
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  submissionFailureReason?: string;
}

export interface Attachment {
  id: number;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface NewTask {
  title: string;
  description: string;
  deadline: string;
  assignedTo: string;
  completed?: boolean;
  priority: "low" | "medium" | "high";
}

// Fetch Tasks

export const fetchTasks = createAsyncThunk<
  Task[],
  {
    token: string;
    employeeId?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: string;
    status?: string;
    searchTerm?: string;
  },
  { rejectValue: string }
>(
  "tasks/fetchTasks",
  async (
    { token, employeeId, date, sortBy, sortOrder, status, searchTerm },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      if (employeeId) params.append("employeeId", employeeId);
      if (date) params.append("date", date);
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("sortOrder", sortOrder);
      if (status) params.append("status", status);
      if (searchTerm) params.append("searchTerm", searchTerm);

      const response = await axios.get<any>(
        `${API_BASE_URL}?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      return data as Task[];
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch tasks"
      );
    }
  }
);

// Assign/Create Task
export const assignTask = createAsyncThunk<
  Task,
  { taskData: NewTask; token: string },
  { rejectValue: string }
>("tasks/assignTask", async ({ taskData, token }, { rejectWithValue }) => {
  try {
    console.log(taskData);
    const response = await axios.post<Task>(ASSIGN_TASK_URL, taskData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || err.message || "Failed to assign task"
    );
  }
});

// Submit Task (e.g., upload images or complete task)
export const submitTask = createAsyncThunk<
  Task,
  {
    taskId: number;
    attachments: Attachment[];
    status?: Task["status"];
    token: string;
    failureReason?: string;
  },
  { rejectValue: string }
>(
  "tasks/submitTask",
  async (
    { taskId, attachments, status, token, failureReason },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post<Task>(
        `${API_BASE_URL}/${taskId}/submit`,
        {
          attachments,
          status: status || "completed",
          failureReason,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to submit task"
      );
    }
  }
);

// Delete Task
export const deleteTask = createAsyncThunk<
  void,
  { taskId: number; token: string },
  { rejectValue: string }
>("tasks/deleteTask", async ({ taskId, token }, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_BASE_URL}/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || err.message || "Failed to delete task"
    );
  }
});

// Update Task Status
export const updateTaskStatus = createAsyncThunk<
  Task,
  { id: number; status: Task["status"]; token: string },
  { rejectValue: string }
>(
  "tasks/updateTaskStatus",
  async ({ id, status, token }, { rejectWithValue }) => {
    try {
      const response = await axios.patch<Task>(
        `${API_BASE_URL}/${id}/status`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to update task status"
      );
    }
  }
);

// Remove Image
export const removeImage = createAsyncThunk<
  void,
  { taskId: number; imageId: number; token: string },
  { rejectValue: string }
>(
  "tasks/removeImage",
  async ({ taskId, imageId, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/${taskId}/image/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to remove image"
      );
    }
  }
);

export const extendTask = createAsyncThunk<
  Task,
  { id: string; token: string; newDeadLine: string },
  { rejectValue: string }
>("task/extend", async ({ id, token, newDeadLine }, { rejectWithValue }) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/extend/${id}`,
      { newDeadLine },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err?.response?.data?.message || "Something went wrong"
    );
  }
});
