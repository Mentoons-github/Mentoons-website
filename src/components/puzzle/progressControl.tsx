import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa6";

interface ProgressControlProps {
  foundWords: Set<string>;
  puzzleWords: string[];
  setFoundWords: (words: Set<string>) => void;
  createGrid: () => void;
}

const ProgressControl = ({
  foundWords,
  puzzleWords,
  setFoundWords,
  createGrid,
}: ProgressControlProps) => {
  return (
    <motion.div
      className="lg:w-1/4 flex flex-col items-center gap-6"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-gradient-to-br from-white/80 to-green-100/80 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border-4 border-green-400 text-center">
        <div className="text-3xl mb-4">🏆</div>
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{
                scale: index < foundWords.size ? 1.3 : 0.8,
                rotate: index < foundWords.size ? 360 : 0,
              }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
              }}
            >
              <FaStar
                className={`text-4xl transition-all duration-300 ${
                  index < foundWords.size
                    ? "text-yellow-400 drop-shadow-xl filter brightness-110"
                    : "text-gray-300"
                }`}
              />
            </motion.div>
          ))}
        </div>

        <div className="text-3xl font-bold text-green-800 mb-2">
          {foundWords.size} / {puzzleWords.length}
        </div>
        <div className="text-green-700 text-lg font-semibold">Words Found!</div>
      </div>

      <motion.button
        onClick={() => {
          setFoundWords(new Set());
          createGrid();
        }}
        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full font-bold shadow-xl text-xl border-3 border-white"
        whileHover={{
          scale: 1.1,
          boxShadow: "0 15px 40px rgba(245, 158, 11, 0.5)",
          y: -3,
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        🎲 New Adventure!
      </motion.button>
    </motion.div>
  );
};

export default ProgressControl;
