import StickMasterLobby from "@/components/adda/game/stickMaster/lobby";
import { useState } from "react";
import { CurrentState, Difficulty } from "@/types/adda/game";
import GameDifficultyModal from "@/components/adda/game/difficultyModal";
import StickMasterPlayzone from "@/components/adda/game/stickMaster/playerzone";
import ResultScreen from "@/components/adda/game/brainStack/result";
import RewardPointsModal from "@/components/modals/candyCoin";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import postScore from "@/api/game/postScore";
import { useAuth } from "@clerk/clerk-react";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { GAME_INSTRUCTIONS } from "@/constant/adda/game/instructions";
import { BiBulb } from "react-icons/bi";
import HowToPlay from "@/components/adda/game/howToPlay/howToPlay";

interface GameResult {
  score: number;
  difficulty: Difficulty;
  totalRounds: number;
}

const StickMaster = () => {
  const [currentState, setCurrentState] = useState<CurrentState>("lobby");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [allCorrect, setAllCorrect] = useState(true);
  const [rewardPoints, setRewardPoints] = useState<number | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [isInstructionOpen, setInstructionOpen] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { showStatus } = useStatusModal();

  const gameId = `stickMaster_${difficulty}`;

  const gameInstructions = GAME_INSTRUCTIONS.find(
    (inst) =>
      inst.game.toLowerCase().replace(/_/g, "").replace(/\s+/g, "") ===
      "stickmaster"
  );

  const handleStartGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setCurrentState("play");
    setIsModalOpen(false);
  };

  const handleGameComplete = async (score: number, roundsPlayed: number) => {
    setCurrentState("result");
    setGameResult({
      score,
      difficulty,
      totalRounds: roundsPlayed,
    });
    try {
      const token = await getToken();
      if (token) {
        const success = allCorrect ? true : false;
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

  const handlePlayAgain = () => {
    setAllCorrect(true);
    setGameResult(null);
    setCurrentState("lobby");
  };

  const handleGoToLobby = () => {
    setAllCorrect(true);
    setGameResult(null);
    setCurrentState("lobby");
  };

  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
    setRewardPoints(null);
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
        <StickMasterLobby setDifficulty={() => setIsModalOpen(true)} />
      )}

      {currentState === "play" && (
        <StickMasterPlayzone
          difficulty={difficulty}
          onGameComplete={handleGameComplete}
          score={score}
          setScore={setScore}
          setAllCorrect={setAllCorrect}
        />
      )}

      {isModalOpen && (
        <GameDifficultyModal
          isClose={() => setIsModalOpen(false)}
          setDifficulty={handleStartGame}
        />
      )}

      {currentState === "result" && gameResult && (
        <ResultScreen
          score={gameResult.score}
          difficulty={gameResult.difficulty}
          totalRounds={gameResult.totalRounds}
          onPlayAgain={handlePlayAgain}
          goToLobby={handleGoToLobby}
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

export default StickMaster;
