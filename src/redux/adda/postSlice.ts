import axiosInstance from "@/api/axios";
import { PostState } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface PostsState {
  posts: PostState[];
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: PostsState = {
  posts: [],
  error: null,
  status: "idle",
};

export const fetchPosts = createAsyncThunk<PostState[], void, { rejectValue: string }>(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/posts");
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError;
      return rejectWithValue(
        error.response?.data ? (error.response.data as { message?: string }).message || "Failed to fetch posts" : "Failed to fetch posts"
      );
    }
  }
);

export const addPost = createAsyncThunk<PostState, Partial<PostState>, { rejectValue: string }>(
  "posts/addPost",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/posts", postData);
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError;
      return rejectWithValue(
        error.response?.data ? (error.response.data as { message?: string }).message || "Failed to add the post" : "Failed to add the post"
      );
    }
  }
);

export const likePost = createAsyncThunk<PostState, string, { rejectValue: string }>(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/posts/${postId}/like`);
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError;
      return rejectWithValue(
        error.response?.data ? (error.response.data as { message?: string }).message || "Failed to like the post" : "Failed to like the post"
      );
    }
  }
);

export const unlikePost = createAsyncThunk<PostState, string, { rejectValue: string }>(
  "posts/unlikePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/posts/${postId}/unlike`);
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError;
      return rejectWithValue(
        error.response?.data ? (error.response.data as { message?: string }).message || "Failed to unlike the post" : "Failed to unlike the post"
      );
    }
  }
);

export const deletePost = createAsyncThunk<string, string, { rejectValue: string }>(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      return postId;
    } catch (err: unknown) {
      const error = err as AxiosError;
      return rejectWithValue(
        error.response?.data ? (error.response.data as { message?: string }).message || "Failed to delete the post" : "Failed to delete the post"
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
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch posts";
        state.status = "failed";
      })
      
      // Add post
      .addCase(addPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = [action.payload, ...state.posts];
        state.error = null;
      })
      .addCase(addPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add post";
      })
      
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      
      // Unlike post
      .addCase(unlikePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post._id !== action.payload);
      });
  },
});

export default postSlice.reducer;
