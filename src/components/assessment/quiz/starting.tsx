import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BackgroundIcons,
  containerVariants,
  itemVariants,
} from "@/utils/assessment/quizAndAssessment";
import { QuizData } from "@/pages/quiz/quiz";

interface QuizStartingProps {
  quiz: QuizData;
  quizType: string;
  backgroundIcons: Array<{
    id: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    delay: number;
  }>;
  onStart: () => void;
}

const QuizStarting: React.FC<QuizStartingProps> = ({
  quiz,
  quizType,
  backgroundIcons,
  onStart,
}) => {
  const navigate = useNavigate();

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
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10"
      >
        <div
          className={`bg-gradient-to-r ${quiz.gradientFrom} ${quiz.gradientTo} p-8 text-white text-center relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <motion.div variants={itemVariants} className="relative z-10">
            <div className="text-6xl mb-4">{quiz.icon}</div>
            <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-xl opacity-90">{quiz.subtitle}</p>
          </motion.div>
        </div>
        <div className="p-8">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <p className="text-gray-600 text-lg leading-relaxed">
              {quiz.description}
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <span>Takes only 2-3 minutes to complete</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">🔒</span>
              </div>
              <span>Your responses are completely anonymous</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-bold">📊</span>
              </div>
              <span>Get personalized insights and recommendations</span>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex gap-4">
            <button
              onClick={() => navigate("/assessment-page")}
              className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Back to Quiz Selection
            </button>
            <button
              onClick={onStart}
              className={`flex-1 py-4 px-6 bg-gradient-to-r ${quiz.gradientFrom} ${quiz.gradientTo} text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all`}
            >
              Start Quiz
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizStarting;
