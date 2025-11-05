import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchTasks,
  assignTask,
  submitTask,
  deleteTask,
  updateTaskStatus,
  removeImage,
  Task,
  extendTask,
} from "./taskApi";
import { PaginationMeta } from "@/pages/employee/tasks/tasks";

interface TaskState {
  tasks: Task[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  pagination: null,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch tasks";
      })
      // Assign Task
      .addCase(assignTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(assignTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to assign task";
      })
      // Submit Task
      .addCase(submitTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(submitTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to submit task";
      })
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteTask.fulfilled,
        (
          state,
          action: PayloadAction<void, string, { arg: { taskId: number } }>
        ) => {
          state.loading = false;
          state.tasks = state.tasks.filter(
            (task) => task.id !== action.meta.arg.taskId
          );
        }
      )
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete task";
      })
      // Update Task Status
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateTaskStatus.fulfilled,
        (state, action: PayloadAction<Task>) => {
          state.loading = false;
          const index = state.tasks.findIndex(
            (t) => t.id === action.payload.id
          );
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
        }
      )
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update task status";
      })
      // Remove Image
      .addCase(removeImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeImage.fulfilled,
        (
          state,
          action: PayloadAction<
            void,
            string,
            { arg: { taskId: number; imageId: number } }
          >
        ) => {
          state.loading = false;
          const { taskId, imageId } = action.meta.arg;
          const task = state.tasks.find((t) => t.id === taskId);
          if (task) {
            task.attachments = task.attachments.filter(
              (img) => img.id !== imageId
            );
          }
        }
      )
      .addCase(removeImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to remove image";
      })

      //Extend Deadline
      .addCase(extendTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extendTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(extendTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to extend task";
      });
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;
