import { useState, useEffect } from "react";
import PlayingCard from "./playingCard";
import { Difficulty } from "@/types/adda/game";
import { CardProps, Round } from "@/utils/game/mathMind";
import { CARD_VALUE } from "@/constant/adda/game/cardValue";

interface PlayerZoneMindMathProps {
  difficulty: Difficulty;
  rounds: Round[];
  onGameComplete: (score: number) => void;
}

const PlayerZoneMindMath = ({
  difficulty,
  rounds,
  onGameComplete,
}: PlayerZoneMindMathProps) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswering, setIsAnswering] = useState(false);

  const currentCards = rounds[currentRound]?.cards || [];
  const operation = rounds[currentRound]?.operation || "sum";

  useEffect(() => {
    if (timeLeft > 0 && !isAnswering) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswering) {
      handleSubmit(true);
    }
  }, [timeLeft, isAnswering]);

  useEffect(() => {
    const timeByDifficulty = {
      easy: 30,
      medium: 20,
      hard: 15,
    };
    setTimeLeft(timeByDifficulty[difficulty]);
  }, [currentRound, difficulty]);

  const calculateAnswer = (cards: CardProps[]): number => {
    const values = cards.map((card) => CARD_VALUE[card.value]);
    switch (operation) {
      case "sum":
        return values.reduce((acc, val) => acc + val, 0);
      case "difference":
        return values.reduce((acc, val, idx) => (idx === 0 ? val : acc - val));
      case "product":
        return values.reduce((acc, val) => acc * val, 1);
      default:
        return values.reduce((acc, val) => acc + val, 0);
    }
  };

  const handleSubmit = (isTimeout = false) => {
    setIsAnswering(true);
    const correctAnswer = calculateAnswer(currentCards);
    const isCorrect = !isTimeout && parseInt(userAnswer) === correctAnswer;

    setFeedback(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setScore(score + 10);
    }

    setTimeout(() => {
      if (currentRound + 1 < rounds.length) {
        setCurrentRound(currentRound + 1);
        setUserAnswer("");
        setFeedback(null);
        setIsAnswering(false);
      } else {
        onGameComplete(isCorrect ? score + 10 : score);
      }
    }, 1500);
  };

  const getOperationSymbol = () => {
    switch (operation) {
      case "sum":
        return "+";
      case "difference":
        return "-";
      case "product":
        return "×";
      default:
        return "+";
    }
  };

  const getOperationText = () => {
    switch (operation) {
      case "sum":
        return "Sum";
      case "difference":
        return "Difference";
      case "product":
        return "Product";
      default:
        return "Sum";
    }
  };

  const getTimeColor = () => {
    if (timeLeft > 15) return "text-emerald-400";
    if (timeLeft > 5) return "text-amber-400";
    return "text-rose-400 animate-pulse";
  };

  return (
    <div className="min-h-screen w-full bg-[url('/assets/games/mindMath/bg.jpg')] flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6 sm:mb-8 px-2 sm:px-4 gap-2">
          <div className="bg-black/30 backdrop-blur-md rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2 sm:py-3 border border-white/10">
            <div className="text-xs sm:text-sm text-gray-400 font-medium">
              Round
            </div>
            <div className="text-xl sm:text-3xl font-bold text-white">
              {currentRound + 1}
              <span className="text-sm sm:text-lg text-gray-400">
                /{rounds.length}
              </span>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-md rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2 sm:py-3 border border-white/10">
            <div className="text-xs sm:text-sm text-gray-400 font-medium">
              Score
            </div>
            <div className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {score}
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-md rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2 sm:py-3 border border-white/10">
            <div className="text-xs sm:text-sm text-gray-400 font-medium">
              Time
            </div>
            <div className={`text-xl sm:text-3xl font-bold ${getTimeColor()}`}>
              {timeLeft}s
            </div>
          </div>
        </div>

        {/* Card Values Legend */}
        <div className="mb-4 bg-black/40 backdrop-blur-md rounded-xl sm:rounded-2xl px-4 py-3 border border-white/10 shadow-lg">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm text-gray-300 font-medium">
              💡 Card Values:
            </span>
            <span className="text-xs sm:text-sm text-white font-semibold">
              A = 1
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-xs sm:text-sm text-white font-semibold">
              2-10 = Face Value
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-xs sm:text-sm text-white font-semibold">
              J/Q/K = 10
            </span>
          </div>
        </div>

        <div className="bg-black/75 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              Calculate the {getOperationText()}
            </h2>
            <p className="text-sm sm:text-base text-gray-400 px-2">
              {operation === "sum" && "Add the values of all cards together"}
              {operation === "difference" &&
                "Subtract the card values in order"}
              {operation === "product" && "Multiply the card values together"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-8 min-h-[200px] items-center">
            {currentCards.map((card, index) => (
              <div
                key={`card-group-${index}`}
                className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8"
              >
                <div
                  className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  style={{
                    animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <PlayingCard value={card.value} suit={card.suit} />
                </div>
                {index < currentCards.length - 1 && (
                  <div
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-white/80 flex items-center justify-center min-w-[30px] sm:min-w-[40px]"
                    style={{
                      animation: `slideIn 0.5s ease-out ${
                        index * 0.1 + 0.05
                      }s both`,
                    }}
                  >
                    {getOperationSymbol()}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="max-w-md mx-auto space-y-3 sm:space-y-4 px-2">
            <div className="relative">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && userAnswer && !isAnswering) {
                    handleSubmit();
                  }
                }}
                disabled={isAnswering}
                placeholder="Enter your answer..."
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-xl sm:text-2xl font-bold text-center rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-md border-2 transition-all duration-300 text-white placeholder-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-500/50 ${
                  feedback === "correct"
                    ? "border-green-500 bg-green-500/20"
                    : feedback === "incorrect"
                    ? "border-red-500 bg-red-500/20"
                    : "border-white/20 focus:border-purple-500"
                }`}
              />
              {feedback && (
                <div
                  className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                    feedback === "correct" ? "animate-ping" : ""
                  }`}
                >
                  <div
                    className={`text-4xl sm:text-6xl ${
                      feedback === "correct" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {feedback === "correct" ? "✓" : "✗"}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleSubmit()}
              disabled={!userAnswer || isAnswering}
              className="w-full py-3 sm:py-4 px-6 sm:px-8 text-lg sm:text-xl font-bold rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-white/10"
            >
              {isAnswering ? "Checking..." : "Submit Answer"}
            </button>
          </div>

          {feedback && (
            <div
              className={`mt-4 sm:mt-6 text-center text-base sm:text-lg font-semibold px-2 ${
                feedback === "correct" ? "text-green-400" : "text-red-400"
              }`}
              style={{
                animation: "fadeIn 0.3s ease-out",
              }}
            >
              {feedback === "correct"
                ? "🎉 Correct! +10 points"
                : `❌ Incorrect! The answer was ${calculateAnswer(
                    currentCards
                  )}`}
            </div>
          )}
        </div>

        <div className="mt-6 bg-black/30 backdrop-blur-md rounded-full h-3 overflow-hidden border border-white/10">
          <div
            className="h-full bg-red-600 transition-all duration-500 ease-out"
            style={{
              width: `${((currentRound + 1) / rounds.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default PlayerZoneMindMath;
