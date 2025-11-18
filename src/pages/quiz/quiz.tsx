import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generateIconPositions } from "@/utils/assessment/quizAndAssessment";
import QuizResult from "@/components/assessment/quiz/quisResult";
import QuizQuestion from "@/components/assessment/quiz/quizQuestions";
import { handlePayment } from "@/services/paymentService";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import axios from "axios";
import { QuizData } from "@/types/adda/quiz";

const STORAGE_KEY = (id: string) => `quiz_${id}_state`;

const QuizPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backgroundIcons] = useState(() => generateIconPositions(15));
  const [hasPaid, setHasPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!categoryId) return;
      try {
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/quiz/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuiz(response.data.data);
        setHasPaid(false);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  const TOTAL_QUESTIONS = quiz?.questions.length || 0;
  const FREE_QUESTION_LIMIT = 5;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const message = urlParams.get("message");
    if (status && message) {
      toast[status.toLowerCase() === "success" ? "success" : "error"](message);
      if (status.toLowerCase() === "success") {
        setHasPaid(true);
        setShowPaymentModal(false);
      } else {
        setShowPaymentModal(true);
        setIsPaying(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!categoryId || !quiz) return;
    const key = STORAGE_KEY(categoryId);
    const raw = localStorage.getItem(key);
    if (raw) {
      const { answers: a, currentQuestion: q, hasPaid: p } = JSON.parse(raw);
      setAnswers(a ?? {});
      setCurrentQuestion(q ?? 0);
      setHasPaid(p ?? false);
    }
  }, [categoryId, quiz]);

  useEffect(() => {
    if (!categoryId || !quiz) return;
    const key = STORAGE_KEY(categoryId);
    localStorage.setItem(
      key,
      JSON.stringify({ answers, currentQuestion, hasPaid })
    );
  }, [answers, currentQuestion, hasPaid, categoryId]);

  useEffect(() => {
    if (quiz && quiz.questions.length > 0) {
      setProgress(
        ((currentQuestion + 1) /
          (hasPaid ? TOTAL_QUESTIONS : FREE_QUESTION_LIMIT)) *
          100
      );
    }
  }, [currentQuestion, quiz, hasPaid, TOTAL_QUESTIONS]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!quiz || !categoryId) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p>Quiz not found. Please go back and select a valid quiz.</p>
        <button
          onClick={() => navigate("/quiz")}
          className="mt-4 py-2 px-4 bg-gray-200 rounded-xl"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const handleAnswerSelect = (score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: score,
    }));

    if (currentQuestion === FREE_QUESTION_LIMIT - 1 && !hasPaid) {
      setShowPaymentModal(true);
    }
  };

  const handleNext = () => {
    const isLastFreeQuestion = currentQuestion === FREE_QUESTION_LIMIT - 1;
    const isLastQuestionOverall = currentQuestion === quiz.questions.length - 1;

    if (isLastFreeQuestion && !hasPaid) {
      setShowPaymentModal(true);
      return;
    }

    if (isLastQuestionOverall && hasPaid) {
      setShowResults(true);
      return;
    }

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const calculateResult = () => {
    const totalScore = Object.values(answers).reduce(
      (sum, score) => sum + score,
      0
    );
    const result = quiz.results.find(
      (r) => totalScore >= r.minScore && totalScore <= r.maxScore
    );
    return result?.message || "No result found";
  };

  const handleRetake = () => {
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
    setProgress(0);
    setHasPaid(false);
    setShowPaymentModal(false);
    localStorage.removeItem(STORAGE_KEY(categoryId));
  };

  const handleMockPayment = async () => {
    setIsPaying(true);
    const billing_name =
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.fullName || "Guest";
    const billing_tel = user?.phoneNumbers?.[0]?.phoneNumber
      ? user.phoneNumbers[0].phoneNumber.replace(/^\+\d+\s*/, "")
      : "0123456789";
    const billing_email =
      user?.emailAddresses?.[0]?.emailAddress || "john@example.com";
    const formData = {
      billing_name,
      billing_email,
      billing_tel,
      currency: "INR",
      order_id: `order-${Date.now()}`,
    };
    const redeemPoints = 0;
    const appliedDiscount = 0;
    const handleRedeemPoints = (points: number, orderId: string) =>
      console.log(`Redeemed ${points} for order ${orderId}`);
    const rewardPurchaseProduct = (productId: string) =>
      console.log(`Rewarded points for ${productId}`);
    const orderType = "QUIZ_PURCHASE";

    try {
      const token = await getToken();
      const proceedToPay = await handlePayment(
        userId || "anonymous",
        { firstName: user?.firstName || "", lastName: user?.lastName || "" },
        quiz._id,
        token!,
        formData,
        redeemPoints,
        appliedDiscount,
        handleRedeemPoints,
        rewardPurchaseProduct,
        { questionsByDifficulty: { dynamic: quiz.questions } },
        "dynamic",
        orderType
      );
      await proceedToPay({
        preventDefault: () => {},
      } as React.MouseEvent<HTMLButtonElement>);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment. Please try again.");
      setIsPaying(false);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    navigate("/quiz");
  };

  if (showResults) {
    return (
      <QuizResult
        quiz={quiz}
        answers={answers}
        result={calculateResult()}
        backgroundIcons={backgroundIcons}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <div className="relative">
      <QuizQuestion
        quiz={quiz}
        backgroundIcons={backgroundIcons}
        currentQuestion={currentQuestion}
        answers={answers}
        progress={progress}
        onAnswerSelect={handleAnswerSelect}
        onNext={handleNext}
        onPaymentPrompt={handleMockPayment}
        hasPaid={hasPaid}
        showPaymentModal={showPaymentModal}
        onClosePaymentModal={handleCancelPayment}
      />

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">
              Continue Your Quiz
            </h2>
            {isPaying ? (
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-green-500 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-gray-600">Initializing Payment...</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  You've answered {FREE_QUESTION_LIMIT} free questions. Pay ₹9
                  to unlock all {quiz.questions.length} questions and continue!
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleMockPayment}
                    disabled={isPaying}
                    className={`py-2 px-6 bg-green-500 text-white rounded-xl hover:bg-green-600 transition ${
                      isPaying ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Pay ₹9
                  </button>
                  <button
                    onClick={handleCancelPayment}
                    disabled={isPaying}
                    className="py-2 px-6 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
