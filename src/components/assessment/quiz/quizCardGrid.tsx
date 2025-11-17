import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "@/context/adda/authModalContext";
import { useAuth } from "@clerk/clerk-react";
import { useStatusModal } from "@/context/adda/statusModalContext";
import axios from "axios";
import {
  Dice6,
  Smartphone,
  Gamepad2,
  Briefcase,
  Tv,
  HelpCircle,
} from "lucide-react";

interface Category {
  _id: string;
  category: string;
}

const fadeContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const colorSchemes = [
  {
    bgGradient: "from-purple-600 via-purple-500 to-pink-500",
    shadowColor: "rgba(168, 85, 247, 0.4)",
    glowColor: "rgba(168, 85, 247, 0.3)",
  },
  {
    bgGradient: "from-blue-600 via-blue-500 to-cyan-500",
    shadowColor: "rgba(59, 130, 246, 0.4)",
    glowColor: "rgba(59, 130, 246, 0.3)",
  },
  {
    bgGradient: "from-emerald-600 via-emerald-500 to-teal-500",
    shadowColor: "rgba(16, 185, 129, 0.4)",
    glowColor: "rgba(16, 185, 129, 0.3)",
  },
  {
    bgGradient: "from-orange-600 via-orange-500 to-amber-500",
    shadowColor: "rgba(249, 115, 22, 0.4)",
    glowColor: "rgba(249, 115, 22, 0.3)",
  },
  {
    bgGradient: "from-rose-600 via-rose-500 to-pink-500",
    shadowColor: "rgba(244, 63, 94, 0.4)",
    glowColor: "rgba(244, 63, 94, 0.3)",
  },
  {
    bgGradient: "from-indigo-600 via-indigo-500 to-purple-500",
    shadowColor: "rgba(99, 102, 241, 0.4)",
    glowColor: "rgba(99, 102, 241, 0.3)",
  },
];

const QuizCardGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { openAuthModal } = useAuthModal();
  const { showStatus } = useStatusModal();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/quiz/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data.categories || []);
      } catch (error: any) {
        showStatus(
          "error",
          error.response?.data?.message || "Failed to load categories"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [getToken, showStatus]);

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

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes("gambling")) return <Dice6 className="w-16 h-16" />;
    if (name.includes("mobile")) return <Smartphone className="w-16 h-16" />;
    if (name.includes("gaming")) return <Gamepad2 className="w-16 h-16" />;
    if (name.includes("performance"))
      return <Briefcase className="w-16 h-16" />;
    if (name.includes("entertainment")) return <Tv className="w-16 h-16" />;
    return <HelpCircle className="w-16 h-16" />;
  };

  if (loading) {
    return (
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
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
        {categories.map((category, index) => {
          const colorScheme = colorSchemes[index % colorSchemes.length];

          return (
            <motion.div
              key={category._id}
              variants={fadeItem}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => handleCategoryClick(category._id)}
              className="relative cursor-pointer group"
            >
              <motion.div
                className={`relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br ${colorScheme.bgGradient} transition-all duration-300`}
                style={{
                  boxShadow:
                    hoveredIndex === index
                      ? `0 20px 40px ${colorScheme.shadowColor}, 0 0 30px ${colorScheme.glowColor}`
                      : `0 8px 24px ${colorScheme.shadowColor}`,
                }}
              >
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent)]" />
                  <motion.div
                    className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)]"
                    animate={{
                      backgroundPosition:
                        hoveredIndex === index
                          ? ["0% 0%", "200% 200%"]
                          : "0% 0%",
                    }}
                    transition={{
                      duration: 2,
                      ease: "linear",
                      repeat: hoveredIndex === index ? Infinity : 0,
                    }}
                    style={{ backgroundSize: "200% 200%" }}
                  />
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
                  <motion.div
                    className="mb-4 text-white"
                    animate={{
                      scale: hoveredIndex === index ? [1, 1.2, 1] : 1,
                      rotate: hoveredIndex === index ? [0, 5, -5, 0] : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                    }}
                  >
                    {getCategoryIcon(category.category)}
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">
                    {category.category}
                  </h3>

                  <motion.div
                    className="mt-auto"
                    initial={{ opacity: 0.8, y: 0 }}
                    animate={{
                      opacity: hoveredIndex === index ? 1 : 0.8,
                      y: hoveredIndex === index ? -4 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-2 text-white text-sm font-semibold bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-white/30 shadow-lg">
                      Start Quiz
                      <motion.span
                        animate={{
                          x: hoveredIndex === index ? [0, 4, 0] : 0,
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: hoveredIndex === index ? Infinity : 0,
                        }}
                      >
                        →
                      </motion.span>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{
                    x: hoveredIndex === index ? "100%" : "-100%",
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default QuizCardGrid;
