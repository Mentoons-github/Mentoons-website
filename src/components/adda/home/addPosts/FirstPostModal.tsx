import React, { useState, useEffect } from "react";
import {
  X,
  Trophy,
  Sparkles,
  Camera,
  Video,
  FileText,
  Calendar,
} from "lucide-react";

interface FirstPostModalProps {
  onClose: () => void;
  postType?: "text" | "photo" | "video" | "article" | "event" | null;
  onCreateNewPost?: () => void;
}

const FirstPostModal: React.FC<FirstPostModalProps> = ({
  onClose,
  postType,
  onCreateNewPost,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleCreateNewPost = () => {
    setIsExiting(true);
    setTimeout(() => {
      onCreateNewPost?.() || onClose();
    }, 300);
  };

  const getPostTypeData = () => {
    switch (postType) {
      case "text":
        return {
          message:
            "Your thoughts are valuable! Keep sharing your insights with the community.",
          icon: <FileText className="w-4 h-4 text-orange-500" />,
          color: "text-blue-600",
        };
      case "photo":
        return {
          message:
            "Pictures speak a thousand words! Your visual content enriches our community.",
          icon: <Camera className="w-4 h-4 text-orange-500" />,
          color: "text-pink-600",
        };
      case "video":
        return {
          message:
            "Great video content! Visual stories have a powerful impact on our community.",
          icon: <Video className="w-4 h-4 text-orange-500" />,
          color: "text-purple-600",
        };
      case "article":
        return {
          message:
            "Your article is live! Detailed content like yours helps educate our community.",
          icon: <FileText className="w-4 h-4 text-orange-500" />,
          color: "text-green-600",
        };
      case "event":
        return {
          message:
            "Event shared successfully! Bringing people together creates stronger bonds.",
          icon: <Calendar className="w-4 h-4 text-orange-500" />,
          color: "text-indigo-600",
        };
      default:
        return {
          message: "Keep sharing your wonderful ideas with us!",
          icon: <Sparkles className="w-4 h-4 text-orange-500" />,
          color: "text-orange-600",
        };
    }
  };

  const postTypeData = getPostTypeData();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isVisible && !isExiting
          ? "bg-black bg-opacity-50"
          : "bg-black bg-opacity-0"
      }`}
      style={{
        backdropFilter: isVisible && !isExiting ? "blur(4px)" : "blur(0px)",
      }}
    >
      <div
        className={`relative flex flex-col items-center w-full max-w-[90vw] sm:max-w-md mx-2 bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-500 ease-out ${
          isVisible && !isExiting
            ? "translate-y-0 scale-100 opacity-100"
            : isExiting
            ? "translate-y-8 scale-95 opacity-0"
            : "-translate-y-8 scale-95 opacity-0"
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
          <div className="absolute top-4 -left-4 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse delay-300"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center w-full p-4 pt-10">
          {/* Trophy icon with animation */}
          <div
            className={`flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg mb-3 transform transition-all duration-700 delay-200 ${
              isVisible ? "translate-y-0 rotate-0" : "translate-y-4 rotate-12"
            }`}
          >
            <Trophy className="w-7 h-7 text-orange-500 animate-bounce" />
          </div>

          {/* Title and content */}
          <div
            className={`w-full mb-4 transform transition-all duration-500 delay-300 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <h2 className="mb-1 text-lg sm:text-xl font-bold text-center text-gray-800">
              Congratulations On Your First Post!
            </h2>

            {/* Animated underline */}
            <div
              className={`h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto mb-2 transition-all duration-700 delay-500 ${
                isVisible ? "w-10" : "w-0"
              }`}
            ></div>

            {/* Congratulation image */}
            <img
              src="/assets/first_post_modal.png"
              alt="Congratulations on your first post"
              className="w-full max-h-24 sm:max-h-32 object-contain rounded-lg mb-3"
            />

            {/* Points notification */}
            <div className="flex items-center justify-center gap-1.5 mb-2 p-1.5 bg-orange-50 rounded-lg border border-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <p className="text-xs sm:text-sm font-semibold text-orange-700">
                +8 Points Earned!
              </p>
              <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse delay-150" />
            </div>

            {/* Post type specific message */}
            <div className="flex items-start gap-1.5 p-2.5 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-0.5">{postTypeData.icon}</div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {postTypeData.message}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div
            className={`flex w-full gap-2 transform transition-all duration-500 delay-400 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <button
              className="flex-1 py-1.5 px-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 transform hover:scale-105"
              onClick={handleClose}
            >
              Close
            </button>
            <button
              className="flex-1 py-1.5 px-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-200 transform hover:scale-105 shadow-lg"
              onClick={handleCreateNewPost}
            >
              Create New Post
            </button>
          </div>
        </div>

        {/* Floating particles animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1.5 h-1.5 bg-orange-300 rounded-full opacity-60 animate-ping`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FirstPostModal;
