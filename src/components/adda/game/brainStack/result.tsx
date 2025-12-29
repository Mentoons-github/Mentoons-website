import React from "react";
import {
  Trophy,
  Star,
  RotateCcw,
  Award,
  Users,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type ResultScreenProps = {
  score: number;
  difficulty: string;
  totalRounds?: number;
  onPlayAgain: () => void;
  goToLobby: () => void;
  gameType?: "flipAndMatch" | "default" | "colorclash";
  resultMessage?: string;
};

const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  difficulty,
  totalRounds,
  onPlayAgain,
  goToLobby,
  resultMessage,
  gameType = "default",
}) => {
  const navigate = useNavigate();
  const isFailure = score === 0 && !!resultMessage;
  const baseColor = isFailure ? "red" : "green";
  const highlightColor = isFailure ? "pink" : "yellow";

  const getScoreData = () => {
    let maxScore: number;
    if (gameType === "flipAndMatch") {
      const pairs =
        difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 10;
      maxScore = pairs * 10;
    } else if (gameType === "colorclash") {
      maxScore =
        difficulty === "easy" ? 100 : difficulty === "medium" ? 150 : 200;
    } else {
      const rounds = totalRounds ?? 10;
      maxScore = rounds * 10;
    }
    const clampedScore = Math.min(score, maxScore);
    const percentage =
      maxScore > 0 ? Math.round((clampedScore / maxScore) * 100) : 0;
    return { displayScore: clampedScore, maxScore, percentage };
  };

  const { displayScore, maxScore, percentage } = getScoreData();
  const stars = Math.min(Math.max(Math.ceil(percentage / 20), 0), 5);

  const getPerformanceRating = (pct: number) => {
    if (pct >= 95) return { text: "Perfect!", emoji: "Crown" };
    if (pct >= 90) return { text: "Outstanding!", emoji: "Sparkles" };
    if (pct >= 80) return { text: "Excellent!", emoji: "Sparkles" };
    if (pct >= 70) return { text: "Great Job!", emoji: "Flexed Biceps" };
    if (pct >= 60) return { text: "Good Work!", emoji: "Thumbs Up" };
    if (pct > 0) return { text: "Keep Practicing!", emoji: "Seedling" };
    return { text: "Better luck next time!", emoji: "Pensive Face" };
  };

  const performance = getPerformanceRating(percentage);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[url('/assets/games/mindStack/bg.jpg')] bg-cover bg-center p-2 sm:p-4 md:p-6 lg:p-8 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className={`absolute top-0 left-0 w-32 h-32 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-${highlightColor}-400 rounded-full blur-3xl`}
        />
        <div
          className={`absolute bottom-0 right-0 w-32 h-32 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-${highlightColor}-400 rounded-full blur-3xl`}
        />
      </div>
      <div className="relative z-10 w-full h-full flex items-center justify-center px-3 py-4 sm:p-0">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-6 md:p-8 lg:p-10 max-h-full overflow-y-auto">
            <div className="flex flex-col items-center mb-2 sm:mb-5 md:mb-6">
              <div className="relative mb-1 sm:mb-3 md:mb-4">
                <div
                  className={`absolute inset-0 bg-${baseColor}-400 rounded-full blur-xl opacity-60 animate-pulse`}
                />
                {isFailure ? (
                  <AlertCircle
                    className={`w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 text-${baseColor}-600 relative`}
                  />
                ) : (
                  <Trophy
                    className={`w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 text-${baseColor}-600 relative`}
                  />
                )}
              </div>
              <h1
                className={`text-lg sm:text-3xl md:text-4xl lg:text-5xl font-bold text-${baseColor}-700 text-center`}
              >
                {isFailure ? "Game Over" : "Mission Complete!"}
              </h1>
              {resultMessage && (
                <p
                  className={`text-sm sm:text-xl md:text-2xl font-semibold text-${baseColor}-600 mt-1 sm:mt-2 text-center`}
                >
                  {resultMessage}
                </p>
              )}
              {!isFailure && (
                <p
                  className={`text-sm sm:text-xl md:text-2xl font-semibold text-${baseColor}-600 mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2`}
                >
                  {performance.text}
                  <span className="text-lg sm:text-2xl">
                    {performance.emoji}
                  </span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-6">
              <div
                className={`bg-gradient-to-br from-${baseColor}-50 to-${baseColor}-100 rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center border-2 border-${baseColor}-200`}
              >
                <Award
                  className={`w-5 h-5 sm:w-8 sm:h-8 text-${baseColor}-600 mx-auto mb-1 sm:mb-2`}
                />
                <p className="text-[10px] sm:text-sm text-gray-600 mb-0.5 sm:mb-1">
                  Score
                </p>
                <p
                  className={`text-lg sm:text-4xl font-bold text-${baseColor}-700`}
                >
                  {displayScore}
                  {gameType === "colorclash" ? "" : `/${maxScore}`}
                </p>
              </div>

              <div
                className={`bg-gradient-to-br from-${baseColor}-50 to-${baseColor}-100 rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center border-2 border-${baseColor}-200`}
              >
                <div className="flex justify-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 sm:w-5 sm:h-5 ${
                        i <= stars
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] sm:text-sm text-gray-600 mb-0.5 sm:mb-1">
                  Rating
                </p>
                <p
                  className={`text-xs sm:text-lg font-bold text-${baseColor}-700`}
                >
                  {stars}/5 Stars
                </p>
              </div>

              <div
                className={`bg-gradient-to-br from-${baseColor}-50 to-${baseColor}-100 rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center border-2 border-${baseColor}-200`}
              >
                <div className="flex justify-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                  {["easy", "medium", "hard"].map((level, idx) => (
                    <div
                      key={level}
                      className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full ${
                        difficulty === level
                          ? `bg-${baseColor}-600`
                          : idx < ["easy", "medium", "hard"].indexOf(difficulty)
                          ? `bg-${baseColor}-400`
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] sm:text-sm text-gray-600 mb-0.5 sm:mb-1">
                  Difficulty
                </p>
                <p
                  className={`text-xs sm:text-lg font-bold text-${baseColor}-700 capitalize`}
                >
                  {difficulty}
                </p>
              </div>
            </div>

            <div className="mb-3 sm:mb-6">
              <div
                className={`bg-${baseColor}-50 rounded-full h-4 sm:h-6 overflow-hidden border-2 border-${baseColor}-200`}
              >
                <div
                  className={`bg-gradient-to-r from-${baseColor}-500 to-${baseColor}-600 h-full flex items-center justify-end pr-2 sm:pr-3 transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                >
                  <span className="text-white text-[10px] sm:text-xs font-bold">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4">
              <button
                onClick={onPlayAgain}
                className={`group relative px-3 py-2.5 sm:px-6 sm:py-4 bg-gradient-to-r from-${baseColor}-500 to-${baseColor}-600 text-white text-xs sm:text-lg font-bold rounded-xl sm:rounded-2xl hover:from-${baseColor}-600 hover:to-${baseColor}-700 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center justify-center gap-1 sm:gap-2">
                  <RotateCcw className="w-3 h-3 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
                  Play Again
                </span>
              </button>

              <button
                onClick={goToLobby}
                className={`group relative px-3 py-2.5 sm:px-6 sm:py-4 bg-white text-${baseColor}-600 text-xs sm:text-lg font-bold rounded-xl sm:rounded-2xl border-2 border-${baseColor}-500 hover:bg-${baseColor}-50 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg`}
              >
                <span className="relative flex items-center justify-center gap-1 sm:gap-2">
                  <svg
                    className="w-3 h-3 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Go to Lobby
                </span>
              </button>
            </div>

            <button
              onClick={() => navigate("/adda/leaderboard")}
              className="group relative w-full px-3 py-2.5 sm:px-6 sm:py-4 bg-black text-white text-xs sm:text-lg font-bold rounded-xl sm:rounded-2xl hover:bg-purple-900 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-1 sm:gap-2">
                <Users className="w-3 h-3 sm:w-5 sm:h-5" />
                View Leaderboard
              </span>
            </button>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.9; }
          }
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ResultScreen;
