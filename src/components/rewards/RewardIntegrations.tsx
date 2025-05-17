import { useRewardsContext } from "@/context/RewardsContext";
import { RootState } from "@/redux/store";
import { RewardEventType } from "@/types/rewards";
import { useRewardActions } from "@/utils/rewardHelper";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const RewardIntegrations: React.FC = () => {
  const { showRewardNotification } = useRewardsContext();
  const {
    rewardLikePost,
    rewardCommentPost,
    rewardSharePost,
    rewardCreateStatus,
    rewardJoinGroup,
    rewardFollowUser,
    rewardPurchaseProduct,
    rewardShareProduct,
    rewardBookSession,
    rewardApplyJob,
    rewardListenAudioComic,
    rewardListenPodcast,
    rewardReadComic,
    rewardDailyLogin,
    rewardRegistration,
    rewardProfileCompletion,
  } = useRewardActions();

  // Get relevant state from Redux
  const { userLoggedIn } = useSelector((state: RootState) => state.user);

  // Daily login check
  useEffect(() => {
    if (userLoggedIn) {
      const lastLoginDate = localStorage.getItem("lastLoginDate");
      const today = new Date().toDateString();

      if (lastLoginDate !== today) {
        // Reward daily login
        rewardDailyLogin();
        showRewardNotification(RewardEventType.DAILY_LOGIN);
        localStorage.setItem("lastLoginDate", today);
      }
    }
  }, [userLoggedIn, rewardDailyLogin, showRewardNotification]);

  // Expose reward action handlers to window for global access
  useEffect(() => {
    if (userLoggedIn) {
      // @ts-ignore - Adding to window object for global access
      window.rewardActions = {
        likePost: (postId: string) => {
          rewardLikePost(postId);
          showRewardNotification(RewardEventType.LIKE_POST);
        },
        commentPost: (postId: string) => {
          rewardCommentPost(postId);
          showRewardNotification(RewardEventType.COMMENT_POST);
        },
        sharePost: (postId: string) => {
          rewardSharePost(postId);
          showRewardNotification(RewardEventType.SHARE_POST);
        },
        createStatus: (statusId: string) => {
          rewardCreateStatus(statusId);
          showRewardNotification(RewardEventType.CREATE_STATUS);
        },
        joinGroup: (groupId: string) => {
          rewardJoinGroup(groupId);
          showRewardNotification(RewardEventType.JOIN_GROUP);
        },
        followUser: (userId: string) => {
          rewardFollowUser(userId);
          showRewardNotification(RewardEventType.FOLLOW_USER);
        },
        purchaseProduct: (productId: string) => {
          rewardPurchaseProduct(productId);
          showRewardNotification(RewardEventType.PURCHASE_PRODUCT);
        },
        shareProduct: (productId: string) => {
          rewardShareProduct(productId);
          showRewardNotification(RewardEventType.SHARE_PRODUCT);
        },
        bookSession: (sessionId: string) => {
          rewardBookSession(sessionId);
          showRewardNotification(RewardEventType.BOOK_SESSION);
        },
        applyJob: (jobId: string) => {
          rewardApplyJob(jobId);
          showRewardNotification(RewardEventType.APPLY_JOB);
        },
        listenAudioComic: (comicId: string) => {
          rewardListenAudioComic(comicId);
          showRewardNotification(RewardEventType.LISTEN_AUDIO_COMIC);
        },
        listenPodcast: (podcastId: string) => {
          rewardListenPodcast(podcastId);
          showRewardNotification(RewardEventType.LISTEN_PODCAST);
        },
        readComic: (comicId: string) => {
          rewardReadComic(comicId);
          showRewardNotification(RewardEventType.READ_COMIC);
        },
        dailyLogin: () => {
          rewardDailyLogin();
          showRewardNotification(RewardEventType.DAILY_LOGIN);
        },
        registration: () => {
          rewardRegistration();
          showRewardNotification(RewardEventType.REGISTRATION);
        },
        profileCompletion: () => {
          rewardProfileCompletion();
          showRewardNotification(RewardEventType.PROFILE_COMPLETION);
        },
      };
    }
  }, [
    userLoggedIn,
    rewardLikePost,
    rewardCommentPost,
    rewardSharePost,
    rewardCreateStatus,
    rewardJoinGroup,
    rewardFollowUser,
    rewardPurchaseProduct,
    rewardShareProduct,
    rewardBookSession,
    rewardApplyJob,
    rewardListenAudioComic,
    rewardListenPodcast,
    rewardReadComic,
    rewardDailyLogin,
    rewardRegistration,
    rewardProfileCompletion,
    showRewardNotification,
  ]);

  return null; // This is a utility component with no UI
};

export default RewardIntegrations;
