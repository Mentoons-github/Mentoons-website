import { Dispatch, SetStateAction } from "react";
import { FaBell, FaHome, FaUser } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { Link } from "react-router-dom";

interface BottomNavProps {
  activeSection:
    | "home"
    | "notification"
    | "memeBanner"
    | "friendRequest"
    | "userProfile";
  setActiveSection: Dispatch<
    SetStateAction<
      "home" | "notification" | "memeBanner" | "friendRequest" | "userProfile"
    >
  >;
}

const BottomNav = ({ activeSection, setActiveSection }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9] bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-16">
        <button
          onClick={() => setActiveSection("home")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeSection === "home" ? "text-orange-500" : "text-gray-500"
          }`}
        >
          <FaHome className="text-xl" />
          <span className="mt-1 text-xs">Home</span>
        </button>
        <button
          onClick={() => setActiveSection("notification")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeSection === "notification"
              ? "text-orange-500"
              : "text-gray-500"
          }`}
        >
          <FaBell className="text-xl" />
          <span className="mt-1 text-xs">Notifications</span>
        </button>
        <button
          onClick={() => setActiveSection("friendRequest")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeSection === "friendRequest"
              ? "text-orange-500"
              : "text-gray-500"
          }`}
        >
          <FaMessage className="text-xl" />
          <span className="mt-1 text-xs">Messages</span>
        </button>
        <Link
          to="/adda/user-profile"
          className="flex flex-col items-center justify-center w-full h-full text-gray-500"
        >
          <FaUser className="text-xl" />
          <span className="mt-1 text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
