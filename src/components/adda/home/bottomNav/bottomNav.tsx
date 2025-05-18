import { FaBell, FaHome, FaUser, FaUserFriends } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9] bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-16">
        <button
          onClick={() => navigate("/adda/home")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            location.pathname === "/adda/home"
              ? "text-orange-500"
              : "text-gray-500"
          }`}
        >
          <FaHome className="text-xl" />
          <span className="mt-1 text-xs">Home</span>
        </button>

        <button
          onClick={() => navigate("/adda/notifications")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            location.pathname === "/adda/notifications"
              ? "text-orange-500"
              : "text-gray-500"
          }`}
        >
          <FaBell className="text-xl" />
          <span className="mt-1 text-xs">Notifications</span>
        </button>

        <button
          onClick={() => navigate("/adda/search-friend")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            location.pathname === "/adda/search-friend"
              ? "text-orange-500"
              : "text-gray-500"
          }`}
        >
          <FaUserFriends className="text-xl" />
          <span className="mt-1 text-xs">Friends</span>
        </button>

        <button
          onClick={() => navigate("/adda/user-profile")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            location.pathname === "/adda/user-profile"
              ? "text-orange-500"
              : "text-gray-500"
          }`}
        >
          <FaUser className="text-xl" />
          <span className="mt-1 text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
