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
  isBlocked?: boolean;
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

export interface ProfileMediaItem {
  url: string;
  type: "image" | "video";
  caption?: string;
}

export interface ProfilePostUser {
  _id: string;
  name: string;
  picture?: string;
  email?: string;
}

export interface ProfileComment {
  _id?: string;
  userId?: string;
  user?: {
    _id: string;
    email?: string;
    name: string;
    picture?: string;
  };
  content?: string;
  text?: string;
  createdAt?: string;
}

export interface ProfilePost {
  _id: string;
  postType: "text" | "photo" | "video" | "article" | "event" | "mixed";
  user: ProfilePostUser;
  content?: string;
  media?: ProfileMediaItem[];
  likes: string[];
  comments: ProfileComment[];
  shares: string[];
  saves?: string[] | number;
  visibility: "public" | "friends" | "private";
  createdAt: string;
}

export interface ProfileUserDetails {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  bio?: string;
  phoneNumber?: string;
  location?: string;
  education?: string;
  occupation?: string;
  interests?: string[];
  coverImage?: string;
  followers?: string[];
  following?: string[];
  dateOfBirth?: string;
  gender?: string;
  socialLinks?: Array<{ label: string; url: string }>;
  joinedDate?: string;
}

export type ProfileTabTypes =
  | "profile"
  | "posts"
  | "friends"
  | "rewards"
  | "saved";

export type TabType = "posts" | "about" | "friends" | "rewards" | "follow";
