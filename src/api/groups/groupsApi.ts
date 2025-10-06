import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Group, GroupMessage, Poll } from "@/types";

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/groups`;

// -------------------- GROUP ASYNC THUNKS --------------------

// Fetch all groups
export const fetchGroups = createAsyncThunk<Group[]>(
  "group/fetchGroups",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}`);
      return data.data as Group[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch members of a group
export const fetchMembers = createAsyncThunk<
  { name: string; picture: string; _id: string }[],
  string
>("group/fetchMembers", async (groupId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${groupId}/members`);
    return data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Fetch messages of a group
export const fetchGroupMessages = createAsyncThunk<GroupMessage[], string>(
  "group/fetchMessages",
  async (groupId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/${groupId}/messages`);
      return data.data as GroupMessage[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

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
  }
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
        { voterId, optionIndex }
      );
      return data.poll as Poll;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Close a poll
export const closePoll = createAsyncThunk<
  Poll,
  { groupId: string; pollId: string }
>("group/closePoll", async ({ groupId, pollId }, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch(
      `${BASE_URL}/${groupId}/polls/${pollId}/close`
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
    console.log("fetching group", groupId, token);
    const response = await axios.get(`${BASE_URL}/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response data :", response.data);
    return response.data.data as Group;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch group"
    );
  }
});
