interface RewardActions {
  likePost: (postId: string) => void;
  commentPost: (postId: string) => void;
  sharePost: (postId: string) => void;
  createStatus: (statusId: string) => void;
  joinGroup: (groupId: string) => void;
  followUser: (userId: string) => void;
  purchaseProduct: (productId: string) => void;
  shareProduct: (productId: string) => void;
  bookSession: (sessionId: string) => void;
  applyJob: (jobId: string) => void;
  listenAudioComic: (comicId: string) => void;
  listenPodcast: (podcastId: string) => void;
  readComic: (comicId: string) => void;
  dailyLogin: () => void;
  registration: () => void;
  profileCompletion: () => void;
}

declare global {
  interface Window {
    rewardActions: {
      likePost: (referenceId: string) => void;
      commentPost: (referenceId: string) => void;
      sharePost: (referenceId: string) => void;
      createStatus: (referenceId: string) => void;
      joinGroup: (referenceId: string) => void;
      followUser: (referenceId: string) => void;
      purchaseProduct: (referenceId: string) => void;
      shareProduct: (referenceId: string) => void;
      bookSession: (referenceId: string) => void;
      applyJob: (referenceId: string) => void;
      listenAudioComic: (referenceId: string) => void;
      listenPodcast: (referenceId: string) => void;
      readComic: (referenceId: string) => void;
      dailyLogin: () => void;
      registration: () => void;
      profileCompletion: () => void;
    };
  }
}

export { };

