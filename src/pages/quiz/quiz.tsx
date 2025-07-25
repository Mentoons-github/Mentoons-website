import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QUIZ_DATA } from "@/constant/constants";
import { generateIconPositions } from "@/utils/assessment/quizAndAssessment";
import QuizResult from "@/components/assessment/quiz/quisResult";
import QuizStarting from "@/components/assessment/quiz/starting";
import QuizQuestion from "@/components/assessment/quiz/quizQuestions";
import { handlePayment } from "@/services/paymentService";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  type: "multiple" | "scale" | "boolean";
  category?: string;
  correctAnswer: string;
}

export interface QuizData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  bgColor: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  questionsByDifficulty: {
    easy: QuizQuestion[];
    medium: QuizQuestion[];
    hard: QuizQuestion[];
  };
  resultCategories: string[];
}

const QuizPage: React.FC = () => {
  const { quizType, difficulty } = useParams<{
    quizType: string;
    difficulty: "easy" | "medium" | "hard" | undefined;
  }>();
  
  const navigate = useNavigate();
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backgroundIcons] = useState(() => generateIconPositions(15));
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const currentQuiz: QuizData | undefined =
    QUIZ_DATA[quizType as keyof typeof QUIZ_DATA];
  const validDifficulties = ["easy", "medium", "hard"] as const;
  const isValidDifficulty =
    difficulty && validDifficulties.includes(difficulty);

  const questions = useMemo(() => {
    return isValidDifficulty
      ? currentQuiz?.questionsByDifficulty[difficulty].slice(
          0,
          hasPaid ? 25 : 5
        )
      : [];
  }, [currentQuiz, difficulty, isValidDifficulty, hasPaid]);

  const FREE_QUESTION_LIMIT = 5;
  const TOTAL_QUESTIONS = 25;

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

  // Update progress
  useEffect(() => {
    if (quizStarted && currentQuiz && questions.length > 0) {
      setProgress(
        ((currentQuestion + 1) /
          (hasPaid ? TOTAL_QUESTIONS : FREE_QUESTION_LIMIT)) *
          100
      );
    }
  }, [currentQuestion, quizStarted, currentQuiz, difficulty, hasPaid]);

  // Reset payment modal on unmount
  useEffect(() => {
    return () => {
      setShowPaymentModal(false);
    };
  }, []);

  // Validate quizType and difficulty
  if (!quizType || !currentQuiz || !isValidDifficulty) {
    console.error(`Invalid quizType: ${quizType} or difficulty: ${difficulty}`);
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p>
          Invalid quiz type or difficulty. Please go back and select a valid
          quiz.
        </p>
        <button
          onClick={() => navigate("/quiz")}
          className="mt-4 py-2 px-4 bg-gray-200 rounded-xl"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerSubmitted || showPaymentModal) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion]: answer,
      }));
      setIsCorrect(answer === questions[currentQuestion].correctAnswer);
      setIsAnswerSubmitted(true);

      if (currentQuestion === FREE_QUESTION_LIMIT - 1 && !hasPaid) {
        setShowPaymentModal(true);
      }
    }
  };

  const handleNext = () => {
    if (!isAnswerSubmitted || showPaymentModal) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
    } else {
      setShowResults(true);
    }
  };

  const getResult = () => {
    const correctCount = Object.entries(answers).reduce(
      (acc, [index, answer]) => {
        return (
          acc + (answer === questions[parseInt(index)].correctAnswer ? 1 : 0)
        );
      },
      0
    );

    const totalQuestions = hasPaid ? TOTAL_QUESTIONS : FREE_QUESTION_LIMIT;
    const percentage = (correctCount / totalQuestions) * 100;

    if (percentage < 25) return currentQuiz.resultCategories[0];
    if (percentage < 50) return currentQuiz.resultCategories[1];
    if (percentage < 75) return currentQuiz.resultCategories[2];
    return currentQuiz.resultCategories[3];
  };

  const handleRetake = () => {
    setShowResults(false);
    setQuizStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setProgress(0);
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setShowPaymentModal(false);
  };

  const handleStart = () => {
    setQuizStarted(true);
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
    const quizId = currentQuiz?.id || "quiz123";
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
        quizId,
        token!,
        formData,
        redeemPoints,
        appliedDiscount,
        handleRedeemPoints,
        rewardPurchaseProduct,
        currentQuiz,
        difficulty || "easy",
        orderType
      );
      await proceedToPay({
        preventDefault: () => {},
      } as React.MouseEvent<HTMLButtonElement>);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment. Please try again.");
      setIsPaying(false); // Reset paying state on error
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    navigate("/quiz");
  };

  return (
    <div className="relative">
      {!quizStarted ? (
        <QuizStarting
          quiz={currentQuiz}
          quizType={quizType}
          backgroundIcons={backgroundIcons}
          onStart={handleStart}
        />
      ) : showResults ? (
        <QuizResult
          quiz={currentQuiz}
          quizType={difficulty as "easy" | "medium" | "hard"}
          answers={answers}
          result={getResult()}
          correctCount={Object.entries(answers).reduce(
            (acc, [index, answer]) => {
              return (
                acc +
                (answer === questions[parseInt(index)].correctAnswer ? 1 : 0)
              );
            },
            0
          )}
          backgroundIcons={backgroundIcons}
          onRetake={handleRetake}
        />
      ) : (
        <QuizQuestion
          quiz={currentQuiz}
          quizType={difficulty}
          backgroundIcons={backgroundIcons}
          currentQuestion={currentQuestion}
          answers={answers}
          isAnswerSubmitted={isAnswerSubmitted}
          isCorrect={isCorrect}
          progress={progress}
          onAnswerSelect={handleAnswerSelect}
          onNext={handleNext}
          onPaymentPrompt={handleMockPayment}
          hasPaid={hasPaid}
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
                  to unlock all{" "}
                  {currentQuiz.questionsByDifficulty[difficulty].length}{" "}
                  questions and continue from question {FREE_QUESTION_LIMIT + 1}
                  !
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
