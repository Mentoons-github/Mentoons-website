import { FilteredFriendRequest } from "./home";

interface User {
  _id: string;
  name: string;
  picture: string;
}

export interface GroupMessage {
  _id: string;
  senderId: User;
  message: string;
  createdAt: string;
}

export interface PollOption {
  text: string;
  votes: number;
  voters: string[];
}

export interface Poll {
  title: string;
  description: string;
  options: PollOption[];
  createdBy: string;
  expiresAt: string;
  isActive: boolean;
  category?: string;
  isAnonymous: boolean;
  allowMultipleVotes: boolean;
  viewResults: "immediately" | "afterEnd";
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
}

export interface Group {
  _id?: string;
  name: string;
  details: {
    subTitle: string;
    description: string;
  };
  polls: Poll[];
  members?: { name: string; picture: string; _id: string }[];
  message: GroupMessage[];
  profileImage: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ActiveTabType = "MEMBERS" | "CHAT" | "POLLS";

export interface GroupState {
  data: {
    joinedGroups: Group[];
    suggestedGroups: Group[];
  };
  loading?: boolean;
  error?: string | null;
  selectedGroup: Group | null;
  message: string;
  joinSuccess: boolean;
  groupMessages: GroupMessage[];
  groupMembers: User[];
  friendRequests:FilteredFriendRequest[]
}
