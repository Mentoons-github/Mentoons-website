import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  RotateCcw,
  Trophy,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { useAuth } from "@clerk/clerk-react";
import { useStatusModal } from "@/context/adda/statusModalContext";
import postScore from "@/api/game/postScore";

const COLORS = {
  CARD_BG: "bg-blue-950/90 backdrop-blur-sm",
  PRIMARY_TEXT: "text-white",
  SECONDARY_TEXT: "text-teal-300",
  ACCENT_ICON: "text-yellow-400",
  DICE_BOX_GRADIENT: "bg-gradient-to-br from-teal-500 to-cyan-600",
  EASY_GRADIENT: "from-green-500 to-emerald-600",
  MEDIUM_GRADIENT: "from-amber-400 to-orange-500",
  HARD_GRADIENT: "from-red-600 to-rose-700",
  SUBMIT_GRADIENT: "from-emerald-500 to-teal-500",
};

interface DiceBoxProps {
  value: number;
  revealed?: boolean;
}

const DiceBox: React.FC<DiceBoxProps> = ({ value, revealed = true }) => {
  const pip = "w-2 h-2 bg-white rounded-full shadow-sm";
  const smallPip = "w-1.5 h-1.5 sm:w-2 sm:h-2";

  const patterns: Record<number, (string | null)[][]> = {
    1: [
      [null, null, null],
      [null, pip, null],
      [null, null, null],
    ],
    2: [
      [pip, null, null],
      [null, null, null],
      [null, null, pip],
    ],
    3: [
      [pip, null, null],
      [null, pip, null],
      [null, null, pip],
    ],
    4: [
      [pip, null, pip],
      [null, null, null],
      [pip, null, pip],
    ],
    5: [
      [pip, null, pip],
      [null, pip, null],
      [pip, null, pip],
    ],
    6: [
      [pip, null, pip],
      [pip, null, pip],
      [pip, null, pip],
    ],
  };

  return (
    <div
      className={`${COLORS.DICE_BOX_GRADIENT} rounded-lg sm:rounded-xl shadow-lg p-3 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 transition-transform duration-200`}
    >
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1 h-full">
        {patterns[value].flat().map((dot, i) => (
          <div key={i} className="flex items-center justify-center">
            {revealed && dot && <div className={`${dot} ${smallPip}`} />}
          </div>
        ))}
      </div>
    </div>
  );
};

interface RoundResult {
  round: number;
  isPerfect: boolean;
  correctCount: number;
  diceValues: number[];
  userGuesses: number[];
}

type GameState =
  | "difficulty"
  | "ready"
  | "memorizing"
  | "recall"
  | "result"
  | "finalScore";
type Difficulty = "easy" | "medium" | "hard";

