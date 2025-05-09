export interface UserStatusInterface {
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

export interface RequestInterface {
  id: string;
  userName: string;
  profilePic: string;
  status: "pending" | "accepted" | "rejected";
  senderId: string;
  receiverId: string;
}
