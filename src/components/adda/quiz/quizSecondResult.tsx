import { Trophy, Target, Clock, Award, RotateCcw, Home } from "lucide-react";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  onRestart?: () => void;
  onHome?: () => void;
}

const QuizResults = ({
  score,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  onRestart,
  onHome,
}: QuizResultsProps) => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getPerformanceMessage = () => {
    if (percentage >= 90)
      return { text: "OUTSTANDING!", emoji: "🏆", color: "text-yellow-500" };
    if (percentage >= 70)
      return { text: "GREAT JOB!", emoji: "🌟", color: "text-green-500" };
    if (percentage >= 50)
      return { text: "GOOD EFFORT!", emoji: "👍", color: "text-blue-500" };
    return { text: "KEEP TRYING!", emoji: "💪", color: "text-orange-500" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-yellow-400 p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Celebration Background */}
      {percentage >= 70 && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl md:text-6xl animate-floatUp"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              {
                ["🎉", "🎊", "✨", "🌟", "⭐", "🎈", "🏆", "👏"][
                  Math.floor(Math.random() * 8)
                ]
              }
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl w-full relative z-10">
        {/* Main Results Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-amber-600 animate-scaleIn">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-7xl mb-4 animate-bounce">
              {performance.emoji}
            </div>
            <h1
              className={`text-5xl md:text-6xl font-black mb-3 ${performance.color}`}
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {performance.text}
            </h1>
            <p
              className="text-2xl text-gray-600 font-bold"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Quiz Completed!
            </p>
          </div>

          {/* Score Display */}
          <div className="bg-gradient-to-br from-amber-500 via-orange-400 to-yellow-500 rounded-2xl p-1 mb-8">
            <div className="bg-white rounded-[1.1rem] p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Trophy className="text-amber-600" size={40} strokeWidth={3} />
                <h2
                  className="text-2xl font-black text-gray-800"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  FINAL SCORE
                </h2>
                <Trophy className="text-amber-600" size={40} strokeWidth={3} />
              </div>
              <div
                className="text-8xl font-black text-amber-600 mb-2"
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  textShadow: "4px 4px 0px rgba(251, 191, 36, 0.3)",
                }}
              >
                {score}
              </div>
              <div
                className="text-xl font-bold text-gray-500"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                POINTS
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Correct Answers */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-1">
              <div className="bg-white rounded-[0.7rem] p-5 text-center">
                <Target
                  className="text-green-600 mx-auto mb-2"
                  size={32}
                  strokeWidth={3}
                />
                <div
                  className="text-4xl font-black text-green-600 mb-1"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {correctAnswers}
                </div>
                <div
                  className="text-sm font-bold text-gray-600"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  CORRECT
                </div>
              </div>
            </div>

            {/* Wrong Answers */}
            <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-1">
              <div className="bg-white rounded-[0.7rem] p-5 text-center">
                <Clock
                  className="text-red-600 mx-auto mb-2"
                  size={32}
                  strokeWidth={3}
                />
                <div
                  className="text-4xl font-black text-red-600 mb-1"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {wrongAnswers}
                </div>
                <div
                  className="text-sm font-bold text-gray-600"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  WRONG
                </div>
              </div>
            </div>

            {/* Percentage */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-1">
              <div className="bg-white rounded-[0.7rem] p-5 text-center">
                <Award
                  className="text-blue-600 mx-auto mb-2"
                  size={32}
                  strokeWidth={3}
                />
                <div
                  className="text-4xl font-black text-blue-600 mb-1"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {percentage}%
                </div>
                <div
                  className="text-sm font-bold text-gray-600"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  ACCURACY
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                style={{ width: `${percentage}%` }}
              >
                <span
                  className="text-white font-black text-sm"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            {onRestart && (
              <button
                onClick={onRestart}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-xl py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                <RotateCcw size={28} strokeWidth={3} />
                PLAY AGAIN
              </button>
            )}
            {onHome && (
              <button
                onClick={onHome}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xl py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                <Home size={28} strokeWidth={3} />
                HOME
              </button>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-10 right-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div
          className="fixed bottom-10 left-10 w-40 h-40 bg-orange-400 rounded-full blur-3xl opacity-40 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap");
        
        @keyframes scaleIn {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .animate-floatUp {
          animation: floatUp 5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default QuizResults;
