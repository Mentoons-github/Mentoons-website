import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useAuthModal } from "@/context/adda/authModalContext";
import { useStatusModal } from "@/context/adda/statusModalContext";
import {
  Dice6,
  Smartphone,
  Gamepad2,
  Briefcase,
  Tv,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Music,
  Trophy,
} from "lucide-react";
import { Category } from "@/pages/quiz/quizHome";
import { QUIZ_DATA_GAME } from "@/constant/adda/game/quiz";
import { COLOR_SCHEME } from "@/constant/adda/quiz";

const fadeContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const fadeItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

interface QuizCardGridProps {
  categories: Category[];
}

interface CategoryWithSubcategories extends Category {
  subCategories?: { quizId: string; name: string }[];
}

const QuizCardGrid = ({ categories }: QuizCardGridProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { openAuthModal } = useAuthModal();
  const { showStatus } = useStatusModal();

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    console.log(name);
    if (name.includes("logo") || name.includes("guess"))
      return <Dice6 className="w-16 h-16" />;
    if (name.includes("social") || name.includes("mobile"))
      return <Smartphone className="w-16 h-16" />;
    if (name.includes("gaming") || name.includes("game"))
      return <Gamepad2 className="w-16 h-16" />;
    if (name.includes("tech") || name.includes("software"))
      return <Briefcase className="w-16 h-16" />;
    if (name.includes("entertainment")) return <Tv className="w-16 h-16" />;
    if (name.includes("music")) return <Music className="w-16 h-16" />;
    if (name.includes("gambling")) return <Dice6 className="w-16 h-16" />;
    if (name.includes("performance")) return <Trophy className="w-16 h-16" />;
    return <HelpCircle className="w-16 h-16" />;
  };

  const getDisplayName = (key: string) => {
    return key
      .split(/[\s&]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const frontendLogoCategory: CategoryWithSubcategories[] = QUIZ_DATA_GAME.map(
    (data) => ({
      _id: data._id,
      category: data.title,
      subCategories: data.category?.map((item) => ({
        quizId: item.quizId,
        name: item.category,
      })),
    })
  );

  const frontendId = QUIZ_DATA_GAME.map((data) => data._id);

  const backendCategories = categories.filter(
    (c) => !frontendId.includes(c._id)
  );

  const allCategories: CategoryWithSubcategories[] = [
    ...frontendLogoCategory,
    ...backendCategories,
  ];

  const handleCategoryClick = async (categoryId: string) => {
    const token = await getToken();
    if (!token) {
      openAuthModal("sign-in");
      return;
    }
    if (!categoryId) {
      showStatus("error", "Invalid category. Please try another quiz.");
      return;
    }
    navigate(`/quiz/category/${categoryId}`);
  };

  const handleSubcategoryClick = async (
    categoryId: string,
    quizId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const token = await getToken();
    if (!token) {
      openAuthModal("sign-in");
      return;
    }
    navigate(`/quiz/category/${categoryId}?quiz=${quizId}`);
  };

  const handleCardClick = (
    index: number,
    categoryId: string,
    hasSubcategories: boolean
  ) => {
    if (hasSubcategories) {
      setExpandedIndex(expandedIndex === index ? null : index);
    } else {
      handleCategoryClick(categoryId);
    }
  };

  if (allCategories.length === 0) {
    return (
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-xl text-gray-600">
            No quiz categories available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {allCategories.map((category, index) => {
          const scheme = COLOR_SCHEME[index % COLOR_SCHEME.length];
          const isFrontendCategory = frontendId.includes(category._id);
          const isExpanded = expandedIndex === index;
          const hasSubcategories =
            isFrontendCategory && !!category.subCategories?.length;

          return (
            <motion.div
              key={category._id}
              variants={fadeItem}
              layout
              onHoverStart={() => !isExpanded && setHoveredIndex(index)}
              onHoverEnd={() => !isExpanded && setHoveredIndex(null)}
              className={`relative ${isExpanded ? "col-span-full" : ""}`}
            >
              <motion.div
                layout
                className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${
                  scheme.bgGradient
                } transition-all duration-300 ${
                  isExpanded ? "min-h-[480px]" : "h-64"
                } cursor-pointer group`}
                style={{
                  boxShadow:
                    hoveredIndex === index || isExpanded
                      ? `0 20px 40px ${scheme.shadow}, 0 0 30px ${scheme.glow}`
                      : `0 8px 24px ${scheme.shadow}`,
                }}
                whileHover={!isExpanded ? { scale: 1.03 } : {}}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  handleCardClick(index, category._id, hasSubcategories)
                }
              >
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent)]" />

                <AnimatePresence mode="wait">
                  {!isExpanded ? (
                    <motion.div
                      key="collapsed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center"
                    >
                      <motion.div className="mb-5 text-white">
                        {getCategoryIcon(category.category)}
                      </motion.div>

                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg">
                        {category.category}
                      </h3>

                      <motion.div className="mt-auto">
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold shadow-lg">
                          {hasSubcategories ? "Choose Topic" : "Start Quiz"}
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </motion.div>

                      {hasSubcategories && (
                        <div className="absolute top-5 right-5 text-white/80">
                          <ChevronDown className="w-8 h-8" />
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10 h-full p-8"
                    >
                      <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-5">
                          {getCategoryIcon(category.category)}
                          <h3 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                            {category.category}
                          </h3>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.15, rotate: 180 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedIndex(null);
                          }}
                          className="text-white/80 hover:text-white transition-colors"
                        >
                          <ChevronDown className="w-9 h-9 rotate-180" />
                        </motion.button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {category.subCategories?.map((sub) => (
                          <motion.button
                            key={sub.quizId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.05 }}
                            whileHover={{ scale: 1.03, y: -3 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={(e) =>
                              handleSubcategoryClick(
                                category._id,
                                sub.quizId,
                                e
                              )
                            }
                            className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl py-6 px-7 text-white font-medium text-left hover:bg-white/25 transition-all flex justify-between items-center group"
                          >
                            <span className="text-lg">
                              {getDisplayName(sub.name)}
                            </span>
                            <ChevronRight className="w-6 h-6 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default QuizCardGrid;
