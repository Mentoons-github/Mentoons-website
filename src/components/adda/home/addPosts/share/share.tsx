import { RewardEventType } from "@/types/rewards";
import { triggerReward } from "@/utils/rewardMiddleware";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BiShare } from "react-icons/bi";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";

interface BasePostDetails {
  _id: string;
  title?: string;
  visibility: string;
  shares: string[];
  user: {
    _id: string;
    name: string;
    email: string;
    picture: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface ShareProps {
  postDetails: BasePostDetails;
  type: "post" | "meme";
}

const platforms = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />,
    getUrl: (text: string, url: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        text + " " + url,
      )}`,
  },
  {
    key: "twitter",
    label: "Twitter",
    icon: <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />,
    getUrl: (text: string, url: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url,
      )}&text=${encodeURIComponent(text)}`,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />,
    getUrl: (_text: string, url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url,
      )}`,
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
    getUrl: (_text: string, url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
];

const Share = ({ postDetails, type }: ShareProps) => {
  const [showShareOptions, setShareOptions] = useState(false);
  const [shareCount, setShareCount] = useState(postDetails.shares.length);
  const containerRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();

  const shareText = `${postDetails?.title || ""} - ${
    type === "post" ? postDetails.content || "" : postDetails.description || ""
  }`;

  const baseUrl =
    type === "post"
      ? window.location.origin + "/adda/post/"
      : type === "meme"
        ? window.location.origin + "/adda/meme/"
        : "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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
          `${import.meta.env.VITE_PROD_URL}/shares`,
          {
            postId: postDetails._id,
            caption: postDetails.content || "",
            visibility: postDetails.visibility,
            externalPlatform: platform,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        triggerReward(RewardEventType.SHARE_POST, postDetails._id);
      } else if (type === "meme") {
        await axios.post(
          `${import.meta.env.VITE_PROD_URL}/shares`,
          {
            memeId: postDetails._id,
            caption: postDetails.description || "",
            visibility: postDetails.visibility,
            externalPlatform: platform,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        triggerReward(RewardEventType.SHARE_POST, postDetails._id);
      }
    } catch (error) {
      console.error("Failed to record share:", error);
    }
  };

  const handleShare = (platform: string, shareUrl: string) => {
    trackShare(platform);
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center gap-3 share-container"
    >
      <style>{`
        @keyframes sh-pop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          70%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .sh-pop { animation: sh-pop 0.4s cubic-bezier(.2,.9,.3,1.4) both; }

        .sh-chip-font {
          font-family: var(--font-comic-chip, var(--font-comic)) !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }

        .sh-main {
          background: #fff;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 999px;
          transition: transform 0.15s cubic-bezier(.34,1.56,.64,1), box-shadow 0.1s ease, background 0.1s ease;
        }
        .sh-main:hover { background: #fef9c3; transform: translate(-2px, -2px) rotate(-2deg); box-shadow: 5px 5px 0 #000; }
        .sh-main:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }
        .sh-main-on { background: #fde047; }
        .sh-main-on:hover { background: #facc15; }

        .sh-count {
          background: #fde047;
          color: #000;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 6px;
          min-width: 26px;
          padding: 0 6px;
          text-align: center;
          transform: rotate(-2deg) skewX(-6deg);
          display: inline-block;
        }

        .sh-selector {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 5px 5px 0 #000;
          border-radius: 999px;
        }
        .sh-option {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
          transition: transform 0.15s cubic-bezier(.34,1.56,.64,1), background 0.1s ease;
        }
        .sh-option:hover { background: #fde047; transform: translateY(-4px) rotate(-6deg) scale(1.12); }
        .sh-option:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }
        .sh-label {
          background: #fde047;
          color: #000;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 6px;
          padding: 0 6px;
          white-space: nowrap;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .sh-pop { animation: none; }
        }
      `}</style>

      <motion.button
        aria-label="Share"
        className={`sh-main flex items-center justify-center gap-2 px-4 py-2 cursor-pointer ${
          showShareOptions ? "sh-main-on" : ""
        }`}
        onClick={() => setShareOptions(!showShareOptions)}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <BiShare className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 transform scale-x-[-1]" />
      </motion.button>

      <div className="flex items-center gap-1">
        <span className="sh-count sh-chip-font text-sm">{shareCount}</span>
      </div>

      <AnimatePresence>
        {showShareOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="sh-selector absolute left-0 z-50 flex items-center gap-2 px-3 py-2 mb-3 bottom-full"
          >
            {platforms.map((platform, i) => (
              <motion.div
                key={platform.key}
                className="relative group"
                whileTap={{ scale: 0.92 }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={platform.label}
                  onClick={() =>
                    handleShare(
                      platform.key,
                      platform.getUrl(shareText, baseUrl + postDetails._id),
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleShare(
                        platform.key,
                        platform.getUrl(shareText, baseUrl + postDetails._id),
                      );
                    }
                  }}
                  className="sh-option sh-pop flex items-center justify-center w-10 h-10 cursor-pointer"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {platform.icon}
                </div>
                <div className="sh-label sh-chip-font absolute text-xs transition-opacity transform -translate-x-1/2 opacity-0 -bottom-8 left-1/2 group-hover:opacity-100 z-10">
                  {platform.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Share;
