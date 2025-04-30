import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PostState } from "@/types";
import { fetchProducts } from "../productSlice";

interface Post {
  posts: PostState[];
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: Post = {
  posts: [],
  error: null,
  status: "idle",
};

export const fetchPosts = createAsyncThunk<PostState[]>(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/posts");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

export const addPost = createAsyncThunk(
  "posts/addPost",
  async (postData: Partial<PostState>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/adda/", postData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to add the posts"
      );
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.error.message!;
        state.status = "failed";
      })
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(addPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
      });
  },
});

export default postSlice.reducer;
