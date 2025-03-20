export interface Status {
  id: string;
  userId: string;
  userProfilePicture: string;
  viewCount: number;
  username: string;
  type: "video" | "image";
  status: "watched" | "unwatched";
  url: string;
  createdAt: string;
}

export interface StatusState {
  statuses: Status[];
  lastFetchedTime: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  watchedStatus: string[];
}
