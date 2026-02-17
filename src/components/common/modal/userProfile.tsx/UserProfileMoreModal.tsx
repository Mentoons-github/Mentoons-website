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
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute right-0 z-50 w-48 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-xl"
    >
      <>
        <button
          className="flex items-center w-full px-4 py-3 text-left text-orange-600 transition-colors hover:bg-gray-50"
          onClick={() => {
            setModalType("blocked");
            onClose();
          }}
        >
          <MdReport className="w-5 h-5 mr-1" />
          Blocked Users
        </button>

      </>
    </motion.div>
  );
};

export default UserProfileMoreModal;
