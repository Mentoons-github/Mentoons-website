import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { UserStatusInterface } from "../../../types";

const Status = ({
  status,
  setStatus,
}: {
  status: UserStatusInterface;
  setStatus: (val: UserStatusInterface | null) => void;
}) => {
  const isVideo = (media: string) => /\.(mp4|webm|ogg|mov)$/i.test(media);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setStatus(null), 500);
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);

    // Ensure video plays when component mounts
    if (isVideo(status.url) && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }

    return () => clearInterval(timer);
  }, [setStatus, status.url]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999999999999] flex items-center justify-center bg-black"
      onClick={() => setStatus(null)}
    >
      <div
        className="relative w-full h-full md:w-[400px] md:h-[85vh] bg-black flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex w-full px-2 pt-2">
          <div className="w-full h-1 overflow-hidden bg-gray-500 bg-opacity-50 rounded-full">
            <div
              className="h-full transition-all duration-100 ease-linear bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between w-full p-4 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center gap-2">
            <img
              src={status.userProfilePicture}
              alt={status.username}
              className="object-cover w-8 h-8 border-2 border-pink-500 rounded-full"
            />
            <p className="text-sm font-medium text-white">{status.username}</p>
            <span className="text-xs text-gray-300">• 2h</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white">
              <FaTimes
                className="w-5 h-5 transition cursor-pointer hover:text-gray-300"
                onClick={() => setStatus(null)}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex items-center justify-center w-full h-full">
          {isVideo(status.url) ? (
            <video
              ref={videoRef}
              src={status.url}
              autoPlay
              controls
              playsInline
              className="object-contain w-full h-full"
            />
          ) : (
            <img
              src={status.url}
              alt="status"
              className="object-contain w-full h-full"
            />
          )}
        </div>

        {/* Footer - Reply section */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center w-full gap-2 p-2 bg-white rounded-full bg-opacity-20">
            <input
              type="text"
              placeholder="Reply to story..."
              className="flex-1 text-sm text-white placeholder-gray-300 bg-transparent border-none outline-none"
            />
            <button className="text-sm font-medium text-white">Send</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Status;
