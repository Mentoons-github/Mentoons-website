import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  IndianRupee,
  Phone,
  Cake,
  LogOut,
  Menu,
  X,
  ClipboardList,
  Sheet,
  Wallet2,
} from "lucide-react";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: "/employee/dashboard",
  },
  {
    name: "Tasks",
    icon: <CheckSquare className="w-5 h-5" />,
    path: "/employee/tasks",
  },
  {
    name: "Request Leave",
    icon: <FileText className="w-5 h-5" />,
    path: "/employee/request-leave",
  },
  {
    name: "Salary",
    icon: <IndianRupee className="w-5 h-5" />,
    path: "/employee/salary",
  },
  {
    name: "Session Calls",
    icon: <Phone className="w-5 h-5" />,
    path: "/employee/session-calls",
  },
  {
    name: "Celebrations",
    icon: <Cake className="w-5 h-5" />,
    path: "/employee/celebrations",
  },
  {
    name: "Data Capture",
    icon: <ClipboardList className="w-5 h-5" />,
    path: "/employee/data_capture",
  },
  {
    name: "Workshops",
    icon: <Sheet className="w-5 h-5" />,
    path: "/employee/workshops",
  },
  {
    name: "Incentive",
    icon: <Wallet2 className="w-5 h-5" />,
    path: "/employee/incentive",
  },
];

const EmployeeSidebar = ({ showSession }: { showSession: boolean }) => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleDrawer = () => setIsOpen((v) => !v);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Debug
  console.log("showSession in Sidebar:", showSession);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleDrawer}
        className="fixed top-4 left-4 z-40 p-2 rounded-md bg-gray-800 text-white md:hidden"
        aria-label="Open menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          h-screen z-50 flex flex-col bg-gray-800 shadow-2xl
          transition-all duration-300 ease-in-out
          fixed top-0 left-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky md:top-0
          w-64
          ${isHovered ? "md:w-64" : "md:w-16"}
        `}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700 flex justify-center flex-shrink-0">
          <img
            src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
            alt="Mentoons Logo"
            className={`object-contain transition-all duration-300 ${
              isHovered ? "w-28" : "w-10"
            }`}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navItems
              .filter((item) => item.name !== "Session Calls" || showSession)
              .map((item) => (
                <Tooltip
                  key={item.name}
                  label={item.name}
                  side="right"
                  show={!isHovered}
                >
                  <li>
                    <NavLink
                      to={item.path}
                      end
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center p-3 rounded-xl text-sm md:text-base font-medium transition-all duration-200 group
                        ${
                          isActive
                            ? "bg-orange-500 text-white shadow-lg"
                            : "text-gray-300 hover:bg-orange-500/20 hover:text-white"
                        }
                        ${isHovered ? "" : "md:justify-center"}`
                      }
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span
                        className={`ml-3 whitespace-nowrap transition-all duration-300 ${
                          isHovered
                            ? "opacity-100"
                            : "md:opacity-0 md:w-0 md:ml-0"
                        }`}
                      >
                        {item.name}
                      </span>
                    </NavLink>
                  </li>
                </Tooltip>
              ))}
          </ul>
        </nav>

        {/* User & Logout */}
        {user && (
          <div className="border-t border-gray-700 p-4 space-y-3 flex-shrink-0">
            <Tooltip label="User Profile" side="right" show={!isHovered}>
              <NavLink
                to="/employee/profile"
                onClick={() => setIsOpen(false)}
                className={`flex items-center p-2 rounded-xl hover:bg-gray-700/50 transition-colors ${
                  isHovered ? "" : "md:justify-center"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user.firstName?.charAt(0).toUpperCase()}
                </div>
                <div
                  className={`ml-3 transition-all duration-300 ${
                    isHovered ? "opacity-100" : "md:opacity-0 md:w-0 md:ml-0"
                  }`}
                >
                  <p className="text-sm font-semibold text-white">
                    {user.firstName}
                  </p>
                  <p className="text-xs text-gray-400">Settings & Account</p>
                </div>
              </NavLink>
            </Tooltip>

            <Tooltip label="Logout" side="right" show={!isHovered}>
              <button
                className={`flex w-full items-center p-2 rounded-xl text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors ${
                  isHovered ? "" : "md:justify-center"
                }`}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`ml-3 transition-all duration-300 ${
                    isHovered ? "opacity-100" : "md:opacity-0 md:w-0 md:ml-0"
                  }`}
                >
                  Logout
                </span>
              </button>
            </Tooltip>
          </div>
        )}
      </aside>
    </>
  );
};

// Tooltip Component
interface TooltipProps {
  children: React.ReactNode;
  label: string;
  side?: "left" | "right" | "top" | "bottom";
  show?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  label,
  side = "right",
  show = true,
}) => {
  if (!show) return <>{children}</>;

  return (
    <div className="group relative inline-block w-full">
      {children}
      <div
        className={`
          absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md 
          opacity-0 invisible group-hover:opacity-100 group-hover:visible 
          transition-all duration-200 pointer-events-none whitespace-nowrap
          ${side === "right" ? "left-full ml-2 top-1/2 -translate-y-1/2" : ""}
          ${side === "left" ? "right-full mr-2 top-1/2 -translate-y-1/2" : ""}
          ${side === "top" ? "bottom-full mb-2 left-1/2 -translate-x-1/2" : ""}
          ${side === "bottom" ? "top-full mt-2 left-1/2 -translate-x-1/2" : ""}
        `}
      >
        {label}
        <div
          className={`
            absolute w-0 h-0 border-4 border-transparent
            ${
              side === "right"
                ? "right-full top-1/2 -translate-y-1/2 border-r-gray-900"
                : ""
            }
            ${
              side === "left"
                ? "left-full top-1/2 -translate-y-1/2 border-l-gray-900"
                : ""
            }
            ${
              side === "top"
                ? "bottom-0 translate-y-full left-1/2 -translate-x-1/2 border-t-gray-900"
                : ""
            }
            ${
              side === "bottom"
                ? "top-0 -translate-y-full left-1/2 -translate-x-1/2 border-b-gray-900"
                : ""
            }
          `}
        />
      </div>
    </div>
  );
};

export default EmployeeSidebar;
