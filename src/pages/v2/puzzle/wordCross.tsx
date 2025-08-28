import { useParams, useNavigate } from "react-router-dom";
import ClueSection from "@/components/puzzle/crossWord/clueSection";
import GameBoard from "@/components/puzzle/crossWord/gameBoard";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  GRID_SOCIAL_EASY,
  CLUES_SOCIAL_EASY,
  GRID_SOCIAL_MEDIUM,
  CLUES_SOCIAL_MEDIUM,
  GRID_SOCIAL_HARD,
  CLUES_SOCIAL_HARD,
} from "@/constant/constants";
import SuccessModal from "@/components/puzzle/crossWord/successModal";

// Debounce utility
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const difficultyMap = {
  socialMedia: {
    easy: { CLUES: CLUES_SOCIAL_EASY, GRID: GRID_SOCIAL_EASY },
    medium: { CLUES: CLUES_SOCIAL_MEDIUM, GRID: GRID_SOCIAL_MEDIUM },
    hard: { CLUES: CLUES_SOCIAL_HARD, GRID: GRID_SOCIAL_HARD },
  },
};

const CrossWordPuzzle = () => {
  const { difficulty, puzzleType } = useParams<{
    difficulty: string;
    puzzleType: string;
  }>();

  console.log("difficulty received: ", difficulty, puzzleType);
  const navigate = useNavigate();

  // Default to easy if difficulty is invalid or undefined
  const selectedDifficulty =
    difficulty &&
    typeof difficulty === "string" &&
    difficulty.toLowerCase() in difficultyMap.socialMedia
      ? (difficulty.toLowerCase() as keyof typeof difficultyMap.socialMedia)
      : "easy";

  const { GRID, CLUES } =
    difficultyMap.socialMedia[selectedDifficulty] ||
    difficultyMap.socialMedia.easy;

  const [userInput, setUserInput] = useState<(string | null)[][]>(
    GRID.map((row) =>
      row.map((cell) => (cell?.answer && !cell?.isBlocked ? "" : null))
    )
  );

  const [showResult, setShowResult] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [direction, setDirection] = useState<"across" | "down">("across");
  const [selectedClue, setSelectedClue] = useState<number | null>(null);
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());
  const [letterPop, setLetterPop] = useState<string>("");
  const [sparkles, setSparkles] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [usedHints, setUsedHints] = useState(new Set<number>());
  const [showClues, setShowClues] = useState<{
    across: boolean;
    down: boolean;
  }>({ across: false, down: false });

  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    GRID.map((row) => row.map(() => null))
  );

  const triggerSparkles = useCallback(() => {
    const newSparkles = Array.from({ length: 25 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 4000);
  }, []);

  const getWordCells = useCallback(
    (clueNumber: number | null, dir: "across" | "down"): [number, number][] => {
      if (!clueNumber) return [];
      const clue = CLUES.find(
        (c) => c.number === clueNumber && c.direction === dir
      );
      if (!clue) return [];

      const cells: [number, number][] = [];
      const { startRow, startCol, answer } = clue;

      for (let i = 0; i < answer.length; i++) {
        if (dir === "across") {
          cells.push([startRow, startCol + i]);
        } else {
          cells.push([startRow + i, startCol]);
        }
      }

      return cells;
    },
    [CLUES]
  );

  const checkWordCompletion = useCallback(
    debounce(() => {
      const newCompleted = new Set<string>();

      CLUES.forEach((clue) => {
        const cells = getWordCells(clue.number, clue.direction);
        const isComplete = cells.every(([r, c]) => {
          const cellIndex = cells.findIndex(([cr, cc]) => cr === r && cc === c);
          return (
            userInput[r] &&
            userInput[r][c] !== null &&
            userInput[r][c]?.toUpperCase() === clue.answer[cellIndex]
          );
        });

        if (isComplete) {
          newCompleted.add(`${clue.number}-${clue.direction}`);
          if (!completedWords.has(`${clue.number}-${clue.direction}`)) {
            triggerSparkles();
          }
        }
      });

      setCompletedWords(newCompleted);
    }, 300),
    [userInput, getWordCells, completedWords, triggerSparkles]
  );

  const moveToNextCell = useCallback(
    (row: number, col: number) => {
      const cells = getWordCells(selectedClue, direction);
      const currentIndex = cells.findIndex(([r, c]) => r === row && c === col);

      if (currentIndex >= 0 && currentIndex < cells.length - 1) {
        const [nextR, nextC] = cells[currentIndex + 1];
        setActiveCell([nextR, nextC]);
        inputRefs.current[nextR][nextC]?.focus();
      }
    },
    [direction, selectedClue, getWordCells]
  );

  const moveToPreviousCell = useCallback(
    (row: number, col: number) => {
      const cells = getWordCells(selectedClue, direction);
      const currentIndex = cells.findIndex(([r, c]) => r === row && c === col);

      if (currentIndex > 0) {
        const [prevR, prevC] = cells[currentIndex - 1];
        setActiveCell([prevR, prevC]);
        inputRefs.current[prevR][prevC]?.focus();
      }
    },
    [direction, selectedClue, getWordCells]
  );

  const handleChange = useCallback(
    (row: number, col: number, val: string) => {
      const updated = userInput.map((r) => [...r]);
      updated[row][col] = val.toUpperCase().slice(0, 1);
      setUserInput(updated);

      setLetterPop(`${row}-${col}`);
      setTimeout(() => setLetterPop(""), 400);

      if (val) {
        moveToNextCell(row, col);
      }
    },
    [userInput, moveToNextCell]
  );

  const handleKeyDown = useCallback(
    (
      row: number,
      col: number,
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Backspace" && !userInput[row][col]) {
        moveToPreviousCell(row, col);
        event.preventDefault();
      } else if (event.key === "ArrowRight" && direction === "across") {
        moveToNextCell(row, col);
        event.preventDefault();
      } else if (event.key === "ArrowLeft" && direction === "across") {
        moveToPreviousCell(row, col);
        event.preventDefault();
      } else if (event.key === "ArrowDown" && direction === "down") {
        moveToNextCell(row, col);
        event.preventDefault();
      } else if (event.key === "ArrowUp" && direction === "down") {
        moveToPreviousCell(row, col);
        event.preventDefault();
      }
    },
    [direction, userInput, moveToNextCell, moveToPreviousCell]
  );

  const isCorrectCell = useCallback(
    (row: number, col: number) => {
      const cell = GRID[row][col];
      if (!cell?.answer || cell?.isBlocked) return true;
      return userInput[row][col]?.toUpperCase() === cell.answer;
    },
    [userInput, GRID]
  );

  const allCorrect = useMemo(() => {
    return GRID.every((row, r) =>
      row.every((cell, c) => {
        if (!cell?.answer || cell?.isBlocked) return true;
        return userInput[r][c]?.toUpperCase() === cell.answer;
      })
    );
  }, [userInput, GRID]);

  // Show success modal when puzzle is complete
  useEffect(() => {
    if (allCorrect) {
      triggerSparkles();
      setTimeout(() => setShowSuccessModal(true), 1000); // Small delay for better UX
    }
  }, [allCorrect, triggerSparkles]);

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      const cellClues = CLUES.filter(
        (clue) => clue.startRow === r && clue.startCol === c
      );

      if (cellClues.length > 0) {
        const currentClue = cellClues.find(
          (clue) => clue.direction === direction
        );
        const oppositeClue = cellClues.find(
          (clue) => clue.direction !== direction
        );

        if (selectedClue === currentClue?.number && oppositeClue) {
          setDirection(oppositeClue.direction);
          setSelectedClue(oppositeClue.number);
        } else if (currentClue) {
          setDirection(currentClue.direction);
          setSelectedClue(currentClue.number);
        }
      } else {
        const belongsTo = CLUES.find((clue) => {
          const cells = getWordCells(clue.number, clue.direction);
          return cells.some(([wr, wc]) => wr === r && wc === c);
        });

        if (belongsTo) {
          setDirection(belongsTo.direction);
          setSelectedClue(belongsTo.number);
        }
      }

      setActiveCell([r, c]);
      inputRefs.current[r][c]?.focus();
    },
    [direction, selectedClue, getWordCells]
  );

  const handleClueClick = useCallback(
    (clueNumber: number, dir: "across" | "down") => {
      setSelectedClue(clueNumber);
      setDirection(dir);

      const clue = CLUES.find(
        (c) => c.number === clueNumber && c.direction === dir
      );
      if (clue) {
        setActiveCell([clue.startRow, clue.startCol]);
        inputRefs.current[clue.startRow][clue.startCol]?.focus();
      }
    },
    [CLUES]
  );

  const getHint = useCallback(
    (clueNumber: number) => {
      if (usedHints.has(clueNumber)) return;

      const clue = CLUES.find(
        (c) => c.number === clueNumber && c.direction === direction
      );
      if (!clue) return;

      const cells = getWordCells(clueNumber, clue.direction);
      const emptyCell = cells.find(([r, c]) => !userInput[r][c]);

      if (emptyCell) {
        const [r, c] = emptyCell;
        const updated = userInput.map((row) => [...row]);
        updated[r][c] = GRID[r][c]?.answer || "";
        setUserInput(updated);
        setLetterPop(`${r}-${c}-hint`);
        setTimeout(() => setLetterPop(""), 800);
        setUsedHints((prev) => new Set([...prev, clueNumber]));
      }
    },
    [userInput, getWordCells, usedHints, direction, GRID]
  );

  const getCellHighlight = useCallback(
    (r: number, c: number) => {
      if (!activeCell || !selectedClue) return "";

      const [activeR, activeC] = activeCell;

      if (r === activeR && c === activeC) {
        return "ring-2 lg:ring-4 ring-saffron-500 bg-gradient-to-br from-yellow-200 via-saffron-200 to-orange-200 shadow-xl transform scale-105 lg:scale-110 border-saffron-600";
      }

      const cells = getWordCells(selectedClue, direction);
      if (cells.some(([wr, wc]) => wr === r && wc === c)) {
        return "bg-gradient-to-r from-yellow-100 via-saffron-100 to-orange-100 shadow-md lg:shadow-lg border-saffron-400";
      }

      return "";
    },
    [activeCell, selectedClue, direction, getWordCells]
  );

  const progress = useCallback(() => {
    const totalCells = GRID.flat().filter(
      (cell) => cell?.answer && !cell?.isBlocked
    ).length;
    const filledCells = userInput
      .flat()
      .filter((cell): cell is string => cell !== null && cell !== "").length;
    return Math.round((filledCells / totalCells) * 100);
  }, [userInput, GRID]);

  const handleReset = useCallback(() => {
    setUserInput(
      GRID.map((row) =>
        row.map((cell) => (cell?.answer && !cell?.isBlocked ? "" : null))
      )
    );
    setCompletedWords(new Set());
    setUsedHints(new Set());
    setActiveCell(null);
    setSelectedClue(null);
    setShowResult(false);
    setShowSuccessModal(false);
  }, [GRID]);

  useEffect(() => {
    checkWordCompletion();
  }, [checkWordCompletion]);

  const acrossClues = CLUES.filter((clue) => clue.direction === "across");
  const downClues = CLUES.filter((clue) => clue.direction === "down");

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-saffron-50 to-orange-50 relative overflow-hidden">
      {/* Success Modal */}
      <SuccessModal
        puzzleType={puzzleType!}
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        currentDifficulty={selectedDifficulty}
        onReset={handleReset}
        navigate={navigate}
      />

      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs - responsive positioning */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-gradient-to-r from-saffron-300/30 to-yellow-300/30 rounded-full opacity-60 animate-pulse blur-xl"></div>
        <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24 bg-gradient-to-r from-orange-400/40 to-saffron-400/40 rounded-full opacity-50 animate-bounce blur-lg"></div>
        <div className="absolute bottom-16 sm:bottom-32 left-1/4 w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 bg-gradient-to-r from-yellow-200/25 to-saffron-200/25 rounded-full opacity-40 animate-pulse blur-2xl"></div>
        <div className="absolute top-1/2 right-5 sm:right-10 w-10 sm:w-16 lg:w-20 h-10 sm:h-16 lg:h-20 bg-gradient-to-r from-saffron-300/35 to-orange-300/35 rounded-full opacity-45 blur-lg"></div>

        {/* Celebration sparkles */}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute w-6 sm:w-8 lg:w-12 h-6 sm:h-8 lg:h-12 text-saffron-400 animate-bounce pointer-events-none text-xl sm:text-2xl lg:text-4xl opacity-90"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${Math.random() * 2}s`,
              filter: "drop-shadow(0 0 8px rgba(255, 171, 0, 0.7))",
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8 relative z-10">
        {/* Enhanced Header - Responsive */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black bg-gradient-to-r from-saffron-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent mb-4 sm:mb-6 drop-shadow-2xl">
            🧩 WORD WIZARD 🧩
          </h1>
          <div className="bg-gradient-to-r from-white via-yellow-50 to-saffron-50 rounded-full px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-6 inline-block shadow-2xl border-2 sm:border-4 border-saffron-300 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/10 to-saffron-200/10 rounded-full"></div>
            <div className="relative z-10">
              <span className="text-saffron-700 font-black text-sm sm:text-lg lg:text-2xl block mb-1 sm:mb-2">
                🎯 Progress: {progress()}% 🎯
              </span>
              <div className="w-32 sm:w-40 lg:w-48 h-2 sm:h-3 lg:h-4 bg-gradient-to-r from-saffron-100 to-yellow-100 rounded-full shadow-inner border border-saffron-200">
                <div
                  className="h-full bg-gradient-to-r from-saffron-500 via-yellow-400 to-orange-500 rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden"
                  style={{ width: `${progress()}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Clue Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6 lg:hidden">
          <button
            onClick={() =>
              setShowClues((prev) => ({ ...prev, across: !prev.across }))
            }
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
              showClues.across
                ? "bg-saffron-500 text-green-400 shadow-lg"
                : "bg-white text-saffron-600 border-2 border-saffron-300 text-black"
            }`}
          >
            ➡️ Across ({acrossClues.length})
          </button>
          <button
            onClick={() =>
              setShowClues((prev) => ({ ...prev, down: !prev.down }))
            }
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
              showClues.down
                ? "bg-saffron-500 text-green-400 shadow-lg"
                : "bg-white text-saffron-600 border-2 border-saffron-300 text-black"
            }`}
          >
            📝 Down ({downClues.length})
          </button>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {/* Mobile Clue Sections */}
          <div className="lg:hidden space-y-4">
            {/* Across Clues Mobile */}
            {showClues.across && (
              <div className="animate-slideDown">
                <ClueSection
                  title="➡️ ACROSS CLUES"
                  clues={acrossClues}
                  selectedClue={selectedClue}
                  direction={direction}
                  completedWords={completedWords}
                  handleClueClick={handleClueClick}
                  getHint={getHint}
                  currentDirection="across"
                />
              </div>
            )}

            {/* Down Clues Mobile */}
            {showClues.down && (
              <div className="animate-slideDown">
                <ClueSection
                  title="📝 DOWN CLUES"
                  clues={downClues}
                  selectedClue={selectedClue}
                  direction={direction}
                  completedWords={completedWords}
                  handleClueClick={handleClueClick}
                  getHint={getHint}
                  currentDirection="down"
                />
              </div>
            )}
          </div>

          {/* Desktop Down Clues */}
          <div className="hidden lg:block lg:col-span-3">
            <ClueSection
              title="📝 DOWN CLUES"
              clues={downClues}
              selectedClue={selectedClue}
              direction={direction}
              completedWords={completedWords}
              handleClueClick={handleClueClick}
              getHint={getHint}
              currentDirection="down"
            />
          </div>

          {/* Game Board */}
          <div className="lg:col-span-6 flex flex-col items-center px-2 sm:px-4">
            <div className="w-full flex justify-center">
              <div className="max-w-full overflow-hidden">
                <GameBoard
                  grid={GRID}
                  userInput={userInput}
                  letterPop={letterPop}
                  showResult={showResult}
                  inputRefs={inputRefs}
                  getCellHighlight={getCellHighlight}
                  isCorrect={isCorrectCell}
                  handleCellClick={handleCellClick}
                  handleChange={handleChange}
                  handleKeyDown={handleKeyDown}
                />
              </div>
            </div>

            {/* Enhanced Action Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8 lg:mt-12 w-full px-4">
              <button
                onClick={() => setShowResult(true)}
                className="group relative px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 bg-gradient-to-r from-saffron-500 via-yellow-500 to-orange-500 text-white text-sm sm:text-lg lg:text-xl font-black rounded-full hover:from-saffron-600 hover:via-yellow-600 hover:to-orange-600 transform hover:scale-105 lg:hover:scale-110 transition-all duration-300 shadow-xl lg:shadow-2xl hover:shadow-saffron-500/50 border-2 lg:border-4 border-white overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2 lg:space-x-3">
                  <span className="text-lg sm:text-xl lg:text-3xl">🔍</span>
                  <span className="hidden sm:inline">CHECK ANSWERS</span>
                  <span className="sm:hidden">CHECK</span>
                  <span className="text-lg sm:text-xl lg:text-3xl">✨</span>
                </span>
              </button>

              <button
                onClick={handleReset}
                className="group relative px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 bg-gradient-to-r from-yellow-500 via-saffron-500 to-orange-500 text-white text-sm sm:text-lg lg:text-xl font-black rounded-full hover:from-yellow-600 hover:via-saffron-600 hover:to-orange-600 transform hover:scale-105 lg:hover:scale-110 transition-all duration-300 shadow-xl lg:shadow-2xl hover:shadow-yellow-500/50 border-2 lg:border-4 border-white overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2 lg:space-x-3">
                  <span className="text-lg sm:text-xl lg:text-3xl">🔄</span>
                  <span className="hidden sm:inline">RESET PUZZLE</span>
                  <span className="sm:hidden">RESET</span>
                  <span className="text-lg sm:text-xl lg:text-3xl">🎯</span>
                </span>
              </button>
            </div>

            {/* Enhanced Result Display - Responsive */}
            {showResult && !allCorrect && (
              <div className="text-center mt-8 lg:mt-12 animate-fadeIn px-4">
                <div className="bg-gradient-to-r from-saffron-500 via-yellow-500 to-orange-500 text-white border-2 sm:border-4 border-saffron-300 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden backdrop-blur-sm max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10"></div>
                  <div className="relative z-10">
                    <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 lg:mb-8 animate-pulse filter drop-shadow-lg">
                      🎯⚡🔥
                    </div>
                    <div className="text-xl sm:text-2xl lg:text-4xl font-black mb-3 sm:mb-4 lg:mb-6 drop-shadow-lg">
                      Keep Going, Word Wizard!
                    </div>
                    <div className="text-sm sm:text-base lg:text-xl opacity-90 font-semibold">
                      Some words still await your magic! You're doing great! ✨
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Across Clues */}
          <div className="hidden lg:block lg:col-span-3">
            <ClueSection
              title="➡️ ACROSS CLUES"
              clues={acrossClues}
              selectedClue={selectedClue}
              direction={direction}
              completedWords={completedWords}
              handleClueClick={handleClueClick}
              getHint={getHint}
              currentDirection="across"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossWordPuzzle;
