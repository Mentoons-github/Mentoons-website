export interface StatusInterface {
  id: string;
  userId: string;
  userProfilePicture: string;
  viewCount: number;
  username: string;
  type: "video" | "image";
  status: "watched" | "unwatched";
  url: string;
  createdAt: string;
  mediaUrl?: string;
  caption?: string;
}

export interface StatusState {
  statuses: StatusInterface[];
  lastFetchedTime: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  watchedStatus: string[];
}
