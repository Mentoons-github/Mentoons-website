import StickMasterLobby from "@/components/adda/game/stickMaster/lobby";
import { useState } from "react";
import { CurrentState, Difficulty } from "@/types/adda/game";
import GameDifficultyModal from "@/components/adda/game/difficultyModal";
import StickMasterPlayzone from "@/components/adda/game/stickMaster/playerzone";
import ResultScreen from "@/components/adda/game/brainStack/result";
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
      if (token)
        await postScore({ body: { score, gameId, difficulty }, token });
    } catch (error: unknown) {
      showStatus("error", error as string);
    }
  };

  const handlePlayAgain = () => {
    setGameResult(null);
    setCurrentState("lobby");
  };

  const handleGoToLobby = () => {
    setGameResult(null);
    setCurrentState("lobby");
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
    </>
  );
};

export default StickMaster;
