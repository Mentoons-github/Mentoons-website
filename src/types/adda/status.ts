// export interface StatusInterface {
//   _id: string;
//   user: user;
//   content: string;
//   type: "video" | "image" | "text";
//   viewers: string[];
//   createdAt: string;
//   isOwner?: boolean;
// }

// type user = {
//   _id: string;
//   name: string;
//   picture: string;
// };

// export interface StatusState {
//   statusGroups: StatusInterface[];
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

export interface UserInfo {
  _id: string;
  name: string;
  picture: string;
  email?: string;
  joined?: string;
}

export interface StatusInterface {
  _id: string;
  user: string | UserInfo;
  content: string;
  type: "image" | "video" | "text";
  caption?: string;
  createdAt: string;
  updatedAt: string;
  viewers: string[] | UserInfo[];
  isOwner?: boolean;
}

export interface UserStatusInterface {
  user: UserInfo;
  statuses: StatusInterface[];
  isRead: boolean;
  isOwner?: boolean;
}

export interface StatusState {
  statusGroups: UserStatusInterface[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  deletingStatusIds: string[];
}

export interface CreateStatusParams {
  file: File;
  caption?: string;
  token: string;
}

export interface DeleteStatusParams {
  statusId: string;
  token: string;
}

export interface WatchStatusParams {
  statusId: string;
  token: string;
}

export interface FriendRequest {
  _id: string;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface StatusApiResponse {
  success: boolean;
  message: string;
  data: UserStatusInterface[];
}

export interface SingleStatusApiResponse {
  success: boolean;
  message: string;
  data: StatusInterface;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  data: {
    fileDetails: {
      url: string;
      type: string;
      size: number;
      name: string;
    };
  };
}
