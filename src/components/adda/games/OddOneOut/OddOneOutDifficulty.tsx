type InstrumentsDifficultyProps = {
  setDifficulty: React.Dispatch<
    React.SetStateAction<"easy" | "medium" | "hard" | null>
  >;
};

const OddOneOutDifficulty = ({ setDifficulty }: InstrumentsDifficultyProps) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/games/ColorTube/startBg3.png')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="bg-gradient-to-br from-[#444356] to-[#5b5f49] border-2 border-[#f7e991] p-2 md:p-10 rounded-lg backdrop-blur-xl">
        <h2 className="text-xl font-bold text-[#d409f4] mb-2 text-center">
          Choose Your Challenge
        </h2>
        <p className={"text-[#f7e991] mb-4 text-center"}>
          Select a difficulty level to begin
        </p>
        <div className="grid grid-cols-3 gap-2 md:gap-6">
          <button
            onClick={() => {
              setDifficulty("easy");
            }}
            className={`group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 hover:opacity-90 rounded-lg p-2 md:p-6 md:px-8 transition-all transform hover:scale-[1.02] shadow-lg`}
          >
            <div className="text-4xl mb-2">🙂</div>
            <h3 className="text-lg font-bold text-white">Easy</h3>
            <h3 className="text-lg font-bold text-white"></h3>
            <p className="text-green-200 text-md font-medium mt-1">
              Ages: 6-12
            </p>
          </button>
          <button
            onClick={() => setDifficulty("medium")}
            className={`group relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 hover:opacity-90 rounded-lg p-2 md:p-6 md:px-8 transition-all transform hover:scale-[1.02] shadow-lg`}
          >
            <div className="text-4xl mb-2">🧐</div>
            <h3 className="text-lg font-bold text-white">Medium</h3>
            <h3 className="text-lg font-bold text-white"></h3>
            <p className="text-orange-200 text-md font-medium mt-1">
              Ages: 13-19
            </p>
          </button>
          <button
            onClick={() => setDifficulty("hard")}
            className={`group relative overflow-hidden bg-gradient-to-br from-red-600 to-rose-700 hover:opacity-90 rounded-lg p-2 md:p-6 md:px-8 transition-all transform hover:scale-[1.02] shadow-lg`}
          >
            <div className="text-4xl mb-2">🚀</div>
            <h3 className="text-lg font-bold text-white">Hard</h3>
            <h3 className="text-lg font-bold text-white"></h3>
            <p className="text-red-200 text-md font-medium mt-1">
              Ages: Adults
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OddOneOutDifficulty;
