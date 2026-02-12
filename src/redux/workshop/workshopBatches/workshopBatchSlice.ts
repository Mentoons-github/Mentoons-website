import { createSlice } from "@reduxjs/toolkit";
import {
  addScoringWorkshopThunk,
  assignWorkshopBatchThunk,
  getAllWorkshopBatchesThunk,
  getPsychologistWorkshopBatchesThunk,
  getSingleWorkshopBatchThunk,
  updateScoringWorkshopThunk,
} from "./workshopBatchThunk";
import {
  WorkshopBatchTypes,
  WorkshopPagination,
} from "@/types/workshopsV2/workshopBatchTypes";

interface initialStateType {
  loading: boolean;
  error: string | null;
  message: string;
  batches: WorkshopBatchTypes[];
  singleWorkshopBatch: WorkshopBatchTypes | null;
  assignSuccess: boolean;
  assignLoading: boolean;
  psychologistBatches: WorkshopBatchTypes[];
  scoringSuccess: boolean;
  psychologistPagination: WorkshopPagination | null;
  allPagination: WorkshopPagination | null;
}

const initialState: initialStateType = {
  loading: false,
  message: "",
  error: null,
  batches: [],
  singleWorkshopBatch: null,
  assignSuccess: false,
  assignLoading: false,
  psychologistBatches: [],
  scoringSuccess: false,
  psychologistPagination: null,
  allPagination: null,
};

export const workshopBatchSlice = createSlice({
  name: "workshop_batch",
  initialState,
  reducers: {
    resetWorkshopBatchReducer: (state) => {
      state.assignLoading = false;
      state.assignSuccess = false;
      state.error = null;
      state.loading = false;
      state.message = "";
      state.scoringSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //get workshopbatches
      .addCase(getAllWorkshopBatchesThunk.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(getAllWorkshopBatchesThunk.fulfilled, (state, action) => {
        ((state.loading = false),
          (state.error = null),
          (state.batches = action.payload.data),
          (state.allPagination = action.payload.pagination));
      })
      .addCase(getAllWorkshopBatchesThunk.rejected, (state, action) => {
        ((state.loading = false), (state.error = action.payload as string));
      })

      //get single workshopbatch
      .addCase(getSingleWorkshopBatchThunk.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(getSingleWorkshopBatchThunk.fulfilled, (state, action) => {
        ((state.loading = false),
          (state.error = null),
          (state.singleWorkshopBatch = action.payload));
      })
      .addCase(getSingleWorkshopBatchThunk.rejected, (state, action) => {
        ((state.loading = false), (state.error = action.payload as string));
      })

      //assign workshop batch
      .addCase(assignWorkshopBatchThunk.pending, (state) => {
        state.assignLoading = true;
        state.error = null;
        state.assignSuccess = false;
      })
      .addCase(assignWorkshopBatchThunk.fulfilled, (state, action) => {
        state.assignLoading = false;
        state.error = null;
        state.assignSuccess = true;
        state.message = action.payload.message;
        const updatedBatch = action.payload.data;
        state.singleWorkshopBatch = updatedBatch;
        const index = state.batches.findIndex(
          (batch) => batch._id === updatedBatch._id,
        );

        if (index !== -1) {
          state.batches[index] = updatedBatch;
        }
      })
      .addCase(assignWorkshopBatchThunk.rejected, (state, action) => {
        state.assignLoading = false;
        state.assignSuccess = false;
        state.error = action.payload as string;
      })

      .addCase(getPsychologistWorkshopBatchesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPsychologistWorkshopBatchesThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;
          state.psychologistBatches = action.payload.data;
          state.psychologistPagination = action.payload.pagination;
        },
      )
      .addCase(
        getPsychologistWorkshopBatchesThunk.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      )

      //add scoring
      .addCase(addScoringWorkshopThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addScoringWorkshopThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.scoringSuccess = true;
        const updatedStudent = action.payload.data;

        if (!state.singleWorkshopBatch) return;

        const index = state.singleWorkshopBatch.students.findIndex(
          (student) => student._id === updatedStudent._id,
        );

        if (index !== -1) {
          state.singleWorkshopBatch.students[index] = updatedStudent;
        }
      })
      .addCase(addScoringWorkshopThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // update
      .addCase(updateScoringWorkshopThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateScoringWorkshopThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.scoringSuccess = true;

        const updatedStudent = action.payload.data;

        if (!state.singleWorkshopBatch) return;

        const student = state.singleWorkshopBatch.students.find(
          (s) => s._id === updatedStudent._id,
        );

        if (!student) return;

        student.scoring.sessions = [...updatedStudent.scoring.sessions];
      })

      .addCase(updateScoringWorkshopThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default workshopBatchSlice.reducer;
export const { resetWorkshopBatchReducer } = workshopBatchSlice.actions;
