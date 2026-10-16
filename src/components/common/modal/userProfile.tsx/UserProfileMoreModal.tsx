import { MdReport } from "react-icons/md";
import { motion } from "framer-motion";

interface UserProfileMoreModalProps {
  setModalType: React.Dispatch<
    React.SetStateAction<"followers" | "following" | "blocked" | null>
  >;
  onClose: () => void;
}

const UserProfileMoreModal = ({
  setModalType,
  onClose,
}: UserProfileMoreModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10, rotate: -1 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="absolute right-0 z-50 w-52 mt-3 overflow-hidden bg-white border-2 border-gray-900 rounded-xl shadow-[4px_4px_0_0_#111827]"
    >
      <div className="px-4 py-2 bg-[#F69306] border-b-2 border-gray-900">
        <span className="text-lg tracking-wider text-white font-comic">
          More
        </span>
      </div>

      <button
        className="flex items-center w-full gap-2 px-4 py-3 text-left text-gray-900 transition-all duration-150 hover:bg-orange-100 hover:pl-5 active:bg-orange-200"
        onClick={() => {
          setModalType("blocked");
          onClose();
        }}
      >
        <span className="flex items-center justify-center w-7 h-7 text-white bg-orange-500 border-2 border-gray-900 rounded-md shadow-[2px_2px_0_0_#111827]">
          <MdReport className="w-4 h-4" />
        </span>
        <span className="text-base tracking-wide font-comic">
          Blocked Users
        </span>
      </button>
    </motion.div>
  );
};

export default UserProfileMoreModal;
