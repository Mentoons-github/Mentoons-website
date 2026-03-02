import { Clock, Star } from "lucide-react";

interface WordBuilderHeaderProps {
  score?: number;
  timer?: number;
  roundCount?: number;
}

const PatterRaceHeader = ({
  score = 0,
  timer = 60,
  roundCount,
}: WordBuilderHeaderProps) => {
  const getClockColor = () => {
    if (timer > 30) return "text-green-400";
    if (timer > 10) return "text-yellow-400";
    return "text-red-400";
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div
      className="w-full bg-[url('/assets/games/wordBuilder/topbar.png')] bg-cover bg-center
      flex items-center justify-between
      px-3 sm:px-10 py-2 sm:py-3"
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 sm:gap-8">
        {/* Round */}
        {roundCount !== undefined && (
          <div className="flex items-center gap-1 sm:gap-2">
            <h1 className="text-white font-bold text-xs sm:text-base md:text-lg">
              Round:
            </h1>
            <span className="text-white font-extrabold text-lg sm:text-2xl md:text-3xl">
              {roundCount + 1}
            </span>
          </div>
        )}

        {/* Score */}
        <div className="flex items-center gap-1 sm:gap-2">
          <h1 className="text-white font-bold text-xs sm:text-base md:text-lg">
            Score:
          </h1>
          <span className="text-white font-extrabold text-lg sm:text-2xl md:text-3xl">
            {score}
          </span>
          <Star
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400"
            fill="currentColor"
          />
        </div>
      </div>

      {/* RIGHT SIDE (Timer) */}
      <div className="flex items-center gap-2 sm:gap-3">
        <h1 className="text-white font-bold text-xs sm:text-base md:text-lg">
          Time:
        </h1>

        <span
          className={`text-lg sm:text-2xl md:text-3xl font-extrabold ${getClockColor()}
          ${timer <= 10 ? "animate-pulse" : ""}`}
        >
          {formattedTime}
        </span>

        <Clock
          className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${getClockColor()}
          ${timer <= 10 ? "animate-pulse" : ""}`}
        />
      </div>
    </div>
  );
};

export default PatterRaceHeader;
