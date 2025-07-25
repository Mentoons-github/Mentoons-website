import PuzzleBanner from "@/components/puzzle/banner";
import PuzzleDataContent from "@/components/puzzle/puzzleDataContent";
import PuzzleItems from "@/components/puzzle/puzzles";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronUp, FaPuzzlePiece } from "react-icons/fa6";
import CrossWordPuzzle from "@/components/puzzle/crossWord/puzzle";

export type PuzzleType = "word" | "crossWord";

const Puzzle = () => {
  const [showPuzzleType, setShowPuzzleType] = useState<PuzzleType>("word");
  const [showPuzzle, setShowPuzzle] = useState(true);

  const hideAndShowPuzzle = (val: PuzzleType) => {
    setShowPuzzleType(val);
    setShowPuzzle(false);
  };

  const showPuzzleSelection = () => {
    setShowPuzzle(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        opacity: { duration: 0.3 },
      },
    },
    visible: {
      opacity: 1,
      height: "45rem",
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        opacity: { duration: 0.3, delay: 0.1 },
      },
    },
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.2,
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.1,
      },
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const aboutVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.3,
      },
    },
  };

  return (
    <>
      <PuzzleBanner />
      <AnimatePresence mode="wait">
        {showPuzzle && (
          <motion.div
            key="puzzle-selection"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="overflow-hidden"
          >
            <PuzzleDataContent
              hideAndShowPuzzle={hideAndShowPuzzle}
              showPuzzle={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto my-10">
        <AnimatePresence mode="wait">
          {!showPuzzle && (
            <motion.div
              key="show-button"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex justify-center items-center mb-8"
            >
              <motion.button
                onClick={showPuzzleSelection}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 via-red-600 to-orange-500 rounded-2xl text-white font-semibold text-lg shadow-xl overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-700"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative z-10 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <FaPuzzlePiece className="text-xl" />
                  </motion.div>

                  <span className="tracking-wide">Show Puzzle Selection</span>

                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <FaChevronUp className="text-lg" />
                  </motion.div>
                </div>

                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 blur-lg opacity-0 group-hover:opacity-50"
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-white/30"
                  initial={{ scale: 1, opacity: 0.3 }}
                  whileHover={{ scale: 1.05, opacity: 0.6 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!showPuzzle && (
            <motion.div
              key="puzzle-content"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <PuzzleItems puzzle={showPuzzleType} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center py-20"
              >
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Crossword Puzzles
                </h1>
                <CrossWordPuzzle />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key="about-section"
            variants={aboutVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="mt-16 text-center text-gray-700 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                About the Puzzles
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="text-lg leading-relaxed max-w-3xl mx-auto"
            >
              Dive into a world of challenges with our engaging word and
              crossword puzzles. Whether you're looking to sharpen your
              vocabulary or test your logic, these puzzles are designed to
              entertain and stimulate your mind. Pick a category and start
              solving!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex justify-center gap-4 mt-6"
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                  className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default Puzzle;
