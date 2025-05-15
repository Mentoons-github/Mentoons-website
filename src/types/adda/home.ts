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
  _id?: string;
  userName: string;
  profilePic: string;
  picture: string;
  name: string;
}

export interface requestSender {
  requestId: string;
  senderDetails: {
    _id: string;
    name: string;
    picture: string;
  };
}

export interface UserSummary {
  _id: string;
  name: string;
  picture: string;
}

export interface FriendRequestResponse {
  _id: string;
  senderId: UserSummary;
  receiverId: UserSummary;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
  __v: number;
}
