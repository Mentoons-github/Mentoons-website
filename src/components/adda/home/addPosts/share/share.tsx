import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BiShare } from "react-icons/bi";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";

const Share = ({ postDetails, type }: { postDetails: any; type: string }) => {
  const [showShareOptions, setShareOptions] = useState(false);
  const [shareCount, setShareCount] = useState(postDetails.shares.length);
  const { getToken } = useAuth();
  const shareText = `${postDetails?.title} - ${postDetails.content}`;
  const baseUrl =
    type === "post"
      ? window.location.origin + "/adda/post/"
      : type === "meme"
      ? window.location.origin + "/adda/meme/"
      : "";

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

  const trackShare = async (platform: string) => {
    try {
      setShareCount(shareCount + 1);
      const token = await getToken();
      if (type === "post") {
        await axios.post(
          `${import.meta.env.VITE_PROD_URL}shares`,
          {
            postId: postDetails._id,
            caption: postDetails.content,
            visibility: postDetails.visibility,
            externalPlatform: platform,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (type === "meme") {
        await axios.post(
          `${import.meta.env.VITE_PROD_URL}shares`,
          {
            memeId: postDetails._id,
            caption: postDetails.content,
            visibility: postDetails.visibility,
            externalPlatform: platform,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Failed to record share:", error);
      // Don't show error to user as this is background tracking
    }
  };

  const handleShare = (platform: string, shareUrl: string) => {
    // Track the share attempt
    trackShare(platform);

    // Open the share URL in a new window
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

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

      <span className="text-[#605F5F]  figtree text-sm">{shareCount}</span>

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
          <button
            onClick={() =>
              handleShare(
                "whatsapp",
                `https://api.whatsapp.com/send?text=${encodeURIComponent(
                  shareText + " " + baseUrl + postDetails._id
                )}`
              )
            }
            className="flex items-center justify-center p-2 text-green-600"
          >
            <FaWhatsapp className="w-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() =>
              handleShare(
                "twitter",
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  baseUrl + postDetails._id
                )}&text=${encodeURIComponent(shareText)}`
              )
            }
            className="flex items-center justify-center p-2 text-blue-500"
          >
            <FaTwitter className="w-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() =>
              handleShare(
                "linkedin",
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  baseUrl + postDetails._id
                )}`
              )
            }
            className="flex items-center justify-center p-2 text-blue-700"
          >
            <FaLinkedin className="w-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() =>
              handleShare(
                "facebook",
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  baseUrl + postDetails._id
                )}`
              )
            }
            className="flex items-center justify-center p-2 text-blue-600"
          >
            <FaFacebook className="w-4 sm:w-5 sm:h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Share;
