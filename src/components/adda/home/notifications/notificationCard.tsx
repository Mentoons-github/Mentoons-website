import {
  Bell,
  Check,
  CheckCircle,
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  UserPlus,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Notification, NotificationType } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (notification: Notification) => void;
  onFriendRequestAction: (
    notificationId: string,
    referenceId: string | undefined,
    action: "accept" | "decline"
  ) => void;
}

interface User {
  name: string;
  picture: string;
}

const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
  onFriendRequestAction,
}: NotificationCardProps) => {
  const timeAgo = notification.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : "recently";

  const getNotificationIcon = (type: NotificationType) => {
    const iconProps = { className: "w-5 h-5 text-orange-500" };
    switch (type) {
      case "friend_request":
      case "friend_request_accepted":
        return <UserPlus {...iconProps} />;
      case "like":
        return <Heart {...iconProps} />;
      case "comment":
        return <MessageCircle {...iconProps} />;
      case "share":
        return <Share2 {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const isUser = (initiator: string | User): initiator is User => {
    return typeof initiator !== "string";
  };

  const initiatorName = isUser(notification.initiatorId)
    ? notification.initiatorId.name
    : "Anonymous User";
  const initiatorPicture = isUser(notification.initiatorId)
    ? notification.initiatorId.picture
    : "/default-avatar.png";

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
      className={`flex flex-col items-center justify-start w-full gap-5 p-5 transition-all duration-300 border border-orange-200 rounded-xl shadow-sm hover:shadow-lg bg-white ${
        !notification.isRead ? "bg-orange-50" : ""
      }`}
      onClick={() => onClick(notification)}
      role="button"
      tabIndex={0}
      aria-label={`Notification from ${initiatorName}`}
    >
      <div className="flex items-start w-full gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative overflow-hidden border-2 border-orange-200 rounded-full w-14 h-14 shrink-0 z-[1]"
        >
          <img
            src={initiatorPicture}
            alt={initiatorName}
            className="object-cover w-full h-full"
            loading="lazy"
          />
          <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-sm">
            {getNotificationIcon(notification.type)}
          </div>
        </motion.div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex flex-col figtree">
              <span className="font-semibold text-orange-900">
                {initiatorName}
              </span>
              <span className="text-sm text-orange-600">
                {notification.message}
                {notification.referenceId && (
                  <span className="text-xs text-orange-500">
                    {" "}
                    (ID: {notification.referenceId.slice(-6)})
                  </span>
                )}
              </span>
            </div>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="px-2 py-1 text-xs font-medium text-orange-600 rounded-full bg-orange-100"
            >
              {timeAgo}
            </motion.span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 mt-3 flex-wrap"
          >
            {notification.type === "friend_request" && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFriendRequestAction(
                      notification._id,
                      notification.referenceId,
                      "accept"
                    );
                  }}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-white bg-orange-500 rounded-full hover:bg-orange-600"
                  aria-label="Accept friend request"
                >
                  <CheckCircle className="w-3 h-3" />
                  Accept
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFriendRequestAction(
                      notification._id,
                      notification.referenceId,
                      "decline"
                    );
                  }}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-orange-600 bg-orange-100 rounded-full hover:bg-orange-200"
                  aria-label="Decline friend request"
                >
                  <XCircle className="w-3 h-3" />
                  Decline
                </motion.button>
              </>
            )}
            {!notification.isRead && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification._id);
                }}
                className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-orange-600 bg-orange-100 rounded-full hover:bg-orange-200"
                aria-label="Mark notification as read"
              >
                <Check className="w-3 h-3" />
                Mark as read
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification._id);
              }}
              className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-orange-600 bg-orange-100 rounded-full hover:bg-orange-200"
              aria-label="Delete notification"
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

export default NotificationCard;
