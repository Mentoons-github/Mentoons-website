import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import VictoryModal from "@/components/puzzle/victoryModal";
import GameGrid from "@/components/puzzle/gameGrid";
import ProgressControl from "@/components/puzzle/progressControl";
import AnimatedBG from "@/components/puzzle/animation/puzzleContent";
import CelebrationAnimation from "@/components/puzzle/animation/celebrationAnimation";
import SideTab from "@/components/puzzle/sideTab";
import { PUZZLE_DIFFICULTY } from "@/constant/puzzle/puzzleDifficulties";
import axiosInstance from "@/api/axios";
import RewardProgressBar from "@/components/rewards/RewardProgressBar";
import { useAuth } from "@clerk/clerk-react";
import { canPlaceItem, formatTime, getItemPositions, getLinePath, placeItem } from "@/services/puzzleService";

interface Position {
  row: number;
  col: number;
}

export interface WordPosition {
  row: number;
  col: number;
  direction: "horizontal" | "vertical";
}

const KidsWordSearch: React.FC = () => {
  const location = useLocation();
  const { getToken } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const difficulty = queryParams.get("difficulty") as
    | "Easy"
    | "Medium"
    | "Hard"
    | null;
  const puzzleType = queryParams.get("puzzleType") as
    | "socialMedia"
    | "career"
    | "icons"
    | null;

  const selectedDifficulty = difficulty || "Easy";
  const selectedPuzzleType = puzzleType || "icons";

  const puzzleData =
    PUZZLE_DIFFICULTY[
      selectedDifficulty.toLowerCase() as keyof typeof PUZZLE_DIFFICULTY
    ];
  const puzzleItems: string[] = puzzleData
    ? puzzleData[selectedPuzzleType as "socialMedia" | "career" | "icons"].data
    : PUZZLE_DIFFICULTY.easy.icons.data;

  // Set grid size based on difficulty
  const baseSize = {
    Easy: 10,
    Medium: 10,
    Hard: 10,
  };

  const difficultyMultiplier = {
    Easy: 1,
    Medium: 1.25,
    Hard: 1.5,
  };

  const pointsConfig: Record<string, number> = {
    Easy: 5,
    Medium: 10,
    Hard: 15,
  };

  const wordCount = puzzleItems.length;
  const maxWordLength = Math.max(
    ...puzzleItems.map((word: string) => word.length)
  );

  const rawSize = Math.sqrt(wordCount * maxWordLength);
  const adjustedSize = rawSize * difficultyMultiplier[selectedDifficulty];
  const gridSize = Math.max(
    baseSize[selectedDifficulty],
    Math.ceil(adjustedSize)
  );

  const [foundItems, setFoundItems] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Position | null>(null);
  const [currentDragPath, setCurrentDragPath] = useState<string[]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [itemPositions, setItemPositions] = useState<
    Record<string, WordPosition>
  >({});
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [showFailureModal, setShowFailureModal] = useState<boolean>(false);
  const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);

  const getRandomLetter = (): string =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26));

  const createGrid = (): void => {
    const newGrid: string[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill("")
    );
    const newItemPositions: Record<string, WordPosition> = {};

    puzzleItems.forEach((item) => {
      let placed = false;
      let attempts = 0;
      const itemChars = item.split("");

      while (!placed && attempts < 300) {
        const directions = ["horizontal", "vertical"] as const;
        const direction =
          directions[Math.floor(Math.random() * directions.length)];
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);

        if (canPlaceItem(newGrid, itemChars, row, col, direction, gridSize)) {
          placeItem(newGrid, itemChars, row, col, direction);
          newItemPositions[item] = { row, col, direction };
          placed = true;
        }
        attempts++;
      }
    });

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (newGrid[i][j] === "") {
          newGrid[i][j] = getRandomLetter();
        }
      }
    }

    setGrid(newGrid);
    setItemPositions(newItemPositions);
    setTimeLeft(180); // Reset timer on new grid
    setIsTimerActive(true); // Start timer
    setFoundItems(new Set()); // Reset found items
    setShowFailureModal(false); // Reset failure modal
  };


  useEffect(() => {
    createGrid();
  }, [selectedDifficulty, selectedPuzzleType]);

  // Timer effect
  useEffect(() => {
    if (!isTimerActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          if (foundItems.size < puzzleItems.length) {
            setShowFailureModal(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive]);

  useEffect(() => {
    if (foundItems.size === puzzleItems.length && isTimerActive) {
      setShowCelebration(true);
      setIsTimerActive(false);
      setTimeout(() => setShowCelebration(false), 3000);
      awardPoints();
    }
  }, [foundItems, puzzleItems]);

  const awardPoints = async () => {
    if (foundItems.size !== puzzleItems.length || !isTimerActive) return;

    const points = pointsConfig[selectedDifficulty];
    const reference = `wordsearch_${selectedDifficulty}_${Date.now()}`;
    const modifiedRequest = {
      eventType: "wordsearch_completion_perfect",
      reference,
      description: `Earned ${points} points for perfect ${selectedDifficulty} word search completion`,
    };

    try {
      const token = await getToken();
      if (!token) {
        setErrorMessage("You must be logged in to earn points");
        setShowRewardModal(true);
        return;
      }

      const response = await axiosInstance.post(
        "/api/v1/rewards/add-points",
        modifiedRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setPointsAwarded(points);
        setShowRewardModal(true);
      } else {
        setErrorMessage(response.data.message || "Failed to award points");
        setShowRewardModal(true);
      }
    } catch (error: any) {
      console.error("Error awarding points:", error);
      setErrorMessage(error.response?.data?.message || "Error awarding points");
      setShowRewardModal(true);
    }
  };

  const handleMouseDown = (row: number, col: number): void => {
    if (!isTimerActive) return; // Prevent interaction after timer ends
    setIsDragging(true);
    setDragStart({ row, col });
    setCurrentDragPath([`${row}-${col}`]);
  };

  const handleMouseEnter = (row: number, col: number): void => {
    if (isDragging && dragStart && isTimerActive) {
      const path = getLinePath(dragStart, { row, col });
      setCurrentDragPath(path);
    }
  };

  const handleMouseUp = (): void => {
    if (isDragging && currentDragPath.length > 0 && isTimerActive) {
      checkForItemInPath();
    }
    setIsDragging(false);
    setDragStart(null);
    setCurrentDragPath([]);
  };

  const checkForItemInPath = (): void => {
    const pathLetters = currentDragPath
      .map((cellKey) => {
        const [row, col] = cellKey.split("-").map(Number);
        return grid[row] && grid[row][col] ? grid[row][col] : "";
      })
      .join("");

    const reversedPathLetters = pathLetters.split("").reverse().join("");

    puzzleItems.forEach((item) => {
      if (
        !foundItems.has(item) &&
        (pathLetters === item || reversedPathLetters === item)
      ) {
        setFoundItems((prev) => new Set([...prev, item]));
      }
    });
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <AnimatedBG />
      {showCelebration && <CelebrationAnimation />}
      <motion.div
        className="fixed top-30 right-20 mt-10 ml-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 via-red-600 to-orange-500 rounded-full shadow-lg px-4 py-2 border-2 border-white/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <motion.p
            className="text-xl font-bold text-white"
            key={timeLeft}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {formatTime(timeLeft)}
          </motion.p>
        </div>
      </motion.div>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 max-w-7xl w-full">
          <motion.div
            className="lg:w-1/3"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <SideTab foundWords={foundItems} puzzleWords={puzzleItems} />
          </motion.div>
          <GameGrid
            currentDragPath={currentDragPath}
            foundWords={foundItems}
            getWordPositions={getItemPositions}
            grid={grid}
            handleMouseDown={handleMouseDown}
            handleMouseEnter={handleMouseEnter}
            handleMouseUp={handleMouseUp}
            wordPositions={itemPositions}
          />
          <ProgressControl
            createGrid={createGrid}
            foundWords={foundItems}
            puzzleWords={puzzleItems}
            setFoundWords={setFoundItems}
          />
        </div>
      </div>
      {foundItems.size === puzzleItems.length && (
        <VictoryModal
          puzzleType={puzzleType}
          selectedDifficulty={selectedDifficulty}
          createGrid={createGrid}
          setFoundWords={setFoundItems}
        />
      )}
      {showRewardModal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-lg p-6 max-w-md w-full z-50"
        >
          {pointsAwarded ? (
            <>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3 animate-bounce">🎉</div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  Your Reward Progress
                </h3>
              </div>

              <div className="text-center mb-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <p className="text-gray-700 leading-relaxed font-medium">
                  You earned{" "}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg transform -rotate-1">
                    {pointsAwarded} points
                  </span>{" "}
                  for completing the{" "}
                  <span className="font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md">
                    {selectedDifficulty}
                  </span>{" "}
                  word search perfectly!
                </p>
              </div>

              <div className="mb-6 bg-gray-50 rounded-xl p-4">
                <RewardProgressBar showLabel={true} />
              </div>

              <button
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white font-semibold rounded-xl 
              shadow-lg hover:shadow-xl hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 
              transform hover:-translate-y-0.5 transition-all duration-200 
              focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
                onClick={() => setShowRewardModal(false)}
              >
                <span className="flex items-center justify-center">
                  Close
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              </button>
            </>
          ) : (
            <>
              <p className="text-center text-red-500 mb-4">
                {errorMessage || "Unable to award points at this time."}
              </p>
              <button
                className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => setShowRewardModal(false)}
              >
                Close
              </button>
            </>
          )}
        </motion.div>
      )}
      {showFailureModal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-lg p-6 max-w-md w-full z-50"
        >
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">😔</div>
            <h3 className="text-2xl font-bold text-red-600 mb-3">Time's Up!</h3>
            <p className="text-gray-700 leading-relaxed font-medium">
              You didn't complete the word search in time. Try again to earn
              those points!
            </p>
          </div>
          <button
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl 
            shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 
            transform hover:-translate-y-0.5 transition-all duration-200 
            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            onClick={() => {
              setShowFailureModal(false);
              createGrid();
            }}
          >
            Try Again
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default KidsWordSearch;
