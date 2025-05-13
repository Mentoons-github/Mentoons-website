import axiosInstance from "@/api/axios";
import UserStatus from "@/components/adda/home/userStatus/userStatus";
import FounderNote from "@/components/common/founderNote";
import { useAuth } from "@clerk/clerk-react";
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
import { Link } from "react-router-dom";
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

// Sample data generator
// const generateSampleNotifications = (): NotificationInterface[] => {
//   const sampleUsers: NotificationSender[] = [
//     {
//       _id: "1",
//       name: "Sarah Johnson",
//       picture: "https://i.pravatar.cc/150?img=1",
//     },
//     {
//       _id: "2",
//       name: "Mike Chen",
//       picture: "https://i.pravatar.cc/150?img=2",
//     },
//     {
//       _id: "3",
//       name: "Emma Wilson",
//       picture: "https://i.pravatar.cc/150?img=3",
//     },
//     {
//       _id: "4",
//       name: "Alex Kumar",
//       picture: "https://i.pravatar.cc/150?img=4",
//     },
//   ];

//   const types = ["friend_request_accepted", "like", "comment", "default"];
//   const messages = [
//     "accepted your friend request",
//     "liked your post",
//     "commented on your post: 'Great content! 👏'",
//     "shared a new post in your group",
//   ];

//   return Array.from({ length: 8 }, (_, index) => ({
//     _id: `sample-${index + 1}`,
//     userId: "current-user",
//     initiatorId: sampleUsers[index % sampleUsers.length],
//     type: types[index % types.length],
//     message: messages[index % messages.length],
//     isRead: index % 3 === 0, // Some notifications are read, some are unread
//     createdAt: new Date(Date.now() - index * 1000 * 60 * 30).toISOString(), // Staggered times
//     updatedAt: new Date().toISOString(),
//     __v: 0,
//   }));
// };

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

        console.log(response);
        setNotifications(response.data.data);

        // Use sample data
        // const sampleData = generateSampleNotifications();
        // setNotifications(sampleData);
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
      await axiosInstance.patch(
        `/adda/markNotificationAsRead/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      await axiosInstance.delete(`/adda/deleteNotification/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    <div className="flex items-start justify-center w-full p-2 bg-white max-w-8xl sm:p-3 md:p-4">
      <div className="relative flex flex-col w-full">
        <div className="sticky left-0 flex items-center w-full top-[64px] z-[99999] bg-white">
          <div className="flex-grow w-full min-w-0 py-2">
            <UserStatus />
          </div>
          <div className="flex-shrink-0 hidden px-4 pt-2 md:block">
            <Link to="/mythos">
              <img
                src="/assets/adda/sidebar/Introducing poster.png"
                alt="mentoons-mythos"
                className="max-w-[134px] lg:max-w-[170px]"
              />
            </Link>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-col w-full md:flex-row md:gap-4 lg:gap-6">
          {/* Left sidebar - Founder Note (only visible on lg screens and up) */}
          <div className="flex-shrink-0 hidden lg:block lg:w-1/4">
            <div className="sticky top-[204px] w-full">
              <FounderNote scroll={false} />
            </div>
          </div>

          {/* Center content area - Notifications */}
          <div className="flex flex-col gap-4 sm:gap-6 w-full md:flex-1 lg:max-w-[50%]">
            {/* Notifications header */}
            <div className="p-5 bg-white border border-orange-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-start w-full gap-3">
                <button
                  onClick={() => (window.location.href = "/adda")}
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
                    {notifications.length === 1
                      ? "notification"
                      : "notifications"}
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

          {/* Right sidebar */}
          <div className="flex-shrink-0 hidden w-full md:w-1/3 lg:w-1/4 md:block">
            <div className="md:sticky flex flex-col gap-4 sm:gap-6 md:rounded-lg md:pt-0 top-[204px] z-10 w-full">
              {/* Notification stats */}
              <div className="p-5 bg-white border border-orange-200 rounded-lg">
                <h3 className="mb-4 text-lg font-bold">Notification Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                    <span className="text-orange-600">Unread</span>
                    <span className="px-3 py-1 text-sm font-medium text-orange-600 bg-orange-100 rounded-full">
                      {notifications.filter((n) => !n.isRead).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                    <span className="text-orange-600">Total</span>
                    <span className="px-3 py-1 text-sm font-medium text-orange-600 bg-orange-100 rounded-full">
                      {notifications.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notification types */}
              <div className="p-5 bg-white border border-orange-200 rounded-lg">
                <h3 className="mb-4 text-lg font-bold">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50">
                    <UserPlus className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">Friend Requests</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50">
                    <Heart className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">Likes</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50">
                    <MessageCircle className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">Comments</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50">
                    <Share2 className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">Shares</span>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="p-5 bg-white border border-orange-200 rounded-lg">
                <h3 className="mb-4 text-lg font-bold">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600">
                    Mark All as Read
                  </button>
                  <button className="w-full px-4 py-2 text-sm font-medium text-orange-500 transition-colors border-2 border-orange-500 rounded-lg hover:bg-orange-50">
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "friend_request_accepted":
        return <UserPlus className="w-5 h-5 text-orange-500" />;
      case "like":
        return <Heart className="w-5 h-5 text-orange-500" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-orange-500" />;
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
          className="relative overflow-hidden border-2 border-orange-200 rounded-full w-14 h-14 shrink-0"
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
