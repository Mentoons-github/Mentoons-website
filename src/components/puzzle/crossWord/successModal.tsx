const SuccessModal = ({
  puzzleType,
  isOpen,
  onClose,
  currentDifficulty,
  onReset,
  navigate,
}: {
  puzzleType: string;
  isOpen: boolean;
  onClose: () => void;
  currentDifficulty: "easy" | "medium" | "hard";
  onReset: () => void;
  navigate: (path: string) => void;
}) => {
  if (!isOpen) return null;

  const getDifficultyButtons = () => {
    const difficulties = ["easy", "medium", "hard"] as const;
    const currentIndex = difficulties.indexOf(currentDifficulty);

    return difficulties
      .filter((_, index) => index > currentIndex)
      .map((difficulty) => ({
        difficulty,
        label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        emoji: difficulty === "medium" ? "⚡" : "🔥",
        gradient:
          difficulty === "medium"
            ? "from-orange-500 via-red-500 to-pink-500"
            : "from-purple-500 via-red-500 to-pink-600",
      }));
  };

  const nextDifficulties = getDifficultyButtons();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 text-white border-4 border-emerald-300 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-sm max-w-2xl w-full mx-4 animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-bold z-10 hover:scale-110 transition-transform"
        >
          ×
        </button>

        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10"></div>
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="relative z-10 text-center">
          <div className="text-6xl md:text-8xl mb-6 animate-bounce filter drop-shadow-lg">
            🎊👑🎉
          </div>
          <div className="text-3xl md:text-5xl font-black mb-4 drop-shadow-lg">
            WORD WIZARD CHAMPION!
          </div>
          <div className="text-lg md:text-2xl opacity-90 font-semibold mb-8">
            You've mastered the {currentDifficulty} level! Absolutely brilliant!
            🌟
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Play Again Button */}
            <button
              onClick={() => {
                onReset();
                onClose();
              }}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white text-lg font-black rounded-full hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 transform hover:scale-110 transition-all duration-300 shadow-xl border-2 border-white overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span className="text-2xl">🔄</span>
                <span>Play Again</span>
              </span>
            </button>

            {/* Next Difficulty Buttons */}
            {nextDifficulties.map(({ difficulty, label, emoji, gradient }) => (
              <button
                key={difficulty}
                onClick={() => {
                  navigate(
                    `/wordCross/${
                      difficulty.charAt(0).toUpperCase() +
                      difficulty.slice(1).toLowerCase()
                    }/${puzzleType}`
                  );
                  onClose();
                }}
                className={`group relative px-8 py-4 bg-gradient-to-r ${gradient} text-white text-lg font-black rounded-full hover:scale-110 transition-all duration-300 shadow-xl border-2 border-white overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span className="text-2xl">{emoji}</span>
                  <span>Try {label}</span>
                </span>
              </button>
            ))}

            {/* If it's the hardest difficulty, show a special message */}
            {currentDifficulty === "hard" && (
              <div className="text-center mt-4">
                <div className="text-2xl mb-2">🏆 ULTIMATE CHAMPION! 🏆</div>
                <div className="text-lg opacity-90">
                  You've conquered all difficulties!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-6 -right-6 w-16 h-16 md:w-20 md:h-20 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default SuccessModal;
