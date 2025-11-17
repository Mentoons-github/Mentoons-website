import { motion, AnimatePresence } from "framer-motion";
import {
  BackgroundIcons,
  containerVariants,
} from "@/utils/assessment/quizAndAssessment";
import { CircleHelp } from "lucide-react";

interface Option {
  text: string;
  score: number;
}

interface Question {
  _id: string;
  question: string;
  options: Option[];
}

interface QuizData {
  _id: string;
  category: string;
  questions: Question[];
}

interface QuizQuestionProps {
  quiz: QuizData;
  backgroundIcons: Array<{
    id: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    delay: number;
  }>;
  currentQuestion: number;
  answers: Record<number, number>;
  progress: number;
  onAnswerSelect: (score: number) => void;
  onNext: () => void;
  onPaymentPrompt: () => void;
  hasPaid: boolean;
  showPaymentModal?: boolean;
  onClosePaymentModal?: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  quiz,
  backgroundIcons,
  currentQuestion,
  answers,
  progress,
  onAnswerSelect,
  onNext,
  onPaymentPrompt,
  hasPaid,
  showPaymentModal,
  onClosePaymentModal,
}) => {
  const question = quiz.questions[currentQuestion];
  if (!question) return null;

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${progress}%`,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 relative"
    >
      <BackgroundIcons quizType={quiz._id} backgroundIcons={backgroundIcons} />
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
            className="h-full bg-blue-600"
          />
        </div>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CircleHelp className="w-8 h-8 text-blue-600" />
              <span className="font-semibold text-gray-800">
                {quiz.category}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {currentQuestion + 1} of {hasPaid ? quiz.questions.length : 5}
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

              <div className="grid grid-cols-1 gap-4 mb-8">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => onAnswerSelect(option.score)}
                    disabled={answers[currentQuestion] !== undefined}
                    className={`p-6 text-left rounded-xl border-2 transition-all min-h-[80px] flex items-center ${
                      answers[currentQuestion] === option.score
                        ? "border-blue-500 bg-blue-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
                    } ${
                      answers[currentQuestion] !== undefined
                        ? "cursor-not-allowed"
                        : ""
                    }`}
                    whileHover={
                      answers[currentQuestion] !== undefined
                        ? {}
                        : { scale: 1.02 }
                    }
                    whileTap={
                      answers[currentQuestion] !== undefined
                        ? {}
                        : { scale: 0.98 }
                    }
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="font-medium text-gray-800">
                      {option.text}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-end mt-8">
            <button
              onClick={onNext}
              disabled={answers[currentQuestion] === undefined}
              className="py-3 px-8 bg-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {currentQuestion === (hasPaid ? quiz.questions.length - 1 : 5) - 1
                ? "Finish"
                : "Next"}
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
              Pay ₹9 to unlock all {quiz.questions.length} questions!
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
