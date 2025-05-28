import axios from "@/api/axios";
import { Notification } from "@/types";
import { useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react";
import { NotificationContext } from "../notificationContext";
import { errorToast, successToast } from "@/utils/toastResposnse";

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/adda/userNotifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const notificationData = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      const formattedNotifications: Notification[] = notificationData.map(
        (notif: any) => ({
          _id: notif._id || notif.id,
          userId: notif.userId,
          initiatorId: notif.initiatorId || notif.sender,
          type: notif.type || "message",
          message: notif.message || notif.content,
          referenceId: notif.referenceId,
          referenceModel: notif.referenceModel,
          isRead: notif.isRead || false,
          createdAt: notif.createdAt || new Date().toISOString(),
          updatedAt: notif.updatedAt || new Date().toISOString(),
        })
      );

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  const markNotificationRead = useCallback(
    async (notificationId: string) => {
      try {
        const token = await getToken();
        await axios.patch(
          `${
            import.meta.env.VITE_PROD_URL
          }/adda/userNotifications/${notificationId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [getToken]
  );

  const markAllNotificationsRead = useCallback(async () => {
    try {
      const token = await getToken();
      await axios.patch(
        `${import.meta.env.VITE_PROD_URL}/adda/markAllNotificationsRead`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, [getToken]);

  const removeNotification = useCallback(
    async (notificationId: string) => {
      try {
        const token = await getToken();
        await axios.delete(
          `${
            import.meta.env.VITE_PROD_URL
          }/adda/userNotifications/${notificationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications((prev) =>
          prev.filter((n) => n._id !== notificationId)
        );
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    },
    [getToken]
  );

  const updateNotification = useCallback(
    async (notificationId: string, updates: Partial<Notification>) => {
      try {
        const token = await getToken();
        await axios.patch(
          `${
            import.meta.env.VITE_PROD_URL
          }/adda/userNotifications/${notificationId}`,
          updates,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, ...updates } : n))
        );
        successToast("Notification updated");
      } catch (error) {
        console.error("Failed to update notification:", error);
        errorToast("Failed to update notification");
      }
    },
    [getToken]
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        isLoading,
        fetchNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        removeNotification,
        updateNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
