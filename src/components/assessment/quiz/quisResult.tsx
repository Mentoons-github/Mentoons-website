import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BackgroundIcons } from "@/utils/assessment/quizAndAssessment";
import { QuizData } from "@/pages/quiz";
import { FaLock } from "react-icons/fa6";
import { jsPDF } from "jspdf";

interface QuizResultProps {
  quiz: QuizData;
  answers: Record<number, string>;
  result: string;
  correctCount: number;
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

// interface QuizAnswersProps {
//   quiz: QuizData;
//   answers: Record<number, string>;
// }

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

// const QuizAnswers: React.FC<QuizAnswersProps> = ({ quiz, answers }) => (
//   <div className="bg-gray-50 rounded-2xl p-6">
//     <h3 className="font-semibold text-gray-800 mb-3">Your Responses:</h3>
//     <div className="space-y-2">
//       {quiz.questions.map((question, index) => (
//         <div key={question.id} className="flex justify-between items-center">
//           <span className="text-sm text-gray-600">Question {index + 1}</span>
//           <span className="text-sm font-medium">
//             {answers[index]}{" "}
//             {answers[index] === question.correctAnswer ? (
//               <span className="text-green-500">✓</span>
//             ) : (
//               <span className="text-red-500">
//                 ✗ (Correct: {question.correctAnswer})
//               </span>
//             )}
//           </span>
//         </div>
//       ))}
//     </div>
//   </div>
// );

const QuizResult: React.FC<QuizResultProps> = ({
  quiz,
  answers,
  result,
  correctCount,
  backgroundIcons,
  onRetake,
}) => {
  const navigate = useNavigate();
  const percentage = (correctCount / quiz.questions.length) * 100;
  const missed = quiz.questions.length - correctCount;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Quiz Result Report", 20, 20);
    doc.setFontSize(14);
    doc.text(`Quiz: ${quiz.title}`, 20, 30);
    doc.text(`Result: ${result}`, 20, 40);
    doc.text(
      `Score: ${correctCount} out of ${quiz.questions.length} (${Math.round(
        percentage
      )}%)`,
      20,
      50
    );
    doc.text(`Missed: ${missed} question${missed !== 1 ? "s" : ""}`, 20, 60);
    doc.setFontSize(16);
    doc.text("Your Responses:", 20, 80);
    doc.setFontSize(12);
    quiz.questions.forEach((question, index) => {
      const yPos = 90 + index * 20;
      doc.text(`Question ${index + 1}: ${answers[index]}`, 20, yPos);
      doc.text(
        answers[index] === question.correctAnswer
          ? "Correct"
          : `Incorrect (Correct: ${question.correctAnswer})`,
        20,
        yPos + 10
      );
    });
    doc.save(`${quiz.title}_report.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 relative"
    >
      <BackgroundIcons quizType={quiz.id} backgroundIcons={backgroundIcons} />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10"
      >
        <div
          className={`bg-gradient-to-r ${quiz.gradientFrom} ${quiz.gradientTo} p-8 text-white text-center`}
        >
          <motion.div variants={itemVariants}>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
            <p className="text-xl opacity-90">Your results are ready</p>
          </motion.div>
        </div>
        <div className="p-8">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="text-4xl mb-4">{quiz.icon}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Your Result: {result}
            </h2>
            <div className="flex justify-center mb-4">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-green-500"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${percentage * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dy=".3em"
                  className="text-xl font-bold text-gray-800"
                >
                  {Math.round(percentage)}%
                </text>
              </svg>
            </div>
            <p className="text-gray-600">
              You got {correctCount} out of {quiz.questions.length} correct,
              missed {missed} question{missed !== 1 ? "s" : ""}
            </p>
            <p className="text-gray-500 mt-2 italic">
              Download the full report to see detailed responses
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex gap-4">
            <button
              onClick={onRetake}
              className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => navigate("/assessment-page")}
              className={`flex-1 py-4 px-6 bg-gradient-to-r ${quiz.gradientFrom} ${quiz.gradientTo} text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all`}
            >
              Back to Quizzes
            </button>
            <button
              onClick={generatePDF}
              className="flex-1 py-4 px-6 bg-gray-300 text-gray-500 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
              title="Requires payment to unlock"
            >
              <FaLock />
              Download Report
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizResult;
