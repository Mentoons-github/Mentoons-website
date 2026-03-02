import {
  Employee,
  EmployeeDataResponse,
  SingleEmployeeDataResponse,
} from "@/types/employee";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/employee`;

export const getEmployees = createAsyncThunk<
  EmployeeDataResponse,
  {
    sortOrder: string;
    searchTerm: string;
    page: number;
    limit: number;
    from?: string;
  }
>(
  "employees/getEmployees",
  async ({ sortOrder, searchTerm, page, limit, from }) => {
    const { data } = await axios.get<EmployeeDataResponse>(`${BASE_URL}/`, {
      params: { sort: sortOrder, search: searchTerm, page, limit, from },
      headers: { Accept: "application/json" },
    });
    return data;
  },
);

// Get Employee by ID
export const getEmployeeById = createAsyncThunk<
  SingleEmployeeDataResponse,
  string
>("employees/getEmployeeById", async (id) => {
  const { data } = await axios.get<SingleEmployeeDataResponse>(
    `${BASE_URL}/${id}`,
    {
      headers: { Accept: "application/json" },
    },
  );
  return data;
});

// Create Employee
export const createEmployee = createAsyncThunk<
  SingleEmployeeDataResponse,
  Employee
>("employees/createEmployee", async (employee) => {
  console.log(employee);
  const { data } = await axios.post<SingleEmployeeDataResponse>(
    `${BASE_URL}/`,
    employee,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
  return data;
});

// Delete Employee
export const deleteEmployee = createAsyncThunk<
  { status: boolean; message: string; deletedId: string },
  string
>("employees/deleteEmployee", async (id) => {
  const { data } = await axios.delete<{
    status: boolean;
    message: string;
    deletedId: string;
  }>(`${BASE_URL}/${id}`, {
    headers: { Accept: "application/json" },
  });
  return data;
});

// Update Employee
export const updateEmployee = createAsyncThunk<
  SingleEmployeeDataResponse,
  Employee
>("employees/updateEmployee", async (employee) => {
  const { data } = await axios.put<SingleEmployeeDataResponse>(
    `${BASE_URL}/${employee._id}`,
    employee,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
  return data;
});
