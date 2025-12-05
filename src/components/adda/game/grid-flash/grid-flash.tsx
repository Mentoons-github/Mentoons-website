import postScore from "@/api/game/postScore";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useStatusModal } from "@/context/adda/statusModalContext";

type Difficulty = "easy" | "medium" | "hard";
type GamePhase = "memorize" | "recall" | "comparison" | "results";

interface GridConfig {
  cols: number;
  rows: number;
  fillCount: number;
  memorizeTime: number;
}

interface RoundResult {
  round: number;
  correctCells: number[];
  userCells: number[];
  score: number;
  accuracy: number;
}

const gridConfigs: Record<Difficulty, GridConfig> = {
  easy: { cols: 4, rows: 4, fillCount: 4, memorizeTime: 5 },
  medium: { cols: 6, rows: 6, fillCount: 8, memorizeTime: 4 },
  hard: { cols: 10, rows: 10, fillCount: 15, memorizeTime: 3 },
};

const GridFlashPlay = ({
  difficulty,
  onGameComplete,
}: {
  difficulty: Difficulty;
  onGameComplete: () => void;
}) => {
  const config = gridConfigs[difficulty];
  const totalCells = config.cols * config.rows;
  const totalRounds = 2;

  const [phase, setPhase] = useState<GamePhase>("memorize");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.memorizeTime);
  const [correctCells, setCorrectCells] = useState<number[]>([]);
  const [userCells, setUserCells] = useState<number[]>([]);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const { getToken } = useAuth();
  const { showStatus } = useStatusModal();
  const gameId = `gridFlash_${difficulty}`;

  useEffect(() => {
    if (phase === "memorize" && timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(t);
    } else if (phase === "memorize" && timeLeft === 0) {
      setPhase("recall");
    }
  }, [timeLeft, phase]);

  useEffect(() => {
    startNewRound();
  }, [round, difficulty]);

  const startNewRound = () => {
    const cells = Array.from({ length: totalCells }, (_, i) => i);
    const selected: number[] = [];
    for (let i = 0; i < config.fillCount; i++) {
      const idx = Math.floor(Math.random() * cells.length);
      selected.push(cells[idx]);
      cells.splice(idx, 1);
    }
    setCorrectCells(selected);
    setUserCells([]);
    setTimeLeft(config.memorizeTime);
    setPhase("memorize");
  };

  const toggleCell = (idx: number) => {
    if (userCells.includes(idx)) {
      setUserCells(userCells.filter((c) => c !== idx));
    } else {
      setUserCells([...userCells, idx]);
    }
  };

  const submit = () => {
    const correct = userCells.filter((c) => correctCells.includes(c)).length;
    const roundScore = correct === config.fillCount ? 10 : 0;
    const accuracy = Math.round((correct / config.fillCount) * 100);

    const result: RoundResult = {
      round,
      correctCells,
      userCells: [...userCells],
      score: roundScore,
      accuracy,
    };
    setResults([...results, result]);
    setScore(score + roundScore);
    setPhase("comparison");
  };

  const nextRound = async () => {
    if (round < totalRounds) {
      setRound(round + 1);
    } else {
      try {
        const token = await getToken();
        if (token)
          await postScore({ body: { score, gameId, difficulty }, token });
      } catch (error: unknown) {
        showStatus("error", error as string);
      }
      setPhase("results");
    }
  };

  const restart = () => {
    setRound(1);
    setScore(0);
    setResults([]);
    setShowComparison(false);
    startNewRound();
  };

  const goToLobby = () => {
    onGameComplete();
  };

  if (phase === "results") {
    const avg =
      results.reduce((s, r) => s + r.accuracy, 0) / results.length || 0;
    return (
      <div className="min-h-screen bg-[url('/assets/games/gridFlash/bg/bg.png')] flex items-center justify-center p-4 overflow-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-6xl w-full my-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-purple-600 mb-6 sm:mb-8 text-center">
            Game Over!
          </h1>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3 sm:p-6 text-white text-center">
              <p className="text-sm sm:text-lg">Score</p>
              <p className="text-2xl sm:text-4xl font-bold">{score}/100</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl p-3 sm:p-6 text-white text-center">
              <p className="text-sm sm:text-lg">Avg Accuracy</p>
              <p className="text-2xl sm:text-4xl font-bold">
                {avg.toFixed(1)}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl p-3 sm:p-6 text-white text-center">
              <p className="text-sm sm:text-lg">Difficulty</p>
              <p className="text-2xl sm:text-4xl font-bold capitalize">
                {difficulty}
              </p>
            </div>
          </div>

          {!showComparison && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setShowComparison(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl hover:scale-105 transition text-base sm:text-lg"
              >
                Show All Rounds Comparison
              </button>
            </div>
          )}

          {showComparison && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">
                All Rounds Comparison
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {results.map((result) => {
                  const correct = result.userCells.filter((c) =>
                    result.correctCells.includes(c)
                  );
                  const wrong = result.userCells.filter(
                    (c) => !result.correctCells.includes(c)
                  );
                  const missed = result.correctCells.filter(
                    (c) => !result.userCells.includes(c)
                  );

                  return (
                    <div
                      key={result.round}
                      className="bg-gray-50 rounded-xl p-3 sm:p-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                          Round {result.round}
                        </h3>
                        <div className="flex gap-2 sm:gap-4 text-sm sm:text-base">
                          <span className="font-semibold text-purple-600">
                            Score: {result.score}/10
                          </span>
                          <span className="font-semibold text-pink-600">
                            Accuracy: {result.accuracy}%
                          </span>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2">
                            Correct Pattern
                          </p>
                          <div
                            className="grid gap-1 sm:gap-2 mx-auto"
                            style={{
                              gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
                              maxWidth:
                                difficulty === "easy"
                                  ? "200px"
                                  : difficulty === "medium"
                                  ? "250px"
                                  : "320px",
                            }}
                          >
                            {Array.from({ length: totalCells }).map((_, i) => (
                              <div
                                key={i}
                                className={`aspect-square rounded ${
                                  result.correctCells.includes(i)
                                    ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                    : "bg-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2">
                            Your Answer
                          </p>
                          <div
                            className="grid gap-1 sm:gap-2 mx-auto"
                            style={{
                              gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
                              maxWidth:
                                difficulty === "easy"
                                  ? "200px"
                                  : difficulty === "medium"
                                  ? "250px"
                                  : "320px",
                            }}
                          >
                            {Array.from({ length: totalCells }).map((_, i) => {
                              const isCorrect = correct.includes(i);
                              const isWrong = wrong.includes(i);
                              const isMissed = missed.includes(i);
                              return (
                                <div
                                  key={i}
                                  className={`aspect-square rounded ${
                                    isCorrect
                                      ? "bg-green-500"
                                      : isWrong
                                      ? "bg-red-500"
                                      : isMissed
                                      ? "bg-yellow-400"
                                      : "bg-gray-300"
                                  }`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center gap-3 sm:gap-6 mt-3 text-xs sm:text-sm">
                        <span className="flex items-center gap-1 sm:gap-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded" />
                          Correct
                        </span>
                        <span className="flex items-center gap-1 sm:gap-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded" />
                          Wrong
                        </span>
                        <span className="flex items-center gap-1 sm:gap-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded" />
                          Missed
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={restart}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 sm:py-4 rounded-xl hover:scale-105 transition text-base sm:text-lg"
            >
              Play Again
            </button>
            <button
              onClick={goToLobby}
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 sm:py-4 rounded-xl hover:scale-105 transition text-base sm:text-lg"
            >
              Go to Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "comparison") {
    const last = results[results.length - 1];
    const correct = last.userCells.filter((c) => last.correctCells.includes(c));
    const wrong = last.userCells.filter((c) => !last.correctCells.includes(c));
    const missed = last.correctCells.filter((c) => !last.userCells.includes(c));

    return (
      <div className="min-h-screen bg-[url('/assets/games/gridFlash/bg/bg.png')] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-4xl w-full">
          <h2 className="text-2xl sm:text-4xl font-bold text-purple-600 text-center mb-6 sm:mb-8">
            Round {round} Result
          </h2>
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <p className="text-lg sm:text-xl font-bold text-gray-700 mb-4">
                Correct Pattern
              </p>
              <div
                className="grid gap-2 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
                  maxWidth:
                    difficulty === "easy"
                      ? "300px"
                      : difficulty === "medium"
                      ? "350px"
                      : "400px",
                }}
              >
                {Array.from({ length: totalCells }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg ${
                      last.correctCells.includes(i)
                        ? "bg-gradient-to-br from-purple-500 to-pink-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-lg sm:text-xl font-bold text-gray-700 mb-4">
                Your Answer
              </p>
              <div
                className="grid gap-2 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
                  maxWidth:
                    difficulty === "easy"
                      ? "300px"
                      : difficulty === "medium"
                      ? "350px"
                      : "400px",
                }}
              >
                {Array.from({ length: totalCells }).map((_, i) => {
                  const isCorrect = correct.includes(i);
                  const isWrong = wrong.includes(i);
                  const isMissed = missed.includes(i);
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg ${
                        isCorrect
                          ? "bg-green-500"
                          : isWrong
                          ? "bg-red-500"
                          : isMissed
                          ? "bg-yellow-400"
                          : "bg-gray-300"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-center gap-3 sm:gap-6 mt-4 text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded" />
                  Correct
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded" />
                  Wrong
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded" />
                  Missed
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={nextRound}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 sm:py-4 rounded-xl hover:scale-105 transition text-lg sm:text-xl"
          >
            {round < totalRounds ? "Next Round" : "View Final Results"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-[url('/assets/games/gridFlash/bg/bg.png')]">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black/10 backdrop-blur rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 text-white text-center">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 text-base sm:text-xl">
            <div>
              <p className="text-sm sm:text-lg opacity-90">Score</p>
              <p className="text-3xl sm:text-5xl font-bold">{score}</p>
            </div>
            <div>
              <p className="text-sm sm:text-lg opacity-90">
                {phase === "memorize" ? "Time" : "Selected"}
              </p>
              <p className="text-3xl sm:text-5xl font-bold">
                {phase === "memorize"
                  ? `${timeLeft}s`
                  : `${userCells.length}/${config.fillCount}`}
              </p>
            </div>
            <div>
              <p className="text-sm sm:text-lg opacity-90">Round</p>
              <p className="text-3xl sm:text-5xl font-bold">
                {round}/{totalRounds}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <p className="text-xl sm:text-3xl font-bold text-white px-4">
            {phase === "memorize"
              ? "Memorize the pattern!"
              : "Select the cells you remember!"}
          </p>
        </div>

        <div className="flex justify-center px-4">
          <div
            className="grid gap-2 sm:gap-3 w-full p-4 sm:p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl"
            style={{
              gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
              maxWidth:
                difficulty === "easy"
                  ? "400px"
                  : difficulty === "medium"
                  ? "500px"
                  : "640px",
            }}
          >
            {Array.from({ length: totalCells }).map((_, i) => {
              const isCorrect = correctCells.includes(i);
              const isSelected = userCells.includes(i);

              return (
                <div
                  key={i}
                  onClick={() => phase === "recall" && toggleCell(i)}
                  className={`aspect-square rounded-lg sm:rounded-2xl transition-all duration-300 cursor-pointer flex items-center justify-center
                    ${
                      phase === "memorize"
                        ? isCorrect
                          ? "bg-gradient-to-br from-purple-400 to-pink-500 scale-110 shadow-2xl"
                          : "bg-white"
                        : isSelected
                        ? "bg-gradient-to-br from-purple-400 to-pink-500 scale-95 shadow-2xl"
                        : "bg-white hover:bg-white/40"
                    }`}
                >
                  {phase === "recall" && isSelected && (
                    <span className="text-white text-xs sm:text-base font-bold">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {phase === "recall" && (
          <div className="flex justify-center mt-8 sm:mt-12">
            <button
              onClick={submit}
              disabled={userCells.length === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg sm:text-2xl px-12 sm:px-16 py-4 sm:py-6 rounded-full shadow-2xl hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GridFlashPlay;
