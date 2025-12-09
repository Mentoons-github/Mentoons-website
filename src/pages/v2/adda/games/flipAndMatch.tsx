import { useState } from "react";
import { CurrentState, Difficulty } from "@/types/adda/game";
import FlipAndMatchLobby from "@/components/adda/game/flipAndMatch/lobby";
import GameDifficultyModal from "@/components/adda/game/difficultyModal";
import FlipAndMatchPlayerZone from "@/components/adda/game/flipAndMatch/playerZone";
import ResultScreen from "@/components/adda/game/brainStack/result";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { useAuth } from "@clerk/clerk-react";
import postScore from "@/api/game/postScore";
import { useStatusModal } from "@/context/adda/statusModalContext";

const FlipAndMatch = () => {
  const [currentState, setCurrentState] = useState<CurrentState>("lobby");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [finalScore, setFinalScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { showStatus } = useStatusModal();
  const gameId = `flipAndMatch_${difficulty}`;

  const handleGameComplete = async (score: number, success: boolean) => {
    setFinalScore(score);
    setCurrentState("result");
    try {
      const token = await getToken();
      if (token)
        await postScore({
          body: { score, gameId, difficulty, success },
          token,
        });
    } catch (error: unknown) {
      showStatus("error", error as string);
    }
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
      <button
        onClick={() => navigate("/adda/game-lobby")}
        className="absolute left-6 top-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/30 backdrop-blur-sm shadow-md z-[999]"
      >
        <FaChevronLeft className="text-white text-2xl" />
      </button>
      {currentState === "lobby" && (
        <FlipAndMatchLobby showDifficultyModal={() => setIsModalOpen(true)} />
      )}
      {currentState === "play" && (
        <FlipAndMatchPlayerZone
          difficulty={difficulty}
          onGameComplete={handleGameComplete}
        />
      )}
      {currentState === "result" && (
        <ResultScreen
          score={finalScore}
          difficulty={difficulty}
          onPlayAgain={handlePlayAgain}
          goToLobby={goToLobby}
          gameType="flipAndMatch"
        />
      )}
      {isModalOpen && (
        <GameDifficultyModal
          isClose={() => setIsModalOpen(false)}
          setDifficulty={startGame}
        />
      )}
    </>
  );
};

export default FlipAndMatch;
