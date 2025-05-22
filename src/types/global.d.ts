declare global {
  interface Window {
    rewardActions?: {
      likePost: (id: string) => void;
      commentPost: (id: string) => void;
      sharePost: (id: string) => void;
      createStatus: (id: string) => void;
      joinGroup: (id: string) => void;
      followUser: (id: string) => void;
      purchaseProduct: (id: string) => void;
      shareProduct: (id: string) => void;
      bookSession: (id: string) => void;
      applyJob: (id: string) => void;
      listenAudioComic: (id: string) => void;
      listenPodcast: (id: string) => void;
      readComic: (id: string) => void;
      dailyLogin: () => void;
      registration: () => void;
      profileCompletion: () => void;
    };
  }
}

export {};
