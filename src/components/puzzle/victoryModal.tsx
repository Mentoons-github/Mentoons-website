import { motion } from "framer-motion";

interface VictoryModalProps {
  selectedDifficulty: string;
  setFoundWords: (words: Set<string>) => void;
  createGrid: () => void;
  puzzleType: "socialMedia" | "career" | "icons" | null;
}

const VictoryModal = ({
  setFoundWords,
  createGrid,
  selectedDifficulty,
  puzzleType,
}: VictoryModalProps) => {
  const difficulties = ["easy", "medium", "hard"];
  const availableDifficulties = difficulties.filter(
    (difficulty) => difficulty !== selectedDifficulty.toLowerCase()
  );

  const handleDifficultyChange = (difficulty: string) => {
    const capitalizedDifficulty =
      difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
    window.location.href = `/puzzle/play?difficulty=${capitalizedDifficulty}&puzzleType=${puzzleType}`;
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <motion.div
        className="bg-gradient-to-br from-yellow-200 via-orange-200 to-green-200 p-10 rounded-3xl border-6 border-white shadow-2xl text-center max-w-lg mx-4"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <motion.div
          className="text-8xl mb-6"
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🎉
        </motion.div>
        <h2
          id="modal-title"
          className="text-4xl font-bold text-orange-800 mb-4"
        >
          🌟 INCREDIBLE! 🌟
        </h2>
        <p id="modal-description" className="text-orange-700 text-xl mb-6">
          You're a word-finding superstar!
          <br />
          All words discovered! 🏆
        </p>
        <div className="flex gap-4 justify-center flex-wrap mb-6">
          {availableDifficulties.map((difficulty) => (
            <motion.button
              key={difficulty}
              onClick={() => handleDifficultyChange(difficulty)}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold text-lg shadow-xl border-3 border-white"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Play ${difficulty} difficulty`}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Puzzle
            </motion.button>
          ))}
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <motion.button
            onClick={() => {
              setFoundWords(new Set());
              createGrid();
            }}
            className="px-10 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full font-bold text-xl shadow-xl border-3 border-white"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Start a new game"
          >
            🚀 Another Quest!
          </motion.button>
          <motion.button
            onClick={() => setFoundWords(new Set())}
            className="px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold text-xl shadow-xl border-3 border-white"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Close modal"
          >
            🎊 Awesome!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VictoryModal;
