import axiosInstance from "@/api/axios";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";

interface NotificationSender {
  _id: string;
  name: string;
  picture: string;
}

interface NotificationInterface {
  _id: string;
  userId: string;
  initiatorId: NotificationSender;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const response = await axiosInstance.get("/adda/userNotifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data);

        setNotifications(response.data.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [getToken]);

  return (
    <div className="flex flex-col gap-4 p-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="text-blue-500" />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      {loading ? (
        <div className="flex justify-center p-6">
          <div className="animate-pulse">Loading notifications...</div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
          No notifications yet
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-screen overflow-auto">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const NotificationCard = ({
  notification,
}: {
  notification: NotificationInterface;
}) => {
  const timeAgo = notification.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : "recently";

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "friend_request_accepted":
        return "👋";
      case "like":
        return "❤️";
      case "comment":
        return "💬";
      default:
        return "🔔";
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 overflow-hidden rounded-full shrink-0 border border-gray-200">
          <img
            src={notification.initiatorId?.picture || "/default-avatar.png"}
            alt={notification.initiatorId?.name || "User"}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <h3 className="font-semibold text-gray-900">
              {notification.initiatorId?.name || "Anonymous User"}
            </h3>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
          <p className="text-gray-700">
            <span className="mr-2">
              {getNotificationIcon(notification.type)}
            </span>
            {notification.message}
          </p>
          {!notification.isRead && (
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
