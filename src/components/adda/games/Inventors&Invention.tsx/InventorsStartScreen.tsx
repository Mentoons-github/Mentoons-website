import { motion } from "framer-motion";

const InventorsStartScreen = ({ onStart }: { onStart: () => void }) => {
  return (
    <div
      className="relative flex flex-col items-center justify-center text-center px-6 min-h-screen bg-cover bg-center  gap-10"
      style={{ backgroundImage: "url('/assets/games/inventors/startBg.jpg')" }}
    >
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