const Dice: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>("difficulty");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [diceValues, setDiceValues] = useState<number[]>([]);
  const [diceCount, setDiceCount] = useState<number>(4);
  const [userGuesses, setUserGuesses] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [showReport, setShowReport] = useState<boolean>(false);
  const [gameHistory, setGameHistory] = useState<RoundResult[]>([]);
  const { getToken } = useAuth();
  const { showStatus } = useStatusModal();
  const navigate = useNavigate();
  const gameId = `dice_${difficulty}`;

  const maxRounds = 10;

  const difficultySettings = {
    easy: {
      dice: 4,
      color: COLORS.EASY_GRADIENT,
      icon: "🙂",
      ageCategory: "6-12",
    },
    medium: {
      dice: 6,
      color: COLORS.MEDIUM_GRADIENT,
      icon: "🧐",
      ageCategory: "13-19",
    },
    hard: {
      dice: 12,
      color: COLORS.HARD_GRADIENT,
      icon: "🚀",
      ageCategory: "Adults",
    },
  };

  const generateDice = useCallback((): number[] => {
    return Array.from(
      { length: diceCount },
      () => Math.floor(Math.random() * 6) + 1
    );
  }, [diceCount]);

  const selectDifficulty = (level: Difficulty) => {
    setDifficulty(level);
    setDiceCount(difficultySettings[level].dice);
    setGameState("ready");
  };

  const startGame = useCallback(() => {
    const newDice = generateDice();
    setDiceValues(newDice);
    setUserGuesses([]);
    setGameState("memorizing");
    setTimeLeft(10);
    setShowReport(false);
  }, [generateDice]);

  const resetGame = useCallback(() => {
    setGameState("difficulty");
    setScore(0);
    setRound(1);
    setDiceValues([]);
    setUserGuesses([]);
    setTimeLeft(10);
    setShowReport(false);
    setGameHistory([]);
  }, []);

  useEffect(() => {
    if (gameState === "memorizing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "memorizing" && timeLeft === 0) {
      setGameState("recall");
    }
  }, [gameState, timeLeft]);

  const handleDiceClick = (value: number) => {
    if (gameState !== "recall") return;
    if (userGuesses.length >= diceCount) return;
    setUserGuesses((prev) => [...prev, value]);
  };

  const submitGuesses = () => {
    if (userGuesses.length !== diceCount) return;

    const correctCount = diceValues.reduce(
      (count, value, index) => count + (userGuesses[index] === value ? 1 : 0),
      0
    );
    const isPerfect = correctCount === diceCount;

    const roundResult: RoundResult = {
      round: round,
      isPerfect: isPerfect,
      correctCount: correctCount,
      diceValues: diceValues,
      userGuesses: userGuesses,
    };
    setGameHistory((prev) => [...prev, roundResult]);

    setGameState("result");
    setShowReport(false);
  };

  const nextRound = async () => {
    const lastResult = gameHistory[gameHistory.length - 1];
    const currentRoundScore = lastResult?.isPerfect
      ? 10
      : lastResult?.correctCount || 0;

    const newTotalScore = score + currentRoundScore;
    setScore(newTotalScore);

    if (round < maxRounds) {
      setRound((prev) => prev + 1);
      startGame();
    } else {
      setGameState("finalScore");

      try {
        const token = await getToken();
        if (token)
          await postScore({
            body: { score: newTotalScore, gameId, difficulty },
            token,
          });
      } catch (error: unknown) {
        showStatus("error", error as string);
      }
    }
  };

  const currentRoundResult = gameHistory[gameHistory.length - 1] || {};
  const currentRoundCorrectCount = currentRoundResult.correctCount || 0;
  const currentRoundIsPerfect = currentRoundResult.isPerfect || false;
  const currentDiceValues = currentRoundResult.diceValues || diceValues;
  const currentUserGuesses = currentRoundResult.userGuesses || userGuesses;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[url('/assets/games/dice/dice-bg.png')] bg-cover bg-center">
      <button
        onClick={() => navigate("/adda/game-lobby")}
        className="absolute left-4 top-4 sm:left-6 sm:top-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/30 backdrop-blur-sm shadow-md z-10"
      >
        <FaChevronLeft className="text-white text-xl sm:text-2xl" />
      </button>

      <div
        className={`${COLORS.CARD_BG} rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 max-w-lg md:max-w-2xl w-full border border-white/20`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className={COLORS.ACCENT_ICON} size={28} />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Dice Memory Game
              </h1>
              <p className={COLORS.SECONDARY_TEXT + " text-sm sm:text-base"}>
                Score: {score} | Round:{" "}
                {round <= maxRounds ? `${round}/${maxRounds}` : "Complete!"}
              </p>
            </div>
          </div>
          <button
            onClick={resetGame}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            aria-label="Reset game"
          >
            <RotateCcw className="text-white" size={20} />
          </button>
        </div>

        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          {gameState === "difficulty" && (
            <div className="text-center py-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Choose Your Challenge
              </h2>
              <p
                className={COLORS.SECONDARY_TEXT + " mb-5 text-sm sm:text-base"}
              >
                Select a difficulty level to begin
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => selectDifficulty("easy")}
                  className={`group relative overflow-hidden bg-gradient-to-br ${COLORS.EASY_GRADIENT} hover:opacity-90 rounded-lg p-4 sm:p-6 transition-all transform hover:scale-[1.02] shadow-lg`}
                >
                  <div className="text-4xl mb-2">🙂</div>
                  <h3 className="text-lg font-bold text-white">Easy</h3>
                  <p className="text-green-100 text-sm">4 Dice</p>
                  <p className="text-green-200 text-md font-medium mt-1">
                    Ages: {difficultySettings.easy.ageCategory}
                  </p>
                </button>
                <button
                  onClick={() => selectDifficulty("medium")}
                  className={`group relative overflow-hidden bg-gradient-to-br ${COLORS.MEDIUM_GRADIENT} hover:opacity-90 rounded-lg p-4 sm:p-6 transition-all transform hover:scale-[1.02] shadow-lg`}
                >
                  <div className="text-4xl mb-2">🧐</div>
                  <h3 className="text-lg font-bold text-white">Medium</h3>
                  <p className="text-orange-100 text-sm">6 Dice</p>
                  <p className="text-orange-200 text-md font-medium mt-1">
                    Ages: {difficultySettings.medium.ageCategory}
                  </p>
                </button>
                <button
                  onClick={() => selectDifficulty("hard")}
                  className={`group relative overflow-hidden bg-gradient-to-br ${COLORS.HARD_GRADIENT} hover:opacity-90 rounded-lg p-4 sm:p-6 transition-all transform hover:scale-[1.02] shadow-lg`}
                >
                  <div className="text-4xl mb-2">🚀</div>
                  <h3 className="text-lg font-bold text-white">Hard</h3>
                  <p className="text-red-100 text-sm">12 Dice</p>
                  <p className="text-red-200 text-md font-medium mt-1">
                    Ages: {difficultySettings.hard.ageCategory}
                  </p>
                </button>
              </div>
            </div>
          )}

          {gameState === "ready" && (
            <div className="text-center py-6">
              <div className="text-5xl mb-3">
                {difficultySettings[difficulty].icon}
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                Ready to Play Round {round}?
              </h2>
              <p
                className={COLORS.SECONDARY_TEXT + " mb-1 text-sm sm:text-base"}
              >
                Difficulty:{" "}
                <span className="font-bold capitalize">{difficulty}</span>
              </p>
              <p
                className={COLORS.SECONDARY_TEXT + " mb-3 text-sm sm:text-base"}
              >
                Recommended Age:{" "}
                <span className="font-bold">
                  {difficultySettings[difficulty].ageCategory}
                </span>
              </p>
              <p
                className={COLORS.SECONDARY_TEXT + " mb-4 text-sm sm:text-base"}
              >
                Memorize {diceCount} dice values in 10 seconds.
              </p>
              <button
                onClick={startGame}
                className={`px-6 py-3 bg-gradient-to-r ${difficultySettings[difficulty].color} hover:opacity-90 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md`}
              >
                Start Memorizing
              </button>
            </div>
          )}

          {gameState === "memorizing" && (
            <div>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock className="text-teal-300" size={20} />
                <span className="text-2xl font-bold text-white">
                  {timeLeft}s
                </span>
                <Eye className="text-teal-300" size={20} />
              </div>
              <p
                className={
                  COLORS.SECONDARY_TEXT +
                  " text-center mb-4 text-sm sm:text-base"
                }
              >
                Memorize these dice!
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {diceValues.map((value, i) => (
                  <DiceBox key={i} value={value} revealed={true} />
                ))}
              </div>
            </div>
          )}

          {gameState === "recall" && (
            <div>
              <div className="flex items-center justify-center gap-3 mb-4">
                <EyeOff className={COLORS.ACCENT_ICON} size={20} />
                <span className="text-lg font-semibold text-white text-center">
                  Click the dice in the correct order!
                </span>
              </div>

              <div className="mb-6">
                <p
                  className={
                    COLORS.SECONDARY_TEXT +
                    " text-center mb-2 text-sm sm:text-base"
                  }
                >
                  Your guesses ({userGuesses.length}/{diceCount}):
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 min-h-[60px] sm:min-h-[90px]">
                  {userGuesses.map((value, i) => (
                    <DiceBox key={i} value={value} revealed={true} />
                  ))}
                  {[...Array(diceCount - userGuesses.length)].map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/10 rounded-lg sm:rounded-xl border-2 border-dashed border-white/30"
                    />
                  ))}
                </div>
              </div>

              <div className="border-t border-white/20 pt-4 mt-4 sm:pt-6 sm:mt-6">
                <p
                  className={
                    COLORS.SECONDARY_TEXT +
                    " text-center mb-4 text-sm sm:text-base"
                  }
                >
                  Choose the next die:
                </p>

                <div className="grid grid-cols-6 gap-2 sm:gap-3 max-w-lg mx-auto mb-6">
                  {[1, 2, 3, 4, 5, 6].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleDiceClick(value)}
                      disabled={userGuesses.length >= diceCount}
                      className="hover:opacity-80 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <DiceBox value={value} revealed={true} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setUserGuesses((prev) => prev.slice(0, -1))}
                  disabled={userGuesses.length === 0}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                >
                  Undo
                </button>
                <button
                  onClick={submitGuesses}
                  disabled={userGuesses.length !== diceCount}
                  className={`px-6 py-2 bg-gradient-to-r ${COLORS.SUBMIT_GRADIENT} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-md text-sm sm:text-base`}
                >
                  Submit Round {round}
                </button>
              </div>
            </div>
          )}

          {gameState === "result" && (
            <div className="text-center py-4">
              <div
                className={`p-4 rounded-lg mb-4 shadow-xl ${
                  currentRoundIsPerfect
                    ? "bg-green-700/30 border border-green-500"
                    : "bg-red-700/30 border border-red-500"
                }`}
              >
                {currentRoundIsPerfect ? (
                  <>
                    <div className="text-5xl mb-3 animate-pulse">🌟🎉</div>
                    <h2 className="text-2xl font-bold text-green-400 mb-2">
                      Round {round} Perfect!
                    </h2>
                    <p className="text-yellow-300 text-xl font-bold">
                      +10 POINTS!
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-3">😬</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-orange-400 mb-2">
                      Round {round} Close Call!
                    </h2>
                    <p
                      className={
                        COLORS.SECONDARY_TEXT + " text-sm sm:text-base"
                      }
                    >
                      You got{" "}
                      <span className="text-3xl font-semibold">
                        {currentRoundCorrectCount}
                      </span>{" "}
                      out of{" "}
                      <span className="text-2xl font-bold">{diceCount}</span>{" "}
                      correct.
                    </p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-left bg-white/10 rounded-lg p-3 mb-4">
                <div>
                  <p className="text-green-300 text-xs mb-1">Correct:</p>
                  <p className="text-white text-xl font-bold">
                    {currentRoundCorrectCount}
                  </p>
                </div>
                <div>
                  <p className="text-red-300 text-xs mb-1">Wrong:</p>
                  <p className="text-white text-xl font-bold">
                    {diceCount - currentRoundCorrectCount}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowReport(!showReport)}
                className="w-full py-2 mb-4 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
              >
                {showReport ? "Hide Comparison" : "View Comparison"}
                {showReport ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {showReport && (
                <div className="mt-4 mb-4 border-t border-white/20 pt-4">
                  <h3
                    className={
                      COLORS.SECONDARY_TEXT + " text-lg font-semibold mb-3"
                    }
                  >
                    Round {round} Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-green-300 mb-2 font-medium text-sm">
                        ✓ Correct Sequence:
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 bg-green-500/20 rounded-lg p-2 border border-green-500/30">
                        {currentDiceValues.map((value, i) => (
                          <DiceBox key={i} value={value} revealed={true} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-blue-300 mb-2 font-medium text-sm">
                        Your Answer:
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 bg-blue-500/20 rounded-lg p-2 border border-blue-500/30">
                        {currentUserGuesses.map((value, i) => (
                          <div key={i} className="relative">
                            <DiceBox value={value} revealed={true} />
                            <div
                              className={`absolute -top-1.5 -right-1.5 rounded-full w-5 h-5 flex items-center justify-center text-white font-bold text-xs shadow-md ${
                                currentUserGuesses[i] === currentDiceValues[i]
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            >
                              {currentUserGuesses[i] === currentDiceValues[i]
                                ? "✓"
                                : "✗"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-center">
                <button
                  onClick={nextRound}
                  className={`px-6 py-2 bg-gradient-to-r ${difficultySettings[difficulty].color} hover:opacity-90 text-white font-semibold rounded-lg transition-all shadow-md text-sm sm:text-base`}
                >
                  {round < maxRounds
                    ? `Proceed to Round ${round + 1} →`
                    : "View Final Score"}
                </button>
              </div>
            </div>
          )}

          {gameState === "finalScore" && (
            <div className="text-center py-4">
              <div className="text-6xl mb-3">🏆</div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                Game Completed!
              </h2>
              <p className={COLORS.SECONDARY_TEXT + " text-xl mb-4"}>
                Final Score: <span className="text-4xl font-bold">{score}</span>{" "}
                / {maxRounds * 10}
              </p>

              <p className="text-lg text-white mb-6">
                You completed{" "}
                <span className="text-xl font-semibold">{maxRounds}</span>{" "}
                rounds on the
                <span className="text-xl font-semibold ml-2">
                  {difficulty.toUpperCase()}
                </span>{" "}
                difficulty.
              </p>

              <button
                onClick={() => setShowReport(!showReport)}
                className="w-full py-3 mb-4 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
              >
                {showReport
                  ? "Hide Full Game Report"
                  : `View Full Game Report (Rounds 1-${maxRounds})`}
                {showReport ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>

              {showReport && (
                <div className="mt-6 border-t border-white/20 pt-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Detailed Game History
                  </h3>
                  {gameHistory.map((result, index) => (
                    <div
                      key={index}
                      className={`mb-6 p-4 rounded-lg text-left ${
                        result.isPerfect ? "bg-green-700/30" : "bg-red-700/30"
                      }`}
                    >
                      <h4 className="text-lg font-bold mb-2 text-white">
                        Round {result.round}:{" "}
                        {result.isPerfect ? "PERFECT" : "INCORRECT"}
                        {result.isPerfect && (
                          <span className="text-yellow-300 ml-2">
                            (+10 pts)
                          </span>
                        )}
                      </h4>
                      <p className="text-sm mb-3 text-white">
                        Correct: {result.correctCount} /{" "}
                        {result.diceValues.length}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-green-300 mb-1">
                            ✓ Correct Sequence:
                          </p>
                          <div className="flex flex-wrap justify-start gap-1 bg-green-500/20 rounded-md p-1">
                            {result.diceValues.map((value, i) => (
                              <DiceBox key={i} value={value} revealed={true} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-blue-300 mb-1">Your Answer:</p>
                          <div className="flex flex-wrap justify-start gap-1 bg-blue-500/20 rounded-md p-1">
                            {result.userGuesses.map((value, i) => (
                              <div key={i} className="relative">
                                <DiceBox value={value} revealed={true} />
                                <div
                                  className={`absolute -top-1 -right-1 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs ${
                                    result.userGuesses[i] ===
                                    result.diceValues[i]
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                >
                                  {result.userGuesses[i] ===
                                  result.diceValues[i]
                                    ? "✓"
                                    : "✗"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={resetGame}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-lg rounded-lg transition-all shadow-md mt-6"
              >
                Start New Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dice;
