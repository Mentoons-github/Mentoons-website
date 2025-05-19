import { FaBookmark, FaUsers } from "react-icons/fa6";
import { FiAward, FiHome, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

const MobileBottomNav = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (val: string) => void;
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        <button
          className={`relative outline-none cursor-pointer p-2 ${
            activeTab === "profile" ? "text-[#EC9600]" : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <FiUser className="text-2xl" />
        </button>

        <button
          className={`relative outline-none cursor-pointer p-2 ${
            activeTab === "friends" ? "text-[#EC9600]" : ""
          }`}
          onClick={() => setActiveTab("friends")}
        >
          <FaUsers className="text-2xl" />
        </button>

        <Link
          to="/adda/home"
          className="relative p-2 outline-none cursor-pointer"
        >
          <FiHome className="text-2xl text-[#EC9600]" />
        </Link>

        <button
          className={`relative outline-none cursor-pointer p-2 ${
            activeTab === "rewards" ? "text-[#EC9600]" : ""
          }`}
          onClick={() => setActiveTab("rewards")}
        >
          <FiAward className="text-2xl" />
        </button>

        <button
          className={`relative outline-none cursor-pointer p-2 ${
            activeTab === "saved" ? "text-[#EC9600]" : ""
          }`}
          onClick={() => setActiveTab("saved")}
        >
          <FaBookmark className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
