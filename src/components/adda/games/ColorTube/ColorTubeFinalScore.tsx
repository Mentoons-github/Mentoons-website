const ColorTubeFinalScore = ({
  restart,
  score,
  totalScore,
}: {
  restart: () => void;
  score: number;
  totalScore: number;
}) => {
  const percentage = Math.round((score / totalScore) * 100);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/games/ColorTube/gameBg2.jpg')" }}
    >
      <div className=" flex flex-col items-center justify-center bg-gradient-to-br rounded-lg from-black via-gray-900 to-black text-white p-10">
        <div className="text-5xl md:text-7xl mb-6 animate-bounce">🏆</div>

        <h1 className="text-2xl md:text-5xl font-extrabold mb-4 tracking-wide">
          Game Completed!
        </h1>

        {/* Score Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md text-center shadow-xl border border-white/20">
          <p className="text-lg text-gray-300 mb-2">Your Final Score</p>

          <p className="text-5xl font-extrabold text-yellow-400 mb-2">
            {score}
            <span className="text-xl text-white/60"> / {totalScore}</span>
          </p>

          <p className="text-sm text-gray-300 mb-4">
            Accuracy:{" "}
            <span className="text-green-400 font-bold">{percentage}%</span>
          </p>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-yellow-400 transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Replay Button */}
        <button
          onClick={restart}
          className="mt-10 bg-gradient-to-r from-green-500 to-emerald-600 
                   px-10 py-4 rounded-full text-lg font-bold shadow-lg
                   hover:scale-105 transition-all duration-300"
        >
          🔄 Play Again
        </button>

        {/* Footer Hint */}
        <p className="mt-6 text-xs text-white/50 tracking-wide">
          Can you beat your high score?
        </p>
      </div>
    </div>
  );
};

export default ColorTubeFinalScore;
