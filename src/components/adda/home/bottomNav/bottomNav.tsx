import {
  FaHome,
  FaRegLaughSquint,
  FaUser,
  FaUserFriends,
} from "react-icons/fa";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const BottomNav = ({
  setActive,
}: {
  setActive: React.Dispatch<
    React.SetStateAction<
      "home" | "notification" | "memeBanner" | "friendRequest" | "userProfile"
    >
  >;
  
  }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 left-0 flex items-center justify-between w-full px-4 bg-white border-t border-gray-300 md:hidden h-14">
      <div className="relative" onClick={() => setActive("notification")}>
        <button className="relative p-2 outline-none cursor-pointer">
          <FiBell className="text-3xl" />
          <span className="absolute top-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-600 rounded-full -right-0">
            1
          </span>
        </button>
      </div>

      <div className="relative" onClick={() => setActive("memeBanner")}>
        <button className="relative p-2 outline-none cursor-pointer">
          <FaRegLaughSquint className="text-3xl" />
        </button>
      </div>

      <div className="relative" onClick={() => setActive("home")}>
        <button className="relative p-2 outline-none cursor-pointer">
          <FaHome className="text-3xl" />
        </button>
      </div>

      <div className="relative" onClick={() => setActive("friendRequest")}>
        <button className="relative p-2 outline-none cursor-pointer">
          <FaUserFriends className="text-3xl" />
          <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-600 rounded-full -top-0 -right-1">
            1
          </span>
        </button>
      </div>

      <div className="relative" onClick={() => navigate("/adda/user-profile") }>
        <button className="p-2 outline-none cursor-pointer">
          <FaUser className="text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
