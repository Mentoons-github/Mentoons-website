import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  MessageCircle,
  AlertTriangle,
  Clock,
  UserCheck,
  UserX,
  Heart,
  MessageSquare,
  Share2,
  UserPlus,
  AtSign,
  Users,
  Camera,
  FileText,
  Calendar,
  Gift,
  Eye,
  Flag,
  CheckCircle,
  XCircle,
  Settings,
  Tag,
  ShieldCheck,
  ShieldX,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNotifications } from "@/context/adda/notificationContext";
import { NotificationType } from "@/types";
import axios from "axios";

interface NotificationProps {
  getToken: () => Promise<string | null>;
}

const Notification = ({ getToken }: NotificationProps) => {
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const {
    notifications,
    isLoading,
    markNotificationRead,
    markAllNotificationsRead,
    updateNotification,
    removeNotification,
  } = useNotifications();

  console.log("notifications :", notifications);
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
    const iconProps = { size: 18, className: "flex-shrink-0" };
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
    await markNotificationRead(notification._id);

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

    try {
      const token = await getToken();
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
          updateNotification(notificationId, {
            isRead: true,
            type: "friend_request_accepted",
            message: `${
              typeof response.data.initiatorId === "object"
                ? response.data.initiatorId.name
                : "User"
            } is now your friend`,
          });
          await markNotificationRead(notificationId);
        } else {
          removeNotification(notificationId);
        }
      }
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  console.log("sorted notification :", sortedNotifications);

  return (
    <div className="relative hidden py-2 md:block" ref={notificationRef}>
      <div
        onClick={() => setShowNotificationModal(!showNotificationModal)}
        className="relative cursor-pointer p-2 hover:bg-gray-700 rounded-full transition-colors"
      >
        <FaBell className="text-white" />
        {getNotificationCount() > 0 && (
          <span className="absolute px-2 text-xs text-center text-black bg-yellow-400 rounded-full -top-0 -right-1">
            {getNotificationCount()}
          </span>
        )}
      </div>

      {showNotificationModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-[999999] overflow-hidden"
        >
          <div className="bg-red-500 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Notifications</h3>
                <p className="text-blue-100 text-xs">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-sm font-medium mt-2">
                  Loading notifications...
                </p>
              </div>
            ) : sortedNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm font-medium">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {sortedNotifications.map((notification) => {
                  const initiator =
                    typeof notification.initiatorId === "object"
                      ? notification.initiatorId
                      : null;
                  return (
                    <div
                      key={notification._id}
                      className={`notification-item p-3 cursor-pointer transition-all duration-200 border-l-4 ${
                        notification.isRead
                          ? "bg-gray-50 hover:bg-gray-100 border-l-gray-200"
                          : `bg-blue-50 hover:bg-blue-100 ${getPriorityColor(
                              notification.type
                            )}`
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-2">
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
                              className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-xs leading-relaxed ${
                                notification.isRead
                                  ? "text-gray-700"
                                  : "text-gray-900 font-medium"
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
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            {notification.type === "friend_request" && (
                              <div className="flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFriendRequestAction(
                                      notification._id,
                                      notification.referenceId,
                                      "accept"
                                    );
                                  }}
                                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
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
                                  className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                >
                                  Decline
                                </button>
                              </div>
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
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate("/adda/notifications");
                  setShowNotificationModal(false);
                }}
                className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium"
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

export default Notification;
