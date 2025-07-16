import { motion } from "framer-motion";
import { useState } from "react";
import { QUIZ_ITEMS } from "@/constant/constants";
import {
  fadeContainer,
  fadeItem,
  cardHoverEffect,
  overlayFade,
  liftText,
  bounceIcon,
} from "@/animation/assessmentsAndQuiz/quiz";
import { QuizType } from "@/types";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleQuizStart = (quizValue: QuizType) => {
    console.log("Quiz ID clicked:", quizValue);
    navigate(`/quiz/${quizValue}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeContainer}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {QUIZ_ITEMS.map((item, index) => (
          <motion.div
            key={index}
            variants={fadeItem}
            initial="rest"
            whileHover="hover"
            animate="rest"
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            onClick={() => handleQuizStart(item.value as QuizType)}
            className="relative group cursor-pointer"
          >
            <motion.div
              variants={cardHoverEffect}
              className={`relative h-56 rounded-2xl overflow-hidden ${item.bgColor} shadow-lg`}
              style={{
                boxShadow:
                  hoveredIndex === index
                    ? `0 20px 40px ${item.shadowColor}, 0 0 30px ${item.glowColor}`
                    : `0 8px 25px ${item.shadowColor}`,
              }}
            >
              <div className="absolute inset-0">
                <img
                  src={item.imgSrc}
                  className="w-full h-full object-cover opacity-60"
                  alt={item.imgAlt}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <motion.div
                variants={overlayFade}
                className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm"
              />
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <motion.div variants={liftText} className="self-start">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/30">
                    {item.category}
                  </span>
                </motion.div>
                <div className="text-center">
                  <motion.div variants={bounceIcon} className="text-4xl mb-3">
                    {item.icon}
                  </motion.div>
                  <motion.h3
                    variants={liftText}
                    className="text-2xl font-bold text-white mb-2"
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
                <motion.div variants={liftText} className="self-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium text-sm border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    Start Quiz
                    <motion.span
                      animate={{ x: hoveredIndex === index ? 4 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </motion.div>
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                animate={{
                  x: hoveredIndex === index ? "200%" : "-100%",
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `radial-gradient(circle at center, ${item.glowColor} 0%, transparent 70%)`,
                filter: "blur(20px)",
                opacity: hoveredIndex === index ? 0.6 : 0,
              }}
              animate={{
                opacity: hoveredIndex === index ? 0.6 : 0,
                scale: hoveredIndex === index ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-center mt-10"
      >
        <h4 className="text-xl font-semibold text-gray-800 mb-2">
          Discover Your Digital Wellness
        </h4>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Take our comprehensive quizzes to understand your relationship with
          technology and develop healthier habits.
        </p>
      </motion.div>
    </div>
  );
};

export default Quiz;
