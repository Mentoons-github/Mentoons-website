import { motion, Variants } from "framer-motion";
import { getItemEmoji } from "@/services/emojiFinder";
import { FaLock } from "react-icons/fa6";

interface SideTabProps {
  puzzleWords: string[];
  foundWords: Set<string>;
}

const lockVariants: Variants = {
  locked: { opacity: 1, scale: 1 },
  unlocked: {
    opacity: 0,
    scale: [1, 1.2, 0.8, 0],
    transition: { duration: 0.5, times: [0, 0.3, 0.6, 1] },
  },
};

const contentVariants: Variants = {
  locked: { filter: "blur(4px)", opacity: 0.5 },
  unlocked: { filter: "blur(0px)", opacity: 1, transition: { duration: 0.5 } },
};

const checkmarkVariants: Variants = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: { type: "spring", stiffness: 200, delay: 0.1 },
  },
};

const SideTab = ({ puzzleWords, foundWords }: SideTabProps) => {
  return (
    <div className="bg-gradient-to-br from-white/80 to-yellow-100/80 backdrop-blur-lg rounded-2xl p-4 shadow-xl border-2 border-orange-300 w-full max-w-md lg:max-w-none">
      <h3 className="text-xl font-bold text-orange-800 mb-4 text-center">
        🎯 Find These Words!
      </h3>
      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
        {puzzleWords.map((word, index) => (
          <motion.div
            key={word}
            className={`relative px-4 py-2 rounded-xl text-center font-bold border-2 transition-all duration-200 min-w-0 break-words flex flex-col items-center justify-center ${
              foundWords.has(word)
                ? "bg-gradient-to-r from-green-400 to-green-600 border-green-700 text-white shadow-lg transform scale-105"
                : "bg-gradient-to-r from-yellow-100 to-orange-100 border-orange-400 text-orange-800 shadow-md"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -1 }}
          >
            {/* Content with blur effect when locked */}
            <motion.div
              className="flex flex-col items-center justify-center w-full"
              variants={contentVariants}
              initial="locked"
              animate={foundWords.has(word) ? "unlocked" : "locked"}
            >
              <div className="inline-flex items-center justify-center w-8 h-8 mb-1 text-2xl">
                {getItemEmoji(word)}
              </div>
              <div
                className={`text-sm ${
                  foundWords.has(word) ? "line-through" : ""
                } break-words w-full`}
              >
                {word}
              </div>
              {foundWords.has(word) && (
                <motion.div
                  className="text-xl mt-1"
                  variants={checkmarkVariants}
                  initial="initial"
                  animate="animate"
                >
                  ✅
                </motion.div>
              )}
            </motion.div>
            {/* Lock icon overlay when not found */}
            {!foundWords.has(word) && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                variants={lockVariants}
                initial="locked"
                animate={foundWords.has(word) ? "unlocked" : "locked"}
              >
                <FaLock />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SideTab;
