// InstrumentQuestions.tsx
import { InstrumentTypes } from "@/constant/games/instrumentQuestions";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

type InstrumentQuestionsProps = {
  currentIndex: number;
  questions: InstrumentTypes[];
  score: number;
  current: InstrumentTypes;
  selected: string | null;
  submitted: boolean;
  isPlaying: boolean;
  audioLoaded: boolean;
  toggleAudio: () => void;
  handleSelect: (option: string) => void;
  handleSubmit: () => void;
  resetGame: () => void;
};

const InstrumentQuestions = ({
  currentIndex,
  questions,
  score,
  current,
  selected,
  submitted,
  isPlaying,
  audioLoaded,
  toggleAudio,
  handleSelect,
  handleSubmit,
  resetGame,
}: InstrumentQuestionsProps) => {
  return (
    <motion.div
      key={currentIndex}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white/95 backdrop-blur-xl p-4 md:p-8 rounded-3xl shadow-2xl max-w-2xl w-full text-center border-4 border-purple-300"
    >
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-sm font-bold text-purple-700 bg-purple-100 px-4 py-2 rounded-full shadow-sm"
        >
          🎯 Question {currentIndex + 1}/{questions.length}
        </motion.div>
        <div className="flex items-center gap-3">
          <motion.div
            key={`score-${score}`}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="text-sm font-bold text-green-700 bg-green-100 px-4 py-2 rounded-full shadow-sm"
          >
            ⭐ Score: {score}
          </motion.div>
          <motion.button
            onClick={resetGame}
            whileHover={{ scale: 1.05, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
            className="
        relative group
        p-2 md:p-3 rounded-full 
        bg-gradient-to-br from-red-500 to-pink-500
        shadow-lg hover:shadow-red-500/50
        transition-all
      "
            aria-label="Reset game"
          >
            <RotateCcw className="text-white" size={22} />

          </motion.button>
        </div>
      </div>

      {/* TITLE */}
      <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
        🎧 Identify the Instrument
      </h2>

      {/* AUDIO PLAYER */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-purple-100 via-pink-100 to-purple-100 rounded-3xl p-6 mb-6 shadow-lg border-2 border-purple-200"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          {/* Waveform Animation Left */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isPlaying ? [8, 24, 12, 20, 8] : 8,
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
                className="w-1.5 bg-purple-500 rounded-full"
                style={{ height: 8 }}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: audioLoaded ? 1.05 : 1 }}
            whileTap={{ scale: audioLoaded ? 0.95 : 1 }}
            onClick={toggleAudio}
            disabled={!audioLoaded}
            className={`${
              !audioLoaded
                ? "bg-gray-400 cursor-not-allowed"
                : isPlaying
                ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            } text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 flex items-center gap-2 min-w-[180px] justify-center`}
          >
            {!audioLoaded ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⏳
                </motion.span>
                <span>Loading...</span>
              </>
            ) : isPlaying ? (
              <>
                <span className="text-xl">⏸</span>
                <span>Pause</span>
              </>
            ) : (
              <>
                <span className="text-xl">▶</span>
                <span>Play</span>
              </>
            )}
          </motion.button>

          {/* Waveform Animation Right */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isPlaying ? [8, 20, 12, 24, 8] : 8,
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
                className="w-1.5 bg-purple-500 rounded-full"
                style={{ height: 8 }}
              />
            ))}
          </div>
        </div>

        <motion.p
          key={isPlaying ? "playing" : "paused"}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm font-semibold mt-2 ${
            isPlaying ? "text-purple-700" : "text-gray-500"
          }`}
        >
          {!audioLoaded
            ? "⏳ Loading audio..."
            : isPlaying
            ? "🎵 Now Playing..."
            : "🎵 Ready to play"}
        </motion.p>
      </motion.div>

      {/* OPTIONS */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-3 md:gap-4 mb-6 "
      >
        {current?.options?.map((option, i) => {
          const isCorrect = option === current.answer;
          const isSelected = option === selected;

          let btnStyle =
            "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white";

          if (submitted && isSelected && isCorrect)
            btnStyle =
              "bg-gradient-to-r from-green-500 to-green-600 text-white ring-4 ring-green-300";
          if (submitted && isSelected && !isCorrect)
            btnStyle =
              "bg-gradient-to-r from-red-500 to-red-600 text-white ring-4 ring-red-300";
          if (submitted && isCorrect && !isSelected)
            btnStyle =
              "bg-gradient-to-r from-green-500 to-green-600 text-white ring-4 ring-green-300 animate-pulse";

          return (
            <motion.button
              key={i}
              initial={{ scale: 0.6, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{
                delay: i * 0.08,
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
              whileHover={{ scale: submitted ? 1 : 1.08 }}
              whileTap={{ scale: submitted ? 1 : 0.92 }}
              onClick={() => handleSelect(option)}
              disabled={submitted}
              className={`py-4 px-6 rounded-2xl font-extrabold text-base md:text-lg shadow-lg transition-all duration-300 ${btnStyle} ${
                isSelected && !submitted
                  ? "ring-4 ring-yellow-400 scale-105 "
                  : ""
              }`}
            >
              {submitted && isCorrect && "✓ "}
              {submitted && isSelected && !isCorrect && "✗ "}
              {option}
            </motion.button>
          );
        })}
      </motion.div>

      {/* SUBMIT BUTTON */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: !selected || submitted ? 1 : 1.02 }}
        whileTap={{ scale: !selected || submitted ? 1 : 0.98 }}
        onClick={handleSubmit}
        disabled={!selected || submitted}
        className={`w-full py-4 rounded-2xl text-lg md:text-xl font-black shadow-xl transition-all duration-300 ${
          !selected || submitted
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-purple-900"
        }`}
      >
        {submitted ? "⏳ Next Question..." : "✅ Submit Answer"}
      </motion.button>

      {/* Feedback message */}
      {submitted && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className={`mt-4 p-4 rounded-xl font-bold text-base md:text-lg ${
            selected === current.answer
              ? "bg-green-100 text-green-700 border-2 border-green-300"
              : "bg-red-100 text-red-700 border-2 border-red-300"
          }`}
        >
          {selected === current.answer
            ? "🎉 Correct! Well done!"
            : `❌ Wrong! The correct answer is: ${current.answer}`}
        </motion.div>
      )}
    </motion.div>
  );
};

export default InstrumentQuestions;
