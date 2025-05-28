export type NotificationType =
  | "message"
  | "alert"
  | "reminder"
  | "friend_request_accepted"
  | "friend_request_rejected"
  | "like"
  | "comment"
  | "share"
  | "friend_request"
  | "mention"
  | "follow"
  | "tagged_in_photo"
  | "post_update"
  | "group_invite"
  | "event_invite"
  | "birthday"
  | "new_follower"
  | "story_viewed"
  | "post_reported"
  | "post_approved"
  | "post_rejected"
  | "system_update"
  | "promotion"
  | "privacy_update"
  | "content_approval"
  | "content_rejected";

export interface NotificationSender {
  _id: string;
  name: string;
  picture: string;
}

export interface NotificationInterface {
  _id: string;
  userId: string | NotificationSender;
  initiatorId: NotificationSender;
  type: NotificationType;
  message: string;
  referenceId?: string;
  referenceModel?: "User" | "Post" | "FriendRequest" | "Comment";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export type ReferenceModel = "User" | "Post" | "FriendRequest" | "Comment";

export interface User {
  _id: string;
  name: string;
  picture: string;
}

export interface Notification {
  _id: string;
  userId: string | User;
  initiatorId: string | User;
  type: NotificationType;
  message: string;
  referenceId?: string;
  referenceModel?: ReferenceModel;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
