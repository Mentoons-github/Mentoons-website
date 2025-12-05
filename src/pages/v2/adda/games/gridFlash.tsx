import GridFlashLobby from "@/components/adda/game/grid-flash/lobby";
import { useState } from "react";
import { CurrentState, Difficulty } from "@/types/adda/game";
import GameDifficultyModal from "@/components/adda/game/difficultyModal";
import GridFlashPlay from "@/components/adda/game/grid-flash/grid-flash";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";

const GridFlash = () => {
  const [currentState, setCurrentState] = useState<CurrentState>("lobby");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => navigate("/adda/game-lobby")}
        className="absolute left-6 top-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/30 backdrop-blur-sm shadow-md z-[999]"
      >
        <FaChevronLeft className="text-white text-2xl" />
      </button>
      {currentState === "lobby" && (
        <GridFlashLobby selectDifficulty={() => setIsModalOpen(true)} />
      )}

      {currentState === "play" && (
        <GridFlashPlay
          difficulty={difficulty}
          onGameComplete={() => setCurrentState("lobby")}
        />
      )}

      {isModalOpen && (
        <GameDifficultyModal
          isClose={() => setIsModalOpen(false)}
          setDifficulty={(val) => {
            setDifficulty(val);
            setIsModalOpen(false);
            setCurrentState("play");
          }}
        />
      )}
    </>
  );
};

export default GridFlash;
