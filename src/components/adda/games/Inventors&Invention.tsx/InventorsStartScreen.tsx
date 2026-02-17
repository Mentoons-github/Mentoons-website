import { motion } from "framer-motion";
import HowToPlay from "../../game/howToPlay/howToPlay";
import { GAME_INSTRUCTIONS } from "@/constant/adda/game/instructions";
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { BiBulb } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const InventorsStartScreen = ({ onStart }: { onStart: () => void }) => {
  const [isInstructionOpen, setInstructionOpen] = useState(false);
  const navigate = useNavigate();

  const gameInstructions = GAME_INSTRUCTIONS.find(
    (inst) =>
      inst.game.toLowerCase().replace(/_/g, "").replace(/\s+/g, "") ===
      "mindofinventions",
  );
  return (
    <div
      className="relative flex flex-col items-center justify-center text-center px-6 min-h-screen bg-cover bg-center  gap-10"
      style={{ backgroundImage: "url('/assets/games/inventors/startBg.jpg')" }}
    >
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
      <div className="absolute inset-0 bg-black/80"></div>
      {/* Game Title Image */}
      <motion.img
        src="/assets/games/inventors/text.png"
        alt="Game Title"
        className="w-[700px] max-w-full relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      />

      {/* Start Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="bg-gradient-to-r from-green-600 to-yellow-500 animate-pulse 
                   text-white px-12 py-4 rounded-full 
                   text-xl font-bold shadow-xl 
                   hover:shadow-2xl transition-all"
      >
        ▶ Start Game
      </motion.button>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm text-white/80 tracking-wide"
      ></motion.p>
    </div>
  );
};

export default InventorsStartScreen;
