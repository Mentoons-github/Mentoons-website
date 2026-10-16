import QuizBanner from "@/components/assessment/quiz/quizBanner";
// import QuizTimelineSection from "@/components/assessment/quiz/quizTimeLineSection";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { QUIZ_DATA_GAME } from "@/constant/adda/game/quiz";

export interface Category {
  _id: string;
  category: string;
  subCategory?: string[];
}

const HALFTONE_BG = {
  backgroundColor: "#F5F5F4",
  backgroundImage: "radial-gradient(#d6d3d1 1.2px, transparent 1.2px)",
  backgroundSize: "16px 16px",
};

const COMIC_CARD =
  "border-2 border-gray-900 bg-white shadow-[5px_5px_0_0_#111827]";

const QuizHome = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
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
          },
        );

        const frontendCategories = QUIZ_DATA_GAME.map((cat) => ({
          category: cat.title,
          _id: cat._id,
        }));
        setCategories([...response.data.categories, ...frontendCategories]);
      } catch (error: any) {
        showStatus(
          "error",
          error.response?.data?.message || "Failed to load categories",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [getToken, showStatus]);

  if (loading) {
    return (
      <div style={HALFTONE_BG} className="min-h-screen">
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
          <div className="mb-8 flex justify-center">
            <span className="font-comic -rotate-2 rounded-full border-2 border-gray-900 bg-[#FFD93D] px-6 py-2 text-3xl tracking-wide text-gray-900 shadow-[4px_4px_0_0_#111827]">
              Loading quizzes...
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`h-64 rounded-2xl p-3 animate-pulse ${COMIC_CARD}`}
              >
                <div className="h-36 rounded-xl border-2 border-gray-900 bg-[#FFFBEB]" />
                <div className="mt-4 h-6 w-3/4 rounded-full border-2 border-gray-900 bg-gray-200" />
                <div className="mt-3 h-8 w-1/2 rounded-full border-2 border-gray-900 bg-[#ff9800]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <QuizBanner categories={categories} />
      {/* <QuizTimelineSection categories={categories} /> */}
    </>
  );
};

export default QuizHome;
