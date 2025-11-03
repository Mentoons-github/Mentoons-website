import { Cake, Mail, Calendar } from "lucide-react";
import { Celebration } from "@/types";

interface CelebrationModalProps {
  date: number;
  month: number;
  year: number;
  celebrations: Celebration[];
  onClose: () => void;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  date,
  month,
  celebrations,
  onClose,
}) => (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all border-4 border-blue-400"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mb-5 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <Cake className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
        {months[month]} {date}
      </h3>

      {celebrations.length > 0 ? (
        <div className="space-y-4">
          {celebrations.map((c, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-blue-300"
            >
              <div className="flex items-center gap-4 mb-3 sm:mb-4">
                <img
                  src={c.picture || "https://via.placeholder.com/64"}
                  alt={c.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-black text-xl sm:text-2xl text-gray-800 mb-1">
                    {c.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">{c.type}</p>
                  <p className="text-xs text-blue-600 font-bold">
                    Time to celebrate!
                  </p>
                </div>
              </div>
              <button className="w-full px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                Send Message
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 sm:py-12">
          <Calendar className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-base sm:text-lg font-semibold">
            No celebrations on this date
          </p>
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-5 sm:mt-6 w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl transition-all hover:scale-105"
      >
        Close
      </button>
    </div>
  </div>
);

export default CelebrationModal;
