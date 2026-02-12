import { EmployeeInterface } from "@/types/employee";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/employee`;

export interface TaskStats {
  assigned: number;
  submitted: number;
  completed: number;
  inProgress: number;
  overdue: number;
}

export interface RecentTask {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed" | "overdue" | "transferred";
  dueDate: string;
}

export interface EmployeeProfileResponse {
  employee: EmployeeInterface;
  tasks: TaskStats;
  recentTasks: RecentTask[];
}

export const fetchEmployee = createAsyncThunk<
  EmployeeProfileResponse,
  string,
  { rejectValue: string }
>("employee/fetch", async (token, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err?.response?.data?.message || "Error fetching employee data",
    );
  }
});

export const editEmployee = createAsyncThunk<
  EmployeeInterface,
  { updatedData: Partial<EmployeeInterface>; token: string },
  { rejectValue: string }
>("employee/edit", async ({ updatedData, token }, { rejectWithValue }) => {
  try {
    const currentResponse = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const currentEmployee: EmployeeInterface = currentResponse.data.employee;

    const validatedData: Partial<EmployeeInterface> = {
      user: {
        name: updatedData.user?.name || currentEmployee.user.name,
        gender: updatedData.user?.gender || currentEmployee.user.gender,
        picture: updatedData.user?.picture || currentEmployee.user.picture,
        email: currentEmployee.user.email,
        role: currentEmployee.user.role,
        phoneNumber: currentEmployee.user.phoneNumber,
        dob: currentEmployee.user.dob
          ? currentEmployee.user.dob
          : updatedData.user?.dob || null,
      },
    };

    const cleanData = JSON.parse(
      JSON.stringify(validatedData),
    ) as Partial<EmployeeInterface>;

    const response = await axios.put(`${BASE_URL}/edit`, cleanData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as EmployeeInterface;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err?.response?.data?.message || "Failed to update employee",
    );
  }
});
