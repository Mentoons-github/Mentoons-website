import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  Check,
  AlertCircle,
  UserPlus,
  DollarSign,
  Package,
  Settings,
  MessageCircle,
  Heart,
  Users,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  fetchNotifications,
  markNotificationRead,
} from "@/redux/adda/notificationSlice";
import {
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from "@/redux/adda/notificationSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";

const AdminNotification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, error, isLoading } = useSelector(
    (state: RootState) => state.notification
  );

  const { getToken } = useAuth();
  const [filter, setFilter] = useState("all");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchNotificationsData = async () => {
      const token = await getToken();
      if (token) {
        dispatch(fetchNotifications({ token, page: 1, limit: 10 }));
      }
    };
    fetchNotificationsData();
  }, [dispatch, getToken]);

  const markAsRead = async (notificationId: string) => {
    const token = await getToken();
    if (token) {
      await dispatch(markNotificationRead({ token, notificationId }));
    }
  };

  const markAllAsRead = async () => {
    const token = await getToken();
    if (token) {
      await dispatch(markAllNotificationsRead(token)).unwrap();
    }
  };

  const clearAll = async () => {
    const token = await getToken();
    if (token) {
      try {
        await dispatch(clearAllNotifications(token)).unwrap();
      } catch (error) {
        console.error("Error clearing notifications:", error);
      }
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    const token = await getToken();
    if (token) {
      setDeletingIds((prev) => new Set(prev).add(notificationId));

      try {
        await dispatch(deleteNotification({ notificationId, token })).unwrap();
        setDeletingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(notificationId);
          return newSet;
        });
      } catch (error) {
        setDeletingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(notificationId);
          return newSet;
        });
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications.filter((n) => n.isRead);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "NEW_USER":
      case "USER_REGISTRATION":
        return UserPlus;
      case "FRIEND_REQUEST":
      case "FRIEND_ACCEPT":
        return Users;
      case "NEW_ORDER":
      case "ORDER_UPDATE":
        return Package;
      case "PAYMENT":
      case "PAYMENT_SUCCESS":
        return DollarSign;
      case "LIKE":
      case "POST_LIKE":
        return Heart;
      case "COMMENT":
      case "POST_COMMENT":
        return MessageCircle;
      case "SYSTEM_ALERT":
      case "ALERT":
        return AlertCircle;
      case "SYSTEM_UPDATE":
        return Settings;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "NEW_USER":
      case "USER_REGISTRATION":
        return "bg-blue-100 text-blue-600";
      case "FRIEND_REQUEST":
      case "FRIEND_ACCEPT":
        return "bg-purple-100 text-purple-600";
      case "NEW_ORDER":
      case "ORDER_UPDATE":
        return "bg-orange-100 text-orange-600";
      case "PAYMENT":
      case "PAYMENT_SUCCESS":
        return "bg-green-100 text-green-600";
      case "LIKE":
      case "POST_LIKE":
        return "bg-pink-100 text-pink-600";
      case "COMMENT":
      case "POST_COMMENT":
        return "bg-indigo-100 text-indigo-600";
      case "SYSTEM_ALERT":
      case "ALERT":
        return "bg-red-100 text-red-600";
      case "SYSTEM_UPDATE":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  };

  if (isLoading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Notifications
                </h1>
                <p className="text-sm text-gray-500">
                  {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "unread"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "read"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Read ({notifications.length - unreadCount})
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && error !== "No notifications found" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications to display</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const Icon = getNotificationIcon(notif.type);
              const isDeleting = deletingIds.has(notif._id);

              return (
                <div
                  key={notif._id}
                  className={`bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md ${
                    !notif.isRead ? "border-l-4 border-blue-600" : ""
                  } ${isDeleting ? "opacity-50 animate-pulse" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${getTypeColor(notif.type)}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {notif.type.replace(/_/g, " ")}
                            {!notif.isRead && (
                              <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {notif.message}
                          </p>
                          <span className="text-xs text-gray-400">
                            {getTimeAgo(notif.createdAt)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          {!notif.isRead && (
                            <button
                              onClick={() => markAsRead(notif._id)}
                              disabled={isLoading || isDeleting}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notif._id)}
                            disabled={isLoading || isDeleting}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete notification"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotification;
