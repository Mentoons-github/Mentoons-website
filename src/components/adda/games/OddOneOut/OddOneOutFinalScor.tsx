type Props = {
  score: number;
  total: number;
  level: "easy" | "medium" | "hard";
  onReset: () => void;
};

const OddOneOutFinalScore = ({ score, total, level, onReset }: Props) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center text-white p-4"
      style={{ backgroundImage: "url('/assets/games/FindOddOne/bg.png')" }}
    >
        <div className="absolute inset-0 bg-black/50"></div>
      <div
        className="bg-[#48aae2] backdrop-blur-xl border border-white/20 
        rounded-3xl p-8 max-w-sm w-full text-center flex flex-col gap-6 shadow-2xl"
      >
        <h1 className="text-3xl font-extrabold text-green-400">🏆 Game Over</h1>

        <p className="text-lg">
          Difficulty: <b className="text-yellow-400">{level.toUpperCase()}</b>
        </p>

        <p className="text-2xl font-bold">
          Score: <span className="text-green-400">{score}</span> / {total}
        </p>

        <button
          onClick={onReset}
          className="mt-4 px-6 py-3 rounded-full 
          bg-gradient-to-r from-green-400 to-blue-500
          text-black font-bold hover:scale-105 transition-all"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default OddOneOutFinalScore;
