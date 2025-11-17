export interface GroupMessage {
  senderId: string;
  senderName: string;
  profilePicture: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
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
  data: Group[];
  loading?: boolean;
  error?: string | null;
  selectedGroup: Group | null;
}
