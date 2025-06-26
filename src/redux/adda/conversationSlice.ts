import axiosInstance from "@/api/axios";
import { Message } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface Friend {
  _id: string;
  name: string;
  picture?: string;
  email?: string;
  bio?: string;
  isOnline?: boolean;
}

interface UserConversation {
  conversation_id: string;
  friend: Friend;
  lastMessage: string;
  messageType: string;
  updatedAt: string;
  createdAt: string;
  unreadCounts: { [userId: string]: number };
}

interface MessageI {
  conversations: UserConversation[];
  data: Message[];
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed" | "conversationLoading";
  conversationId: string;
  // New fields for infinite scroll
  loadingMore: boolean;
  hasMore: boolean;
}

const initialState: MessageI = {
  conversations: [],
  data: [],
  error: null,
  status: "idle",
  conversationId: "",
  // Initialize new fields
  loadingMore: false,
  hasMore: true,
};

export const fetchConversationId = createAsyncThunk<
  { conversationId: string },
  { selectedUserId: string; token: string },
  { rejectValue: string }
>(
  "conversation/fetchConversationId",
  async ({ selectedUserId, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/conversation/conversationId/${selectedUserId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { conversationId: response.data.data };
    } catch (err: unknown) {
      const error = err as AxiosError;
      return rejectWithValue(
        error.response?.data
          ? (error.response.data as { message?: string }).message ||
              "Failed to fetch conversation id"
          : "Failed to fetch conversation id"
      );
    }
  }
);

// Updated fetchConversation with pagination support
export const fetchConversation = createAsyncThunk<
  { messages: Message[]; hasMore: boolean },
  { conversationId: string; token: string; before?: string },
  { rejectValue: string }
>(
  "conversation/fetchConversation",
  async ({ conversationId, token, before }, { rejectWithValue }) => {
    try {
      const url = before 
        ? `/conversation/${conversationId}?before=${before}`
        : `/conversation/${conversationId}`;
        
      const response = await axiosInstance.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      const messages = response.data.data;
      // If we got less than 50 messages, there are no more to fetch
      const hasMore = messages.length === 50;
      
      return { messages, hasMore };
    } catch (err: unknown) {
      const error = err as AxiosError;
      return rejectWithValue(
        error.response?.data
          ? (error.response.data as { message?: string }).message ||
              "Failed to fetch conversation"
          : "Failed to fetch conversation"
      );
    }
  }
);

export const fetchAllConversations = createAsyncThunk<
  UserConversation[],
  { token: string },
  { rejectValue: string }
>("conversationList/fetchAll", async ({ token }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/conversation", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError;
    return rejectWithValue(
      error.response?.data
        ? (error.response.data as { message?: string }).message ||
            "Failed to fetch conversation"
        : "Failed to fetch conversation"
    );
  }
});

// Slice
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    addNewMessage: (state, action) => {
      state.data.push(action.payload);
    },
    markMessagesAsRead: (state, action) => {
      const { conversationId, userId } = action.payload;

      state.data = state.data.map((msg) => {
        if (
          msg.conversationId === conversationId &&
          msg.receiverId === userId
        ) {
          return { ...msg, isRead: true };
        }
        return msg;
      });
    },
    updateLastMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        message: string;
        fileType?: string;
        updatedAt: string;
      }>
    ) => {
      const index = state.conversations.findIndex(
        (c) => c.conversation_id === action.payload.conversationId
      );
      if (index !== -1) {
        state.conversations[index] = {
          ...state.conversations[index],
          lastMessage: action.payload.message,
          messageType: action.payload.fileType ?? "text",
          updatedAt: action.payload.updatedAt,
        };
      }
    },
    incrementUnreadCount: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) => {
      const convo = state.conversations.find(
        (c) => c.conversation_id === action.payload.conversationId,
      );
      if (convo) {
        console.log('increment unread count')
        const userId = action.payload.userId;
        convo.unreadCounts = convo.unreadCounts || {};
        convo.unreadCounts[userId] = (convo.unreadCounts[userId] || 0) + 1;
      }
    },
    
    resetUnreadCount: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) => {
      const convo = state.conversations.find(
        (c) => c.conversation_id === action.payload.conversationId
      );
      if (convo) {
        const userId = action.payload.userId;
        if (convo.unreadCounts && convo.unreadCounts[userId]) {
          convo.unreadCounts[userId] = 0;
        }
      }
    },
    // New reducer to reset conversation state when switching conversations
    resetConversation: (state) => {
      state.data = [];
      state.hasMore = true;
      state.loadingMore = false;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Updated fetchConversation cases
      .addCase(fetchConversation.pending, (state, action) => {
        // Check if this is initial load or loading more
        if (action.meta.arg.before) {
          state.loadingMore = true;
        } else {
          state.status = "loading";
        }
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        const { messages, hasMore } = action.payload;
        
        if (action.meta.arg.before) {
          // Loading more messages - prepend to beginning (reverse order for chronological display)
          state.data = [...messages.reverse(), ...state.data];
          state.loadingMore = false;
        } else {
          // Initial load - replace all messages (reverse for chronological display)
          state.data = messages.reverse();
          state.status = "succeeded";
        }
        
        state.hasMore = hasMore;
        state.error = null;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        if (action.meta.arg.before) {
          state.loadingMore = false;
        } else {
          state.status = "failed";
        }
        state.error = action.payload || "Failed to fetch conversation";
      })

      //fetch conversation id
      .addCase(fetchConversationId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchConversationId.fulfilled, (state, action) => {
        state.conversationId = action.payload.conversationId;
      })
      .addCase(fetchConversationId.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch conversation id";
      })

      .addCase(fetchAllConversations.pending, (state) => {
        state.status = "conversationLoading";
        state.error = null;
      })
      .addCase(fetchAllConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
      })
      .addCase(fetchAllConversations.rejected, (state, action) => {
        state.error = action.payload || "Failed to load conversation list";
      });
  },
});

export default conversationSlice.reducer;

export const {
  addNewMessage,
  markMessagesAsRead,
  updateLastMessage,
  resetUnreadCount,
  incrementUnreadCount,
  resetConversation,
} = conversationSlice.actions;