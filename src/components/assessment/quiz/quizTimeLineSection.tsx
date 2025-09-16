import { useRef, useState } from "react";
import { QUIZ_ITEMS } from "@/constant/constants";
import { motion, useScroll, useTransform } from "framer-motion";

const QuizTimelineSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Scroll tracking with useScroll (moved before early return)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress for smoother and more visible animations
  const arrowY = useTransform(scrollYProgress, [0, 1], [0, 600]);

  // Fallback UI if QUIZ_ITEMS is empty
  if (!QUIZ_ITEMS || QUIZ_ITEMS.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Animated Background with Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              rotate: [0, 360],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <div
              className={`w-16 h-16 bg-gradient-to-r ${
                i % 3 === 0
                  ? "from-blue-400 to-purple-600"
                  : i % 3 === 1
                  ? "from-pink-400 to-red-600"
                  : "from-green-400 to-teal-600"
              } ${i % 2 === 0 ? "rounded-full" : "rounded-lg rotate-45"}`}
            />
          </motion.div>
        ))}

        {/* Floating Icons */}
        {["🌟", "✨", "💫", "🎯", "🔥", "⚡", "🌈", "🎪", "🎭", "🎨"].map(
          (icon, i) => (
            <motion.div
              key={`icon-${i}`}
              className="absolute text-3xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -60, 0],
                x: [0, Math.random() * 50 - 25, 0],
                rotate: [0, 30, -30, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 12 + Math.random() * 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {icon}
            </motion.div>
          )
        )}
      </div>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center mb-20"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="inline-block mb-4"
        >
          <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
            <span className="mr-2">🎯</span>
            Quiz Collection
          </span>
        </motion.div>
        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-6">
          Test Your Knowledge
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Explore our diverse set of interactive quizzes, crafted to challenge
          your knowledge and spark curiosity across various domains. From
          beginner to expert, there's something for everyone!
        </p>
      </motion.div>

      {/* Timeline Container */}
      <div ref={containerRef} className="relative max-w-7xl mx-auto px-4">
        {/* Enhanced Timeline Line */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 w-3 bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 rounded-full opacity-30"
          style={{ height: "100%", minHeight: "1200px" }}
        />

        {/* Animated Timeline Indicator (Arrow) */}
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 z-30 w-14 h-14 bg-white rounded-full shadow-xl border-4 border-blue-500 flex items-center justify-center cursor-pointer"
          style={{ y: arrowY, top: "5%" }}
          whileHover={{
            scale: 1.2,
            borderColor: "rgba(236, 72, 153, 1)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
          }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.3)",
              "0 0 40px rgba(59, 130, 246, 0.6)",
              "0 0 20px rgba(59, 130, 246, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-blue-600 text-3xl font-bold"
          >
            ↓
          </motion.div>
        </motion.div>

        {/* Quiz Cards */}
        <div className="space-y-32 pt-16">
          {QUIZ_ITEMS.map((item, index) => {
            const isLeft = index % 2 === 0;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: isLeft ? -100 : 100, y: 50 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex ${
                  isLeft ? "justify-start" : "justify-end"
                } items-center`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Timeline Node */}
                <motion.div
                  className="absolute left-1/2 transform -translate-x-1/2 z-20"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-4 border-white shadow-lg ${
                      isHovered ? "bg-purple-500 scale-125" : "bg-blue-500"
                    } transition-all duration-300`}
                  />
                </motion.div>

                {/* Connection Line */}
                <motion.div
                  className={`absolute top-6 w-20 h-1 bg-gradient-to-r ${
                    isLeft
                      ? "from-blue-400 to-transparent right-1/2 mr-4"
                      : "from-transparent to-blue-400 left-1/2 ml-4"
                  }`}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                />

                {/* Card */}
                <motion.div
                  className={`relative w-full max-w-md ${
                    isLeft ? "mr-10" : "ml-10"
                  }`}
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div
                    className={`relative rounded-2xl overflow-hidden ${item.bgColor} shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer`}
                    style={{
                      boxShadow: isHovered
                        ? `0 20px 40px ${item.shadowColor}, 0 0 60px ${item.glowColor}`
                        : `0 10px 30px ${item.shadowColor}`,
                    }}
                  >
                    {/* Card Header */}
                    <div className="relative h-60 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={isHovered ? { x: [-100, 400] } : {}}
                        transition={{ duration: 0.6 }}
                      />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center px-3 py-1 text-sm font-bold bg-white/95 backdrop-blur-sm rounded-full text-gray-800 shadow-lg">
                          {item.category}
                        </span>
                      </div>

                      {/* Icon */}
                      <motion.div
                        className="absolute bottom-4 right-4 text-7xl"
                        animate={
                          isHovered
                            ? {
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0],
                              }
                            : {}
                        }
                        transition={{ duration: 0.5 }}
                      >
                        {item.icon}
                      </motion.div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {item.label}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center mt-32"
      >
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Ready to Challenge Yourself?
          </h3>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of learners who have tested their skills with our
            interactive quizzes. Start exploring now or dive into detailed
            statistics to track your progress!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizTimelineSection;
