import { TrendingUp } from "lucide-react";
import { NameTooltip } from "./nameTooltip";
import { UpcomingCelebration } from "@/types";

interface ComingSoonPanelProps {
  celebrations: UpcomingCelebration[];
}

const ComingSoonPanel: React.FC<ComingSoonPanelProps> = ({ celebrations }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-200">
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5">
      <div className="flex items-center gap-2 sm:gap-3">
        <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Coming Soon
        </h3>
      </div>
    </div>
    <div className="p-4 sm:p-5">
      <div className="space-y-2 sm:space-y-3">
        {celebrations.map((c, i) => (
          <div
            key={i}
            className="flex min-h-[60px] items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl hover:shadow-lg transition-all border-2 border-blue-200"
          >
            <img
              src={c.picture || "https://via.placeholder.com/64"}
              alt={c.name}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <NameTooltip name={c.name}>
                <h4 className="truncate font-bold text-sm sm:text-base text-gray-800">
                  {c.name}
                </h4>
              </NameTooltip>
              <p className="truncate text-xs text-gray-600">{c.type}</p>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="text-lg sm:text-xl md:text-2xl font-black text-blue-600 leading-tight">
                {c.daysUntil}
              </div>
              <div className="text-xs text-gray-600">days</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ComingSoonPanel;
