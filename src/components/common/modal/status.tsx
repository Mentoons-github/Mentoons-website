import { motion } from "framer-motion";
import { UserStatusInterface } from "../../../types";
import { FaTimes } from "react-icons/fa";

const Status = ({
  status,
  setStatus,
}: {
  status: UserStatusInterface;
  setStatus: (val: UserStatusInterface | null) => void;
}) => {
  const isVideo = (media: string) => /\.(mp4|webm|ogg|mov)$/i.test(media);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 50 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] z-50 p-4"
      onClick={() => setStatus(null)}
    >
      <div
        className="relative w-[90%] sm:w-[70%] md:w-[50%] max-w-lg bg-white rounded-xl p-4 sm:p-5 shadow-lg flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <FaTimes
          className="absolute top-3 right-3 w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800 transition"
          onClick={() => setStatus(null)}
        />

        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src={status.userProfilePic}
            alt={status.userName}
            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-full border-2 border-blue-500"
          />
          <p className="text-base sm:text-lg font-semibold">
            {status.userName}
          </p>
        </div>

        <div className="w-full flex justify-center">
          {isVideo(status.status) ? (
            <video
              src={status.status}
              autoPlay
              loop
              muted
              playsInline
              className="w-[90%] max-w-sm h-[50vh] rounded-lg object-cover"
            />
          ) : (
            <img
              src={status.status}
              alt="status"
              className="w-[90%] max-w-sm h-[50vh] object-cover rounded-lg"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Status;
