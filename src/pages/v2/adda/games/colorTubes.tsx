import postScore from "@/api/game/postScore";
import ColorTubeDifficulty from "@/components/adda/games/ColorTube/ColorTubeDifficulty";
import ColorTubeFinalScore from "@/components/adda/games/ColorTube/ColorTubeFinalScore";
import ColorTubePuzzles from "@/components/adda/games/ColorTube/ColorTubePuzzles";
import ColorTubeStartScreen from "@/components/adda/games/ColorTube/ColorTubeStarterScreen";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

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

// ✅ RANDOM LEVEL GENERATOR
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

  const totalScore = difficulty ? 10 * DIFFICULTY_CONFIG[difficulty].points : 0;

  const { getToken } = useAuth();

  const gameId = `colorTube${difficulty}`;

  // ✅ LOAD LEVEL
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

  // ✅ MOVE LIMIT → NEXT LEVEL WITH 0 POINTS
  useEffect(() => {
    if (!difficulty) return;

    if (moves >= DIFFICULTY_CONFIG[difficulty].moveLimit) {
      setGameOver(true);
      nextLevel(0);
    }
  }, [moves]);

  // ✅ WIN → NEXT LEVEL WITH POINTS
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

  const sendResult = async () => {
    setCompleteSend(true);
    try {
      postScore({
        body: { gameId, difficulty: difficulty as string, score },
        token: (await getToken()) || "",
      });
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
    </div>
  );
};

export default ColorTubeGame;
