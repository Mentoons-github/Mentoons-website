import GridFlashLobby from "@/components/adda/game/grid-flash/lobby";
import { useState } from "react";
import { CurrentState, Difficulty } from "@/types/adda/game";
import GameDifficultyModal from "@/components/adda/game/difficultyModal";
import GridFlashPlay from "@/components/adda/game/grid-flash/grid-flash";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { GAME_INSTRUCTIONS } from "@/constant/adda/game/instructions";
import HowToPlay from "@/components/adda/game/howToPlay/howToPlay";
import { BiBulb } from "react-icons/bi";

const GridFlash = () => {
  const [currentState, setCurrentState] = useState<CurrentState>("lobby");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInstructionOpen, setInstructionOpen] = useState(false);
  const navigate = useNavigate();

  const gameInstructions = GAME_INSTRUCTIONS.find(
    (inst) =>
      inst.game.toLowerCase().replace(/_/g, "").replace(/\s+/g, "") ===
      "gridflash"
  );

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
