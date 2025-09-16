export interface Notification {
  _id: string;
  userId: string | { _id: string; name: string };
  initiatorId: string | { _id: string; name: string };
  type: string;
  message: string;
  referenceId?: string;
  referenceModel?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccessCheckResponse {
  allowed: boolean;
  upgradeRequired?: boolean;
  upgradeTo?: string;
  planType?: "free" | "prime" | "platinum";
  modalType?: "freeToPrime" | "primeToPlatinum" | "freeToPlatinum";
  message?: string;
  currentPrimeConnections?: number;
}

export interface RequestSender {
  requestId: string;
  senderDetails: {
    _id: string;
    name: string;
    picture: string;
  };
  status?: "pending" | "accepting" | "declining" | "accepted" | "declined";
  message?: string;
}

export interface FollowBackUser {
  _id: string;
  name: string;
  picture: string;
  status?: "following" | "following-in-progress" | "declining" | "declined";
  message?: string;
}

export interface FriendRequestsState {
  requests: RequestSender[] | null;
  followBackUsers: FollowBackUser[] | null;
  loading: boolean;
  followBackLoading: boolean;
  hasMore: boolean;
  page: number;
  error: string | null;
  accessCheck: {
    allowed: boolean;
    upgradeRequired?: boolean;
    upgradeTo?: string;
    planType?: "free" | "prime" | "platinum";
    modalType?: "freeToPrime" | "primeToPlatinum" | "freeToPlatinum";
    message?: string;
    currentPrimeConnections?: number;
  } | null;
}
