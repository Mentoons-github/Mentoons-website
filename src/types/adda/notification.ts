export interface Notification {
  id: string;
  message: string;
  read: boolean;
}

export interface NotificationInterface {
  _id: string;
  receiverId: string;
  senderId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
}
