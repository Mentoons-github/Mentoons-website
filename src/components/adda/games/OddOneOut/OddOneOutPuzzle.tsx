import { Card } from "@/pages/v2/adda/games/OddOneOut";

type OddOneOutPuzzleProps = {
  timer: number;
  score: number;
  round: number;
  TOTAL_ROUNDS: number;
  grid: number;
  cards: Card[];
  handleSelect: (card: Card) => void;
  showResult: boolean;
  resultType: "correct" | "wrong" | "timeover" | null;
};


const OddOneOutPuzzle = ({
  TOTAL_ROUNDS,
  cards,
  grid,
  round,
  score,
  timer,
  handleSelect,
  showResult,
  resultType,
}: OddOneOutPuzzleProps) => {

  return (
    <div
      className="min-h-screen flex items-center justify-center px-1 md:px-3 bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/games/FindOddOne/bg.png')" }}
    >
        <div className="absolute inset-0 bg-black/50"></div>
      {/* MAIN CARD */}
      <div
        className=" max-w-2xl bg-[#0f172a]/80 rounded-3xl p-3 md:p-6 
                      shadow-2xl border border-white/20 text-white flex flex-col gap-5 relative z-10cd"
      >
        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center tracking-wide">
          🎯 Find The Odd One
        </h1>

        {/* STATUS BAR */}
        <div className="flex justify-between items-center text-sm sm:text-base font-semibold bg-black/30 px-4 py-2 rounded-full">
          <div
            className={
              timer <= 5 ? "text-red-400 animate-pulse" : "text-green-300"
            }
          >
            ⏳ {timer}s
          </div>
          <div className="text-yellow-300">⭐ {score}</div>
          <div className="text-blue-300">
            {round + 1}/{TOTAL_ROUNDS}
          </div>
        </div>

        {/* RESULT MESSAGE */}
        {showResult && (
          <div className="text-center text-lg sm:text-xl font-bold min-h-[32px] animate-pulse">
            {resultType === "correct" && (
              <span className="text-green-400">✅ Correct!</span>
            )}
            {resultType === "wrong" && (
              <span className="text-red-400">❌ Wrong!</span>
            )}
            {resultType === "timeover" && (
              <span className="text-yellow-400">⏰ Time Over!</span>
            )}
          </div>
        )}

        {/* GRID CONTAINER */}
        <div className="flex justify-center">
          <div
            className={`grid ${grid > 9 ? "gap-2 md:gap-3"  :"gap-4"} `}
            style={{
              gridTemplateColumns: `repeat(${Math.sqrt(grid)}, 1fr)`,
            }}
          >
            {cards.map((card) => (
              <button
                key={card.id}
                disabled={showResult}
                onClick={() => handleSelect(card)}
                className="w-20 h-20 sm:w-28 sm:h-28 
                bg-white/20 border border-white/30 rounded-2xl 
                flex items-center justify-center 
                transition-all duration-200
                hover:scale-110 hover:ring-2 hover:ring-green-400
                active:scale-95 disabled:opacity-50 shadow-lg"
              >
                <img
                  src={card.img}
                  className="w-full h-full object-contain p-"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>

        {/* HINT */}
        <p className="text-center text-xs sm:text-sm text-gray-300 tracking-wide">
          Tap the card that looks different
        </p>
      </div>
    </div>
  );
};

export default OddOneOutPuzzle;
