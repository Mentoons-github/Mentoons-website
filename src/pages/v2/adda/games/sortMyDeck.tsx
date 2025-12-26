import ResultScreen from "@/components/adda/game/brainStack/result";
import GameDifficultyModal from "@/components/adda/game/difficultyModal";
import HowToPlay from "@/components/adda/game/howToPlay/howToPlay";
import RewardPointsModal from "@/components/modals/candyCoin";
import { BiBulb } from "react-icons/bi";
import { FaChevronLeft } from "react-icons/fa6";
import { Difficulty } from "./OddOneOut";
import postScore from "@/api/game/postScore";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { useState } from "react";
import { CurrentState } from "@/types/adda/game";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { GAME_INSTRUCTIONS } from "@/constant/adda/game/instructions";
import { gameData } from "@/constant/adda/game/brainStack";
import SortMyDeckLobby from "@/components/adda/game/sortMyDeck/lobby";
import SortMyDeckPlayzone from "@/components/adda/game/sortMyDeck/playzone";

const SortMyDeck = () => {
  const { showStatus } = useStatusModal();
  const [currentState, setCurrentState] = useState<CurrentState>("lobby");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [finalScore, setFinalScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rewardPoints, setRewardPoints] = useState<number | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [isInstructionOpen, setInstructionOpen] = useState(false);
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const gameId = `brainstack_${difficulty}`;

  const gameInstructions = GAME_INSTRUCTIONS.find(
    (inst) =>
      inst.game.toLowerCase().replace(/_/g, "").replace(/\s+/g, "") ===
      "brainstack"
  );

  const currentRounds = gameData[difficulty].rounds;

  const handleGameComplete = async (score: number) => {
    setFinalScore(score);
    setCurrentState("result");
    try {
      const token = await getToken();
      if (token) {
        const success = score === currentRounds.length * 10;
        const response = await postScore({
          body: { score, gameId, difficulty, success },
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
  };

  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
    setRewardPoints(null);
  };

  const handlePlayAgain = () => {
    setFinalScore(0);
    setCurrentState("play");
  };

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setCurrentState("play");
    setIsModalOpen(false);
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
      {currentState === "lobby" && (
        <SortMyDeckLobby showDifficultyModal={() => setIsModalOpen(true)} />
      )}

      {currentState === "play" && (
        <SortMyDeckPlayzone
          difficulty={difficulty}
          onGameComplete={handleGameComplete}
        />
      )}

      {currentState === "result" && (
        <ResultScreen
          score={finalScore}
          difficulty={difficulty}
          totalRounds={currentRounds.length}
          onPlayAgain={handlePlayAgain}
          goToLobby={goToLobby}
        />
      )}

      {isModalOpen && (
        <GameDifficultyModal
          isClose={() => setIsModalOpen(false)}
          setDifficulty={startGame}
        />
      )}

      {showRewardModal && rewardPoints !== null && (
        <RewardPointsModal
          rewardPoints={rewardPoints}
          onClose={handleCloseRewardModal}
        />
      )}
    </>
  );
};

export default SortMyDeck;
