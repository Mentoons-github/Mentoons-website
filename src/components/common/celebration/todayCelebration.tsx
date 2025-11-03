import { Gift, Mail } from "lucide-react";
import { Celebration } from "@/types";

interface TodayCelebrationsProps {
  celebrations: Celebration[];
  onConfettiEnter: () => void;
  onConfettiLeave: () => void;
}

const TodayCelebrations: React.FC<TodayCelebrationsProps> = ({
  celebrations,
  onConfettiEnter,
  onConfettiLeave,
}) => {
  if (celebrations.length === 0) return null;

  return (
    <div
      className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-white/50"
      onMouseEnter={onConfettiEnter}
      onMouseLeave={onConfettiLeave}
    >
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Gift className="w-10 h-10 sm:w-14 sm:h-14 text-white animate-bounce drop-shadow-lg" />
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg">
          Today's Celebrations!
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {celebrations.map((c, i) => (
          <div
            key={i}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl transform hover:scale-105 transition-all hover:shadow-blue-500/50"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <img
                src={c.picture || "https://via.placeholder.com/64"}
                alt={c.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-800 mb-1">
                  {c.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">{c.type}</p>
              </div>
            </div>
            <button className="w-full px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Send {c.type} Wishes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayCelebrations;
