import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
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
  clearAllNotifications,
} from "@/redux/adda/notificationSlice";
import axios from "axios";
import { Notification } from "@/types";

const Notifications = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { notifications, isLoading, hasMore, error } = useSelector(
    (state: RootState) => state.notification
  );
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [showLatestOnly, setShowLatestOnly] = useState(false);
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
        dispatch(removeNotification(notificationId));
        await dispatch(deleteNotification({ notificationId, token }));
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

  const getFilteredNotifications = () => {
    let filtered = notifications;

    if (showLatestOnly) {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      filtered = filtered.filter(
        (notification) => new Date(notification.createdAt) > twentyFourHoursAgo
      );
    }

    return filtered.filter(
      (notif) => filter === "all" || (filter === "unread" && !notif.isRead)
    );
  };

  const handleLatestToggle = () => {
    setShowLatestOnly(!showLatestOnly);
    if (!showLatestOnly) {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const recentCount = notifications.filter(
        (notification) => new Date(notification.createdAt) > twentyFourHoursAgo
      ).length;

      if (recentCount === 0) {
        toast.info("No notifications from the last 24 hours");
      } else {
        toast.info(`Showing ${recentCount} notification(s) from last 24 hours`);
      }
    } else {
      toast.info("Showing all notifications");
    }
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="relative flex flex-col w-full gap-4 sm:gap-6 p-4 max-w-3xl mx-auto">
      <div className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50/30 rounded-2xl shadow-lg border border-orange-100/50 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-100/40 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-100/30 to-transparent rounded-full blur-xl"></div>

        <div className="relative z-10 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/adda")}
              className="group relative p-3 text-orange-600 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-orange-100/50"
              aria-label="Back to Adda"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg
                className="w-5 h-5 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex-1 text-center px-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                Notifications
              </h1>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                Stay updated with your connections
              </p>
            </div>

            <div className="w-11 h-11" />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value as "all" | "unread")
                  }
                  className="appearance-none px-4 py-2.5 pr-10 text-sm font-medium text-orange-700 bg-white/90 backdrop-blur-sm border border-orange-200/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300/50 focus:border-orange-300 cursor-pointer"
                  aria-label="Filter notifications"
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread Only</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <button
                onClick={handleLatestToggle}
                className={`group relative px-4 py-2.5 text-sm font-medium rounded-xl shadow-sm hover:shadow-md border overflow-hidden transition-all duration-300 hover:scale-105 ${
                  showLatestOnly
                    ? "text-white bg-orange-500 border-orange-500"
                    : "text-orange-600 bg-white/80 backdrop-blur-sm border-orange-200/50"
                }`}
                aria-label="Toggle latest 24h notifications"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-300 ${
                    showLatestOnly
                      ? "from-orange-600/20 to-orange-700/20 opacity-100"
                      : "from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100"
                  }`}
                ></div>
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {showLatestOnly ? "Show All" : "Latest 24h"}
                </span>
              </button>
            </div>

            <div className="flex gap-3">
              {notifications.length > 0 &&
                notifications.some((n) => !n.isRead) && (
                  <button
                    onClick={async () => {
                      const token = (await getToken()) ?? "";
                      dispatch(markAllNotificationsRead(token));
                    }}
                    className="group relative px-5 py-2.5 text-sm font-medium text-orange-600 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md border border-orange-200/50 overflow-hidden transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Mark All Read
                    </span>
                  </button>
                )}

              {notifications.length > 0 && (
                <button
                  onClick={async () => {
                    const token = (await getToken()) ?? "";
                    dispatch(clearAllNotifications(token));
                  }}
                  className="group relative px-5 py-2.5 text-sm font-medium text-red-600 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md border border-red-200/50 overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Clear All
                  </span>
                </button>
              )}
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="px-6 py-2.5 bg-gradient-to-r from-orange-100/80 to-orange-50/80 backdrop-blur-sm rounded-full border border-orange-200/30 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-orange-700">
                      {showLatestOnly ? (
                        <>
                          Showing{" "}
                          <span className="font-semibold text-orange-600">
                            {filteredNotifications.length}
                          </span>{" "}
                          notification(s) from last 24 hours
                        </>
                      ) : notifications.filter((n) => !n.isRead).length > 0 ? (
                        <>
                          <span className="font-semibold text-orange-600">
                            {notifications.filter((n) => !n.isRead).length}
                          </span>{" "}
                          unread of{" "}
                          <span className="font-semibold text-orange-600">
                            {notifications.length}
                          </span>{" "}
                          total
                        </>
                      ) : (
                        <>All Notifications Read 🎉</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            No {filter === "unread" ? "unread " : ""}
            {showLatestOnly ? "recent " : ""}notifications
          </h3>
          <p className="text-orange-600">
            {showLatestOnly
              ? "No notifications from the last 24 hours"
              : "We'll notify you when something new arrives"}
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
                    dispatch(removeNotification(id));
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
