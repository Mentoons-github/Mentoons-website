import { addRewardPoints } from "@/redux/rewardSlice";
import { AppDispatch } from "@/redux/store";
import { RewardEventType } from "@/types/rewards";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";

/**
 * Hook that provides all reward action handlers
 * Can be used in any component to trigger reward events
 */
export const useRewardActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();

  const handleRewardAction = async (
    eventType: RewardEventType,
    referenceId: string = ""
  ) => {
    const token = await getToken();
    dispatch(
      addRewardPoints({
        eventType,
        reference: referenceId,
        token: token || undefined,
      })
    );
  };

  return {
    // Authentication related
    rewardDailyLogin: () => handleRewardAction(RewardEventType.DAILY_LOGIN),
    rewardRegistration: () => handleRewardAction(RewardEventType.REGISTRATION),
    rewardProfileCompletion: () =>
      handleRewardAction(RewardEventType.PROFILE_COMPLETION),

    // Content interaction
    rewardLikePost: (postId: string) =>
      handleRewardAction(RewardEventType.LIKE_POST, postId),
    rewardLovePost: (postId: string) =>
      handleRewardAction(RewardEventType.LOVE_POST, postId),
    rewardCommentPost: (postId: string) =>
      handleRewardAction(RewardEventType.COMMENT_POST, postId),
    rewardSharePost: (postId: string) =>
      handleRewardAction(RewardEventType.SHARE_POST, postId),
    rewardCreateStatus: (statusId: string) =>
      handleRewardAction(RewardEventType.CREATE_STATUS, statusId),

    // Group interaction
    rewardJoinGroup: (groupId: string) =>
      handleRewardAction(RewardEventType.JOIN_GROUP, groupId),
    rewardFollowUser: (userId: string) =>
      handleRewardAction(RewardEventType.FOLLOW_USER, userId),

    // Purchase related
    rewardPurchaseProduct: (productId: string) =>
      handleRewardAction(RewardEventType.PURCHASE_PRODUCT, productId),
    rewardShareProduct: (productId: string) =>
      handleRewardAction(RewardEventType.SHARE_PRODUCT, productId),

    // Session related
    rewardBookSession: (sessionId: string) =>
      handleRewardAction(RewardEventType.BOOK_SESSION, sessionId),

    // Job related
    rewardApplyJob: (jobId: string) =>
      handleRewardAction(RewardEventType.APPLY_JOB, jobId),

    // Content consumption
    rewardListenAudioComic: (comicId: string) =>
      handleRewardAction(RewardEventType.LISTEN_AUDIO_COMIC, comicId),
    rewardListenPodcast: (podcastId: string) =>
      handleRewardAction(RewardEventType.LISTEN_PODCAST, podcastId),
    rewardReadComic: (comicId: string) =>
      handleRewardAction(RewardEventType.READ_COMIC, comicId),
  };
};

/**
 * Helper function to get the appropriate display label for reward event types
 */
export const getRewardEventLabel = (eventType: RewardEventType): string => {
  const mapping: Record<RewardEventType, string> = {
    [RewardEventType.DAILY_LOGIN]: "Daily Login",
    [RewardEventType.REGISTRATION]: "New Registration",
    [RewardEventType.PROFILE_COMPLETION]: "Profile Completion",
    [RewardEventType.LIKE_POST]: "Liked a Post",
    [RewardEventType.LOVE_POST]: "Loved a Post",
    [RewardEventType.COMMENT_POST]: "Commented on a Post",
    [RewardEventType.SHARE_POST]: "Shared a Post",
    [RewardEventType.SAVED_POST]: "Saved a Post",
    [RewardEventType.CREATE_STATUS]: "Created a Status",
    [RewardEventType.JOIN_GROUP]: "Joined a Group",
    [RewardEventType.FOLLOW_USER]: "Followed a User",
    [RewardEventType.PURCHASE_PRODUCT]: "Purchased a Product",
    [RewardEventType.SHARE_PRODUCT]: "Shared a Product",
    [RewardEventType.BOOK_SESSION]: "Booked a Session",
    [RewardEventType.APPLY_JOB]: "Applied for a Job",
    [RewardEventType.LISTEN_AUDIO_COMIC]: "Listened to an Audio Comic",
    [RewardEventType.LISTEN_PODCAST]: "Listened to a Podcast",
    [RewardEventType.READ_COMIC]: "Read a Comic",
  };

  return mapping[eventType] || eventType.replace(/_/g, " ");
};
