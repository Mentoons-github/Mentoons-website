import axiosInstance from "@/api/axios";
import {
  AddPointsRequest,
  PointTransaction,
  RewardEventType,
  RewardTier,
  UserRewardState,
} from "@/types/rewards";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

// API error response type
interface ApiErrorResponse {
  message: string;
}

// Define the initial tier thresholds
const TIER_THRESHOLDS = {
  [RewardTier.BRONZE]: { min: 0, max: 499 },
  [RewardTier.SILVER]: { min: 500, max: 1499 },
  [RewardTier.GOLD]: { min: 1500, max: Infinity },
};

// Define the points for each action
const POINTS_CONFIG = {
  [RewardEventType.DAILY_LOGIN]: 2,
  [RewardEventType.REGISTRATION]: 5,
  [RewardEventType.PROFILE_COMPLETION]: 10,
  [RewardEventType.LIKE_POST]: 2,
  [RewardEventType.LOVE_POST]: 3,
  [RewardEventType.COMMENT_POST]: 5,
  [RewardEventType.SHARE_POST]: 3,
  [RewardEventType.CREATE_STATUS]: 5,
  [RewardEventType.JOIN_GROUP]: 8,
  [RewardEventType.FOLLOW_USER]: 5,
  [RewardEventType.PURCHASE_PRODUCT]: 10,
  [RewardEventType.SHARE_PRODUCT]: 5,
  [RewardEventType.BOOK_SESSION]: 10,
  [RewardEventType.APPLY_JOB]: 8,
  [RewardEventType.LISTEN_AUDIO_COMIC]: 5,
  [RewardEventType.LISTEN_PODCAST]: 5,
  [RewardEventType.READ_COMIC]: 5,
  [RewardEventType.SAVED_POST]: 4,
};

const initialState: UserRewardState = {
  totalPoints: 0,
  currentTier: RewardTier.BRONZE,
  pointsToNextTier: TIER_THRESHOLDS[RewardTier.SILVER].min,
  transactions: [],
  availableRewards: [],
  loading: false,
  error: null,
};

// Calculate current tier based on points
const calculateTier = (points: number): RewardTier => {
  if (points >= TIER_THRESHOLDS[RewardTier.GOLD].min) {
    return RewardTier.GOLD;
  } else if (points >= TIER_THRESHOLDS[RewardTier.SILVER].min) {
    return RewardTier.SILVER;
  } else {
    return RewardTier.BRONZE;
  }
};

// Calculate points needed for next tier
const calculatePointsToNextTier = (
  currentPoints: number,
  currentTier: RewardTier
): number => {
  if (currentTier === RewardTier.GOLD) {
    return 0; // Already at highest tier
  } else if (currentTier === RewardTier.SILVER) {
    return TIER_THRESHOLDS[RewardTier.GOLD].min - currentPoints;
  } else {
    return TIER_THRESHOLDS[RewardTier.SILVER].min - currentPoints;
  }
};

// Update fetchUserRewards to accept a token
export const fetchUserRewards = createAsyncThunk(
  "rewards/fetchUserRewards",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      console.log("Fetching user rewards with token");
      const response = await axiosInstance.get("/rewards/user-rewards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Failed to fetch rewards:", error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to fetch rewards"
      );
    }
  }
);

export const addRewardPoints = createAsyncThunk(
  "rewards/addPoints",

  async (request: AddPointsRequest, { rejectWithValue }) => {
    try {
      console.log("Adding reward points:", request);
      if (!request.token) {
        console.error("No authentication token available");
        return rejectWithValue("Authentication required");
      }

      console.log("Making API request to add reward points:", request);

      const response = await axiosInstance.post(
        "/rewards/add-points",
        request,
        {
          headers: {
            Authorization: `Bearer ${request.token}`,
          },
        }
      );

      console.log("Reward points API response:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("Failed to add reward points:", error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to add reward points"
      );
    }
  }
);

const rewardSlice = createSlice({
  name: "rewards",
  initialState,
  reducers: {
    // Local point addition without API call (for testing/development)
    addPointsLocally: (
      state,
      action: PayloadAction<{
        eventType: RewardEventType;
        referenceId?: string;
      }>
    ) => {
      const { eventType, referenceId } = action.payload;
      const points = POINTS_CONFIG[eventType];

      // Add the transaction
      const newTransaction: PointTransaction = {
        _id: Date.now().toString(), // Mock ID
        userId: "current-user", // This would be the actual user ID in production
        eventType,
        points,
        description: `Earned ${points} points for ${eventType.replace(
          "_",
          " "
        )}${referenceId ? ` (ID: ${referenceId.substring(0, 8)}...)` : ""}`,
        createdAt: new Date().toISOString(),
      };

      state.transactions.unshift(newTransaction);

      // Update total points
      state.totalPoints += points;

      // Recalculate tier
      const newTier = calculateTier(state.totalPoints);
      state.currentTier = newTier;

      // Recalculate points to next tier
      state.pointsToNextTier = calculatePointsToNextTier(
        state.totalPoints,
        newTier
      );
    },

    // Reset rewards state
    resetRewards: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch user rewards
      .addCase(fetchUserRewards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRewards.fulfilled, (state, action) => {
        const { totalPoints, transactions, availableRewards } = action.payload;

        state.totalPoints = totalPoints;
        state.transactions = transactions;
        state.availableRewards = availableRewards;

        // Calculate tier and points to next tier
        const currentTier = calculateTier(totalPoints);
        state.currentTier = currentTier;
        state.pointsToNextTier = calculatePointsToNextTier(
          totalPoints,
          currentTier
        );

        state.loading = false;
      })
      .addCase(fetchUserRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add reward points
      .addCase(addRewardPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRewardPoints.fulfilled, (state, action) => {
        const { totalPoints, newTransaction } = action.payload;

        // Add the transaction
        state.transactions.unshift(newTransaction);

        // Update total points
        state.totalPoints = totalPoints;

        // Recalculate tier
        const newTier = calculateTier(totalPoints);
        state.currentTier = newTier;

        // Recalculate points to next tier
        state.pointsToNextTier = calculatePointsToNextTier(
          totalPoints,
          newTier
        );

        state.loading = false;
      })
      .addCase(addRewardPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addPointsLocally, resetRewards } = rewardSlice.actions;
export default rewardSlice.reducer;
