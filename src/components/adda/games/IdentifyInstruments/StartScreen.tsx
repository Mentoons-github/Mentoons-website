import { motion } from "framer-motion";

const StartScreen = ({ onStart }: { onStart: () => void }) => {
  return (


      <div className="relative flex flex-col items-center justify-center text-center px-6">
        {/* Game Title Image */}
        <motion.img
          src="/assets/games/instruments/text.png"
          alt="Game Title"
          className=" "
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
          className="mt-6 text-sm text-white/80 tracking-wide"
        >
          🎧 Best experience with headphones
        </motion.p>
      </div>
  );
};

export default StartScreen;
