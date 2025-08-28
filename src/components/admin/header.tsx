import { useUser, useClerk } from "@clerk/clerk-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown,
  MessageSquare,
} from "lucide-react";

interface AdminHeaderProps {
  onSidebarToggle?: (collapsed: boolean) => void;
  isSidebarCollapsed?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onSidebarToggle,
  isSidebarCollapsed,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "New user registered", time: "5 min ago", unread: true },
    {
      id: 2,
      message: "System backup completed",
      time: "1 hour ago",
      unread: false,
    },
    { id: 3, message: "New order received", time: "2 hours ago", unread: true },
  ]);

  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
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

  // Enhanced breadcrumb logic
  const getBreadcrumbTitle = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);

    if (pathSegments.length === 0) return "Dashboard";

    const lastSegment = pathSegments[pathSegments.length - 1];

    // Check if last segment is an ID (ObjectId pattern)
    if (/^[0-9a-f]{24}$/i.test(lastSegment) && pathSegments.length > 1) {
      const parentSegment = pathSegments[pathSegments.length - 2];
      return formatSegmentName(parentSegment) + " Details";
    }

    // Handle specific routes
    const routeNames: Record<string, string> = {
      users: "User Management",
      products: "Product Management",
      orders: "Order Management",
      analytics: "Analytics Dashboard",
      settings: "System Settings",
      profile: "User Profile",
    };

    return routeNames[lastSegment] || formatSegmentName(lastSegment);
  };

  const formatSegmentName = (segment: string): string => {
    return segment
      .replace(/[_-]/g, " ")
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="flex items-center w-full px-4 lg:px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 border-b border-blue-400 shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Left Section - Menu Toggle & Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onSidebarToggle?.(!isSidebarCollapsed)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
          >
            {isSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
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

        {/* Right Section - Actions & User Menu */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationMenuRef}>
            <button
              onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
              className="relative p-2 rounded-full text-white hover:bg-white/10 transition-colors duration-200"
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
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                        notification.unread
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                    >
                      <p className="text-sm text-gray-800">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 bg-gray-50 border-t">
                  <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center space-x-2 lg:space-x-3 focus:outline-none text-white hover:bg-white/10 rounded-full p-2 transition-all duration-200 group"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm border-2 border-white/20 group-hover:border-white/40 transition-colors">
                  {user?.fullName?.charAt(0) ||
                    user?.firstName?.charAt(0) ||
                    "A"}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="font-medium text-sm">
                    {user?.fullName ||
                      user?.firstName + " " + user?.lastName ||
                      "Admin User"}
                  </p>
                  <p className="text-xs text-blue-100 opacity-75">
                    {user?.primaryEmailAddress?.emailAddress ||
                      "admin@example.com"}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 hidden lg:block ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-30 overflow-hidden border">
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
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150 group"
                    onClick={() => {
                      navigate("/admin/profile");
                      setUserMenuOpen(false);
                    }}
                  >
                    <User className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                    View Profile
                  </button>

                  <button
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150 group"
                    onClick={() => {
                      navigate("/admin/settings");
                      setUserMenuOpen(false);
                    }}
                  >
                    <Settings className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                    Settings
                  </button>

                  <button
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150 group"
                    onClick={() => {
                      navigate("/admin/messages");
                      setUserMenuOpen(false);
                    }}
                  >
                    <MessageSquare className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                    Messages
                  </button>
                </div>

                <div className="border-t py-2">
                  <button
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
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
