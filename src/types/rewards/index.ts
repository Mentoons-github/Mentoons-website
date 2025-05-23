export enum RewardTier {
  BRONZE = "bronze",
  SILVER = "silver",
  GOLD = "gold",
}

export enum RewardEventType {
  // Authentication related
  DAILY_LOGIN = "daily_login",
  REGISTRATION = "registration",
  PROFILE_COMPLETION = "profile_completion",

  // Content interaction
  LIKE_POST = "like_post",
  LOVE_POST = "love_post",
  COMMENT_POST = "comment_post",
  SHARE_POST = "share_post",
  CREATE_STATUS = "create_status",
  SAVED_POST = "saved_post",

  // Group interaction
  JOIN_GROUP = "join_group",
  FOLLOW_USER = "follow_user",

  // Purchase related
  PURCHASE_PRODUCT = "purchase_product",
  SHARE_PRODUCT = "share_product",

  // Session related
  BOOK_SESSION = "book_session",

  // Job related
  APPLY_JOB = "apply_job",

  // Content consumption
  LISTEN_AUDIO_COMIC = "listen_audio_comic",
  LISTEN_PODCAST = "listen_podcast",
  READ_COMIC = "read_comic",
}

export interface RewardPointsConfig {
  [RewardEventType.DAILY_LOGIN]: number;
  [RewardEventType.REGISTRATION]: number;
  [RewardEventType.PROFILE_COMPLETION]: number;
  [RewardEventType.LIKE_POST]: number;
  [RewardEventType.LOVE_POST]: number;
  [RewardEventType.COMMENT_POST]: number;
  [RewardEventType.SHARE_POST]: number;
  [RewardEventType.CREATE_STATUS]: number;
  [RewardEventType.JOIN_GROUP]: number;
  [RewardEventType.FOLLOW_USER]: number;
  [RewardEventType.PURCHASE_PRODUCT]: number;
  [RewardEventType.SHARE_PRODUCT]: number;
  [RewardEventType.BOOK_SESSION]: number;
  [RewardEventType.APPLY_JOB]: number;
  [RewardEventType.LISTEN_AUDIO_COMIC]: number;
  [RewardEventType.LISTEN_PODCAST]: number;
  [RewardEventType.READ_COMIC]: number;
}

export interface RewardTierConfig {
  [RewardTier.BRONZE]: {
    minPoints: number;
    maxPoints: number;
    benefits: string[];
  };
  [RewardTier.SILVER]: {
    minPoints: number;
    maxPoints: number;
    benefits: string[];
  };
  [RewardTier.GOLD]: {
    minPoints: number;
    maxPoints: number;
    benefits: string[];
  };
}

export interface PointTransaction {
  _id: string;
  userId: string;
  eventType: RewardEventType;
  points: number;
  description: string;
  createdAt: string;
}

export interface UserRewardState {
  totalPoints: number;
  currentTier: RewardTier;
  pointsToNextTier: number;
  transactions: PointTransaction[];
  availableRewards: Reward[];
  loading: boolean;
  error: string | null;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface AddPointsRequest {
  eventType: RewardEventType;
  userId?: string;
  reference?: string;
  description?: string;
  token?: string;
}
