import postScore from "@/api/game/postScore";
import HowToPlay from "@/components/adda/game/howToPlay/howToPlay";
import ColorTubeDifficulty from "@/components/adda/games/ColorTube/ColorTubeDifficulty";
import ColorTubeFinalScore from "@/components/adda/games/ColorTube/ColorTubeFinalScore";
import ColorTubePuzzles from "@/components/adda/games/ColorTube/ColorTubePuzzles";
import ColorTubeStartScreen from "@/components/adda/games/ColorTube/ColorTubeStarterScreen";
import RewardPointsModal from "@/components/modals/candyCoin";
import { GAME_INSTRUCTIONS } from "@/constant/adda/game/instructions";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BiBulb } from "react-icons/bi";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export type Level = "easy" | "medium" | "hard";
export type Color = "red" | "blue" | "yellow" | "green" | "purple" | "orange";

const TUBE_CAPACITY = 4;

const DIFFICULTY_CONFIG: Record<
  Level,
  { colors: Color[]; tubes: number; moveLimit: number; points: number }
> = {
  easy: {
    colors: ["red", "blue", "yellow"],
    tubes: 4,
    moveLimit: 20,
    points: 10,
  },
  medium: {
    colors: ["red", "blue", "yellow", "green", "purple"],
    tubes: 6,
    moveLimit: 25,
    points: 10,
  },
  hard: {
    colors: ["red", "blue", "yellow", "green", "purple", "orange"],
    tubes: 7,
    moveLimit: 30,
    points: 10,
  },
};

const generateLevel = (difficulty: Level): Color[][] => {
  const { colors, tubes } = DIFFICULTY_CONFIG[difficulty];
  const pool: Color[] = colors.flatMap((c) => Array(TUBE_CAPACITY).fill(c));

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const result: Color[][] = Array.from({ length: tubes }, () => []);
  pool.forEach((color, i) => result[i % tubes].push(color));
  result.push([]);

  return result;
};

const ColorTubeGame = () => {
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Level | null>(null);
  const [tubes, setTubes] = useState<Color[][]>([]);
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [level, setLevel] = useState(1);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [completeSend, setCompleteSend] = useState(false);
  const [rewardPoints, setRewardPoints] = useState<number | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [isInstructionOpen, setInstructionOpen] = useState(false);
  const navigate = useNavigate();
  const totalScore = difficulty ? 10 * DIFFICULTY_CONFIG[difficulty].points : 0;

  const { getToken } = useAuth();

  const gameId = `colorTube${difficulty}`;

  const gameInstructions = GAME_INSTRUCTIONS.find(
    (inst) =>
      inst.game.toLowerCase().replace(/_/g, "").replace(/\s+/g, "") ===
      "colourtube"
  );

  useEffect(() => {
    if (!difficulty) return;

    if (level > 10) {
      setShowFinalScore(true);
      return;
    }

    setTubes(generateLevel(difficulty));
    setMoves(0);
    setWon(false);
    setGameOver(false);
    setSelectedTube(null);
  }, [difficulty, level]);

  const nextLevel = (pointsEarned: number) => {
    setTimeout(() => {
      setScore((s) => s + pointsEarned);
      setLevel((l) => l + 1);
    }, 1200);
  };

  const handleTubeClick = (index: number) => {
    if (won || gameOver) return;

    if (selectedTube === null) {
      setSelectedTube(index);
      return;
    }

    if (selectedTube === index) {
      setSelectedTube(null);
      return;
    }

    const newTubes = structuredClone(tubes);
    const from = newTubes[selectedTube];
    const to = newTubes[index];

    if (!from.length || to.length >= TUBE_CAPACITY) {
      setSelectedTube(null);
      return;
    }

    const color = from[from.length - 1];

    if (to.length === 0 || to[to.length - 1] === color) {
      to.push(color);
      from.pop();
      setMoves((m) => m + 1);
    }

    setTubes(newTubes);
    setSelectedTube(null);
  };

  useEffect(() => {
    if (!difficulty) return;

    if (moves >= DIFFICULTY_CONFIG[difficulty].moveLimit) {
      setGameOver(true);
      nextLevel(0);
    }
  }, [moves]);

  useEffect(() => {
    const isWin = tubes.every(
      (tube) =>
        tube.length === 0 ||
        (tube.length === TUBE_CAPACITY && tube.every((c) => c === tube[0]))
    );

    if (isWin && difficulty && !won) {
      setWon(true);
      nextLevel(DIFFICULTY_CONFIG[difficulty].points);
    }
  }, [tubes]);

  const goToNextLevel = () => {
    setLevel((l) => l + 1);
  };

  const resetGame = () => {
    setCompleteSend(false);
    setStarted(true);
    setDifficulty(null);
    setLevel(1);
    setScore(0);
    setShowFinalScore(false);
  };

  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
    setRewardPoints(null);
  };

  const sendResult = async () => {
    setCompleteSend(true);

    if (!difficulty) return;
    try {
      const maxScore = 10 * DIFFICULTY_CONFIG[difficulty].points;
      const success = score === maxScore;
      const response = await postScore({
        body: { gameId, difficulty: difficulty as string, score, success },
        token: (await getToken()) || "",
      });

      if (response?.rewardPoints) {
        setRewardPoints(response.rewardPoints);
        setShowRewardModal(true);
      }
    } catch (error) {
      console.log(error as string);
    }
  };

  // ✅ FINAL SCORE SCREEN
  if (showFinalScore) {
    if (!completeSend) {
      sendResult();
    }
    return (
      <ColorTubeFinalScore
        restart={resetGame}
        score={score}
        totalScore={totalScore}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <HowToPlay
        instructions={gameInstructions?.steps || []}
        isModalOpen={isInstructionOpen}
        setClose={() => setInstructionOpen(false)}
      />
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-50 flex items-center justify-between gap-2">
        <button
          onClick={() => navigate("/adda/game-lobby")}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm shadow-md hover:bg-black/40 transition-all flex-shrink-0"
        >
          <FaChevronLeft className="text-white text-xl sm:text-2xl" />
        </button>

        <button
          onClick={() => setInstructionOpen(true)}
          className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-md text-white font-bold py-2 px-3 sm:py-2.5 sm:px-4 md:px-6 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg cursor-pointer hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-blue-400/30 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 flex-shrink-0"
        >
          <span className="hidden xs:inline sm:inline">How To Play</span>
          <span className="inline xs:hidden sm:hidden">Help</span>
          <BiBulb className="text-base sm:text-xl animate-pulse" />
        </button>
      </div>
      {!started && <ColorTubeStartScreen onStart={() => setStarted(true)} />}

      {started && !difficulty && (
        <ColorTubeDifficulty setDifficulty={setDifficulty} />
      )}

      {started && difficulty && (
        <ColorTubePuzzles
          tubes={tubes}
          selectedTube={selectedTube}
          handleTubeClick={handleTubeClick}
          moves={moves}
          moveLimit={DIFFICULTY_CONFIG[difficulty].moveLimit}
          won={won}
          gameOver={gameOver}
          level={level}
          difficulty={difficulty}
          TUBE_CAPACITY={TUBE_CAPACITY}
          onNextLevel={goToNextLevel} // ✅
          onReset={resetGame}
        />
      )}

      {showRewardModal && rewardPoints !== null && (
        <RewardPointsModal
          rewardPoints={rewardPoints}
          onClose={handleCloseRewardModal}
        />
      )}
    </div>
  );
};

export default ColorTubeGame;
