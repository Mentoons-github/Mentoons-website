import { Category } from "@/pages/quiz/quizHome";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Category descriptions and color themes
const categoryData: Record<
  string,
  { description: string; gradient: string; accent: string; icon: string }
> = {
  "Mobile addiction": {
    description:
      "Learn how excessive smartphone use develops, its psychological effects, and how it influences attention, sleep, and daily behavior.",
    gradient: "from-blue-600 via-blue-500 to-cyan-400",
    accent: "bg-blue-500",
    icon: "📱",
  },
  "Gaming addiction": {
    description:
      "Explore the science behind gaming addiction, common warning signs, and how prolonged gaming can impact mental health and lifestyle.",
    gradient: "from-orange-600 via-orange-500 to-yellow-400",
    accent: "bg-orange-500",
    icon: "🎮",
  },
  "Gambling addiction": {
    description:
      "Understand how gambling addiction forms, the role of risk and reward in the brain, and its social and financial consequences.",
    gradient: "from-red-600 via-orange-500 to-yellow-400",
    accent: "bg-red-500",
    icon: "🎲",
  },
  "Performance addiction": {
    description:
      "Discover how the constant drive for success and perfection can become addictive, affecting mental health, motivation, and balance.",
    gradient: "from-green-600 via-emerald-500 to-teal-400",
    accent: "bg-green-500",
    icon: "🏆",
  },
  "Entertainment addiction": {
    description:
      "Learn about excessive consumption of entertainment media, why it becomes habit-forming, and its effects on productivity and focus.",
    gradient: "from-yellow-600 via-yellow-500 to-amber-300",
    accent: "bg-yellow-500",
    icon: "🎬",
  },
};

const QuizTimelineSection = ({ categories }: { categories: Category[] }) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const currentCategory = categories[selectedCategory]?.category || "";
  const currentData = categoryData[currentCategory] || {
    description: "Explore this category to learn more about your habits.",
    gradient: "from-gray-600 via-gray-500 to-gray-400",
    accent: "bg-gray-500",
    icon: "📋",
  };

  return (
    <div className="flex items-center justify-center p-8 md:p-20 min-h-screen">
      <div className="w-full max-w-7xl">
        {/* Main Display Card */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`relative w-full h-[500px] rounded-3xl bg-gradient-to-br ${currentData.gradient} shadow-2xl overflow-hidden`}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6"
              >
                <div className="text-8xl mb-4 drop-shadow-2xl">
                  {currentData.icon}
                </div>
                <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight drop-shadow-2xl">
                  {currentCategory}
                </h1>
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto">
                  <p className="text-xl md:text-2xl font-medium leading-relaxed text-white drop-shadow-lg px-4">
                    {currentData.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Category Selection Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 px-4">
          {categories.map((category, index) => {
            const data =
              categoryData[category.category] ||
              categoryData["Mobile addiction"];
            const isSelected = selectedCategory === index;

            return (
              <motion.div
                key={category._id}
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(index)}
                className={`
                  relative overflow-hidden cursor-pointer rounded-2xl transition-all duration-300
                  ${
                    isSelected
                      ? `${data.accent} text-white shadow-2xl scale-105`
                      : "bg-white text-gray-800 shadow-lg hover:shadow-xl"
                  }
                `}
              >
                <div className="relative z-10 px-6 py-4 flex flex-col items-center justify-center text-center min-w-[160px] min-h-[100px]">
                  <div className="text-3xl mb-2">{data.icon}</div>
                  <span className="font-semibold text-sm leading-tight">
                    {category.category}
                  </span>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-white/20 backdrop-blur-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {categories.map((_, index) => (
            <motion.div
              key={index}
              onClick={() => setSelectedCategory(index)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                selectedCategory === index
                  ? `${
                      categoryData[categories[index].category]?.accent ||
                      "bg-gray-500"
                    } w-12`
                  : "bg-gray-300 w-2"
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizTimelineSection;
