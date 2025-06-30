import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  markAllNotificationsRead,
  deleteNotification,
  markNotificationRead,
  updateNotification,
  fetchNotifications,
  clearAllNotifications,
} from "@/redux/adda/notificationSlice";
import { NotificationType } from "@/types";
import axios from "axios";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  AtSign,
  Bell,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Flag,
  Gift,
  Heart,
  MessageCircle,
  MessageSquare,
  Settings,
  Share2,
  ShieldCheck,
  ShieldX,
  Tag,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  X,
  XCircle,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

interface NotificationProps {
  getToken: () => Promise<string | null>;
}

const NotificationModal = ({ getToken }: NotificationProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const notificationRef = useRef<HTMLDivElement>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const { notifications, isLoading } = useSelector(
    (state: RootState) => state.notification
  );

  console.log("notifications :", notifications);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      if (token) {
        dispatch(fetchNotifications({ token, page: 1 }));
      }
    };
    fetchData();
  }, [dispatch, getToken]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotificationModal(false);
      }
    };

    if (showNotificationModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotificationModal]);

  const getNotificationCount = () => {
    if (isLoading) return 0;
    return notifications.filter((n) => !n.isRead).length;
  };

  const getNotificationIcon = (type: NotificationType) => {
    const iconProps = { size: 20, className: "flex-shrink-0" };
    const iconMap: any = {
      message: { icon: MessageCircle, color: "text-blue-500" },
      alert: { icon: AlertTriangle, color: "text-red-500" },
      reminder: { icon: Clock, color: "text-yellow-500" },
      friend_request_accepted: { icon: UserCheck, color: "text-green-500" },
      friend_request_rejected: { icon: UserX, color: "text-red-500" },
      like: { icon: Heart, color: "text-pink-500" },
      comment: { icon: MessageSquare, color: "text-blue-500" },
      share: { icon: Share2, color: "text-indigo-500" },
      friend_request: { icon: UserPlus, color: "text-blue-600" },
      mention: { icon: AtSign, color: "text-purple-500" },
      follow: { icon: Users, color: "text-green-500" },
      tagged_in_photo: { icon: Camera, color: "text-pink-500" },
      post_update: { icon: FileText, color: "text-gray-600" },
      group_invite: { icon: Users, color: "text-indigo-500" },
      event_invite: { icon: Calendar, color: "text-orange-500" },
      birthday: { icon: Gift, color: "text-pink-500" },
      new_follower: { icon: Users, color: "text-green-500" },
      story_viewed: { icon: Eye, color: "text-gray-500" },
      post_reported: { icon: Flag, color: "text-red-500" },
      post_approved: { icon: CheckCircle, color: "text-green-500" },
      post_rejected: { icon: XCircle, color: "text-red-500" },
      system_update: { icon: Settings, color: "text-gray-600" },
      promotion: { icon: Tag, color: "text-yellow-500" },
      privacy_update: { icon: ShieldCheck, color: "text-blue-500" },
      content_approval: { icon: ShieldCheck, color: "text-green-500" },
      content_rejected: { icon: ShieldX, color: "text-red-500" },
    };

    const { icon: IconComponent, color } = iconMap[type] || {
      icon: Bell,
      color: "text-gray-500",
    };
    return (
      <IconComponent
        {...iconProps}
        className={`${iconProps.className} ${color}`}
      />
    );
  };

  const getPriorityColor = (type: NotificationType) => {
    const highPriority = [
      "message",
      "friend_request",
      "alert",
      "friend_request_accepted",
    ];
    const mediumPriority = [
      "like",
      "comment",
      "mention",
      "birthday",
      "event_invite",
    ];
    return highPriority.includes(type)
      ? "border-l-red-400"
      : mediumPriority.includes(type)
      ? "border-l-yellow-400"
      : "border-l-green-400";
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (notification: any) => {
    const token = await getToken();
    if (token) {
      await dispatch(
        markNotificationRead({ notificationId: notification._id, token })
      );
    }

    const getNavigationLink = (notif: any): string => {
      const { type, referenceId, referenceModel, initiatorId } = notif;
      const userId = typeof initiatorId === "object" ? initiatorId._id : null;

      switch (type) {
        case "friend_request":
        case "friend_request_accepted":
        case "friend_request_rejected":
          return userId ? `/adda/user/${userId}` : "/adda/notifications";
        case "like":
        case "comment":
          return referenceId &&
            (referenceModel === "Post" || referenceModel === "Comment")
            ? `/adda/posts/${referenceId}`
            : "/adda/notifications";
        default:
          return "/adda/notifications";
      }
    };

    const navigationLink = getNavigationLink(notification);
    navigate(navigationLink);
    setShowNotificationModal(false);
  };

  const handleFriendRequestAction = async (
    notificationId: string,
    referenceId: string | undefined,
    action: "accept" | "decline"
  ) => {
    if (!referenceId) return;
    const endpoint = action === "accept" ? "acceptRequest" : "rejectRequest";
    const token = await getToken();

    if (!token) return;
    console.log(token);

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_PROD_URL}/adda/${endpoint}/${referenceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (action === "accept") {
          dispatch(
            updateNotification({
              id: notificationId,
              data: {
                isRead: true,
                type: "friend_request_accepted",
                message: `${
                  typeof response.data.initiatorId === "object"
                    ? response.data.initiatorId.name
                    : "User"
                } is now your friend`,
              },
            })
          );
          await dispatch(markNotificationRead({ notificationId, token }));
        } else {
          await dispatch(deleteNotification({ notificationId, token }));
        }
      }
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
    }
  };

  const handleClearAllNotifications = async () => {
    const token = await getToken();
    if (token) {
      await dispatch(clearAllNotifications(token));
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="relative hidden py-4 md:block" ref={notificationRef}>
      <div
        onClick={() => setShowNotificationModal(!showNotificationModal)}
        className="relative p-2 rounded-full cursor-pointer transition-colors hover:bg-gray-800"
      >
        <FaBell className="text-white" />
        {getNotificationCount() > 0 && (
          <span className="absolute px-2 text-xs text-center text-black bg-gray-200 rounded-full shadow-lg -top-0 -right-1">
            {getNotificationCount()}
          </span>
        )}
      </div>

      {showNotificationModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="absolute right-0 mt-2 w-96 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 z-[99999] overflow-hidden"
        >
          <div className="px-5 py-4 text-white bg-gradient-to-r from-orange-600 to-orange-400">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Notifications</h3>
                <p className="text-sm text-gray-200">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={async () => {
                      const token = await getToken();
                      if (token) {
                        dispatch(markAllNotificationsRead(token));
                      }
                    }}
                    className="px-4 py-2 text-sm font-semibold transition-colors rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300"
                    aria-label="Mark all notifications as read"
                  >
                    Mark as read
                  </motion.button>
                )}
                {notifications.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearAllNotifications}
                    className="px-4 py-2 text-sm font-semibold transition-colors rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
                    aria-label="Clear all notifications"
                  >
                    <Trash2 size={20} className="inline-block mr-1" />
                    Clear All
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotificationModal(false)}
                  className="p-2 transition-colors rounded-full hover:bg-orange-500"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto max-h-96 bg-gray-800">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400">
                <div className="w-10 h-10 mx-auto border-b-2 border-gray-200 rounded-full animate-spin"></div>
                <p className="mt-3 text-base font-medium">
                  Loading notifications...
                </p>
              </div>
            ) : sortedNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell size={40} className="mx-auto mb-3 text-gray-500" />
                <p className="text-base font-medium">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {sortedNotifications.map((notification) => {
                  const initiator =
                    typeof notification.initiatorId === "object"
                      ? notification.initiatorId
                      : null;
                  return (
                    <div
                      key={notification._id}
                      className={`notification-item p-4 cursor-pointer transition-all duration-200 border-l-4 ${
                        notification.isRead
                          ? "bg-gray-800 hover:bg-gray-700 border-l-orange-400"
                          : `bg-gray-800 hover:bg-gray-700 ${getPriorityColor(
                              notification.type
                            )}`
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={
                                initiator?.picture ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  initiator?.name || "User"
                                )}&background=random`
                              }
                              alt={initiator?.name}
                              className="object-cover w-10 h-10 border-2 border-gray-900 rounded-full shadow-sm"
                            />
                            <div className="absolute p-1.5 bg-gray-900 rounded-full shadow-sm -bottom-1 -right-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <p
                              className={`text-sm leading-relaxed ${
                                notification.isRead
                                  ? "text-gray-400"
                                  : "text-gray-200 font-medium"
                              }`}
                            >
                              {notification.message}
                              {notification.referenceId && (
                                <span className="text-xs text-gray-500">
                                  {" "}
                                  (ID: {notification.referenceId.slice(-6)})
                                </span>
                              )}
                            </p>
                            {!notification.isRead && (
                              <div className="flex-shrink-0 w-2.5 h-2.5 mt-1 bg-orange-400 rounded-full" />
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            {notification.type === "friend_request" && (
                              <>
                                {notification.friendRequestStatus ===
                                "accepted" ? (
                                  <span className="text-sm text-green-400 font-medium">
                                    You accepted this friend request
                                  </span>
                                ) : notification.friendRequestStatus ===
                                  "rejected" ? (
                                  <span className="text-sm text-red-400 font-medium">
                                    You rejected this friend request
                                  </span>
                                ) : (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFriendRequestAction(
                                          notification._id,
                                          notification.referenceId,
                                          "accept"
                                        );
                                      }}
                                      className="px-3 py-1.5 text-sm text-gray-900 bg-orange-400 rounded-lg hover:bg-orange-500"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFriendRequestAction(
                                          notification._id,
                                          notification.referenceId,
                                          "decline"
                                        );
                                      }}
                                      className="px-3 py-1.5 text-sm text-gray-200 bg-gray-600 rounded-lg hover:bg-gray-500"
                                    >
                                      Decline
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-700 bg-gray-900 shadow-t-lg shadow-orange-400/20">
              <button
                onClick={() => {
                  navigate("/adda/notifications");
                  setShowNotificationModal(false);
                }}
                className="w-full text-sm font-medium text-center text-orange-400 hover:text-orange-300"
              >
                View all notifications
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default NotificationModal;
