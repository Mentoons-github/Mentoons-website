import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchGroups,
  closePoll,
  createPoll,
  fetchGroupMessages,
  fetchMembers,
  fetchPolls,
  votePoll,
  fetchGroupById,
} from "@/api/groups/groupsApi";
import { Group, GroupMessage, Poll, GroupState } from "@/types";

const initialState: GroupState = {
  data: [],
  loading: false,
  error: null,
  selectedGroup: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setSelectedGroup(state, action: PayloadAction<Group | null>) {
      state.selectedGroup = action.payload;
    },
    clearSelectedGroup(state) {
      state.selectedGroup = null;
    },
  },
  extraReducers: (builder) => {
    // -------------------- FETCH GROUPS --------------------
    builder.addCase(fetchGroups.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchGroups.fulfilled,
      (state, action: PayloadAction<Group[]>) => {
        state.loading = false;
        state.data = action.payload;
      }
    );
    builder.addCase(fetchGroups.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // -------------------- FETCH GROUP BY ID --------------------
    builder.addCase(fetchGroupById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchGroupById.fulfilled,
      (state, action: PayloadAction<Group, string, { arg: string }>) => {
        state.loading = false;
        const groupIndex = state.data.findIndex(
          (g) => g._id === action.payload._id
        );
        if (groupIndex !== -1) {
          state.data[groupIndex] = action.payload;
        } else {
          state.data.push(action.payload);
        }
        state.selectedGroup = action.payload;
      }
    );
    builder.addCase(fetchGroupById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // -------------------- FETCH MEMBERS --------------------
    builder.addCase(fetchMembers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchMembers.fulfilled,
      (
        state,
        action: PayloadAction<
          { name: string; picture: string; _id: string }[],
          string,
          { arg: string; requestId: string; requestStatus: "fulfilled" }
        >
      ) => {
        state.loading = false;
        const groupId = action.meta.arg;
        const groupIndex = state.data.findIndex((g) => g._id === groupId);
        if (groupIndex !== -1) {
          state.data[groupIndex].members = action.payload;
        }
      }
    );
    builder.addCase(fetchMembers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // -------------------- FETCH MESSAGES --------------------
    builder.addCase(fetchGroupMessages.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchGroupMessages.fulfilled,
      (
        state,
        action: PayloadAction<GroupMessage[], string, { arg: string }>
      ) => {
        state.loading = false;
        const groupId = action.meta.arg;
        const groupIndex = state.data.findIndex((g) => g._id === groupId);
        if (groupIndex !== -1) {
          state.data[groupIndex].message = action.payload;
        }
      }
    );
    builder.addCase(fetchGroupMessages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // -------------------- FETCH POLLS --------------------
    builder.addCase(fetchPolls.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchPolls.fulfilled,
      (state, action: PayloadAction<Poll[], string, { arg: string }>) => {
        state.loading = false;
        const groupId = action.meta.arg;
        const groupIndex = state.data.findIndex((g) => g._id === groupId);
        if (groupIndex !== -1) {
          state.data[groupIndex].polls = action.payload;
        }
      }
    );
    builder.addCase(fetchPolls.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // -------------------- CREATE POLL --------------------
    builder.addCase(createPoll.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createPoll.fulfilled,
      (
        state,
        action: PayloadAction<
          Poll,
          string,
          { arg: { groupId: string; pollData: Partial<Poll> } }
        >
      ) => {
        state.loading = false;
        const groupId = action.meta.arg.groupId;
        const groupIndex = state.data.findIndex((g) => g._id === groupId);
        if (groupIndex !== -1) {
          state.data[groupIndex].polls.push(action.payload);
        }
      }
    );
    builder.addCase(createPoll.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // -------------------- VOTE POLL --------------------
    builder.addCase(
      votePoll.fulfilled,
      (
        state,
        action: PayloadAction<
          Poll,
          string,
          {
            arg: {
              groupId: string;
              pollId: string;
              voterId: string;
              optionIndex: number;
            };
          }
        >
      ) => {
        const groupId = action.meta.arg.groupId;
        const groupIndex = state.data.findIndex((g) => g._id === groupId);
        if (groupIndex !== -1) {
          const pollIndex = state.data[groupIndex].polls.findIndex(
            (p) => p._id === action.meta.arg.pollId
          );
          if (pollIndex !== -1) {
            state.data[groupIndex].polls[pollIndex] = action.payload;
          }
        }
      }
    );

    // -------------------- CLOSE POLL --------------------
    builder.addCase(
      closePoll.fulfilled,
      (
        state,
        action: PayloadAction<
          Poll,
          string,
          { arg: { groupId: string; pollId: string } }
        >
      ) => {
        const groupId = action.meta.arg.groupId;
        const groupIndex = state.data.findIndex((g) => g._id === groupId);
        if (groupIndex !== -1) {
          const pollIndex = state.data[groupIndex].polls.findIndex(
            (p) => p._id === action.meta.arg.pollId
          );
          if (pollIndex !== -1) {
            state.data[groupIndex].polls[pollIndex] = action.payload;
          }
        }
      }
    );
  },
});

export const { setSelectedGroup, clearSelectedGroup } = groupSlice.actions;
export default groupSlice.reducer;
