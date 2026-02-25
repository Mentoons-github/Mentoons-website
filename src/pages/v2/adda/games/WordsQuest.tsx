import { CurrentState } from "@/types/adda/game";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import HowToPlay from "@/components/adda/game/howToPlay/howToPlay";
import { FaChevronLeft } from "react-icons/fa6";
import { BiBulb } from "react-icons/bi";
import { useStatusModal } from "@/context/adda/statusModalContext";
import RewardPointsModal from "@/components/modals/candyCoin";
import postScore from "@/api/game/postScore";
import { GAME_INSTRUCTIONS } from "@/constant/adda/game/instructions";
import PatternRaceResultScreen from "@/components/adda/game/patternRace/resultScreen";
import WordsQuestLobby from "@/components/adda/game/wordsquest/WordsQuestLobby";
import WordsQuestPlayzone from "@/components/adda/game/wordsquest/WordsQuestPlayzone";

const WordsQuest = () => {
  const GAME_TIME = 60;

  const [timer, setTimer] = useState(GAME_TIME);
  const [gameOver, setGameOver] = useState(false);
  const { showStatus } = useStatusModal();
  const [currentState, setCurrentState] = useState<CurrentState>("lobby");
  const [finalScore, setFinalScore] = useState(0);
  const [rewardPoints, setRewardPoints] = useState<number | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [isInstructionOpen, setInstructionOpen] = useState(false);
  const [roundCount, setRoundCount] = useState<number>(0);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentState !== "play" || gameOver) return;

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentState, gameOver]);

  const gameId = `words_quest_`;

  const gameInstructions = GAME_INSTRUCTIONS.find(
    (inst) =>
      inst.game.toLowerCase().replace(/_/g, "").replace(/\s+/g, "") ===
      "patternrace",
  );

  const handleGameComplete = async (score: number) => {
    setFinalScore(score);
    setCurrentState("result");

    if (score > 70) {
      try {
        const token = await getToken();
        if (token) {
          const success = score > 0;
          const response = await postScore({
            body: { score, gameId, difficulty: "noDifficulty", success },
            token,
          });
          if (response?.rewardPoints) {
            setRewardPoints(response.rewardPoints);
            setShowRewardModal(true);
          }
        }
      } catch (error: unknown) {
        showStatus("error", error as string);
      }
    }
  };

  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
    setRewardPoints(null);
  };

  const handlePlayAgain = () => {
    setFinalScore(0);
    setCurrentState("lobby");
  };

  const startGame = () => {
    setTimer(GAME_TIME);
    setGameOver(false);
    setFinalScore(0);
    setCurrentState("play");
  };

  const goToLobby = () => {
    setCurrentState("lobby");
  };

  return (
    <>
      <HowToPlay
        instructions={gameInstructions?.steps || []}
        isModalOpen={isInstructionOpen}
        setClose={() => setInstructionOpen(false)}
      />

      <div className="absolute top-10 md:top-14 lg:top-10 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-50 flex items-center justify-between gap-2">
        <button
          onClick={() => setCurrentState("lobby")}
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

      {currentState === "lobby" && (
        <WordsQuestLobby showDifficultyModal={() => startGame()} />
      )}

      {currentState === "play" && (
        <WordsQuestPlayzone
          difficulty={"hard"}
          timer={timer}
          timeOver={timer <= 0}
          onGameComplete={handleGameComplete}
          increaseRoundCount={() => setRoundCount((prev) => prev + 1)}
        />
      )}

      {/* {currentState === "result" && (
        <PatternRaceResultScreen
          score={finalScore}
          difficulty={difficulty}
          totalRounds={roundCount}
          totalTime={60}
          onPlayAgain={handlePlayAgain}
          goToLobby={goToLobby}
        />
      )} */}

      {showRewardModal && rewardPoints !== null && (
        <RewardPointsModal
          rewardPoints={rewardPoints}
          onClose={handleCloseRewardModal}
        />
      )}
    </>
  );
};

export default WordsQuest;
