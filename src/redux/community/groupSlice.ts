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
  joinGroupThunk,
} from "@/redux/community/groupsThunk";
import { Group, Poll, GroupState } from "@/types";

const initialState: GroupState = {
  data: {
    joinedGroups: [],
    suggestedGroups: [],
  },
  loading: false,
  error: null,
  selectedGroup: null,
  message: "",
  joinSuccess: false,
  groupMessages:[],
  groupMembers:[],
  friendRequests:[]
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    clearGroupReduces(state) {
      state.message = "";
      state.joinSuccess = false;
    },
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
      (
        state,
        action: PayloadAction<{
          joinedGroups: Group[];
          suggestedGroups: Group[];
        }>,
      ) => {
        state.loading = false;
        state.data = action.payload;
      },
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

    builder.addCase(fetchGroupById.fulfilled, (state, action) => {
      state.loading = false;

      const group = action.payload;

      const joinedIndex = state.data.joinedGroups.findIndex(
        (g) => g._id === group._id,
      );

      const suggestedIndex = state.data.suggestedGroups.findIndex(
        (g) => g._id === group._id,
      );

      if (joinedIndex !== -1) {
        state.data.joinedGroups[joinedIndex] = group;
      } else if (suggestedIndex !== -1) {
        state.data.suggestedGroups[suggestedIndex] = group;
      }

      state.selectedGroup = group;
    });

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
        action
      ) => {
        state.loading = false;
        state.groupMembers = action.payload.data
        state.friendRequests = action.payload.friendRequests
      },
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
        action,
      ) => {
        state.loading = false;
        state.groupMessages = action.payload
      },
    );
    builder.addCase(fetchGroupMessages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // -------------------- JOIN GROUPS --------------------
    builder.addCase(joinGroupThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.joinSuccess = false;
    });
    builder.addCase(joinGroupThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload;
      state.joinSuccess = true;

      const { groupId } = action.meta.arg;

      const groupIndex = state.data.suggestedGroups.findIndex(
        (g) => g._id === groupId,
      );

      if (groupIndex !== -1) {
        const joinedGroup = state.data.suggestedGroups[groupIndex];

        state.data.suggestedGroups.splice(groupIndex, 1);

        state.data.joinedGroups.unshift(joinedGroup);
      }
    });

    builder.addCase(joinGroupThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.joinSuccess = false;
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
        const groupIndex = state.data.joinedGroups.findIndex(
          (g) => g._id === groupId,
        );
        if (groupIndex !== -1) {
          state.data.joinedGroups[groupIndex].polls = action.payload;
        }
      },
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
        >,
      ) => {
        state.loading = false;
        const groupId = action.meta.arg.groupId;
        const groupIndex = state.data.joinedGroups.findIndex(
          (g) => g._id === groupId,
        );
        if (groupIndex !== -1) {
          state.data.joinedGroups[groupIndex].polls =
            state.data.joinedGroups[groupIndex].polls || [];
          state.data.joinedGroups[groupIndex].polls.push(action.payload);
        }
      },
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
        >,
      ) => {
        const groupId = action.meta.arg.groupId;
        const groupIndex = state.data.joinedGroups.findIndex(
          (g) => g._id === groupId,
        );
        if (groupIndex !== -1) {
          const pollIndex = state.data.joinedGroups[groupIndex].polls.findIndex(
            (p) => p._id === action.meta.arg.pollId,
          );
          if (pollIndex !== -1) {
            state.data.joinedGroups[groupIndex].polls[pollIndex] =
              action.payload;
          }
        }
      },
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
        >,
      ) => {
        const groupId = action.meta.arg.groupId;
        const groupIndex = state.data.joinedGroups.findIndex(
          (g) => g._id === groupId,
        );
        if (groupIndex !== -1) {
          const pollIndex = state.data.joinedGroups[groupIndex].polls.findIndex(
            (p) => p._id === action.meta.arg.pollId,
          );
          if (pollIndex !== -1) {
            state.data.joinedGroups[groupIndex].polls[pollIndex] =
              action.payload;
          }
        }
      },
    );
  },
});

export const { setSelectedGroup, clearSelectedGroup, clearGroupReduces } =
  groupSlice.actions;
export default groupSlice.reducer;
