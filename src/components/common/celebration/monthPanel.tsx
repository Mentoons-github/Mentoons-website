import { Calendar } from "lucide-react";
import { NameTooltip } from "./nameTooltip";
import { Celebration } from "@/types";

interface ThisMonthPanelProps {
  celebrations: Celebration[];
  onDateClick: (day: number) => void;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ThisMonthPanel: React.FC<ThisMonthPanelProps> = ({
  celebrations,
  onDateClick,
}) => {
  if (celebrations.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-200 p-4 sm:p-5">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5 mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              This Month
            </h3>
          </div>
        </div>
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 text-gray-300" />
          <p className="font-semibold text-sm sm:text-base">No celebrations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-200">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            This Month
          </h3>
        </div>
      </div>
      <div className="p-4 sm:p-5 max-h-80 sm:max-h-96 overflow-y-auto">
        <div className="space-y-2 sm:space-y-3">
          {celebrations
            .sort(
              (a, b) => new Date(a.date).getDate() - new Date(b.date).getDate()
            )
            .map((c, i) => (
              <div
                key={i}
                className="flex min-h-[60px] items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all cursor-pointer hover:scale-105 border-2 border-blue-200 hover:border-blue-400"
                onClick={() => onDateClick(new Date(c.date).getDate())}
              >
                <img
                  src={c.picture || "https://via.placeholder.com/64"}
                  alt={c.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <NameTooltip name={c.name}>
                    <h4 className="truncate font-bold text-sm sm:text-base md:text-lg text-gray-800">
                      {c.name}
                    </h4>
                  </NameTooltip>
                  <p className="truncate text-xs text-gray-600">{c.type}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-blue-600">
                    {new Date(c.date).getDate()}
                  </div>
                  <div className="text-xs text-blue-600 font-semibold">
                    {months[new Date(c.date).getMonth()]}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ThisMonthPanel;
