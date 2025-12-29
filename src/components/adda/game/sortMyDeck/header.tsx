import { Clock, Trophy, Sparkles } from "lucide-react";

interface Header {
  remainingTime: number;
  score: number;
}

const SortDeckHeader = ({ remainingTime, score }: Header) => {
  return (
    <div className="pt-4 md:pt-8 pb-1 space-y-3 md:space-y-6">
      {/* Stats Bar */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        <div className="bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-2xl border border-purple-500/30 p-0.5 md:p-1">
          <div className="flex justify-between gap-0.5 md:gap-1">
            {/* Timer */}
            <div className="flex-1 bg-gradient-to-br from-rose-600 to-pink-600 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <div className="relative flex items-center justify-center gap-2 md:gap-3">
                <Clock
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
                  strokeWidth={2.5}
                />
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-semibold opacity-90">
                    Time
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-black">
                    {remainingTime}s
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-1 md:bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 h-1 md:h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full shadow-lg transition-all duration-300"
                  style={{ width: `${(remainingTime / 50) * 100}%` }}
                />
              </div>
            </div>

            {/* Score */}
            <div className="flex-1 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <div className="relative flex items-center justify-center gap-2 md:gap-3">
                <Trophy
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
                  strokeWidth={2.5}
                />
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-semibold opacity-90">
                    Score
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-black">
                    {score}
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-1 md:bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 h-1 md:h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full shadow-lg transition-all duration-300"
                  style={{ width: `${Math.min((score / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instruction Banner */}
      <div className="max-w-2xl mx-auto px-2 sm:px-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-xl md:rounded-2xl blur-sm group-hover:blur-md transition-all duration-300 opacity-75" />
          <div className="relative bg-gradient-to-r from-purple-700 to-indigo-700 rounded-xl md:rounded-2xl py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 border border-purple-400/50 shadow-xl">
            <div className="flex items-center justify-center gap-2 md:gap-3">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-300 animate-pulse" />
              <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black text-white text-center tracking-wide">
                Drag the cards to the right pile!
              </h1>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-300 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortDeckHeader;
