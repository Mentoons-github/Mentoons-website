import BrainStackLobby from "@/components/adda/game/brainStack/lobby";
import GameDifficultyModal from "@/components/adda/game/difficultyModal";
import PlayerZone from "@/components/adda/game/brainStack/playerZone";
import ResultScreen from "@/components/adda/game/brainStack/result";
import { useState } from "react";
import { Difficulty, gameData } from "@/constant/adda/game/brainStack";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { CurrentState } from "@/types/adda/game";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { useAuth } from "@clerk/clerk-react";
import postScore from "@/api/game/postScore";

const BrainStack = () => {
  const { showStatus } = useStatusModal();
  const [currentState, setCurrentState] = useState<CurrentState>("lobby");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [finalScore, setFinalScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const gameId = `brainstack_${difficulty}`;

  const handleGameComplete = async (score: number) => {
    setFinalScore(score);
    setCurrentState("result");
    try {
      const token = await getToken();
      if (token)
        await postScore({ body: { score, gameId, difficulty }, token });
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

  const currentItems = gameData[difficulty].items;
  const currentRounds = gameData[difficulty].rounds;

  return (
    <>
      <button
        onClick={() => navigate("/adda/game-lobby")}
        className="absolute left-6 top-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/30 backdrop-blur-sm shadow-md z-[999]"
      >
        <FaChevronLeft className="text-white text-2xl" />
      </button>
      {currentState === "lobby" && (
        <BrainStackLobby showDifficultyModal={() => setIsModalOpen(true)} />
      )}

      {currentState === "play" && (
        <PlayerZone
          difficulty={difficulty}
          items={currentItems}
          rounds={currentRounds}
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
    </>
  );
};

export default BrainStack;
