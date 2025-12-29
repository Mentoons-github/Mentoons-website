import { motion } from "framer-motion";
import { RuntimeQuiz } from "@/pages/quiz/quiz";

interface QuizQuestionProps {
  quiz: RuntimeQuiz;
  currentQuestion: number;
  answers: Record<number, string>;
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
}

const QuizQuistionField: React.FC<QuizQuestionProps> = ({
  quiz,
  currentQuestion,
  answers,
  onAnswerSelect,
  onNext,
}) => {
  const question = quiz.questions[currentQuestion];
  if (!question) return null;

  const progress =
    ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress */}
        <div className="h-2 bg-gray-200">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8">
          <p className="text-sm text-gray-500 mb-2">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.options.map((option) => {
              const selected = answers[currentQuestion] === option;

              return (
                <button
                  key={option}
                  onClick={() => onAnswerSelect(option)}
                  // disabled={answers[currentQuestion] !== undefined}
                  className={`w-full p-4 rounded-xl border-2 text-left transition
                    ${
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }
                    ${
                      answers[currentQuestion] !== undefined
                        ? "cursor-not-allowed"
                        : ""
                    }
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={onNext}
              disabled={answers[currentQuestion] === undefined}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl disabled:opacity-50"
            >
              {currentQuestion === quiz.questions.length - 1
                ? "Finish"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuistionField;
