import { Cake, Sparkles } from "lucide-react";

const CelebrationHeader = () => (
  <div className="text-center mb-6 sm:mb-8">
    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
      <Cake className="w-10 h-10 sm:w-14 sm:h-14 text-blue-500 drop-shadow-lg animate-pulse" />
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent drop-shadow-md">
        Celebrations
      </h1>
      <Sparkles className="w-10 h-10 sm:w-14 sm:h-14 text-blue-500 drop-shadow-lg animate-pulse" />
    </div>
    <p className="text-gray-700 text-base sm:text-lg md:text-xl font-medium">
      Celebrate every special moment with your team
    </p>
  </div>
);

export default CelebrationHeader;
