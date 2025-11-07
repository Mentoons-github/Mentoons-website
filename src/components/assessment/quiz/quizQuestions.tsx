import { motion, AnimatePresence } from "framer-motion";
import {
  BackgroundIcons,
  containerVariants,
} from "@/utils/assessment/quizAndAssessment";
import { QuizData } from "@/pages/quiz/quiz";

interface QuizQuestionProps {
  quiz: QuizData;
  quizType: "easy" | "medium" | "hard";
  backgroundIcons: Array<{
    id: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    delay: number;
  }>;
  currentQuestion: number;
  answers: Record<number, string>;
  isAnswerSubmitted: boolean;
  isCorrect: boolean | null;
  progress: number;
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
  onPaymentPrompt: () => void;
  hasPaid: boolean;
  showPaymentModal?: boolean;
  onClosePaymentModal?: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  quiz,
  quizType,
  backgroundIcons,
  currentQuestion,
  answers,
  isAnswerSubmitted,
  isCorrect,
  progress,
  onAnswerSelect,
  onNext,
  onPaymentPrompt,
  hasPaid,
  showPaymentModal,
  onClosePaymentModal,
}) => {
  const questions = quiz.questionsByDifficulty[quizType];
  const question = questions[currentQuestion];

  if (!question || currentQuestion >= questions.length) {
    return null;
  }

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${progress}%`,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const isFreeLimitReached = currentQuestion === 4 && !hasPaid;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 relative"
    >
      <BackgroundIcons quizType={quizType} backgroundIcons={backgroundIcons} />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10"
      >
        <div className="h-2 bg-gray-200">
          <motion.div
            variants={progressVariants}
            initial="hidden"
            animate="visible"
            custom={progress}
            className={`h-full bg-gradient-to-r ${quiz.gradientFrom} ${quiz.gradientTo}`}
          />
        </div>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{quiz.icon}</span>
              <span className="font-semibold text-gray-800">{quiz.title}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {currentQuestion + 1} of {questions.length}
              </span>
            </div>
          </div>
        </div>
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                {question.question}
              </h2>

              {isAnswerSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center mb-6 p-4 rounded-xl ${
                    isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isCorrect ? (
                    <span>Correct! Well done!</span>
                  ) : (
                    <span>
                      Incorrect. The correct answer is: {question.correctAnswer}
                    </span>
                  )}
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-8">
                {question.options.slice(0, 4).map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => onAnswerSelect(option)}
                    disabled={isAnswerSubmitted}
                    className={`p-6 text-center rounded-xl border-2 transition-all min-h-[120px] flex items-center justify-center ${
                      answers[currentQuestion] === option
                        ? isAnswerSubmitted && isCorrect
                          ? "border-green-500 bg-green-50 shadow-lg"
                          : isAnswerSubmitted && !isCorrect
                          ? "border-red-500 bg-red-50 shadow-lg"
                          : "border-blue-500 bg-blue-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
                    } ${isAnswerSubmitted ? "cursor-not-allowed" : ""}`}
                    whileHover={isAnswerSubmitted ? {} : { scale: 1.02 }}
                    whileTap={isAnswerSubmitted ? {} : { scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="relative w-full">
                      <div className="font-medium text-gray-800 leading-relaxed">
                        {option}
                      </div>
                      {answers[currentQuestion] === option && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${
                            isCorrect ? "bg-green-500" : "bg-red-500"
                          } flex items-center justify-center shadow-lg`}
                        >
                          <span className="text-white text-sm font-bold">
                            {isCorrect ? "Checkmark" : "Cross"}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-end mt-8">
            <button
              onClick={onNext}
              disabled={!isAnswerSubmitted || isFreeLimitReached}
              className={`py-3 px-8 bg-gradient-to-r ${quiz.gradientFrom} ${quiz.gradientTo} text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </motion.div>

      {showPaymentModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
          >
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">
              Free Limit Reached
            </h2>
            <p className="text-gray-700 mb-6">
              You've answered the 5 free questions. Pay ₹9 to unlock all{" "}
              {questions.length} questions and continue the quiz!
            </p>
            <button
              onClick={onPaymentPrompt}
              className="py-3 px-8 bg-green-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Pay ₹9 to Continue
            </button>
            <button
              onClick={onClosePaymentModal}
              className="mt-4 ml-4 py-2 px-4 bg-gray-200 rounded-xl"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizQuestion;
