import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BackgroundIcons } from "@/utils/assessment/quizAndAssessment";
import { jsPDF } from "jspdf";
import { FaLock, FaTrophy, FaStar, FaMedal } from "react-icons/fa6";
import { Check, X } from "lucide-react";
import { QuizData } from "@/types/adda/quiz";

interface QuizResultProps {
  quiz: QuizData;
  answers: Record<number, number>;
  correctness?: Record<number, boolean>;
  result: string;
  backgroundIcons: Array<{
    id: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    delay: number;
  }>;
  onRetake: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const pulseVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const isOptionCorrect = (
  option: { text: string; isCorrect?: boolean },
  answer?: string,
): boolean => {
  if (option.isCorrect) return true;
  if (!answer) return false;
  return option.text.trim().toLowerCase() === answer.trim().toLowerCase();
};

const QuizAnswers: React.FC<{
  quiz: QuizData;
  answers: Record<number, number>;
}> = ({ quiz, answers }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
        <span className="text-blue-600">📝</span>
        Your Responses
      </h3>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {quiz.questions.map((question, index) => {
          const selected = question.options.find(
            (opt) => opt.score === answers[index],
          );
          return (
            <div
              key={question._id}
              className="flex justify-between items-center py-2 px-3 bg-white rounded-lg border border-gray-200"
            >
              <span className="text-xs text-gray-600 font-medium">
                Q{index + 1}
              </span>
              <span className="text-xs font-medium text-gray-800 text-right flex-1 mx-3 truncate">
                {selected?.text || "Not answered"}
              </span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {answers[index] ?? 0}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const KnowledgeAnswers: React.FC<{
  quiz: QuizData;
  correctness: Record<number, boolean>;
}> = ({ quiz, correctness }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
        <span className="text-blue-600">📝</span>
        Your Answers
      </h3>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {quiz.questions.map((question, index) => {
          const correctOption = question.options.find((opt) =>
            isOptionCorrect(opt, question.answer),
          );
          const wasCorrect = correctness[index] === true;
          const wasAnswered = correctness[index] !== undefined;
          return (
            <div
              key={question._id}
              className="flex justify-between items-center py-2 px-3 bg-white rounded-lg border border-gray-200"
            >
              <span className="text-xs text-gray-600 font-medium">
                Q{index + 1}
              </span>
              <span className="text-xs font-medium text-gray-800 text-right flex-1 mx-3 truncate">
                {wasAnswered
                  ? wasCorrect
                    ? correctOption?.text || question.answer
                    : "Incorrect"
                  : "Not answered"}
              </span>
              <span
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  wasAnswered
                    ? wasCorrect
                      ? "bg-emerald-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-300 text-white"
                }`}
              >
                {wasAnswered ? (
                  wasCorrect ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <X className="w-3 h-3" />
                  )
                ) : (
                  "-"
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const QuizResult: React.FC<QuizResultProps> = ({
  quiz,
  answers,
  correctness = {},
  result,
  backgroundIcons,
  onRetake,
}) => {
  const navigate = useNavigate();
  const isKnowledge = quiz.quizType === "knowledge";

  const totalScore = Object.values(answers).reduce((sum, s) => sum + s, 0);
  const maxPossible = quiz.questions.reduce(
    (sum, q) => sum + Math.max(...q.options.map((o) => o.score)),
    0,
  );

  const totalQuestions = quiz.questions.length;
  const correctCount = Object.values(correctness).filter(Boolean).length;
  const knowledgePercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const percentage = isKnowledge
    ? knowledgePercentage
    : maxPossible > 0
      ? (totalScore / maxPossible) * 100
      : 0;

  const resultRange = isKnowledge
    ? quiz.results.find(
        (r) =>
          knowledgePercentage >= r.minScore &&
          knowledgePercentage <= r.maxScore,
      )
    : quiz.results.find(
        (r) => totalScore >= r.minScore && totalScore <= r.maxScore,
      );
  const resultMessage = resultRange?.message || result;

  const getPerformanceLevel = () => {
    if (percentage >= 80)
      return {
        icon: FaTrophy,
        color: "text-blue-600",
        bgGradient: "from-blue-500 to-blue-600",
      };
    if (percentage >= 60)
      return {
        icon: FaMedal,
        color: "text-blue-500",
        bgGradient: "from-blue-400 to-blue-500",
      };
    if (percentage >= 40)
      return {
        icon: FaStar,
        color: "text-blue-400",
        bgGradient: "from-blue-300 to-blue-400",
      };
    return {
      icon: FaStar,
      color: "text-blue-300",
      bgGradient: "from-blue-200 to-blue-300",
    };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Quiz Result Report", 20, 20);
    doc.setFontSize(14);
    doc.text(`Quiz: ${quiz.category}`, 20, 30);
    doc.text(`Result: ${resultMessage}`, 20, 40);

    if (isKnowledge) {
      doc.text(`Correct Answers: ${correctCount} / ${totalQuestions}`, 20, 50);
      doc.text(`Percentage: ${knowledgePercentage}%`, 20, 60);
      doc.setFontSize(16);
      doc.text("Your Answers:", 20, 80);
      doc.setFontSize(12);
      quiz.questions.forEach((question, index) => {
        const wasCorrect = correctness[index] === true;
        const yPos = 90 + index * 25;
        doc.text(
          `Q${index + 1}: ${question.question.substring(0, 60)}`,
          20,
          yPos,
        );
        doc.text(
          `Result: ${wasCorrect ? "Correct" : "Incorrect"}`,
          20,
          yPos + 10,
        );
      });
    } else {
      doc.text(`Total Score: ${totalScore} / ${maxPossible}`, 20, 50);
      doc.text(`Percentage: ${Math.round(percentage)}%`, 20, 60);
      doc.setFontSize(16);
      doc.text("Your Responses:", 20, 80);
      doc.setFontSize(12);
      quiz.questions.forEach((question, index) => {
        const selected = question.options.find(
          (opt) => opt.score === answers[index],
        );
        const yPos = 90 + index * 25;
        doc.text(`Q${index + 1}: ${selected?.text || "No answer"}`, 20, yPos);
        doc.text(`Score: ${answers[index] ?? 0}`, 20, yPos + 10);
      });
    }

    doc.save(`${quiz.category}_report.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50 flex items-center justify-center p-4 relative overflow-y-auto"
    >
      <BackgroundIcons quizType={quiz._id} backgroundIcons={backgroundIcons} />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 my-8"
      >
        <div
          className={`bg-gradient-to-r ${performance.bgGradient} p-6 text-white text-center`}
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4"
          >
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              className="text-4xl"
            >
              <PerformanceIcon />
            </motion.div>
            <div className="text-left">
              <h1 className="text-2xl font-bold">Quiz Complete!</h1>
              <p className="text-sm opacity-90">
                {isKnowledge ? "Here's how you did" : "Your results are ready"}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="p-6 space-y-6">
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-center shadow-lg border-4 border-blue-200"
            >
              <div className="text-sm text-white/80 mb-2 uppercase tracking-wide">
                Your Quiz
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                {resultMessage}
              </h2>
              {isKnowledge ? (
                <div className="flex items-center justify-center gap-4 text-white bg-white/20 rounded-lg py-2 px-4 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{correctCount}</div>
                    <div className="text-xs opacity-90">Correct</div>
                  </div>
                  <div className="h-8 w-px bg-white/40"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalQuestions}</div>
                    <div className="text-xs opacity-90">Total</div>
                  </div>
                  <div className="h-8 w-px bg-white/40"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {knowledgePercentage}%
                    </div>
                    <div className="text-xs opacity-90">Accuracy</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4 text-white bg-white/20 rounded-lg py-2 px-4 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalScore}</div>
                    <div className="text-xs opacity-90">Your Score</div>
                  </div>
                  <div className="h-8 w-px bg-white/40"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{maxPossible}</div>
                    <div className="text-xs opacity-90">Max Score</div>
                  </div>
                  <div className="h-8 w-px bg-white/40"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {Math.round(percentage)}%
                    </div>
                    <div className="text-xs opacity-90">Percentage</div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="relative">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                <motion.circle
                  className="text-blue-500"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${percentage * 2.64} 264`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  initial={{ strokeDasharray: "0 264" }}
                  animate={{ strokeDasharray: `${percentage * 2.64} 264` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(percentage)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {isKnowledge ? "Accuracy" : "Score"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            {isKnowledge ? (
              <KnowledgeAnswers quiz={quiz} correctness={correctness} />
            ) : (
              <QuizAnswers quiz={quiz} answers={answers} />
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <button
              onClick={onRetake}
              className="py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all hover:shadow-md text-sm"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => navigate("/quiz")}
              className="py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all text-sm"
            >
              Back to Quizzes
            </button>
            <button
              onClick={generatePDF}
              className="py-3 px-4 bg-gray-300 text-gray-500 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-not-allowed text-sm"
              title="Requires payment to unlock"
            >
              <FaLock className="text-xs" />
              Download PDF
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizResult;
