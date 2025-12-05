import { Difficulty, Questions } from "@/types/adda/game";
import { useEffect, useState, useCallback } from "react";

interface PlayerSpaceProps {
  difficulty: Difficulty;
  questions: Questions[];
  onGameOver?: () => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

interface GameStats {
  correct: number;
  wrong: number;
  timeout: number;
}

const normalizeAnswer = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/^the/, "")
    .trim();
};

const PlayerSpace = ({
  difficulty,
  questions,
  onGameOver,
  score,
  setScore,
}: PlayerSpaceProps) => {
  const [timer, setTimer] = useState<number>(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [lastUserAnswer, setLastUserAnswer] = useState("");
  const [isTimeout, setIsTimeout] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    correct: 0,
    wrong: 0,
    timeout: 0,
  });
  const [showGameOver, setShowGameOver] = useState(false);

  const handleTimeout = useCallback(() => {
    setLastUserAnswer(inputValue.trim());
    setShowAnswer(true);
    setIsCorrect(false);
    setIsTimeout(true);
    setGameStats((prev) => ({ ...prev, timeout: prev.timeout + 1 }));
  }, [inputValue]);

  const handleSubmit = useCallback(() => {
    if (showAnswer) return;

    const correctAnswer = questions[currentIndex].answer;
    const userAnswer = inputValue.trim();

    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);

    const isMatch = normalizedUser === normalizedCorrect;

    setLastUserAnswer(userAnswer || "(empty)");
    setIsTimeout(false);

    if (isMatch) {
      setScore((prev) => prev + 10);
      setIsCorrect(true);
      setGameStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setIsCorrect(false);
      setGameStats((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
    }

    setShowAnswer(true);
  }, [showAnswer, questions, currentIndex, inputValue]);

  const handleNextRound = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setInputValue("");
      setShowAnswer(false);
      setIsCorrect(null);
      setLastUserAnswer("");
      setIsTimeout(false);
    } else {
      setShowGameOver(true);
    }
  }, [currentIndex, questions.length]);

  const handleRestart = () => {
    setShowGameOver(false);
    setCurrentIndex(0);
    setScore(0);
    setInputValue("");
    setShowAnswer(false);
    setIsCorrect(null);
    setLastUserAnswer("");
    setIsTimeout(false);
    setGameStats({ correct: 0, wrong: 0, timeout: 0 });
    setTimer(difficulty === "easy" ? 15 : difficulty === "medium" ? 10 : 8);
  };

  const handleBackToLobby = () => {
    handleRestart();
    onGameOver?.();
  };

  useEffect(() => {
    const timeLimit =
      difficulty === "easy" ? 15 : difficulty === "medium" ? 10 : 8;
    setTimer(timeLimit);
    if (showAnswer || showGameOver) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, difficulty, showAnswer, showGameOver, handleTimeout]);

  if (showGameOver) {
    const maxScore = questions.length * 10;
    const scorePercentage = Math.round((score / maxScore) * 100);

    return (
      <div className="h-screen w-screen bg-[url('/assets/games/cartoonmoji/bg.png')] bg-cover bg-center flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-2">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-orange-500 flex flex-col h-full max-h-full overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-4 text-center">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Game Over!
              </h1>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2 space-y-4 text-center">
              <div>
                <p className="text-lg font-bold text-orange-600">Your Score</p>
                <p className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                  {score}
                </p>
                <p className="text-xl font-semibold text-orange-500">
                  / {maxScore}
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-7 border-2 border-orange-300 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm"
                  style={{ width: `${scorePercentage}%` }}
                >
                  {scorePercentage}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-500 rounded-2xl p-4">
                  <div className="text-2xl mb-1">Correct</div>
                  <p className="text-4xl font-black text-green-700">
                    {gameStats.correct}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 border-4 border-red-500 rounded-2xl p-4">
                  <div className="text-2xl mb-1">Wrong</div>
                  <p className="text-4xl font-black text-red-700">
                    {gameStats.wrong}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl border-2 border-orange-300">
                <p className="text-xl font-black text-orange-700">
                  {scorePercentage >= 80
                    ? "Emoji Master!"
                    : scorePercentage >= 60
                    ? "Great Job!"
                    : scorePercentage >= 40
                    ? "Good Effort!"
                    : "Keep Practicing!"}
                </p>
              </div>
            </div>

            <div className="p-4 space-y-3 border-t-4 border-orange-300 bg-white">
              <button
                onClick={handleRestart}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 rounded-2xl text-lg shadow-xl transition transform hover:scale-105 active:scale-95"
              >
                Play Again
              </button>
              <button
                onClick={handleBackToLobby}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-2xl text-lg shadow-xl transition transform hover:scale-105 active:scale-95"
              >
                Back to Lobby
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[url('/assets/games/cartoonmoji/bg.png')] bg-cover bg-center flex flex-col">
      <header className="shrink-0 p-3">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl border-4 border-orange-500 p-4 flex justify-around text-center">
            <div>
              <p className="text-orange-700 font-bold text-sm sm:text-base">
                Score
              </p>
              <p className="text-3xl sm:text-4xl font-black text-orange-800">
                {score}
              </p>
            </div>
            <div>
              <p className="text-orange-700 font-bold text-sm sm:text-base">
                Time
              </p>
              <p
                className={`text-3xl sm:text-4xl font-black ${
                  timer <= 3 ? "text-red-600 animate-pulse" : "text-orange-800"
                }`}
              >
                {timer}s
              </p>
            </div>
            <div>
              <p className="text-orange-700 font-bold text-sm sm:text-base">
                Round
              </p>
              <p className="text-3xl sm:text-4xl font-black text-orange-800">
                {currentIndex + 1}/{questions.length}
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col justify-center items-center px-4 pb-6 gap-6 overflow-hidden">
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-bold text-green-900 drop-shadow-2xl">
            Guess the cartoon!
          </p>
        </div>

        <div className="w-full max-w-xl">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-orange-500">
            <div className="p-8 min-h-48 flex items-center justify-center text-7xl sm:text-8xl">
              {questions[currentIndex].emoji}
            </div>
          </div>

          {showAnswer && (
            <div
              className={`mt-6 p-5 rounded-2xl border-4 text-center text-lg font-bold 
                ${
                  isCorrect
                    ? "bg-green-100 border-green-600 text-green-800"
                    : isTimeout
                    ? "bg-yellow-100 border-yellow-600 text-yellow-800"
                    : "bg-red-100 border-red-600 text-red-800"
                }`}
            >
              <p className="text-2xl mb-2">
                {isCorrect ? "Correct!" : isTimeout ? "Time's Up!" : "Wrong!"}
              </p>
              <p>
                You said:{" "}
                <span className="text-blue-700">
                  {lastUserAnswer || "(empty)"}
                </span>
              </p>
              <p>
                Answer:{" "}
                <span className="text-orange-700">
                  {questions[currentIndex].answer}
                </span>
              </p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {!showAnswer ? (
              <>
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  type="text"
                  placeholder="Your answer..."
                  autoFocus
                  className="w-full p-5 text-xl text-center rounded-2xl border-4 border-orange-600 focus:border-orange-700 outline-none shadow-xl"
                />
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-5 rounded-2xl text-xl shadow-xl transition active:scale-95"
                >
                  Submit
                </button>
              </>
            ) : (
              <button
                onClick={handleNextRound}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-5 rounded-2xl text-xl shadow-xl transition active:scale-95"
              >
                {currentIndex + 1 < questions.length ? "Next" : "Results"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlayerSpace;
