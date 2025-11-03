import { useUser, useAuth, useClerk } from "@clerk/clerk-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Bell,
  Menu,
  User,
  LogOut,
  ChevronDown,
  Check,
  Trash2,
  Loader2,
} from "lucide-react";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from "@/redux/adda/notificationSlice";

interface AdminHeaderProps {
  onSidebarToggle: (collapsed: boolean) => void;
  isSidebarCollapsed: boolean;
  isMobile: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onSidebarToggle,
  isSidebarCollapsed,
  isMobile,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { notifications, isLoading } = useSelector(
    (state: RootState) => state.notification
  );

  // Fetch notifications on mount
  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      if (token) {
        dispatch(fetchNotifications({ token, page: 1, limit: 10 }));
      }
    };
    fetchData();
  }, [dispatch, getToken]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        setNotificationMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Breadcrumb title logic
  const getBreadcrumbTitle = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) return "Dashboard";

    const lastSegment = pathSegments[pathSegments.length - 1];

    if (/^[0-9a-f]{24}$/i.test(lastSegment) && pathSegments.length > 1) {
      const parentSegment = pathSegments[pathSegments.length - 2];
      return formatSegmentName(parentSegment) + " Details";
    }

    const routeNames: Record<string, string> = {
      users: "User Management",
      products: "Product Management",
      orders: "Order Management",
      analytics: "Analytics Dashboard",
      settings: "System Settings",
      profile: "Admin Profile",
    };

    return routeNames[lastSegment] || formatSegmentName(lastSegment);
  };

  const formatSegmentName = (segment: string): string => {
    return segment
      .replace(/[_-]/g, " ")
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Notification actions
  const handleMarkAsRead = async (notificationId: string) => {
    const token = await getToken();
    if (token) {
      dispatch(markNotificationRead({ token, notificationId }));
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = await getToken();
    if (token) {
      await dispatch(markAllNotificationsRead(token)).unwrap();
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    const token = await getToken();
    if (token) {
      setDeletingIds((prev) => new Set(prev).add(notificationId));
      try {
        await dispatch(deleteNotification({ notificationId, token })).unwrap();
      } catch (error) {
        console.error("Delete failed:", error);
      } finally {
        setDeletingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(notificationId);
          return newSet;
        });
      }
    }
  };

  const handleClearAll = async () => {
    const token = await getToken();
    if (token) {
      try {
        await dispatch(clearAllNotifications(token)).unwrap();
      } catch (error) {
        console.error("Clear all failed:", error);
      }
    }
  };

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.isRead).length
    : 0;

  const formatTime = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / 1000 / 60
    );

    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hour${
        Math.floor(diffInMinutes / 60) > 1 ? "s" : ""
      } ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="flex items-center w-full px-4 lg:px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 border-b border-blue-400 shadow-lg">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Left: Toggle + Title */}
        <div className="flex items-center space-x-4">
          {/* Hamburger (Mobile) / Collapse Toggle (Desktop) */}
          <button
            onClick={() =>
              onSidebarToggle(isMobile ? true : !isSidebarCollapsed)
            }
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
          >
            <Menu size={20} />
          </button>

          <div className="flex flex-col">
            <h1 className="text-xl lg:text-2xl font-semibold tracking-wide text-white">
              {getBreadcrumbTitle()}
            </h1>
            <div className="text-xs text-blue-100 opacity-75 hidden sm:block">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Right: Notifications + User Menu */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationMenuRef}>
            <button
              onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
              className="relative p-2 rounded-full text-white hover:bg-white/10 transition-colors"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-30 overflow-hidden border">
                <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Notifications
                  </h3>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        disabled={isLoading}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        Mark all
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        disabled={isLoading}
                        className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {isLoading ? (
                    <div className="px-4 py-3 text-sm text-gray-600">
                      Loading notifications...
                    </div>
                  ) : !Array.isArray(notifications) ||
                    notifications.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-600">
                      No notifications available
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const isDeleting = deletingIds.has(notification._id);
                      return (
                        <div
                          key={notification._id}
                          className={`px-4 py-3 hover:bg-gray-50 flex items-start justify-between gap-2 ${
                            !notification.isRead
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : ""
                          } ${isDeleting ? "opacity-50 animate-pulse" : ""}`}
                        >
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => handleMarkAsRead(notification._id)}
                          >
                            <p className="text-sm text-gray-800">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteNotification(notification._id)
                            }
                            disabled={isLoading || isDeleting}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="px-4 py-2 bg-gray-50 border-t">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      navigate("/admin/notifications");
                      setNotificationMenuOpen(false);
                    }}
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center space-x-2 lg:space-x-3 text-white hover:bg-white/10 rounded-full p-2 transition-all group"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm border-2 border-white/20 group-hover:border-white/40">
                {user?.fullName?.charAt(0) || user?.firstName?.charAt(0) || "A"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="font-medium text-sm">
                  {user?.fullName ||
                    `${user?.firstName} ${user?.lastName}` ||
                    "Admin"}
                </p>
                <p className="text-xs text-blue-100 opacity-75">
                  {user?.primaryEmailAddress?.emailAddress ||
                    "admin@example.com"}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform hidden lg:block ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-30 border">
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <p className="font-semibold text-gray-800">
                    {user?.fullName || "Admin User"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>

                <div className="py-2">
                  <button
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 group"
                    onClick={() => {
                      navigate("/admin/profile");
                      setUserMenuOpen(false);
                    }}
                  >
                    <User className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                    View Profile
                  </button>
                </div>

                <div className="border-t py-2">
                  <button
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 group"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-600" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
