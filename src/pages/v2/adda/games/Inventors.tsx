import { useState, useEffect, useCallback, useRef } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import InventorsSlide from "@/components/adda/games/Inventors&Invention.tsx/InventorsSlide";
import InventorsQuestion, {
  ReviewCard,
} from "@/components/adda/games/Inventors&Invention.tsx/InventorsQuestion";
import {
  INVENTORS_BY_DIFFICULTY,
  InvetionTypes,
} from "@/constant/games/InventorSlides";
import { BsExclamation } from "react-icons/bs";
import InventorInstructionModal from "@/components/adda/games/Inventors&Invention.tsx/modal/InventorInstructionModal";
import InventorsReviewCard from "@/components/adda/games/Inventors&Invention.tsx/InventorsReviewCard";
import InventorsStartScreen from "@/components/adda/games/Inventors&Invention.tsx/InventorsStartScreen";

const COLORS = {
  CARD_BG: "bg-[#ab6c3c] backdrop-blur-sm",
  PRIMARY_TEXT: "text-white",
  SECONDARY_TEXT: "text-[#2c8f00]",
  ACCENT_ICON: "text-yellow-400",
  DICE_BOX_GRADIENT: "bg-gradient-to-br from-teal-500 to-cyan-600",
  EASY_GRADIENT: "from-green-500 to-emerald-600",
  MEDIUM_GRADIENT: "from-amber-400 to-orange-500",
  HARD_GRADIENT: "from-red-600 to-rose-700",
  SUBMIT_GRADIENT: "from-emerald-500 to-teal-500",
};

const SHUFFLE_TIME = 15;

const TIME_BY_DIFFICULTY = {
  easy: { shuffle: 15, match: 30 },
  medium: { shuffle: 25, match: 45 },
  hard: { shuffle: 35, match: 60 },
};

const getBatchSize = (level: Difficulty) => {
  if (level === "easy") return 3;
  if (level === "medium") return 6;
  return 8; // hard
};

type GameState =
  | "start"
  | "difficulty"
  | "countdown"
  | "memorize"
  | "match"
  | "review"
  | "final";

type Difficulty = "easy" | "medium" | "hard";

