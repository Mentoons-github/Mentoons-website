import axiosInstance from "@/api/axios";
import { PostState } from "@/types";
import { EditPostTypes, PostDetails } from "@/types/adda/posts";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface PostsState {
  post: PostDetails | null;
  posts: PostState[];
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  message: string;
}

const initialState: PostsState = {
  post: null,
  posts: [],
  error: null,
  status: "idle",
  message: "",
};

export const fetchPosts = createAsyncThunk<
  PostState[],
  void,
  { rejectValue: string }
>("posts/fetchPosts", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/posts");
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError;
    return rejectWithValue(
      error.response?.data
        ? (error.response.data as { message?: string }).message ||
            "Failed to fetch posts"
        : "Failed to fetch posts"
    );
  }
});

export const addPost = createAsyncThunk<
  PostState,
  Partial<PostState>,
  { rejectValue: string }
>("posts/addPost", async (postData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/posts", postData);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError;
    return rejectWithValue(
      error.response?.data
        ? (error.response.data as { message?: string }).message ||
            "Failed to add the post"
        : "Failed to add the post"
    );
  }
});

export const likePost = createAsyncThunk<
  PostState,
  string,
  { rejectValue: string }
>("posts/likePost", async (postId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/posts/${postId}/like`);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError;
    return rejectWithValue(
      error.response?.data
        ? (error.response.data as { message?: string }).message ||
            "Failed to like the post"
        : "Failed to like the post"
    );
  }
});

export const unlikePost = createAsyncThunk<
  PostState,
  string,
  { rejectValue: string }
>("posts/unlikePost", async (postId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/posts/${postId}/unlike`);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError;
    return rejectWithValue(
      error.response?.data
        ? (error.response.data as { message?: string }).message ||
            "Failed to unlike the post"
        : "Failed to unlike the post"
    );
  }
});

export const deletePost = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("posts/deletePost", async (postId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/posts/${postId}`);
    return postId;
  } catch (err: unknown) {
    const error = err as AxiosError;
    return rejectWithValue(
      error.response?.data
        ? (error.response.data as { message?: string }).message ||
            "Failed to delete the post"
        : "Failed to delete the post"
    );
  }
});

export const updatePostThunk = createAsyncThunk<
  PostState,
  { postId: string; data: EditPostTypes; token: string },
  { rejectValue: string }
>("posts/updatePost", async ({ postId, data, token }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/posts/${postId}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError;
    return rejectWithValue(
      error.response?.data
        ? (error.response.data as { message?: string }).message ||
            "Failed to update the post"
        : "Failed to update the post"
    );
  }
});

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    resetUpdateState(state) {
      state.status = "idle";
      state.error = null;
    },
  },
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
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })

      // Unlike post
      .addCase(unlikePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })

      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })

      // update post
      .addCase(updatePostThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePostThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.post = action.payload;
        state.error = null;
      })
      .addCase(updatePostThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add post";
      });
  },
});

export const { resetUpdateState } = postSlice.actions;
export default postSlice.reducer;
