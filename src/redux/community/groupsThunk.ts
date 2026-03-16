import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Group, GroupMessage, Poll } from "@/types";
import {
  fetchGroupMessagesApi,
  fetchGroupsApi,
  fetchMembersApi,
  joinGroupApi,
} from "./groupsApi";
import { FilteredFriendRequest } from "@/types/adda/home";
import { User } from "@/types/adda/notification";

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/groups`;

// -------------------- GROUP ASYNC THUNKS --------------------

// Fetch all groups
export const fetchGroups = createAsyncThunk<
  { joinedGroups: Group[]; suggestedGroups: Group[] },
  string
>("group/fetchGroups", async (token, { rejectWithValue }) => {
  try {
    const res = await fetchGroupsApi(token);
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error?.response?.data?.message || "Fetch groups error",
    );
  }
});

// Fetch members of a group
export const fetchMembers = createAsyncThunk<
  { data: User[]; friendRequests: FilteredFriendRequest[] },
  { token: string; groupId: string }
>("group/fetchMembers", async ({ groupId, token }, { rejectWithValue }) => {
  try {
    const { data } = await fetchMembersApi(groupId, token);
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error?.response?.data?.message || "Error from fetch members",
    );
  }
});

// Fetch messages of a group
export const fetchGroupMessages = createAsyncThunk<
  GroupMessage[],
  { groupId: string; token: string }
>("group/fetchMessages", async ({ groupId, token }, { rejectWithValue }) => {
  try {
    const { data } = await fetchGroupMessagesApi(groupId, token);
    return data.data as GroupMessage[];
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error?.response?.data?.message || "Cant fetch messages from this group",
    );
  }
});

// join group thunk
export const joinGroupThunk = createAsyncThunk<
  string,
  { groupId: string; token: string },
  { rejectValue: string }
>("group/join-group", async ({ groupId, token }, { rejectWithValue }) => {
  try {
    const res = await joinGroupApi(groupId, token);
    return res.data.message;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error?.response?.data?.message || "Cant join group now",
    );
  }
});

// -------------------- POLL ASYNC THUNKS --------------------

// Fetch polls for a group
export const fetchPolls = createAsyncThunk<Poll[], string>(
  "group/fetchPolls",
  async (groupId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/${groupId}/polls`);
      return data.data as Poll[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Create a new poll
export const createPoll = createAsyncThunk<
  Poll,
  { groupId: string; pollData: Partial<Poll> }
>("group/createPoll", async ({ groupId, pollData }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/${groupId}/polls`, pollData);
    return data.poll as Poll;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Vote for a poll
export const votePoll = createAsyncThunk<
  Poll,
  { groupId: string; pollId: string; voterId: string; optionIndex: number }
>(
  "group/votePoll",
  async ({ groupId, pollId, voterId, optionIndex }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/${groupId}/polls/${pollId}/vote`,
        { voterId, optionIndex },
      );
      return data.poll as Poll;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Close a poll
export const closePoll = createAsyncThunk<
  Poll,
  { groupId: string; pollId: string }
>("group/closePoll", async ({ groupId, pollId }, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch(
      `${BASE_URL}/${groupId}/polls/${pollId}/close`,
    );
    return data.poll as Poll;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchGroupById = createAsyncThunk<
  Group,
  { groupId: string; token: string }
>("group/fetchById", async ({ groupId, token }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response data:", response.data);
    return response.data.data as Group;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch group",
    );
  }
});
