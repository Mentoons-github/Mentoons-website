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

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { showStatus } = useStatusModal();

  const gameId = `stickMaster_${difficulty}`;

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
      <button
        onClick={() => navigate("/adda/game-lobby")}
        className="absolute left-6 top-6 w-10 h-10 rounded-full flex items-center justify-center bg-gray-900/30 backdrop-blur-sm shadow-md z-[999]"
      >
        <FaChevronLeft className="text-white text-2xl" />
      </button>

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
