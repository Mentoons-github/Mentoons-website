import postScore from "@/api/game/postScore";
import HowToPlay from "@/components/adda/game/howToPlay/howToPlay";
import OddOneOutDifficulty from "@/components/adda/games/OddOneOut/OddOneOutDifficulty";
import OddOneOutFinalScore from "@/components/adda/games/OddOneOut/OddOneOutFinalScor";
import OddOneOutPuzzle from "@/components/adda/games/OddOneOut/OddOneOutPuzzle";
import OddOneOutStartScreen from "@/components/adda/games/OddOneOut/OddOneOutStarterScreen";
import { GAME_INSTRUCTIONS } from "@/constant/adda/game/instructions";
import { IMAGE_SETS } from "@/constant/games/OddOneOutImages";
import { useCountdown } from "@/hooks/adda/OneOddOutTimet";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BiBulb } from "react-icons/bi";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export type Difficulty = "easy" | "medium" | "hard";

const LEVEL_CONFIG = {
  easy: { grid: 4, time: 25 },
  medium: { grid: 9, time: 18 },
  hard: { grid: 16, time: 12 },
};

export type ImagePair = { normal: string; odd: string };
export type Card = { id: number; isOdd: boolean; img: string };

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateOddGrid(
  totalCards: number,
  normalImg: string,
  oddImg: string
): Card[] {
  const oddIndex = Math.floor(Math.random() * totalCards);

  return Array.from({ length: totalCards }, (_, i) => ({
    id: i,
    isOdd: i === oddIndex,
    img: i === oddIndex ? oddImg : normalImg,
  }));
}

const OddOneOut = () => {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState<Difficulty | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultType, setResultType] = useState<
    "correct" | "wrong" | "timeover" | null
  >(null);
  const [isInstructionOpen, setInstructionOpen] = useState(false);
  const [shuffledImages, setShuffledImages] = useState<ImagePair[]>([]);
  const [totalRounds, setTotalRounds] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [completeSend, setCompleteSend] = useState(false);
  const navigate = useNavigate();
  const grid = level ? LEVEL_CONFIG[level].grid : 0;
  const time = level ? LEVEL_CONFIG[level].time : 0;

  const TOTAL_ROUNDS = totalRounds;
  const currentSet = shuffledImages[round];

  const timer = useCountdown(time, handleTimeOver, round);

  const { getToken } = useAuth();

  const gameId = `odd_one_out${level}`;

  const gameInstructions = GAME_INSTRUCTIONS.find(
    (inst) =>
      inst.game.toLowerCase().replace(/_/g, "").replace(/\s+/g, "") ===
      "oddoneout"
  );

  function handleTimeOver() {
    setResultType("timeover");
    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      goNextRound();
    }, 1200);
  }

  useEffect(() => {
    if (!level) return;

    const shuffled = shuffle(IMAGE_SETS[level]);
    setShuffledImages(shuffled);
    setTotalRounds(shuffled.length);
    setRound(0);
    setScore(0);
    setGameOver(false);

    setGameStarted(true);
  }, [level]);

  useEffect(() => {
    if (!currentSet) return;
    const data = generateOddGrid(grid, currentSet.normal, currentSet.odd);
    setCards(data);
  }, [currentSet, grid]);

  function handleSelect(card: Card) {
    if (showResult) return;

    if (card.isOdd) {
      setScore((s) => s + 1);
      setResultType("correct");
    } else {
      setResultType("wrong");
    }

    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      goNextRound();
    }, 1000);
  }

  function goNextRound() {
    setRound((r) => {
      if (TOTAL_ROUNDS === 0) return r; // ✅ Guard against uninitialized state
      if (r + 1 >= TOTAL_ROUNDS) {
        setGameOver(true);
        return r;
      }
      return r + 1;
    });
  }

  const onReset = () => {
    if (!level) return;
    setShuffledImages(shuffle(IMAGE_SETS[level]));
    setRound(0);
    setScore(0);
    setGameOver(false);
    setLevel(null);
  };

  const sendResult = async () => {
    setCompleteSend(true);
    try {
      const success = score === TOTAL_ROUNDS;
      postScore({
        body: { gameId, difficulty: level as string, score, success },
        token: (await getToken()) || "",
      });
    } catch (error) {
      console.log(error as string);
    }
  };

  if (gameOver && level) {
    if (!completeSend) {
      sendResult();
    }
    return (
      <OddOneOutFinalScore
        score={score}
        total={TOTAL_ROUNDS}
        level={level}
        onReset={onReset}
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
      {!started && <OddOneOutStartScreen onStart={() => setStarted(true)} />}

      {started && !level && <OddOneOutDifficulty setDifficulty={setLevel} />}

      {started && level && gameStarted && TOTAL_ROUNDS > 0 && (
        <OddOneOutPuzzle
          TOTAL_ROUNDS={TOTAL_ROUNDS}
          cards={cards}
          grid={grid}
          handleSelect={handleSelect}
          round={round}
          score={score}
          timer={timer}
          showResult={showResult}
          resultType={resultType}
        />
      )}
    </div>
  );
};

export default OddOneOut;
