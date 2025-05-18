import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Check,
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // For testing, use sample data instead of API call
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/adda/userNotifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setNotifications(response.data.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [getToken]);

  const markAsRead = async (notificationId: string) => {
    try {
      const token = await getToken();
      const response = await axios.post(
        `${
          import.meta.env.VITE_PROD_URL
        }adda/userNotifications/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      toast.success("Marked as read");
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      toast.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const token = await getToken();
      const response = await axios.delete(
        `${
          import.meta.env.VITE_PROD_URL
        }adda/userNotifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
      toast.success("Notification deleted");
    } catch (err) {
      console.error("Failed to delete notification:", err);
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div className="relative flex flex-col w-full gap-4 sm:gap-6">
      {/* Notifications header */}
      <div className="sticky p-3 bg-white bg-opacity-100 border border-orange-200 rounded-lg shadow-lg shadow-orange-100/80 top-[200px] z-10">
        <div className="flex items-center justify-start w-full gap-3">
          <button
            onClick={() => navigate("/adda/home")}
            className="p-2 text-orange-600 transition-colors bg-orange-100 rounded-full hover:bg-orange-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="p-3 rounded-full shadow-lg bg-gradient-to-br from-orange-400 to-orange-500"
          >
            <Bell className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col figtree">
              <span className="text-xl font-bold text-orange-600">
                Notifications
              </span>
              <span className="text-sm text-orange-500">
                Stay updated with your connections
              </span>
            </div>
          </div>
          {notifications?.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 ml-auto text-sm font-medium text-orange-600 bg-orange-100 rounded-full shadow-sm"
            >
              {notifications.length}{" "}
              {notifications.length === 1 ? "notification" : "notifications"}
            </motion.span>
          )}
        </div>
      </div>

      {/* Notifications list */}
      {loading ? (
        <div className="flex justify-center p-6">
          <div className="flex flex-col w-full gap-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-orange-50"></div>
            ))}
          </div>
        </div>
      ) : notifications?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center w-full p-8 text-center bg-white border border-orange-200 rounded-lg shadow-sm"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="p-4 mx-auto mb-4 rounded-full shadow-lg bg-gradient-to-br from-orange-400 to-orange-500 w-fit"
          >
            <Bell className="w-12 h-12 text-white" />
          </motion.div>
          <h3 className="mb-2 text-lg font-semibold text-orange-700">
            No notifications yet
          </h3>
          <p className="text-orange-600">
            We'll notify you when something new arrives
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="flex flex-col w-full gap-4">
            {notifications?.map((notification, index) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NotificationCard
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: NotificationInterface;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const timeAgo = notification.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : "recently";
  console.log(notification);
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "friend_request_accepted":
        return <UserPlus className="w-5 h-5 text-orange-500" />;
      case "like":
        return <Heart className="w-5 h-5 text-orange-500" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-orange-500" />;
      case "friend_request":
        return <UserPlus className="w-5 h-5 text-orange-500" />;
      default:
        return <Share2 className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex flex-col items-center justify-start w-full gap-5 p-5 transition-all duration-200 border border-orange-200 shadow-sm rounded-xl min-h-fit hover:shadow-md"
    >
      <div className="flex items-start w-full gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative overflow-hidden border-2 border-orange-200 rounded-full w-14 h-14 shrink-0 z-[1]"
        >
          <img
            src={notification.initiatorId?.picture || "/default-avatar.png"}
            alt={notification.initiatorId?.name || "User"}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full">
            {getNotificationIcon(notification.type)}
          </div>
        </motion.div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex flex-col figtree">
              <span className="font-semibold text-orange-900">
                {notification.initiatorId?.name || "Anonymous User"}
              </span>
              <span className="text-sm text-orange-600">
                {notification.message}
              </span>
            </div>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="px-2 py-1 text-xs font-medium text-orange-600 rounded-full bg-orange-50"
            >
              {timeAgo}
            </motion.span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 mt-3 transition-opacity opacity-0 group-hover:opacity-100"
          >
            {!notification.isRead && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onMarkAsRead(notification._id)}
                className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-orange-600 transition-colors rounded-full hover:bg-orange-100"
              >
                <Check className="w-3 h-3" />
                Mark as read
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(notification._id)}
              className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-orange-600 transition-colors rounded-full hover:bg-orange-100"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Notification;
