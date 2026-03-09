import React, { useState, useEffect } from "react";
import { api } from "@/api/axiosInstance/axiosInstance";
import {
  Search,
  ChevronLeft,
  Trash2,
  Eye,
  X,
  ChevronDown,
  ChevronRight,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { useSubmissionModal } from "@/context/adda/commonModalContext";
import DeleteConfirmationModal from "@/components/admin/modal/deleteConfirmation";

interface Option {
  text: string;
  score: number;
  _id?: string;
}

interface Question {
  _id: string;
  question: string;
  options: Option[];
}

interface Result {
  _id?: string;
  minScore: number;
  maxScore: number;
  message: string;
}

interface Quiz {
  _id: string;
  category: string;
  questions: Question[];
  results: Result[];
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalQuizzes: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

interface QuizzesResponse {
  success: boolean;
  data: {
    quizzes: Quiz[];
    pagination: Pagination;
  };
}

interface QuizResponse {
  success: boolean;
  data: Quiz;
}

interface DeleteModalState {
  isOpen: boolean;
  itemName: string;
  onConfirm: () => void;
}

const CARD_COLORS = [
  {
    bg: "bg-yellow-100",
    border: "border-yellow-300",
    accent: "bg-yellow-400",
    text: "text-yellow-700",
    light: "bg-yellow-50",
  },
  {
    bg: "bg-pink-100",
    border: "border-pink-300",
    accent: "bg-pink-400",
    text: "text-pink-700",
    light: "bg-pink-50",
  },
  {
    bg: "bg-green-100",
    border: "border-green-300",
    accent: "bg-green-400",
    text: "text-green-700",
    light: "bg-green-50",
  },
  {
    bg: "bg-blue-100",
    border: "border-blue-300",
    accent: "bg-blue-400",
    text: "text-blue-700",
    light: "bg-blue-50",
  },
  {
    bg: "bg-red-100",
    border: "border-red-300",
    accent: "bg-red-400",
    text: "text-red-700",
    light: "bg-red-50",
  },
  {
    bg: "bg-orange-100",
    border: "border-orange-300",
    accent: "bg-orange-400",
    text: "text-orange-700",
    light: "bg-orange-50",
  },
];

const EMOJIS = ["🦁", "🐶", "🦊", "🐸", "🦋", "🐙", "🦄", "🐬", "🦉", "🐼"];
const OPTION_EMOJIS = ["🌟", "🎯", "🚀", "🎨", "🎵", "🍀"];

const QuizTable: React.FC = () => {
  const { showModal: showSubmissionModal } = useSubmissionModal();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 0,
    totalQuizzes: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    itemName: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchQuizzes();
  }, [currentPage, searchTerm]);

  const fetchQuizzes = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/quiz?page=${currentPage}&limit=10&search=${searchTerm}`,
      );
      const data = response.data as QuizzesResponse;
      if (data.success) {
        setQuizzes(data.data.quizzes);
        setPagination(data.data.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const openDeleteModal = (itemName: string, onConfirm: () => void) => {
    setDeleteModal({ isOpen: true, itemName, onConfirm });
  };

  const closeDeleteModal = () => {
    setDeleteModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDelete = async (quizId: string): Promise<void> => {
    const quiz = quizzes.find((q) => q._id === quizId);
    const name = quiz?.category || "this quiz";

    openDeleteModal(`the quiz "${name}"`, async () => {
      closeDeleteModal();
      showSubmissionModal({
        isSubmitting: true,
        currentStep: "saving",
        message: "Deleting quiz...",
      });

      try {
        const response = await api.delete(`/quiz/${quizId}`);
        if (response.data.success) {
          showSubmissionModal({
            isSubmitting: false,
            currentStep: "success",
            message: "Quiz deleted successfully!",
          });
          fetchQuizzes();
        }
      } catch (err: any) {
        showSubmissionModal({
          isSubmitting: false,
          currentStep: "error",
          message: "Failed to delete quiz",
          error: err?.response?.data?.message || err?.message,
        });
      }
    });
  };

  const handleDeleteQuestion = async (
    categoryId: string,
    questionId: string,
  ): Promise<void> => {
    const quiz = quizzes.find((q) => q._id === categoryId);
    const question = quiz?.questions.find((q) => q._id === questionId);
    const qText = question?.question
      ? `"${question.question.substring(0, 40)}${question.question.length > 40 ? "..." : ""}"`
      : "this question";

    openDeleteModal(`question ${qText}`, async () => {
      closeDeleteModal();
      showSubmissionModal({
        isSubmitting: true,
        currentStep: "saving",
        message: "Deleting question...",
      });

      try {
        const response = await api.delete(
          `/quiz/question/${categoryId}/${questionId}`,
        );
        if (response.data.success) {
          showSubmissionModal({
            isSubmitting: false,
            currentStep: "success",
            message: "Question deleted successfully!",
          });
          fetchQuizzes();
          if (selectedQuiz?._id === categoryId) {
            viewQuizDetails(categoryId);
          }
        }
      } catch (err: any) {
        showSubmissionModal({
          isSubmitting: false,
          currentStep: "error",
          message: "Failed to delete question",
          error: err?.response?.data?.message || err?.message,
        });
      }
    });
  };

  const viewQuizDetails = async (quizId: string): Promise<void> => {
    try {
      const response = await api.get(`/quiz/${quizId}`);
      const data = response.data as QuizResponse;
      if (data.success) {
        setSelectedQuiz(data.data);
        setShowDetailsModal(true);
      }
    } catch (err: any) {
      showSubmissionModal({
        isSubmitting: false,
        currentStep: "error",
        message: "Failed to load quiz details",
        error: err?.response?.data?.message || err?.message,
      });
    }
  };

  const toggleExpandQuiz = (quizId: string): void => {
    setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
  };

  const getColor = (index: number) => CARD_COLORS[index % CARD_COLORS.length];
  const getEmoji = (index: number) => EMOJIS[index % EMOJIS.length];

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background:
          "linear-gradient(135deg, #fef9c3 0%, #fee2e2 40%, #dbeafe 100%)",
        fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive",
      }}
    >
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.85); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .card-enter { animation: bounce-in 0.4s ease-out both; }
        .emoji-float { animation: float 3s ease-in-out infinite; }
        .quiz-card:hover { transform: translateY(-3px) rotate(0.5deg); transition: all 0.2s ease; }
        .btn-fun:hover { transform: scale(1.15); transition: transform 0.15s; }
        .expand-btn:hover { animation: wiggle 0.4s ease-in-out; }
        .stars-bg {
          background-image: radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="text-5xl emoji-float">🎮</span>
            <h1
              className="text-4xl font-black text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #f97316, #ef4444, #b91c1c)",
              }}
            >
              Quiz World!
            </h1>
            <span
              className="text-5xl emoji-float"
              style={{ animationDelay: "1.5s" }}
            >
              🌈
            </span>
          </div>
          <p className="text-lg text-red-500 font-bold">
            Manage all your awesome quizzes here ✨
          </p>
        </div>

        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-red-400" />
          </div>
          <input
            type="text"
            placeholder="🔍 Search for a quiz..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-12 pr-6 py-4 text-lg font-bold text-red-800 placeholder-red-300 rounded-3xl border-4 border-red-300 focus:outline-none focus:border-red-500 shadow-lg"
            style={{ background: "rgba(255,255,255,0.85)" }}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-4 border-red-300 rounded-3xl text-red-700 font-bold text-center text-lg">
            😬 Oops! {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center p-20 gap-4">
            <div className="text-6xl animate-spin">⭐</div>
            <p className="text-xl font-bold text-red-500">
              Loading your quizzes...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-red-300">
                <div className="text-6xl mb-4">🎲</div>
                <p className="text-2xl font-bold text-red-400">
                  No quizzes found yet!
                </p>
                <p className="text-red-300 mt-2">Try a different search 🔍</p>
              </div>
            ) : (
              quizzes.map((quiz, index) => {
                const color = getColor(index);
                const emoji = getEmoji(index);
                const isExpanded = expandedQuiz === quiz._id;

                return (
                  <div
                    key={quiz._id}
                    className={`card-enter rounded-3xl border-4 ${color.border} shadow-lg overflow-hidden quiz-card`}
                    style={{ animationDelay: `${index * 0.07}s` }}
                  >
                    <div
                      className={`${color.bg} p-5 flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleExpandQuiz(quiz._id)}
                          className={`expand-btn w-10 h-10 rounded-full ${color.accent} text-white flex items-center justify-center shadow-md font-bold text-lg`}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>
                        <span className="text-3xl">{emoji}</span>
                        <div>
                          <h2 className={`text-xl font-black ${color.text}`}>
                            {quiz.category}
                          </h2>
                          <div className="flex gap-3 mt-1">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-bold text-blue-600 shadow">
                              <Zap className="w-3 h-3" />{" "}
                              {quiz.questions.length} Questions
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-bold text-red-600 shadow">
                              <Trophy className="w-3 h-3" />{" "}
                              {quiz.results?.length || 0} Results
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => viewQuizDetails(quiz._id)}
                          title="View Details"
                          className={`btn-fun w-11 h-11 rounded-2xl bg-white shadow-md flex items-center justify-center ${color.text} border-2 ${color.border}`}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(quiz._id)}
                          title="Delete Quiz"
                          className="btn-fun w-11 h-11 rounded-2xl bg-white shadow-md flex items-center justify-center text-red-500 border-2 border-red-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div
                        className={`${color.light} p-6 border-t-4 ${color.border}`}
                      >
                        <div className="space-y-6">
                          <div>
                            <h3
                              className={`text-xl font-black ${color.text} mb-4 flex items-center gap-2`}
                            >
                              <span>📝</span> Questions
                            </h3>
                            <div className="space-y-4">
                              {quiz.questions.map((question, idx) => (
                                <div
                                  key={question._id}
                                  className="bg-white rounded-2xl p-4 border-3 border-white shadow-md"
                                >
                                  <div className="flex justify-between items-start mb-3 gap-3">
                                    <div className="flex items-start gap-3">
                                      <span
                                        className={`flex-shrink-0 w-8 h-8 rounded-full ${color.accent} text-white flex items-center justify-center font-black text-sm`}
                                      >
                                        {idx + 1}
                                      </span>
                                      <p className="font-bold text-gray-800 text-base">
                                        {question.question}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleDeleteQuestion(
                                          quiz._id,
                                          question._id,
                                        )
                                      }
                                      className="btn-fun flex-shrink-0 text-red-400 hover:text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                                    {question.options.map((option, optIdx) => (
                                      <div
                                        key={optIdx}
                                        className={`${color.bg} rounded-xl p-3 flex justify-between items-center border-2 ${color.border}`}
                                      >
                                        <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                                          <span>
                                            {
                                              OPTION_EMOJIS[
                                                optIdx % OPTION_EMOJIS.length
                                              ]
                                            }
                                          </span>
                                          {option.text}
                                        </span>
                                        <span
                                          className={`ml-2 px-2 py-1 text-xs font-black ${color.accent} text-white rounded-full flex-shrink-0`}
                                        >
                                          +{option.score}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {quiz.results && quiz.results.length > 0 && (
                            <div>
                              <h3
                                className={`text-xl font-black ${color.text} mb-4 flex items-center gap-2`}
                              >
                                <span>🏆</span> Result Ranges
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {quiz.results
                                  .sort((a, b) => a.minScore - b.minScore)
                                  .map((result, idx) => (
                                    <div
                                      key={idx}
                                      className={`bg-white rounded-2xl p-4 border-2 ${color.border} shadow`}
                                    >
                                      <div
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 ${color.accent} text-white rounded-full font-black text-sm mb-2`}
                                      >
                                        <Star className="w-4 h-4" />
                                        {result.minScore} – {result.maxScore}{" "}
                                        pts
                                      </div>
                                      <p className="text-sm font-bold text-gray-700">
                                        {result.message}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {pagination.totalPages > 0 && (
              <div className="flex items-center justify-between pt-4 pb-2">
                <p className="text-sm font-bold text-red-500">
                  📄 Page {pagination.currentPage} of {pagination.totalPages}{" "}
                  &nbsp;·&nbsp; {pagination.totalQuizzes} quizzes total
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="w-11 h-11 rounded-2xl bg-white border-4 border-red-300 text-red-500 font-black flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-100 transition-colors shadow"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="w-11 h-11 rounded-2xl bg-white border-4 border-red-300 text-red-500 font-black flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-100 transition-colors shadow"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showDetailsModal && selectedQuiz && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{
            background: "rgba(127,29,29,0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="bg-white rounded-3xl w-full max-h-[92vh] flex flex-col lg:flex-row overflow-hidden shadow-2xl border-4 border-red-400"
            style={{ maxWidth: "1300px" }}
          >
            <div className="flex-1 overflow-y-auto">
              <div
                className="sticky top-0 bg-white border-b-4 border-red-200 p-5 z-10 flex justify-between items-center"
                style={{
                  background: "linear-gradient(135deg, #fee2e2, #fecaca)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🎯</span>
                  <div>
                    <h2 className="text-2xl font-black text-red-700">
                      {selectedQuiz.category}
                    </h2>
                    <p className="text-sm font-bold text-red-400">
                      {selectedQuiz.questions.length} questions inside!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="lg:hidden btn-fun w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center border-2 border-red-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-black text-red-700 flex items-center gap-2">
                  📋 All Questions
                </h3>
                {selectedQuiz.questions.map((question, idx) => (
                  <div
                    key={question._id}
                    className="border-4 border-red-200 rounded-2xl p-4 bg-red-50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center font-black">
                          {idx + 1}
                        </span>
                        <p className="font-black text-gray-800 text-base">
                          {question.question}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleDeleteQuestion(selectedQuiz._id, question._id)
                        }
                        className="btn-fun flex-shrink-0 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {question.options.map((option, optIdx) => (
                        <div
                          key={optIdx}
                          className="flex justify-between items-center gap-2 p-3 bg-white rounded-xl border-2 border-red-200"
                        >
                          <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <span>
                              {OPTION_EMOJIS[optIdx % OPTION_EMOJIS.length]}
                            </span>
                            {option.text}
                          </span>
                          <span className="px-3 py-1 text-xs font-black bg-red-500 text-white rounded-full flex-shrink-0">
                            +{option.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="w-full lg:w-96 flex flex-col max-h-80 lg:max-h-full"
              style={{
                background: "linear-gradient(180deg, #b91c1c 0%, #ef4444 100%)",
              }}
            >
              <div className="p-5 flex justify-between items-center border-b-4 border-red-700">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🏆</span>
                  <h3 className="text-xl font-black text-white">
                    Result Ranges
                  </h3>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="hidden lg:flex btn-fun w-9 h-9 rounded-full bg-white bg-opacity-20 text-white items-center justify-center border-2 border-white border-opacity-40"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 stars-bg">
                {selectedQuiz.results && selectedQuiz.results.length > 0 ? (
                  <div className="space-y-3">
                    {selectedQuiz.results
                      .sort((a, b) => a.minScore - b.minScore)
                      .map((result, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-yellow-400"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">⭐</span>
                            <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-black text-sm">
                              {result.minScore} – {result.maxScore} pts
                            </div>
                          </div>
                          <p className="text-sm font-bold text-gray-700 leading-relaxed">
                            {result.message}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <span className="text-5xl">🎲</span>
                    <p className="text-white text-center font-bold opacity-80">
                      No result ranges yet!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteModal.onConfirm}
        itemName={deleteModal.itemName}
      />
    </div>
  );
};

export default QuizTable;
