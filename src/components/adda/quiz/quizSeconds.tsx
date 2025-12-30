import { useState, useEffect, useRef } from "react";
import { Trophy, Clock } from "lucide-react";
import { QUIZ_DATA_GAME } from "@/constant/adda/game/quiz";
import { useSearchParams, useParams } from "react-router-dom";
import { QuizQuestion } from "@/types/adda/quiz";
import QuizResults from "./quizSecondResult";

const QuizSeconds = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(true);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [scoreGained, setScoreGained] = useState(0);
  const [timeEnded, setTimeEnded] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [searchParams] = useSearchParams();
  const { categoryId } = useParams<{ categoryId: string }>();
  const quizId = searchParams.get("quiz");

  useEffect(() => {
    if (quizId && categoryId) {
      const selectedQuiz = QUIZ_DATA_GAME.find(
        (quiz) => quiz._id === categoryId
      )?.category.find((category) => category.quizId === quizId)?.questions;

      if (selectedQuiz) {
        const shuffled = [...selectedQuiz];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setQuiz(shuffled.slice(0, 10));
        setCurrentIndex(0);
      }
    }
  }, [quizId, categoryId]);

  const totalTime = 30;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setTimeEnded(true);
            setWrongAnswers((prevWrong) => prevWrong + 1);
            setTimeout(() => {
              moveToNextQuestion();
            }, 5000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const progress = (timeLeft / totalTime) * 100;
  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getTimerColor = () => {
    if (timeLeft === 0) return "#dc2626";
    if (timeLeft <= 5) return "#f97316";
    if (timeLeft <= 10) return "#eab308";
    return "#22c55e";
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowCelebration(false);
    setScoreGained(0);
    setTimeEnded(false);
    setTimeLeft(30);
    setIsRunning(true);
  };

  const handleHome = () => {
    window.location.href = "/quiz";
  };

  const moveToNextQuestion = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowCelebration(false);
      setScoreGained(0);
      setTimeEnded(false);
      setTimeLeft(30);
      setIsRunning(true);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleAnswerClick = (key: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(key);
    setIsRunning(false);

    const correct = key === quiz[currentIndex].answer;
    setIsCorrect(correct);

    if (correct) {
      const points = 10;
      setScore((prev) => prev + points);
      setScoreGained(points);
      setShowCelebration(true);
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => prev + 1);
    }

    setTimeout(() => {
      moveToNextQuestion();
    }, 5000);
  };

  if (quiz.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-400 via-orange-300 to-yellow-400">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p
            className="text-white text-xl font-bold"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Loading Quiz...
          </p>
          <p
            className="text-white/80 text-sm mt-2"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Category: {categoryId} | Quiz: {quizId}
          </p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <QuizResults
        score={score}
        totalQuestions={quiz.length}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        onRestart={handleRestart}
        onHome={handleHome}
      />
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-yellow-400 p-4 md:p-6 overflow-y-auto relative">
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl animate-celebration"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              {
                ["🎉", "🎊", "✨", "🌟", "⭐", "🎈"][
                  Math.floor(Math.random() * 6)
                ]
              }
            </div>
          ))}
        </div>
      )}

      {scoreGained > 0 && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-scorePopup">
          <div className="bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl border-4 border-white">
            <div
              className="text-6xl font-black"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              +{scoreGained}
            </div>
            <div
              className="text-xl font-bold mt-2"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              POINTS!
            </div>
          </div>
        </div>
      )}

      {timeEnded && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-red-500 text-white px-12 py-8 rounded-3xl shadow-2xl border-4 border-white animate-bounce">
            <div
              className="text-5xl font-black mb-4"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              ⏰ TIME'S UP!
            </div>
            <div
              className="text-2xl font-bold"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Moving to next question...
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-3 border-3 border-amber-600">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-amber-600" size={20} strokeWidth={2.5} />
              <h2
                className="text-sm font-black tracking-tight text-gray-800"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                TIME LEFT
              </h2>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <svg width="90" height="90" className="transform -rotate-90">
                  <circle
                    cx="45"
                    cy="45"
                    r="38"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="7"
                  />
                  <circle
                    cx="45"
                    cy="45"
                    r="38"
                    fill="none"
                    stroke={getTimerColor()}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                      transition:
                        "stroke-dashoffset 0.5s ease, stroke 0.3s ease",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-3xl font-black"
                    style={{
                      color: getTimerColor(),
                      fontFamily: "'Fredoka', sans-serif",
                      textShadow: "2px 2px 0px rgba(0,0,0,0.1)",
                    }}
                  >
                    {timeLeft}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-3 border-3 border-amber-600">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="text-amber-600" size={20} strokeWidth={2.5} />
              <h2
                className="text-sm font-black tracking-tight text-gray-800"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                SCORE
              </h2>
            </div>
            <div className="flex items-center justify-center h-20">
              <div className="text-center">
                <span
                  className="text-4xl font-black text-amber-600"
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    textShadow: "2px 2px 0px rgba(251, 191, 36, 0.3)",
                  }}
                >
                  {score}
                </span>
                <div
                  className="text-xs font-bold text-gray-500 mt-1"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  POINTS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-4">
        <div className="bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-400 p-1 rounded-2xl shadow-xl">
          <div className="bg-white rounded-[1.1rem] p-4">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <h1
                  className="text-2xl md:text-3xl font-black text-center text-gray-800 tracking-tight"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {quiz[currentIndex].q}
                </h1>
              </div>
              {quiz[currentIndex].image && (
                <div className="w-32 h-32 rounded-xl border-3 border-gray-800 shadow-lg overflow-hidden bg-white">
                  <img
                    src={quiz[currentIndex].image}
                    alt="Quiz visual"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(quiz[currentIndex].options).map(([key, value], i) => {
            const isSelected = selectedAnswer === key;
            const isCorrectAnswer = key === quiz[currentIndex].answer;
            const showAsWrong = isSelected && !isCorrect;
            const showAsCorrect =
              (isSelected && isCorrect) ||
              (selectedAnswer !== null && isCorrectAnswer);

            return (
              <button
                key={i}
                onClick={() => handleAnswerClick(key)}
                disabled={selectedAnswer !== null}
                className={`group relative p-1 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:hover:scale-100
                  ${
                    showAsWrong
                      ? "animate-shake bg-gradient-to-br from-red-600 via-red-500 to-red-600"
                      : showAsCorrect
                      ? "bg-gradient-to-br from-green-600 via-green-500 to-green-600 scale-105"
                      : "bg-gradient-to-br from-red-500 via-pink-400 to-blue-500"
                  }
                  ${
                    selectedAnswer !== null && !isSelected && !isCorrectAnswer
                      ? "opacity-50"
                      : ""
                  }
                `}
              >
                <div className="bg-white rounded-[0.65rem] p-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center justify-between gap-3">
                    <span
                      className={`text-xl font-black ${
                        showAsWrong
                          ? "text-red-600"
                          : showAsCorrect
                          ? "text-green-600"
                          : "bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent"
                      }`}
                      style={{ fontFamily: "'Fredoka', sans-serif" }}
                    >
                      {key}
                      {showAsWrong && " ❌"}
                      {showAsCorrect && " ✓"}
                    </span>
                    <h2
                      className="text-lg md:text-xl font-bold text-gray-800 flex-1 text-center"
                      style={{ fontFamily: "'Fredoka', sans-serif" }}
                    >
                      {value}
                    </h2>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed top-10 right-10 w-24 h-24 bg-yellow-300 rounded-full blur-3xl opacity-50 animate-pulse" />
      <div
        className="fixed bottom-10 left-10 w-28 h-28 bg-orange-400 rounded-full blur-3xl opacity-40 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap");
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes celebration {
          0% {
            transform: translateY(0) rotate(0deg) scale(0);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) rotate(360deg) scale(1.5);
            opacity: 0;
          }
        }
        
        .animate-celebration {
          animation: celebration 1.5s ease-out forwards;
        }
        
        @keyframes scorePopup {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
          }
          70% {
            transform: translate(-50%, -50%) scale(0.9) rotate(-5deg);
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        .animate-scorePopup {
          animation: scorePopup 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
};

export default QuizSeconds;
