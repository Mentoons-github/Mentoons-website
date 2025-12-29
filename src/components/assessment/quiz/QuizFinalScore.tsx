import { RuntimeQuiz } from "@/pages/quiz/quiz";
import { useNavigate } from "react-router-dom";

interface QuizFinalScoreProps {
  quiz: RuntimeQuiz;
  score: number;
  onRetry: () => void;
}

const QuizFinalScore: React.FC<QuizFinalScoreProps> = ({
  quiz,
  score,
  onRetry,
}) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Quiz Completed 🎉
        </h2>

        <p className="text-xl text-gray-600 mb-6">Your Score</p>

        <p className="text-5xl font-bold text-blue-600 mb-6">
          {score} / {quiz.questions.length}
        </p>

        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Retake Quiz
        </button>
        <button
          onClick={() => navigate("/quiz")}
           className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 ml-5" 
        >
          Back to Quizzes
        </button>
      </div>
    </div>
  );
};

export default QuizFinalScore;
