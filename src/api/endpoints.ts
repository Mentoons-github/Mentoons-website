import axiosInstance from "./axios";

export const Endpoints = {
  WORKSHOP_FORM: "workshop/submit-form",
  SIGNUP: "user/sign-up",
  VERIFY_OTP: "user/sign-up/verify",
  VERIFY_LOGIN_OTP: "user/sign-in/verify",
  LOGIN: "user/sign-in",

  // Reward system endpoints
  REWARDS_USER: "rewards/user-rewards",
  REWARDS_ADD_POINTS: "rewards/add-points",
  REWARDS_REDEEM: "rewards/redeem",
};

export const AddaApi = {
  connectFriends: (receiverId: string) =>
    axiosInstance.post("/adda/connectFriend", { receiverId }),
  createGroupParents: (details: {
    name: string;
    description: string;
    type: string;
    thumbnail: File;
  }) => {
    const formData = new FormData();
    formData.append("name", details.name);
    formData.append("description", details.description);
    formData.append("type", details.type);
    formData.append("thumbnail", details.thumbnail);

    return axiosInstance.post("/adda/createGroup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Reward API functions
export const RewardsApi = {
  // Get user rewards (points, transactions, available rewards)
  getUserRewards: () => axiosInstance.get(`/${Endpoints.REWARDS_USER}`),

  // Add points for a specific event
  addPoints: (data: {
    eventType: string;
    userId?: string;
    reference?: string;
    description?: string;
  }) => axiosInstance.post(`/${Endpoints.REWARDS_ADD_POINTS}`, data),

  // Redeem a reward
  redeemReward: (rewardId: string) =>
    axiosInstance.post(`/${Endpoints.REWARDS_REDEEM}`, { rewardId }),
};
