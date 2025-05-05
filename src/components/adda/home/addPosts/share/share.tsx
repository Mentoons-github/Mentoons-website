import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BiShare } from "react-icons/bi";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";

interface PostDetails {
  title: string;
  description: string;
  postUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  author: string;
  role: string;
  timestamp: string;
  likes: number;
  comments: number;
  saves: number;
  shareCount: number;
}

const Share = ({ postDetails }: { postDetails: PostDetails }) => {
  const [showShareOptions, setShareOptions] = useState(false);
  const shareText = `${postDetails.title} - ${postDetails.description}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".share-container")) {
        setShareOptions(false);
      }
    };

    if (showShareOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showShareOptions]);

  return (
    <div className="relative flex items-center gap-3 share-container">
      <motion.button
        className="flex items-center justify-center w-8 p-2 border border-orange-400 rounded-full sm:w-12 sm:h-12"
        onClick={() => setShareOptions(!showShareOptions)}
        whileTap={{ scale: 0.9 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0px 4px 10px rgba(255,110,0,0.30)",
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <BiShare className="w-5 sm:w-6 sm:h-6 text-orange-500 transform scale-x-[-1]" />
      </motion.button>

      <span className="text-[#605F5F] text-base figtree text-sm">
        {postDetails.saves}
      </span>

      {showShareOptions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 15 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            type: "spring",
            stiffness: 120,
          }}
          className="absolute z-10 flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg shadow-xl bottom-13 sm:bottom-16 -left-3/5 sm:left-0 sm:p-2 md:p-3"
        >
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              shareText + " " + postDetails.postUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 text-green-600"
          >
            <FaWhatsapp className="w-4 sm:w-5 sm:h-5" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              postDetails?.postUrl
            )}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 text-blue-500"
          >
            <FaTwitter className="w-4 sm:w-5 sm:h-5" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              postDetails?.postUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 text-blue-700"
          >
            <FaLinkedin className="w-4 sm:w-5 sm:h-5" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              postDetails?.postUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 text-blue-600"
          >
            <FaFacebook className="w-4 sm:w-5 sm:h-5" />
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default Share;
