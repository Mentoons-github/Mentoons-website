export interface Friend {
  _id: string;
  name: string;
  picture: string;
  isOnline?: boolean;
  lastSeen?: string;
  isPinned?: boolean;
}

export interface Message {
  conversationId:string;
  message: string;
  senderId?: string;
  receiverId: string;
  createdAt: string;
  fileType?: "text" | "image" | "audio" | "file" | "video";
  fileName?: string;
  isRead:boolean;
  isDelivered:boolean;
}

export interface Conversations {
  _id: string;
  members: string[];
  messages?: Message[];
  lastMessage?: string;
  updatedAt: string;
}

export interface Online_users {
  _id: string;
  name: string;
  picture: string;
  hasConversation: boolean;
  conversationId: string;
}
