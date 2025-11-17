import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { NameTooltip } from "./nameTooltip";
import { UpcomingCelebration } from "@/types";
import { useState } from "react";

interface ComingSoonPanelProps {
  celebrations: UpcomingCelebration[];
}

const PAGE_SIZE = 3;

const ComingSoonPanel: React.FC<ComingSoonPanelProps> = ({ celebrations }) => {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(celebrations.length / PAGE_SIZE));
  const start = page * PAGE_SIZE;
  const visible = celebrations.slice(start, start + PAGE_SIZE);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Coming Soon
            </h3>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={goPrev}
                disabled={page === 0}
                className={`p-1.5 rounded-lg transition-all ${
                  page === 0
                    ? "text-white/40 cursor-not-allowed"
                    : "text-white hover:bg-white/20"
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-white px-2">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={goNext}
                disabled={page === totalPages - 1}
                className={`p-1.5 rounded-lg transition-all ${
                  page === totalPages - 1
                    ? "text-white/40 cursor-not-allowed"
                    : "text-white hover:bg-white/20"
                }`}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* List */}
      <div className="p-4 sm:p-5">
        <div className="space-y-2 sm:space-y-3">
          {visible.length > 0 ? (
            visible.map((c, i) => (
              <div
                key={`${c.name}-${i}`}
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
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPanel;
