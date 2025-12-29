import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generateIconPositions } from "@/utils/assessment/quizAndAssessment";
import QuizResult from "@/components/assessment/quiz/quisResult";
import { handlePayment } from "@/services/paymentService";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import axios from "axios";
import { QuizData } from "@/types/adda/quiz";
import { QUIZES } from "@/constant/Quizes/quizeDatas";
import AssessmentQuesionField from "@/components/assessment/quiz/assessmentQuestions";
import QuizQuistionField from "@/components/assessment/quiz/QuizQuestionField";
import QuizFinalScore from "@/components/assessment/quiz/QuizFinalScore";

export interface RuntimeQuiz {
  title: string;
  questions: {
    _id: string;
    question: string;
    options: string[];
    answer: string;
  }[];
}

const STORAGE_KEY = (id: string) => `quiz_${id}_state`;

const QuizPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const [assessment, setAssessment] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backgroundIcons] = useState(() => generateIconPositions(15));
  const [hasPaid, setHasPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [quizCurrentQuestion, setQuizCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [staticQuiz, setStaticQuiz] = useState<RuntimeQuiz | null>(null);

  const findStaticById = (id: string) => {
    for (const quiz of QUIZES) {
      // match quiz id
      if (quiz._id === id) {
        return { quiz, type: null };
      }

      // match type id
      const foundType = quiz.type?.find((t) => t._id === id);
      if (foundType) {
        return { quiz, type: foundType };
      }
    }

    return null;
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!categoryId) return;
      if (categoryId.length < 10) {
        const result = findStaticById(categoryId);

        if (!result) {
          toast.error("Quiz not found");
          setLoading(false);
          return;
        }

        const { type } = result;

        // 🎯 Clicked TYPE
        if (type) {
          setStaticQuiz({
            title: type.artists,
            questions: type.questions,
          });
        }

        // 🎯 Clicked QUIZ (optional behavior)
        else {
          // maybe show modal / types list
          navigate("/quiz");
        }

        setLoading(false);
        return;
      }

      if (categoryId.length > 10) {
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
          setAssessment(response.data.data);
          setHasPaid(false);
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to load quiz");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchQuiz();
  }, []);

  const TOTAL_QUESTIONS = assessment?.questions.length || 0;
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
    if (!categoryId || !assessment) return;
    const key = STORAGE_KEY(categoryId);
    const raw = localStorage.getItem(key);
    if (raw) {
      const { answers: a, currentQuestion: q, hasPaid: p } = JSON.parse(raw);
      setAnswers(a ?? {});
      setCurrentQuestion(q ?? 0);
      setHasPaid(p ?? false);
    }
  }, [categoryId, assessment]);

  useEffect(() => {
    if (!categoryId || !assessment) return;
    const key = STORAGE_KEY(categoryId);
    localStorage.setItem(
      key,
      JSON.stringify({ answers, currentQuestion, hasPaid })
    );
  }, [answers, currentQuestion, hasPaid, categoryId]);

  useEffect(() => {
    if (assessment && assessment.questions.length > 0) {
      setProgress(
        ((currentQuestion + 1) /
          (hasPaid ? TOTAL_QUESTIONS : FREE_QUESTION_LIMIT)) *
          100
      );
    }
  }, [currentQuestion, assessment, hasPaid, TOTAL_QUESTIONS]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!categoryId || (!assessment && !staticQuiz)) {
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
    if (!assessment) return;
    const isLastFreeQuestion = currentQuestion === FREE_QUESTION_LIMIT - 1;
    const isLastQuestionOverall =
      currentQuestion === assessment.questions.length - 1;

    if (isLastFreeQuestion && !hasPaid) {
      setShowPaymentModal(true);
      return;
    }

    if (isLastQuestionOverall && hasPaid) {
      setShowResults(true);
      return;
    }

    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleQuizAnswerSelect = (answer: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [quizCurrentQuestion]: answer,
    }));
  };

  const handleQuizNext = () => {
    if (!staticQuiz) return;

    if (quizCurrentQuestion === staticQuiz?.questions?.length - 1) {
      setQuizFinished(true);
    } else {
      setQuizCurrentQuestion((prev) => prev + 1);
    }
  };

  const calculateQuizScore = () => {
    if (!staticQuiz) return 0;

    return staticQuiz?.questions.reduce((score, q, index) => {
      return quizAnswers[index] === q.answer ? score + 1 : score;
    }, 0);
  };

  const calculateResult = () => {
    const totalScore = Object.values(answers).reduce(
      (sum, score) => sum + score,
      0
    );
    const result = assessment?.results?.find(
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
    if (!assessment) return;
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
        assessment._id,
        token!,
        formData,
        redeemPoints,
        appliedDiscount,
        handleRedeemPoints,
        rewardPurchaseProduct,
        { questionsByDifficulty: { dynamic: assessment.questions } },
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
        quiz={assessment as QuizData}
        answers={answers}
        result={calculateResult()}
        backgroundIcons={backgroundIcons}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <div className="relative">
      {assessment && (
        <AssessmentQuesionField
          quiz={assessment}
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
      )}

      {staticQuiz && !quizFinished && (
        <QuizQuistionField
          quiz={staticQuiz}
          currentQuestion={quizCurrentQuestion}
          answers={quizAnswers}
          onAnswerSelect={handleQuizAnswerSelect}
          onNext={handleQuizNext}
        />
      )}

      {staticQuiz && quizFinished && (
        <QuizFinalScore
          quiz={staticQuiz}
          score={calculateQuizScore() as number}
          onRetry={() => {
            setQuizCurrentQuestion(0);
            setQuizAnswers({});
            setQuizFinished(false);
          }}
        />
      )}

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
                  to unlock all {assessment?.questions.length} questions and
                  continue!
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
