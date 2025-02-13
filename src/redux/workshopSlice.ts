import axiosInstance from "@/api/axios";
import { Endpoints } from "@/api/endpoints";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface SubmitWorkshopResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface SubmitWorkshopError {
  message: string;
}

export interface WorkshopState {
  loading: boolean;
  error: string | null;
  success: boolean;
}
interface FormValues {
  name: string;
  guardianName: string;
  guardianContact: string;
  age: string;
  message: string;
  city: string;
  duration: string;
  workshop: string;
}
const initialState: WorkshopState = {
  loading: false,
  error: null,
  success: false,
};

export const submitWorkshopForm = createAsyncThunk<
  SubmitWorkshopResponse,
  FormValues,
  { rejectValue: SubmitWorkshopError }
>(
  "workshop/submitWorkshopForm",
  async (formData: FormValues, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<SubmitWorkshopResponse>(
        Endpoints.WORKSHOP_FORM,
        formData,
      );
      console.log(response, "lllll");
      console.log(response.data, "llllluuuu");
      if (response.data.success === false) {
        console.log(response, "p;dldl;dkl");
        return rejectWithValue({
          message: response.data.message || "Submission failed",
        });
      }
      return response.data;
    } catch (error: any) {
      console.log(error, "yuuttt");
      console.error("Error in submitWorkshopForm:", error);
      if (error.response && error.response.data.error) {
        return rejectWithValue({ message: error.response.data.error });
      }
      return rejectWithValue({ message: "Something went wrong!" });
    }
  },
);

const workshopSlice = createSlice({
  name: "workshop",
  initialState,
  reducers: {
    resetForm: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitWorkshopForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitWorkshopForm.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitWorkshopForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong!";
      });
  },
});

export const { resetForm } = workshopSlice.actions;
export default workshopSlice.reducer;
