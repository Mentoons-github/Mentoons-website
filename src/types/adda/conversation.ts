export interface Friend {
  _id: string;
  name: string;
  picture: string;
  isOnline?: boolean;
  lastSeen?: string;
  isPinned?: boolean;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface Conversations {
  _id: string;
  members: string[];
  messages?: Message[];
  lastMessage?: string;
  updatedAt: string;
}
