import { motion } from "framer-motion";
import { useState } from "react";
import { QUIZ_ITEMS } from "@/constant/constants";
import {
  fadeContainer,
  fadeItem,
  cardHoverEffect,
  liftText,
  bounceIcon,
} from "@/animation/assessmentsAndQuiz/quiz";
import { QuizType } from "@/types";
import { useNavigate } from "react-router-dom";

const QuizCardGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleQuizStart = (
    quizValue: QuizType,
    difficulty: "easy" | "medium" | "hard"
  ) => {
    if (!quizValue) {
      console.error("Invalid quizValue:", quizValue);
      alert("Error: Invalid quiz value. Please try another quiz.");
      return;
    }
    navigate(`/quiz/${quizValue}/${difficulty}`);
  };

  const difficultyStyles = {
    easy: {
      border: "border-green-500",
      hoverBg: "hover:bg-green-600/30",
      text: "text-green-500",
    },
    medium: {
      border: "border-orange-500",
      hoverBg: "hover:bg-orange-600/30",
      text: "text-orange-500",
    },
    hard: {
      border: "border-red-500",
      hoverBg: "hover:bg-red-600/30",
      text: "text-red-500",
    },
  };

  return (
    <div className="relative w-full px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeContainer}
        className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-4 lg:gap-6"
      >
        {QUIZ_ITEMS.map((item, index) => (
          <motion.div
            key={item.id}
            variants={fadeItem}
            initial="rest"
            whileHover="hover"
            animate="rest"
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className="relative group"
          >
            <motion.div
              variants={cardHoverEffect}
              className={`relative h-72 rounded-xl overflow-hidden ${item.bgColor} shadow-lg`}
              style={{
                boxShadow:
                  hoveredIndex === index
                    ? `0 15px 30px ${item.shadowColor}, 0 0 25px ${item.glowColor}`
                    : `0 6px 20px ${item.shadowColor}`,
              }}
            >
              {/* Background image and overlay */}
              <div className="absolute inset-0">
                <img
                  src={item.imgSrc}
                  className="w-full h-full object-cover opacity-50"
                  alt={item.imgAlt}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-5">
                {/* Top section */}
                <motion.div variants={liftText} className="self-start">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/30">
                    {item.category}
                  </span>
                </motion.div>

                {/* Middle section */}
                <div className="text-center">
                  <motion.div variants={bounceIcon} className="text-4xl mb-3">
                    {item.icon}
                  </motion.div>
                  <motion.h3
                    variants={liftText}
                    className="text-xl font-bold text-white mb-2"
                  >
                    {item.label}
                  </motion.h3>
                  <motion.p
                    variants={liftText}
                    className="text-white/90 text-sm font-medium"
                  >
                    {item.description}
                  </motion.p>
                </div>

                {/* Difficulty buttons - always visible but animated */}
                <motion.div
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    y: hoveredIndex === index ? 0 : 20,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-white text-sm font-semibold">
                    Choose Difficulty:
                  </p>
                  <div className="flex gap-3">
                    {(["easy", "medium", "hard"] as const).map((difficulty) => (
                      <motion.button
                        key={difficulty}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border-2 ${difficultyStyles[difficulty].border} ${difficultyStyles[difficulty].hoverBg} bg-black/20 backdrop-blur-sm text-white transition-all`}
                        onClick={() =>
                          item.value &&
                          handleQuizStart(item.value as QuizType, difficulty)
                        }
                      >
                        {difficulty.charAt(0).toUpperCase() +
                          difficulty.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Hover effects */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                animate={{
                  x: hoveredIndex === index ? "200%" : "-100%",
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default QuizCardGrid;
