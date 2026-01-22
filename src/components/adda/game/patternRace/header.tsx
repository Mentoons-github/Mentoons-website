import { Clock, Star } from "lucide-react";

interface WordBuilderHeaderProps {
  score?: number;
  timer?: number;
}

const PatterRaceHeader = ({
  score = 0,
  timer = 60,
}: WordBuilderHeaderProps) => {
  const getClockColor = () => {
    if (timer > 30) return "text-green-400";
    if (timer > 10) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="flex items-center justify-around bg-[url('/assets/games/wordBuilder/topbar.png')] bg-cover h-12 sm:h-14 md:h-16 px-2 sm:px-4 ">
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
        <h1 className="text-white font-extrabold text-sm sm:text-lg md:text-xl lg:text-2xl">
          Score:{" "}
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            {score}
          </span>
        </h1>
        <Star
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-yellow-400"
          fill="currentColor"
        />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
        <h1 className="text-white font-extrabold text-xs sm:text-base md:text-lg lg:text-xl">
          Time:{" "}
          <span
            className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl ${
              timer <= 10 ? "animate-pulse" : ""
            }`}
          >
            {timer}
          </span>{" "}
          <span className="hidden sm:inline">sec</span>
          <span className="inline sm:hidden">s</span>
        </h1>
        <Clock
          className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 ${getClockColor()} transition-colors duration-300 ${
            timer <= 10 ? "animate-pulse" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default PatterRaceHeader;
