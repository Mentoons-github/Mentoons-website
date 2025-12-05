// InstrumentsFinished.tsx
import { InstrumentTypes } from "@/constant/games/instrumentQuestions";
import { motion } from "framer-motion";

type InstrumentsFinishedProps = {
  score: number;
  questions: InstrumentTypes[];
  resetGame: () => void;
};

const InstrumentsFinished = ({
  score,
  questions,
  resetGame,
}: InstrumentsFinishedProps) => {
  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  const getPerformanceData = () => {
    if (percentage === 100) {
      return {
        title: "Perfect Score! 🏆",
        message: "Outstanding! You're a musical genius!",
        emoji: "🎉",
        color: "from-yellow-400 to-orange-500",
        bgGradient: "from-yellow-50 to-orange-50",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-400",
      };
    } else if (percentage >= 80) {
      return {
        title: "Excellent Work! ⭐",
        message: "Amazing job! You really know your instruments!",
        emoji: "🎵",
        color: "from-green-400 to-teal-500",
        bgGradient: "from-green-50 to-teal-50",
        textColor: "text-green-700",
        borderColor: "border-green-400",
      };
    } else if (percentage >= 60) {
      return {
        title: "Good Job! 👍",
        message: "Well done! Keep practicing to improve!",
        emoji: "🎼",
        color: "from-blue-400 to-cyan-500",
        bgGradient: "from-blue-50 to-cyan-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-400",
      };
    } else if (percentage >= 40) {
      return {
        title: "Nice Try! 💪",
        message: "You're getting there! Practice makes perfect!",
        emoji: "🎹",
        color: "from-purple-400 to-pink-500",
        bgGradient: "from-purple-50 to-pink-50",
        textColor: "text-purple-700",
        borderColor: "border-purple-400",
      };
    } else {
      return {
        title: "Keep Learning! 📚",
        message: "Don't give up! Every expert was once a beginner!",
        emoji: "🎸",
        color: "from-red-400 to-pink-500",
        bgGradient: "from-red-50 to-pink-50",
        textColor: "text-red-700",
        borderColor: "border-red-400",
      };
    }
  };

  const performance = getPerformanceData();

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
      className="bg-white/95 backdrop-blur-xl p-4 md:p-8 rounded-3xl shadow-2xl text-center max-w-2xl w-full border-4 border-white"
    >
      {/* Confetti Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-5xl md:text-6xl mb-4"
      >
        {performance.emoji}
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`text-2xl md:text-5xl font-black mb-5 bg-gradient-to-r ${performance.color} bg-clip-text text-transparent`}
      >
        {performance.title}
      </motion.h2>

      {/* Score Display */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className={`bg-gradient-to-br ${performance.bgGradient} border-4 ${performance.borderColor} rounded-2xl p-5 mb-5 shadow-lg`}
      >
        <div className="flex items-center justify-center gap-4 mb-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <p className="text-sm text-gray-600 font-semibold mb-1">
              Your Score
            </p>
            <div className="flex items-baseline gap-2 justify-center">
              <span className={`text-6xl font-black ${performance.textColor}`}>
                {score}
              </span>
              <span className="text-3xl text-gray-500 font-bold">
                / {totalQuestions}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Percentage */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="relative"
        >
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 1, duration: 1, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${performance.color} rounded-full`}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className={`text-2xl font-black mt-2 ${performance.textColor}`}
          >
            {percentage}%
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4">
          <p className="text-green-700 font-bold text-sm mb-1">✓ Correct</p>
          <p className="text-3xl font-black text-green-600">{score}</p>
        </div>
        <div className="bg-red-100 border-2 border-red-300 rounded-xl p-4">
          <p className="text-red-700 font-bold text-sm mb-1">✗ Wrong</p>
          <p className="text-3xl font-black text-red-600">
            {totalQuestions - score}
          </p>
        </div>
      </motion.div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className={`bg-gradient-to-r ${performance.color} text-white px-8 py-4 rounded-full font-black text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2`}
        >
          <span className="text-xl">🔄</span>
          <span>Play Again</span>
        </motion.button>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="mt-8 text-sm text-gray-500 italic"
      >
        "Music is the universal language of mankind" 🎵
      </motion.p>
    </motion.div>
  );
};

export default InstrumentsFinished;
