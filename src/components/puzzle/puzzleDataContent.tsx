import { motion } from "framer-motion";
import { PuzzleType } from "@/pages/v2/puzzle/puzzle";

const PuzzleDataContent = ({
  hideAndShowPuzzle,
}: {
  hideAndShowPuzzle: (val: PuzzleType) => void;
  showPuzzle: boolean;
}) => {
  const cardVariants = {
    initial: { scale: 1, rotateY: 0 },
    hover: {
      scale: 1.02,
      rotateY: 5,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const imageVariants = {
    initial: { scale: 1, rotate: 0, y: 0 },
    hover: {
      scale: 1.1,
      rotate: 2,
      y: -8,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const textVariants = {
    initial: { y: 0 },
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const particleVariants = {
    initial: { opacity: 0, scale: 0 },
    hover: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="flex w-full h-[45rem] relative overflow-hidden">
      {/* Left Section - Crossword Puzzles */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onClick={() => hideAndShowPuzzle("crossWord")}
        className="w-1/2 relative flex flex-col items-center justify-center bg-gradient-to-br from-red-500 via-red-400 to-red-600 cursor-pointer"
        style={{ perspective: "1000px" }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-700 opacity-0"
          variants={{
            initial: { opacity: 0 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Radial gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-white/20 via-transparent to-transparent"
          variants={{
            initial: { opacity: 0.6 },
            hover: { opacity: 0.8 },
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Enhanced animated particles */}
        <motion.div className="absolute inset-0" variants={particleVariants}>
          <motion.div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.5,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-yellow-200 rounded-full"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 1,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.div
          className="relative z-10 text-center"
          variants={textVariants}
        >
          <motion.h1
            className="text-yellow-300 font-bold text-4xl mb-4 drop-shadow-lg tracking-wide"
            variants={{
              initial: { color: "#fde047" },
              hover: { color: "#fef08a" },
            }}
          >
            CROSSWORD
          </motion.h1>
          <motion.h2
            className="text-yellow-200 font-semibold text-2xl mb-8 drop-shadow-md tracking-wider"
            variants={{
              initial: { opacity: 0.9 },
              hover: { opacity: 1 },
            }}
          >
            PUZZLES
          </motion.h2>

          <motion.div className="relative" variants={imageVariants}>
            <img
              src="/assets/puzzle/crossWord.png"
              alt="crossWord"
              className="w-1/2 mx-auto drop-shadow-xl"
            />
            {/* Enhanced glow effect */}
            <motion.div
              className="absolute inset-0 bg-yellow-300/20 blur-xl -z-10 rounded-full"
              variants={{
                initial: { opacity: 0.5, scale: 1 },
                hover: { opacity: 1, scale: 1.2 },
              }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
        </motion.div>

        {/* Floating decorative circles */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-radial from-white/10 to-transparent rounded-full"
          variants={{
            initial: { scale: 1, opacity: 0.5 },
            hover: { scale: 1.3, opacity: 0.8 },
          }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute bottom-16 right-12 w-24 h-24 bg-gradient-radial from-white/15 to-transparent rounded-full"
          variants={{
            initial: { scale: 1, opacity: 0.6 },
            hover: { scale: 1.2, opacity: 0.9 },
          }}
          transition={{ duration: 0.4, delay: 0.1 }}
        />

        {/* Click effect */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          whileTap={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>

      {/* Right Section - Word Puzzles */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onClick={() => hideAndShowPuzzle("word")}
        className="w-1/2 relative flex flex-col items-center justify-center bg-gradient-to-bl from-orange-500 via-orange-400 to-orange-600 cursor-pointer"
        style={{ perspective: "1000px" }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-bl from-orange-600 via-orange-500 to-orange-700 opacity-0"
          variants={{
            initial: { opacity: 0 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Radial gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-white/20 via-transparent to-transparent"
          variants={{
            initial: { opacity: 0.6 },
            hover: { opacity: 0.8 },
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Enhanced animated particles */}
        <motion.div className="absolute inset-0" variants={particleVariants}>
          <motion.div
            className="absolute top-1/4 right-1/4 w-2 h-2 bg-yellow-300 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.3,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 left-1/3 w-1 h-1 bg-white rounded-full"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.8,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-yellow-200 rounded-full"
            animate={{
              y: [0, -20, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 1.3,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.div
          className="relative z-10 text-center"
          variants={textVariants}
        >
          <motion.h1
            className="text-yellow-300 font-bold text-4xl mb-4 drop-shadow-lg tracking-wide"
            variants={{
              initial: { color: "#fde047" },
              hover: { color: "#fef08a" },
            }}
          >
            WORD
          </motion.h1>
          <motion.h2
            className="text-yellow-200 font-semibold text-2xl mb-8 drop-shadow-md tracking-wider"
            variants={{
              initial: { opacity: 0.9 },
              hover: { opacity: 1 },
            }}
          >
            PUZZLES
          </motion.h2>

          <motion.div className="relative" variants={imageVariants}>
            <img
              src="/assets/puzzle/wordPuzzle.png"
              alt="wordPuzzle"
              className="w-1/2 mx-auto drop-shadow-xl"
            />
            {/* Enhanced glow effect */}
            <motion.div
              className="absolute inset-0 bg-yellow-300/20 blur-xl -z-10 rounded-full"
              variants={{
                initial: { opacity: 0.5, scale: 1 },
                hover: { opacity: 1, scale: 1.2 },
              }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
        </motion.div>

        {/* Floating decorative circles */}
        <motion.div
          className="absolute top-12 right-8 w-28 h-28 bg-gradient-radial from-white/10 to-transparent rounded-full"
          variants={{
            initial: { scale: 1, opacity: 0.5 },
            hover: { scale: 1.3, opacity: 0.8 },
          }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute bottom-20 left-16 w-20 h-20 bg-gradient-radial from-white/15 to-transparent rounded-full"
          variants={{
            initial: { scale: 1, opacity: 0.6 },
            hover: { scale: 1.2, opacity: 0.9 },
          }}
          transition={{ duration: 0.4, delay: 0.1 }}
        />

        {/* Click effect */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          whileTap={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>

      {/* Enhanced center dividing line */}
      <motion.div
        className="absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-transparent via-white/30 to-transparent transform -translate-x-1/2"
        whileHover={{
          width: "0.5rem",
          background:
            "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Enhanced floating elements */}
      <motion.div
        className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-300/30 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white/20 rounded-full"
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: 1,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default PuzzleDataContent;
