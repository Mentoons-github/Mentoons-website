export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  website?: string;
}

export interface Subscription {
  plan: string;
  status: string;
  startDate: Date;
  validUntil: Date;
}

export enum UserRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
}

export enum PostType {
  TEXT = "text",
  PHOTO = "photo",
  VIDEO = "video",
  LINK = "link",
  POLL = "poll",
}

export interface User {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  picture?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: Date;
  joinedDate: Date;
  lastActive?: Date;
  followers: string[];
  following: string[];
  friends: string[];
  interests: string[];
  socialLinks: SocialLinks;
  subscription?: Subscription;
  posts: string[];
  role: UserRole | string;
  isOnline?: boolean;
}

export interface Media {
  url: string;
  type: MediaType | string;
  caption?: string;
}

export interface Post {
  _id: string;
  user: string;
  content: string;
  postType: PostType | string;
  likes: string[];
  comments: string[];
  commentCount: number;
  shares: string[];
  createdAt: Date;
  media: Media[];
}

export type TabType = "posts" | "about" | "friends" | "rewards" | "follow";
