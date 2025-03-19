import { motion } from "framer-motion";
import { useState } from "react";
import { FaHeart, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";

const Likes = () => {
  const [selectedReaction, setSelectedReaction] = useState<
    "like" | "love" | null
  >(null);
  const [showOptions, setShowOptions] = useState(false);
  const [reactionCounts, setReactionCounts] = useState({ like: 0, love: 0 });

  const handleReaction = (reaction: "like" | "love") => {
    setSelectedReaction((prev) => {
      const newCounts = { ...reactionCounts };

      if (prev && prev !== reaction) {
        newCounts[prev]--;
        newCounts[reaction]++;
      } else if (prev === reaction) {
        newCounts[reaction]--;
      } else {
        newCounts[reaction]++;
      }

      setReactionCounts(newCounts);
      return prev === reaction ? null : reaction;
    });

    setShowOptions(false);
  };
  return (
    <div className="flex justify-center items-center gap-3">
      <div className="relative">
        <motion.button
          className="p-2 bg-white border border-gray-400 rounded-full flex justify-center items-center w-8 sm:w-12 sm:h-12"
          onClick={() => setShowOptions(!showOptions)}
          whileTap={{ scale: 0.9 }}
        >
          {selectedReaction === "like" ? (
            <motion.div animate={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
              <FaThumbsUp className="w-4 sm:w-6 sm:h-6 text-blue-500" />
            </motion.div>
          ) : selectedReaction === "love" ? (
            <motion.div animate={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
              <FaHeart className="w-4 sm:w-6 sm:h-6 text-red-500" />
            </motion.div>
          ) : (
            <FaRegThumbsUp className="w-4 sm:w-6 sm:h-6 text-gray-600" />
          )}
        </motion.button>

        {showOptions && (
          <motion.div
            className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 flex gap-2 bg-white p-2 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              className="p-1 hover:scale-125 transition flex justify-center items-center w-8 sm:w-10 sm:h-10"
              onClick={() => handleReaction("like")}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaThumbsUp
                className={`w-5 sm:w-6 sm:h-6 ${
                  selectedReaction === "like"
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              />
            </motion.button>
            <motion.button
              className="p-1 hover:scale-125 transition flex justify-center items-center w-8 sm:w-10 sm:h-10"
              onClick={() => handleReaction("love")}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaHeart
                className={`w-5 sm:w-6 sm:h-6 ${
                  selectedReaction === "love" ? "text-red-600" : "text-gray-500"
                }`}
              />
            </motion.button>
          </motion.div>
        )}
      </div>
      <div className="flex items-center gap-3">
        {reactionCounts.like > 0 && (
          <div className="flex items-center gap-1 text-blue-500">
            <FaThumbsUp className="w-3 sm:w-5 sm:h-5" />
            <span className="text-[#605F5F] figtree text-sm">
              {reactionCounts.like}
            </span>
          </div>
        )}
        {reactionCounts.love > 0 && (
          <div className="flex items-center gap-1 text-red-500">
            <FaHeart className="w-3 sm:w-5 sm:h-5" />
            <span className="text-[#605F5F] figtree text-sm">
              {reactionCounts.love}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Likes;
