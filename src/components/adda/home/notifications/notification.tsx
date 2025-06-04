import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Bell } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import NotificationCard from "./notificationCard";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  removeNotification,
  updateNotification,
  deleteNotification,
} from "@/redux/adda/notificationSlice";
import axios from "axios";
import { Notification } from "@/types";

const Notifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, isLoading, hasMore, error } = useSelector(
    (state: RootState) => state.notification
  );
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver | null>(null);

  const lastNotificationRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    const loadNotifications = async () => {
      const token = await getToken();
      dispatch(fetchNotifications({ token, page, limit: 10 }));
    };
    loadNotifications();
  }, [dispatch, getToken, page]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleFriendRequestAction = async (
    notificationId: string,
    referenceId: string | undefined,
    action: "accept" | "decline"
  ) => {
    if (!referenceId) {
      toast.error("Invalid friend request");
      return;
    }

    try {
      const token = (await getToken()) ?? "";
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const notification = notifications.find((n) => n._id === notificationId);
      if (notification && !notification.isRead) {
        await dispatch(markNotificationRead({ notificationId, token }));
      }

      await axios.post(
        `${
          import.meta.env.VITE_PROD_URL
        }/adda/friend-requests/${referenceId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (action === "accept") {
        dispatch(
          updateNotification({
            id: notificationId,
            data: {
              isRead: true,
              type: "friend_request_accepted",
              message: "Friend request accepted",
            },
          })
        );
        toast.success("Friend request accepted");
      } else {
        dispatch(removeNotification(notificationId)); // Remove locally first
        await dispatch(deleteNotification({ notificationId, token })); // Then delete on backend
        toast.success("Friend request declined");
      }
    } catch (err) {
      console.error(`Failed to ${action} friend request:`, err);
      toast.error(`Failed to ${action} friend request`);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    const getNavigationLink = (): string => {
      const { type, referenceId, referenceModel } = notification;
      switch (type) {
        case "friend_request":
        case "friend_request_accepted":
        case "friend_request_rejected":
          return `/friends/requests/${referenceId}`;
        case "like":
        case "comment":
          return referenceModel === "Post" || referenceModel === "Comment"
            ? `/posts/${referenceId}`
            : "/feed";
        default:
          return "/adda/notifications";
      }
    };
    navigate(getNavigationLink());
    if (!notification.isRead) {
      const token = await getToken();
      if (token) {
        dispatch(
          markNotificationRead({
            notificationId: notification._id,
            token,
          })
        );
      } else {
        toast.error("Authentication token not found");
      }
    } else {
      toast.info("Notification already read");
    }
  };

  const filteredNotifications = notifications.filter(
    (notif) => filter === "all" || (filter === "unread" && !notif.isRead)
  );

  return (
    <div className="relative flex flex-col w-full gap-4 sm:gap-6 p-4 max-w-3xl mx-auto">
      <div className="relative z-10 p-4 bg-white bg-opacity-90 backdrop-blur-sm border border-orange-200 rounded-xl shadow-lg shadow-orange-100/50">
        <div className="flex items-center justify-between w-full gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/adda")}
              className="p-2 text-orange-600 transition-colors bg-orange-100 rounded-full hover:bg-orange-200"
              aria-label="Back to Adda"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="p-3 rounded-full shadow-lg bg-gradient-to-br from-orange-400 to-orange-500"
            >
              <Bell className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex flex-col figtree">
              <span className="text-xl font-bold text-orange-600">
                Notifications
              </span>
              <span className="text-sm text-orange-500">
                Stay updated with your connections
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | "unread")}
              className="px-2 py-1 text-sm text-orange-600 bg-orange-50 rounded-full"
              aria-label="Filter notifications"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
            </select>
            {notifications.length > 0 &&
              notifications.some((n) => !n.isRead) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    const token = (await getToken()) ?? "";
                    dispatch(markAllNotificationsRead(token));
                  }}
                  className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-100 rounded-full hover:bg-orange-200"
                >
                  Mark All as Read
                </motion.button>
              )}
          </div>
        </div>
      </div>

      {isLoading && page === 1 ? (
        <div className="flex justify-center p-6">
          <div className="flex flex-col w-full gap-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-orange-50" />
            ))}
          </div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center w-full p-8 text-center bg-white border border-orange-200 rounded-xl shadow-sm"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="p-4 mx-auto mb-4 rounded-full shadow-lg bg-gradient-to-br from-orange-400 to-orange-500 w-fit"
          >
            <Bell className="w-12 h-12 text-white" />
          </motion.div>
          <h3 className="mb-2 text-lg font-semibold text-orange-700">
            No {filter === "unread" ? "unread " : ""}notifications
          </h3>
          <p className="text-orange-600">
            We'll notify you when something new arrives
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="flex flex-col w-full gap-4">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                ref={
                  index === filteredNotifications.length - 1
                    ? lastNotificationRef
                    : null
                }
              >
                <NotificationCard
                  notification={notification}
                  onMarkAsRead={async (id) => {
                    const notification = notifications.find(
                      (n) => n._id === id
                    );
                    if (notification && !notification.isRead) {
                      const token = await getToken();
                      if (token) {
                        dispatch(
                          markNotificationRead({
                            notificationId: id,
                            token,
                          })
                        );
                        toast.success("Notification marked as read");
                      } else {
                        toast.error("Authentication token not found");
                      }
                    }
                  }}
                  onDelete={async (id) => {
                    const notification = notifications.find(
                      (n) => n._id === id
                    );
                    if (notification && !notification.isRead) {
                      const token = await getToken();
                      if (token) {
                        await dispatch(
                          markNotificationRead({ notificationId: id, token })
                        );
                      }
                    }
                    dispatch(removeNotification(id)); // Remove locally first
                    const token = await getToken();
                    if (token) {
                      await dispatch(
                        deleteNotification({ notificationId: id, token })
                      );
                      toast.success("Notification deleted");
                    } else {
                      toast.error("Authentication token not found");
                    }
                  }}
                  onClick={handleNotificationClick}
                  onFriendRequestAction={handleFriendRequestAction}
                />
              </motion.div>
            ))}
            {isLoading && page > 1 && (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
              </div>
            )}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Notifications;
