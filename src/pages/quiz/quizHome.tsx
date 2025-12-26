import QuizBanner from "@/components/assessment/quiz/quizBanner";
import QuizTimelineSection from "@/components/assessment/quiz/quizTimeLineSection";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";

export interface Category {
  _id: string;
  category: string;
}

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
  return (
    <>
      <QuizBanner categories={categories} />
      <QuizTimelineSection categories={categories} />
    </>
  );
};

export default QuizHome;
