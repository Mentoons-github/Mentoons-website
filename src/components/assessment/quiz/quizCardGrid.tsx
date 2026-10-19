import {
  motion,
  AnimatePresence,
  MotionConfig,
  type Variants,
} from "framer-motion";
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

const COMIC_COLORS = [
  "bg-[#ff9800]",
  "bg-[#FFD93D]",
  "bg-green-400",
  "bg-sky-300",
  "bg-pink-300",
  "bg-purple-300",
];

const HALFTONE_OVERLAY = {
  backgroundImage:
    "radial-gradient(rgba(17,24,39,0.14) 1.4px, transparent 1.4px)",
  backgroundSize: "14px 14px",
};

/* Comic pop: each card punches up with a springy overshoot when it scrolls
   into view, staggered by column. */
const fadeItem: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.6, rotate: -6 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      opacity: { duration: 0.2, delay: (index % 4) * 0.1 },
      default: {
        type: "spring",
        stiffness: 260,
        damping: 14,
        delay: (index % 4) * 0.1,
      },
    },
  }),
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
      return <Dice6 className="w-12 h-12" />;
    if (name.includes("social") || name.includes("mobile"))
      return <Smartphone className="w-12 h-12" />;
    if (name.includes("gaming") || name.includes("game"))
      return <Gamepad2 className="w-12 h-12" />;
    if (name.includes("tech") || name.includes("software"))
      return <Briefcase className="w-12 h-12" />;
    if (name.includes("entertainment")) return <Tv className="w-12 h-12" />;
    if (name.includes("music")) return <Music className="w-12 h-12" />;
    if (name.includes("gambling")) return <Dice6 className="w-12 h-12" />;
    if (name.includes("performance")) return <Trophy className="w-12 h-12" />;
    return <HelpCircle className="w-12 h-12" />;
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
    }),
  );

  const frontendId = QUIZ_DATA_GAME.map((data) => data._id);

  const backendCategories = categories.filter(
    (c) => !frontendId.includes(c._id),
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
    e: React.MouseEvent,
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
    hasSubcategories: boolean,
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
        <div className="mx-auto max-w-lg rounded-2xl border-2 border-gray-900 bg-white p-8 text-center shadow-[5px_5px_0_0_#111827]">
          <p className="font-comic text-3xl tracking-wide text-gray-900">
            No quiz categories available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {allCategories.map((category, index) => {
            const color = COMIC_COLORS[index % COMIC_COLORS.length];
            const isFrontendCategory = frontendId.includes(category._id);
            const isExpanded = expandedIndex === index;
            const hasSubcategories =
              isFrontendCategory && !!category.subCategories?.length;
            const shadowClass =
              hoveredIndex === index || isExpanded
                ? "shadow-[9px_9px_0_0_#111827]"
                : "shadow-[6px_6px_0_0_#111827]";

            return (
              <motion.div
                key={category._id}
                variants={fadeItem}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                layout
                onHoverStart={() => !isExpanded && setHoveredIndex(index)}
                onHoverEnd={() => !isExpanded && setHoveredIndex(null)}
                className={`relative ${isExpanded ? "col-span-full" : ""}`}
              >
                <motion.div
                  layout
                  className={`relative rounded-2xl overflow-hidden border-2 border-gray-900 ${color} ${shadowClass} transition-all duration-300 ${
                    isExpanded ? "min-h-[480px]" : "h-64"
                  } cursor-pointer group`}
                  whileHover={!isExpanded ? { scale: 1.03, rotate: -1 } : {}}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    handleCardClick(index, category._id, hasSubcategories)
                  }
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={HALFTONE_OVERLAY}
                  />

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
                        <motion.div className="mb-3 rounded-full border-2 border-gray-900 bg-white p-3 text-gray-900 shadow-[3px_3px_0_0_#111827]">
                          {getCategoryIcon(category.category)}
                        </motion.div>

                        <h3 className="font-comic text-2xl md:text-3xl leading-tight tracking-wide text-gray-900 mb-3">
                          {category.category}
                        </h3>

                        <motion.div className="mt-auto">
                          <div className="font-comic inline-flex items-center gap-2 rounded-full border-2 border-gray-900 bg-white px-5 py-2 text-xl tracking-wide text-gray-900 shadow-[3px_3px_0_0_#111827] group-hover:bg-[#FFD93D]">
                            {hasSubcategories ? "Choose Topic" : "Start Quiz"}
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </motion.div>

                        {hasSubcategories && (
                          <div className="absolute top-4 right-4 rounded-full border-2 border-gray-900 bg-white p-1 text-gray-900">
                            <ChevronDown className="w-6 h-6" />
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
                        className="relative z-10 h-full p-6 md:p-8"
                      >
                        <div className="flex items-center justify-between mb-10">
                          <div className="flex items-center gap-5">
                            <div className="rounded-full border-2 border-gray-900 bg-white p-3 text-gray-900 shadow-[3px_3px_0_0_#111827]">
                              {getCategoryIcon(category.category)}
                            </div>
                            <h3 className="font-comic text-4xl md:text-5xl tracking-wide text-gray-900">
                              {category.category}
                            </h3>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedIndex(null);
                            }}
                            className="rounded-full border-2 border-gray-900 bg-white p-2 text-gray-900 shadow-[3px_3px_0_0_#111827] transition hover:bg-[#FFD93D] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                          >
                            <ChevronDown className="w-7 h-7 rotate-180" />
                          </motion.button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {category.subCategories?.map((sub, subIndex) => (
                            <motion.button
                              key={sub.quizId}
                              initial={{
                                opacity: 0,
                                y: 30,
                                scale: 0.7,
                                rotate: -4,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                rotate: 0,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 15,
                                delay: 0.05 + subIndex * 0.06,
                              }}
                              whileHover={{ scale: 1.03, y: -3 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={(e) =>
                                handleSubcategoryClick(
                                  category._id,
                                  sub.quizId,
                                  e,
                                )
                              }
                              className="font-comic flex items-center justify-between rounded-xl border-2 border-gray-900 bg-white px-6 py-5 text-left text-2xl tracking-wide text-gray-900 shadow-[4px_4px_0_0_#111827] transition-all hover:bg-[#FFD93D] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none group"
                            >
                              <span>{getDisplayName(sub.name)}</span>
                              <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-all" />
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
        </div>
      </div>
    </MotionConfig>
  );
};

export default QuizCardGrid;
