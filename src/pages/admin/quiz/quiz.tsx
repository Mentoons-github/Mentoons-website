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
        `/quiz?page=${currentPage}&limit=10&search=${searchTerm}`
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
    questionId: string
  ): Promise<void> => {
    const quiz = quizzes.find((q) => q._id === categoryId);
    const question = quiz?.questions.find((q) => q._id === questionId);
    const qText = question?.question
      ? `"${question.question.substring(0, 40)}${
          question.question.length > 40 ? "..." : ""
        }"`
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
          `/quiz/question/${categoryId}/${questionId}`
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Quiz Management
            </h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by category..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Questions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Result Ranges
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quizzes.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No quizzes found
                        </td>
                      </tr>
                    ) : (
                      quizzes.map((quiz) => (
                        <React.Fragment key={quiz._id}>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <button
                                  onClick={() => toggleExpandQuiz(quiz._id)}
                                  className="mr-3 text-gray-500 hover:text-gray-700 transition-colors"
                                  aria-label={
                                    expandedQuiz === quiz._id
                                      ? "Collapse"
                                      : "Expand"
                                  }
                                >
                                  {expandedQuiz === quiz._id ? (
                                    <ChevronDown className="w-5 h-5" />
                                  ) : (
                                    <ChevronRight className="w-5 h-5" />
                                  )}
                                </button>
                                <span className="text-sm font-medium text-gray-900">
                                  {quiz.category}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {quiz.questions.length} questions
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                {quiz.results?.length || 0} result ranges
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => viewQuizDetails(quiz._id)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5 inline" />
                              </button>
                              <button
                                onClick={() => handleDelete(quiz._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Quiz"
                              >
                                <Trash2 className="w-5 h-5 inline" />
                              </button>
                            </td>
                          </tr>

                          {expandedQuiz === quiz._id && (
                            <tr>
                              <td colSpan={4} className="px-6 py-4 bg-gray-50">
                                <div className="space-y-6">
                                  {/* Questions Section */}
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                      Questions
                                    </h3>
                                    <div className="space-y-4">
                                      {quiz.questions.map((question, idx) => (
                                        <div
                                          key={question._id}
                                          className="bg-white p-4 rounded-lg border border-gray-200"
                                        >
                                          <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-medium text-gray-900">
                                              Q{idx + 1}: {question.question}
                                            </h4>
                                            <button
                                              onClick={() =>
                                                handleDeleteQuestion(
                                                  quiz._id,
                                                  question._id
                                                )
                                              }
                                              className="text-red-500 hover:text-red-700"
                                              title="Delete Question"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {question.options.map(
                                              (option, optIdx) => (
                                                <div
                                                  key={optIdx}
                                                  className="p-3 bg-gray-50 rounded border border-gray-200"
                                                >
                                                  <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-700">
                                                      {option.text}
                                                    </span>
                                                    <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                                                      Score: {option.score}
                                                    </span>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Result Ranges Section */}
                                  {quiz.results && quiz.results.length > 0 && (
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        Result Ranges
                                      </h3>
                                      <div className="space-y-3">
                                        {quiz.results
                                          .sort(
                                            (a, b) => a.minScore - b.minScore
                                          )
                                          .map((result, idx) => (
                                            <div
                                              key={idx}
                                              className="bg-white p-4 rounded-lg border border-gray-200"
                                            >
                                              <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                  <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                                                      {result.minScore} -{" "}
                                                      {result.maxScore} points
                                                    </span>
                                                  </div>
                                                  <p className="text-sm text-gray-700">
                                                    {result.message}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {pagination.currentPage} of{" "}
                    {pagination.totalPages} ({pagination.totalQuizzes} total
                    quizzes)
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showDetailsModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className="bg-white rounded-lg w-full max-h-[90vh] flex flex-col lg:flex-row"
            style={{ maxWidth: "1400px" }}
          >
            {/* Left Side - Questions (Scrollable) */}
            <div className="flex-1 overflow-y-auto lg:border-r border-b lg:border-b-0 border-gray-200">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 z-10 flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {selectedQuiz.category}
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Questions
                </h3>
                <div className="space-y-4">
                  {selectedQuiz.questions.map((question, idx) => (
                    <div
                      key={question._id}
                      className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4 gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          Question {idx + 1}: {question.question}
                        </h3>
                        <button
                          onClick={() =>
                            handleDeleteQuestion(selectedQuiz._id, question._id)
                          }
                          className="text-red-500 hover:text-red-700 flex-shrink-0"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          Options:
                        </h4>
                        {question.options.map((option, optIdx) => (
                          <div
                            key={optIdx}
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <span className="text-sm sm:text-base text-gray-800">
                              {option.text}
                            </span>
                            <span className="px-3 py-1 text-xs sm:text-sm font-semibold bg-blue-100 text-blue-800 rounded-full w-fit">
                              Score: {option.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Result Ranges (Fixed) */}
            <div className="w-full lg:w-96 bg-blue-50 flex flex-col max-h-96 lg:max-h-full">
              <div className="sticky top-0 bg-blue-600 text-white p-4 sm:p-6 flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-bold">Result Ranges</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="hidden lg:block text-white hover:text-blue-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {selectedQuiz.results && selectedQuiz.results.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {selectedQuiz.results
                      .sort((a, b) => a.minScore - b.minScore)
                      .map((result, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-lg p-4 sm:p-5 shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                            <div className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm">
                              {result.minScore} - {result.maxScore}
                            </div>
                            <span className="text-xs text-gray-500 font-medium">
                              POINTS
                            </span>
                          </div>
                          <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                            {result.message}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center text-sm sm:text-base">
                      No result ranges defined for this quiz
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
