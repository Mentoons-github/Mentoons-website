import { Users } from "lucide-react";

interface TeamStatsPanelProps {
  total: number;
  thisMonth: number;
}

const TeamStatsPanel: React.FC<TeamStatsPanelProps> = ({
  total,
  thisMonth,
}) => (
  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-white border-4 border-white/30">
    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
      <Users className="w-8 h-8 sm:w-10 sm:h-10" />
      <h3 className="text-xl sm:text-2xl md:text-3xl font-black">Team Stats</h3>
    </div>
    <div className="space-y-3 sm:space-y-4">
      <div className="flex justify-between items-center p-3 sm:p-4 bg-white/20 rounded-xl sm:rounded-2xl border-2 border-white/30 backdrop-blur-sm">
        <span className="text-blue-100 font-semibold text-sm sm:text-base">
          Total
        </span>
        <span className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-300">
          {total}
        </span>
      </div>
      <div className="flex justify-between items-center p-3 sm:p-4 bg-white/20 rounded-xl sm:rounded-2xl border-2 border-white/30 backdrop-blur-sm">
        <span className="text-blue-100 font-semibold text-sm sm:text-base">
          This Month
        </span>
        <span className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-300">
          {thisMonth}
        </span>
      </div>
    </div>
  </div>
);

export default TeamStatsPanel;