const Inventors: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>("start");
  const [shuffleTime, setShuffleTime] = useState(15);
  const [matchTime, setMatchTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(SHUFFLE_TIME);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [allSlides, setAllSlides] = useState<InvetionTypes[]>([]);
  const [currentBatch, setCurrentBatch] = useState<InvetionTypes[]>([]);
  const [batchIndex, setBatchIndex] = useState(0);
  const [batchSize, setBatchSize] = useState(3);
  const [shouldShuffle, setShouldShuffle] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(false);
  const [instructionModalOpen, setInstructionModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const endAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [reviewCards, setReviewCards] = useState<ReviewCard[]>([]);
  const [lastBatchScore, setLastBatchScore] = useState(0);

  const navigate = useNavigate();

  const maxRounds = 3;

  const difficultySettings = {
    easy: {
      slide: 3,
      color: COLORS.EASY_GRADIENT,
      icon: "🙂",
      ageCategory: "6-12",
    },
    medium: {
      slide: 6,
      color: COLORS.MEDIUM_GRADIENT,
      icon: "🧐",
      ageCategory: "13-19",
    },
    hard: {
      slide: 8,
      color: COLORS.HARD_GRADIENT,
      icon: "🚀",
      ageCategory: "Adults",
    },
  };

  const startGame = (level: Difficulty) => {
    const data = [...INVENTORS_BY_DIFFICULTY[level]].sort(
      () => Math.random() - 0.5
    );

    const size = getBatchSize(level);

    // setSelectedDifficulty(level);

    setShuffleTime(TIME_BY_DIFFICULTY[level].shuffle);
    setMatchTime(TIME_BY_DIFFICULTY[level].match);

    setBatchSize(size);
    setAllSlides(data);
    setBatchIndex(0);
    setCurrentBatch(data.slice(0, size));
    setCountdown(3);
    setGameState("countdown");
  };

  useEffect(() => {
    if (gameState === "memorize") {
      const start = batchIndex * batchSize;
      const end = start + batchSize;

      const nextBatch = allSlides.slice(start, end);
      setCurrentBatch(nextBatch);
    }
  }, [gameState, batchIndex, allSlides, batchSize]);


  const onBatchComplete = (batchScore: number, cards: ReviewCard[]) => {
    setLastBatchScore(batchScore);
    setReviewCards(cards);
    setGameState("review");
    endAudioRef.current?.pause();
  };

  const OnNextRound = () => {
    setScore((prev) => prev + lastBatchScore);
    setRound((prev) => prev + 1);

    const nextIndex = batchIndex + 1;
    const isFinished = nextIndex * batchSize >= allSlides.length;

    if (isFinished) {
      setGameState("final");
    } else {
      setBatchIndex(nextIndex);
      setGameState("memorize");
    }
  };

  const resetGame = useCallback(() => {
    setGameState("difficulty");
    setScore(0);
    setRound(1);
    // setTimeLeft(10);

    if (endAudioRef.current) {
      endAudioRef.current.pause();
      endAudioRef.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    if (gameState !== "memorize" && gameState !== "match") return;
    // if (gameState !== "memorize" && gameState !== "match") return;

    // ✅ CLEAR OLD TIMER FIRST (CRITICAL)
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const TOTAL_TIME = gameState === "memorize" ? shuffleTime : matchTime;

    setTimeLeft(TOTAL_TIME);
    setShouldShuffle(false);
    setAutoSubmit(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;

          if (gameState === "memorize") {
            setShouldShuffle(true);
            setGameState("match");
          }

          if (gameState === "match") {
            setAutoSubmit(true);
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "countdown") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState("memorize");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "memorize" && gameState !== "match") return;
    if (timeLeft > 5 || timeLeft === 0) return;

    const audio = endAudioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    audio.play().catch(() => {});
  }, [timeLeft, gameState]);

  useEffect(() => {
    if (timeLeft === 0 && endAudioRef.current) {
      endAudioRef.current.pause();
      endAudioRef.current.currentTime = 0;
    }
  }, [timeLeft]);

  if (gameState == "start") {
    return <InventorsStartScreen onStart={() => setGameState("difficulty")} />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center md:p-4 bg-[url('/assets/games/dice/dice-bg.png')]">
      <audio
        ref={endAudioRef}
        src="/assets/games/inventors/end time.mp3"
        preload="auto"
      />
      <button
        onClick={() => navigate("/adda/game")}
        className="absolute top-1 left-1 md:left-6 z-10 md:top-6 w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white/30 backdrop-blur-sm shadow-md"
      >
        <FaChevronLeft className="text-white text-lg md:text-2xl" />
      </button>

      <div
        className={`
    ${
      COLORS.CARD_BG
    } rounded-xl shadow-2xl pt-2 p-1 md:p-6 w-full border border-white/20
    ${
      gameState === "difficulty" || gameState === "final"
        ? "max-w-2xl"
        : "max-w-6xl"
    }
        ${gameState === "countdown" && "hidden"}
  `}
      >
        <div className="flex md:items-center justify-between mb-4 bg-[#1f85b4] rounded-md p-2 md:p-3">
          <div className="flex items-center gap-2 md:gap-3 w-full">
            <Trophy
              className={`${COLORS.ACCENT_ICON} text-yellow-400 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7  `}
            />

            <div className="w-full">
              <div className="text-lg md:text-2xl font-bold text-[#502d12] ">
                <div className=" flex justify-between  w-full">
                  <h2> Inventors & Inventions Quiz</h2>
                  <div className="flex md:hidden items-center gap-2">
                    {(gameState === "memorize" || gameState === "match") && (
                      <span
                        className={`ml-4 p-1 font-bold text-sm 
                                    whitespace-nowrap ${
                                      gameState === "memorize"
                                        ? "text-yellow-400"
                                        : "text-red-400"
                                    }`}
                      >
                        ⏳{timeLeft}s
                      </span>
                    )}
                    <button
                      onClick={resetGame}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      aria-label="Reset game"
                    >
                      <RotateCcw className="text-white w-4 h-4 md:w-6 md:h-6 " />
                    </button>
                  </div>
                </div>
                {gameState === "match" && (
                  <div
                    className="lg:ml-3 md:px-3 mt-1 px-1 py-1 bg-yellow-400/20 border border-yellow-400 
                  rounded-full text-sm text-yellow-200 font-semibold animate-pulse md:inline"
                  >
                    🫴 Drag and put correct items together!
                  </div>
                )}
                {gameState === "memorize" && (
                  <div
                    className="lg:ml-3 md:px-3 mt-1 px-1 py-1 bg-green-400/20 border border-green-400  
               rounded-full text-xs md:text-sm text-green-200 font-semibold animate-pulse md:inline"
                  >
                    👀 Look carefully & remember the pairs!
                  </div>
                )}
              </div>
              <p className="text-white text-sm md:text-base">
                Score: {score} | Round:{" "}
                {round <= maxRounds ? `${round}/${maxRounds}` : "Complete!"}
              </p>
            </div>
          </div>
          <div className="flex gap-1 items-start md:gap-5 md:items-center">
            {gameState === "difficulty" && (
              <div
                className="p-2 bg-yellow-700 hover:bg-yellow-600 ml-2 rounded-lg transition-colors animate-pulse md:-mr-2"
                onClick={() => setInstructionModalOpen(true)}
              >
                <BsExclamation className="text-white w-4 h-4 md:w-6 md:h-6 " />
              </div>
            )}
            {(gameState === "memorize" || gameState === "match") && (
              <span
                className={`ml-4 font-bold hidden md:flex items-center text-xl p-2 
                  whitespace-nowrap ${
                    gameState === "memorize"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
              >
                ⏳{timeLeft}s
              </span>
            )}

            <button
              onClick={resetGame}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors hidden md:block"
              aria-label="Reset game"
            >
              <RotateCcw className="text-white w-4 h-4 md:w-6 md:h-6 " />
            </button>
          </div>
        </div>

        <div
          className={`bg-[#fceec7] backdrop-blur-md rounded-lg p-1 md:p-2 lg:p-4 border border-white/20`}
        >
          {gameState === "difficulty" && (
            <div className=" md:py-3">
              <h2 className="text-xl font-bold text-[#c9965a] mb-2 text-center">
                Choose Your Challenge
              </h2>
              <p className={COLORS.SECONDARY_TEXT + " mb-4 text-center"}>
                Select a difficulty level to begin
              </p>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <button
                  onClick={() => startGame("easy")}
                  className={`group relative overflow-hidden bg-gradient-to-br ${COLORS.EASY_GRADIENT} hover:opacity-90 rounded-lg p-2 md:p-4 transition-all transform hover:scale-[1.02] shadow-lg`}
                >
                  <div className="text-4xl mb-2">🙂</div>
                  <h3 className="text-lg font-bold text-white">Easy</h3>
                  <h3 className="font-bold text-green-200">
                    {difficultySettings.easy.slide} Cards
                  </h3>
                  <p className="text-green-200 text-[14px] font-medium mt-1">
                    Ages: {difficultySettings.easy.ageCategory}
                  </p>
                </button>
                <button
                  onClick={() => startGame("medium")}
                  className={`group relative overflow-hidden bg-gradient-to-br ${COLORS.MEDIUM_GRADIENT} hover:opacity-90 rounded-lg p-2 md:p-4 transition-all transform hover:scale-[1.02] shadow-lg`}
                >
                  <div className="text-4xl mb-2">🧐</div>
                  <h3 className="text-lg font-bold text-white">Medium</h3>
                  <h3 className="font-bold text-orange-200">
                    {difficultySettings.medium.slide} Cards
                  </h3>
                  <p className="text-orange-200 text-[14px] font-medium mt-1">
                    Ages: {difficultySettings.medium.ageCategory}
                  </p>
                </button>
                <button
                  onClick={() => startGame("hard")}
                  className={`group relative overflow-hidden bg-gradient-to-br ${COLORS.HARD_GRADIENT} hover:opacity-90 rounded-lg p-2 md:p-4 transition-all transform hover:scale-[1.02] shadow-lg`}
                >
                  <div className="text-4xl mb-2">🚀</div>
                  <h3 className="text-lg font-bold text-white">Hard</h3>
                  <h3 className=" font-bold text-red-200">
                    {difficultySettings.hard.slide} Cards
                  </h3>
                  <p className="text-red-200 text-[14px] font-medium mt-1">
                    Ages: {difficultySettings.hard.ageCategory}
                  </p>
                </button>
              </div>
            </div>
          )}

          {gameState === "memorize" && (
            <InventorsSlide
              slides={currentBatch}
              onNext={() => setGameState("match")}
              shouldShuffle={shouldShuffle}
            />
          )}

          {gameState === "match" && (
            <InventorsQuestion
              slides={currentBatch}
              onFinish={(score, cards) => onBatchComplete(score, cards)}
              autoSubmit={autoSubmit}
              resetAutoSubmit={() => setAutoSubmit(false)}
            />
          )}

          {gameState === "final" && (
            <div className="text-center text-white py-6">
              <h1 className="text-4xl font-extrabold mb-3 text-yellow-400 animate-bounce">
                🎉 Game Completed! 🎉
              </h1>

              <p className="text-lg text-green-600 mb-4">
                Great job! Here is your final score:
              </p>

              {/* ✅ SCORE BOARD */}
              <div
                className="mx-auto w-full max-w-sm bg-gradient-to-br from-purple-600 to-blue-700 
                    rounded-2xl p-6 shadow-2xl border border-white/30"
              >
                <p className="text-xl font-semibold mb-2">⭐ Your Score ⭐</p>

                <div className="text-5xl font-extrabold text-green-300 mb-2">
                  {score}
                  <span className="text-2xl text-white">
                    {" "}
                    / {maxRounds * batchSize}
                  </span>
                </div>

                <p className="text-sm text-teal-100">
                  You matched {score} correct answers!
                </p>

                {/* 🎯 PERFORMANCE MESSAGE */}
                <div className="mt-4 text-lg font-bold">
                  {score === maxRounds * batchSize && "🏆 Perfect Champion!"}
                  {score > (maxRounds * batchSize) / 2 &&
                    score < maxRounds * batchSize &&
                    "🌟 Superb Job!"}
                  {score <= (maxRounds * batchSize) / 2 &&
                    "💪 Keep Practicing!"}
                </div>
              </div>

              {/* 🔁 PLAY AGAIN BUTTON */}
              <button
                className="mt-6 bg-gradient-to-r from-teal-500 to-green-500 
                 hover:from-teal-400 hover:to-green-400 
                 px-8 py-3 rounded-full font-bold text-lg 
                 shadow-xl transition-all transform hover:scale-105"
                onClick={() => {
                  setGameState("difficulty");
                  setScore(0);
                  setRound(1);
                }}
              >
                🔁 Play Again
              </button>
            </div>
          )}

          {gameState === "review" && (
            <InventorsReviewCard
              batchSize={batchSize}
              lastBatchScore={lastBatchScore}
              onNextRound={OnNextRound}
              reviewCards={reviewCards}
            />
          )}
        </div>
      </div>
      {gameState === "countdown" && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 
                 bg-black/60 backdrop-blur-md"
        >
          <div className="flex flex-col items-center justify-center h-[300px] text-white">
            <p className="text-lg mb-4 text-teal-200 font-semibold">
              Get Ready!
            </p>

            <div className="text-9xl font-extrabold animate-bounce text-yellow-400">
              {countdown}
            </div>

            <p className="mt-4 text-sm text-gray-300">
              Memorization starts now...
            </p>
          </div>
        </div>
      )}
      {instructionModalOpen && (
        <InventorInstructionModal
          onClose={() => setInstructionModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Inventors;
