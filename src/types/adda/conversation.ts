export interface Friend {
  _id: string;
  name: string;
  picture: string;
  isOnline?: boolean;
  lastSeen?: string;
  isPinned?: boolean;
}

export interface Message {
  message: string;
  senderId?: string;
  receiverId: string;
  timestamp: string;
  fileType?: "text" | "image" | "audio" | "file";
  fileName?: string;
}

export interface Conversations {
  _id: string;
  members: string[];
  messages?: Message[];
  lastMessage?: string;
  updatedAt: string;
}
