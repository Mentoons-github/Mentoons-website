import {
  FaHome,
  FaRegLaughSquint,
  FaUser,
  FaUserFriends,
} from "react-icons/fa";
import { FiBell } from "react-icons/fi";

const BottomNav = ({
  setActive,
}: {
  setActive: React.Dispatch<
    React.SetStateAction<
      "home" | "notification" | "memeBanner" | "friendRequest"
    >
  >;
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full flex justify-between items-center px-4 bg-white border-t border-gray-300 h-14">
      <div className="relative" onClick={() => setActive("notification")}>
        <button className="relative outline-none cursor-pointer p-2">
          <FiBell className="text-3xl" />
          <span className="absolute top-0 -right-0 w-5 h-5 bg-red-600 text-white text-xs flex items-center justify-center rounded-full">
            1
          </span>
        </button>
      </div>

      <div className="relative" onClick={() => setActive("memeBanner")}>
        <button className="relative outline-none cursor-pointer p-2">
          <FaRegLaughSquint className="text-3xl" />
        </button>
      </div>

      <div className="relative" onClick={() => setActive("home")}>
        <button className="relative outline-none cursor-pointer p-2">
          <FaHome className="text-3xl" />
        </button>
      </div>

      <div className="relative" onClick={() => setActive("friendRequest")}>
        <button className="relative outline-none cursor-pointer p-2">
          <FaUserFriends className="text-3xl" />
          <span className="absolute -top-0 -right-1 w-5 h-5 bg-red-600 text-white text-xs flex items-center justify-center rounded-full">
            1
          </span>
        </button>
      </div>

      <div className="relative">
        <button className="outline-none cursor-pointer p-2">
          <FaUser className="text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
