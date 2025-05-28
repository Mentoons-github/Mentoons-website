import { createContext, useContext } from "react";
import { Notification } from "@/types";

export interface NotificationContextType {
  notifications: Notification[];
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  removeNotification: (notificationId: string) => void;
  updateNotification: (
    notificationId: string,
    updates: Partial<Notification>
  ) => void;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
