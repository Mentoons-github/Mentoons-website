import { Trophy, Sparkles, X, Gamepad2 } from "lucide-react";

interface RewardPointsModalProps {
  rewardPoints: number;
  onClose: () => void;
}

const RewardPointsModal = ({
  rewardPoints,
  onClose,
}: RewardPointsModalProps) => {
  const points = rewardPoints ?? 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-[95vw] sm:max-w-md w-full overflow-hidden transform animate-slideUp">
        <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-4 sm:p-6 md:p-8 pb-12 sm:pb-14 md:pb-16">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 sm:p-2 transition-all"
          >
            <X size={20} className="sm:hidden" />
            <X size={24} className="hidden sm:block" />
          </button>

          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <Trophy
                size={48}
                className="text-white relative z-10 sm:hidden"
              />
              <Trophy
                size={64}
                className="text-white relative z-10 hidden sm:block"
              />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-1 sm:mb-2 whitespace-nowrap px-2">
            Game Complete!
          </h2>
          <p className="text-white text-center text-sm sm:text-base md:text-lg opacity-90 whitespace-nowrap px-2">
            You've earned Candy Coins
          </p>
        </div>

        <div className="relative -mt-10 sm:-mt-12 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border-2 sm:border-4 border-yellow-400">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Sparkles className="text-yellow-500 flex-shrink-0" size={24} />
              <div className="text-center min-w-0">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                  {points.toLocaleString()}
                </div>
                <div className="text-gray-600 font-semibold text-sm sm:text-base md:text-lg mt-0.5 sm:mt-1 whitespace-nowrap">
                  Candy Coins
                </div>
              </div>
              <Sparkles className="text-yellow-500 flex-shrink-0" size={24} />
            </div>

            <div className="mt-4 sm:mt-6">
              <button
                onClick={onClose}
                className="w-full py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm sm:text-base whitespace-nowrap"
              >
                Continue Playing
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200">
            <div className="flex items-start sm:items-center justify-center gap-2 text-xs sm:text-sm text-gray-700">
              <Gamepad2
                size={16}
                className="text-orange-500 flex-shrink-0 mt-0.5 sm:mt-0 sm:size-[18px]"
              />
              <p className="text-center leading-relaxed">
                Complete more games to earn even more Candy Coins! 🎮
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RewardPointsModal;
