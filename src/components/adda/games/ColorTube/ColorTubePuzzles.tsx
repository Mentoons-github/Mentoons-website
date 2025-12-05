import { Color, Level } from "@/pages/v2/adda/games/colorTubes";

type Props = {
  moves: number;
  moveLimit: number;
  difficulty: Level;
  won: boolean;
  gameOver: boolean;
  level: number;
  tubes: Color[][];
  selectedTube: number | null;
  TUBE_CAPACITY: number;
  handleTubeClick: (index: number) => void;

  onNextLevel: () => void;
  onReset: () => void;
};

const ColorTubePuzzles = ({
  TUBE_CAPACITY,
  difficulty,
  moves,
  moveLimit,
  selectedTube,
  tubes,
  won,
  gameOver,
  handleTubeClick,
  level,
  onNextLevel,
  onReset,
}: Props) => {
  const isTubeCompleted = (tube: Color[]) => {
    if (tube.length !== TUBE_CAPACITY) return false;
    return tube.every((color) => color === tube[0]);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-2 sm:px-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/games/ColorTube/gameBg2.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div
        className="bg-[#1e293b]/95 w-full max-w-6xl rounded-2xl sm:rounded-3xl z-10 
                      p-3 sm:p-6 md:p-8 
                      text-white shadow-2xl border border-white/20"
      >
        {/* ================= TOP BAR ================= */}
        <div
          className="flex flex-wrap justify-between items-center gap-2 sm:gap-4 
                        mb-4 sm:mb-6 bg-black/40 px-3 sm:px-4 py-2 sm:py-3 
                        rounded-xl text-sm sm:text-base"
        >
          <div className="font-bold text-yellow-300">Level: {level}/10</div>

          <div className="font-bold text-blue-300">
            Moves: {moves}/{moveLimit}
          </div>

          <div className="font-bold text-green-300">
            {difficulty.toUpperCase()}
          </div>

          <button
            onClick={onReset}
            className="bg-red-500 hover:bg-red-600 px-3 sm:px-4 py-1 
                       rounded-full font-bold transition text-xs sm:text-sm"
          >
            🔄 Reset
          </button>
        </div>

        {/* ================= STATUS ================= */}
        {won && (
          <p
            className="text-green-400 text-center mb-3 sm:mb-4 
                        animate-pulse font-bold text-sm sm:text-lg"
          >
            ✅ Level Completed + Points!
          </p>
        )}

        {gameOver && (
          <p
            className="text-red-400 text-center mb-3 sm:mb-4 
                        animate-pulse font-bold text-sm sm:text-lg"
          >
            ❌ Move Limit Reached — No Points!
          </p>
        )}

        {/* ================= TUBES ================= */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-6 mb-6">
          {tubes.map((tube, i) => (
            <div
              key={i}
              onClick={() => handleTubeClick(i)}
              className={`relative w-14 md:w-16 
                h-60 md:h-64 
                border-4 rounded-2xl 
                flex flex-col-reverse items-center p-2 
                cursor-pointer transition-all 
                          
                ${
                  selectedTube === i
                    ? "border-yellow-400 scale-105 shadow-lg shadow-yellow-400/40"
                    : isTubeCompleted(tube)
                    ? "border-green-400 shadow-lg shadow-green-400/50"
                    : "border-white/50 hover:scale-105"
                }
              `}
            >
              {isTubeCompleted(tube) && (
                <div
                  className="absolute -top-3 -right-3 z-10
               bg-green-500 text-white 
               w-8 h-8 rounded-full 
               flex items-center justify-center 
               text-lg font-bold shadow-lg animate-bounce"
                >
                  ✓
                </div>
              )}

              {/* COLORS */}
              {tube.map((color, idx) => (
                <div
                  key={idx}
                  style={{ background: color }}
                  className="w-9 h-9 md:w-10 md:h-10 
                              rounded-full mb-1 
                             shadow-inner border border-black/30"
                />
              ))}

              {/* EMPTY SPACES */}
              {Array.from({ length: TUBE_CAPACITY - tube.length }).map(
                (_, idx) => (
                  <div
                    key={idx}
                    className="w-9 h-9 md:w-10 md:h-10 
                                rounded-full mb-1 bg-white/20"
                  />
                )
              )}
            </div>
          ))}
        </div>

        {/* ================= CONTROLS ================= */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-2 sm:mt-4">
          <button
            disabled={won || gameOver}
            onClick={onNextLevel}
            className="bg-green-500 hover:bg-green-600
                        disabled:bg-gray-600 
                       px-6 sm:px-8 py-2 sm:py-3 
                       rounded-full font-bold text-sm sm:text-lg 
                       transition shadow-lg"
          >
            ▶ Next Puzzle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorTubePuzzles;
