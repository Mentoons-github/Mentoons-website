import { Employee } from "@/types/employee";
import { createSlice } from "@reduxjs/toolkit";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
} from "./api";

interface EmployeeState {
  employees: Employee[];
  employee?: Employee | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalEmployees?: number;
}

const initialState: EmployeeState = {
  employees: [],
  employee: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalEmployees: 0,
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    //Get Employees
    builder
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data.employees;
        state.currentPage =
          action.payload.data.currentPage || state.currentPage;
        state.totalPages = action.payload.data.totalPages || 1;
        state.totalEmployees =
          action.payload.data.totalEmployees || state.employees.length;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch employees";
      });

    //Get Employee by ID
    builder
      .addCase(getEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload.data;
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch employee";
      });

    //Create Employee
    builder.addCase(createEmployee.fulfilled, (state, action) => {
      state.employees.push(action.payload.data);
      state.totalEmployees = (state.totalEmployees || 0) + 1;
    });

    //Delete Employee
    builder.addCase(deleteEmployee.fulfilled, (state, action) => {
      const deletedId = action.payload.deletedId;
      state.employees = state.employees.filter((emp) => emp._id !== deletedId);
      state.totalEmployees = (state.totalEmployees || 0) - 1;
    });

    //Update Employee
    builder.addCase(updateEmployee.fulfilled, (state, action) => {
      const updated = action.payload.data;
      const idx = state.employees.findIndex((emp) => emp._id === updated._id);
      if (idx >= 0) {
        state.employees[idx] = updated;
      }
    });
  },
});

export const { setCurrentPage } = employeeSlice.actions;
export default employeeSlice.reducer;
