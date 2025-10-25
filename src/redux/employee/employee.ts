import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchEmployee, editEmployee, EmployeeProfileResponse } from "./api";
import { EmployeeInterface } from "@/types/employee";

interface EmployeeState {
  employee: EmployeeProfileResponse | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: EmployeeState = {
  employee: null,
  loading: false,
  error: null,
  success: false,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    resetEmployeeState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch employee
    builder
      .addCase(fetchEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        fetchEmployee.fulfilled,
        (state, action: PayloadAction<EmployeeProfileResponse>) => {
          state.loading = false;
          state.employee = action.payload;
          state.success = true;
        }
      )
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch employee data";
      });

    // Edit employee
    builder
      .addCase(editEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        editEmployee.fulfilled,
        (state, action: PayloadAction<EmployeeInterface>) => {
          state.loading = false;
          if (state.employee) {
            state.employee = {
              ...state.employee,
              employee: action.payload,
            };
          } else {
            state.employee = {
              employee: action.payload,
              tasks: {
                assigned: 0,
                submitted: 0,
                completed: 0,
                inProgress: 0,
                overdue: 0,
              },
              recentTasks: [],
            };
          }
          state.success = true;
        }
      )
      .addCase(editEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update employee";
      });
  },
});

export const { resetEmployeeState } = employeeSlice.actions;

export default employeeSlice.reducer;
