import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QUIZ_DATA } from "@/constant/constants";
import { generateIconPositions } from "@/utils/assessment/quizAndAssessment";
import QuizResult from "@/components/assessment/quiz/quisResult";
import QuizStarting from "@/components/assessment/quiz/starting";
import QuizQuestion from "@/components/assessment/quiz/quizQuestions";

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
  questions: QuizQuestion[];
  resultCategories: string[];
}

const QuizPage: React.FC = () => {
  const { quizType } = useParams<{ quizType: string }>();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backgroundIcons] = useState(() => generateIconPositions(15));
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuiz = QUIZ_DATA[quizType!];

  useEffect(() => {
    if (quizStarted && currentQuiz) {
      setProgress(((currentQuestion + 1) / currentQuiz.questions.length) * 100);
    }
  }, [currentQuestion, quizStarted, currentQuiz]);

  if (!quizType || !QUIZ_DATA[quizType]) {
    console.error(`Invalid quizType: ${quizType}`);
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p>Invalid quiz type. Please go back and select a valid quiz.</p>
        <button
          onClick={() => navigate("/assessment-page")}
          className="mt-4 py-2 px-4 bg-gray-200 rounded-xl"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerSubmitted) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion]: answer,
      }));
      setIsCorrect(
        answer === currentQuiz.questions[currentQuestion].correctAnswer
      );
      setIsAnswerSubmitted(true);
    }
  };

  const handleNext = () => {
    if (isAnswerSubmitted) {
      if (currentQuestion < currentQuiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setIsAnswerSubmitted(false);
        setIsCorrect(null);
      } else {
        setShowResults(true);
      }
    }
  };

  const getResult = () => {
    const correctCount = Object.entries(answers).reduce(
      (acc, [index, answer]) => {
        return (
          acc +
          (answer === currentQuiz.questions[parseInt(index)].correctAnswer
            ? 1
            : 0)
        );
      },
      0
    );

    const totalQuestions = currentQuiz.questions.length;
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
  };

  const handleStart = () => {
    setQuizStarted(true);
  };

  if (!quizStarted) {
    return (
      <QuizStarting
        quiz={currentQuiz}
        quizType={quizType}
        backgroundIcons={backgroundIcons}
        onStart={handleStart}
      />
    );
  }

  if (showResults) {
    const result = getResult();
    const correctCount = Object.entries(answers).reduce(
      (acc, [index, answer]) => {
        return (
          acc +
          (answer === currentQuiz.questions[parseInt(index)].correctAnswer
            ? 1
            : 0)
        );
      },
      0
    );

    return (
      <QuizResult
        quiz={currentQuiz}
        answers={answers}
        result={result}
        correctCount={correctCount}
        backgroundIcons={backgroundIcons}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <QuizQuestion
      quiz={currentQuiz}
      quizType={quizType}
      backgroundIcons={backgroundIcons}
      currentQuestion={currentQuestion}
      answers={answers}
      isAnswerSubmitted={isAnswerSubmitted}
      isCorrect={isCorrect}
      progress={progress}
      onAnswerSelect={handleAnswerSelect}
      onNext={handleNext}
    />
  );
};

export default QuizPage;
