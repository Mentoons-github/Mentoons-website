import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ChevronDown,
  MapPin,
  Briefcase,
  ArrowRight,
  Paintbrush,
  Megaphone,
  Clapperboard,
  Video,
  Users,
  Star,
  Code2,
  Drama,
  LucideIcon,
} from "lucide-react";
import { AppDispatch, RootState } from "@/redux/store";
import { getOpenPositions, TPOSITION } from "@/redux/careerSlice";
import { JobApplicationForm } from "@/components/shared/FAQSection/FAQCard";
import SelectedJobModal from "@/components/modals/career/selectedJobModal";

const LIMIT = 8;

const COMIC_BTN =
  "border-2 border-gray-900 shadow-[3px_3px_0_0_#111827] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0_0_#111827]";

const COMIC_CARD =
  "border-2 border-gray-900 bg-white shadow-[5px_5px_0_0_#111827]";

const CARD_COLORS = [
  "bg-[#FFD93D]",
  "bg-green-400",
  "bg-sky-300",
  "bg-pink-300",
  "bg-purple-300",
  "bg-[#ff9800]",
];

const ICON_RULES: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ["illustrat", "design", "art"], icon: Paintbrush },
  { keywords: ["market", "growth", "seo", "content"], icon: Megaphone },
  { keywords: ["video edit", "editor"], icon: Clapperboard },
  { keywords: ["film", "director", "cinemat"], icon: Video },
  { keywords: ["actor", "actress", "talent", "drama"], icon: Drama },
  { keywords: ["mentor", "counsel", "teach"], icon: Users },
  { keywords: ["astrolog"], icon: Star },
  {
    keywords: [
      "developer",
      "engineer",
      "mern",
      "react",
      "node",
      "frontend",
      "backend",
      "full stack",
      "fullstack",
    ],
    icon: Code2,
  },
];

const getJobIcon = (title: string): LucideIcon => {
  const lower = title.toLowerCase();
  const match = ICON_RULES.find((rule) =>
    rule.keywords.some((k) => lower.includes(k)),
  );
  return match ? match.icon : Briefcase;
};

const formatJobType = (type: string) => {
  switch (type) {
    case "FULLTIME":
      return "Full-time";
    case "PARTTIME":
      return "Part-time";
    case "CONTRACT":
      return "Contract";
    case "INTERNSHIP":
      return "Internship";
    default:
      return type;
  }
};

const JOB_TYPES = [
  "All Types",
  "FULLTIME",
  "PARTTIME",
  "CONTRACT",
  "INTERNSHIP",
];

const getPageNumbers = (current: number, total: number) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("...");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("...");
  pages.push(total);

  return pages;
};

interface OpenPositionsFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  jobTypeFilter: string;
  onJobTypeChange: (value: string) => void;
}

const OpenPositionsFilters = ({
  query,
  onQueryChange,
  jobTypeFilter,
  onJobTypeChange,
}: OpenPositionsFiltersProps) => {
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-900" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          type="text"
          placeholder="Search job title or keyword..."
          className="h-11 w-full rounded-full border-2 border-gray-900 bg-white pl-11 pr-4 text-sm text-gray-900 shadow-[3px_3px_0_0_#111827] outline-none placeholder:text-gray-500 focus:bg-[#FFFBEB] sm:h-12 sm:text-base"
        />
      </div>

      <div className="relative w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setShowTypeMenu((s) => !s)}
          className={`font-comic flex h-11 w-full items-center justify-between gap-2 rounded-full bg-white px-5 text-lg tracking-wide text-gray-900 hover:bg-[#FFD93D] sm:h-12 sm:w-auto sm:justify-start sm:text-xl ${COMIC_BTN}`}
        >
          <span className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {jobTypeFilter === "All Types"
              ? "Job Type"
              : formatJobType(jobTypeFilter)}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {showTypeMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowTypeMenu(false)}
            />
            <div className="absolute left-0 top-full z-20 mt-3 w-full overflow-hidden rounded-xl border-2 border-gray-900 bg-white py-1 shadow-[5px_5px_0_0_#111827] sm:right-0 sm:left-auto sm:w-52">
              {JOB_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onJobTypeChange(type);
                    setShowTypeMenu(false);
                  }}
                  className={`font-comic block w-full px-4 py-2 text-left text-xl tracking-wide text-gray-900 hover:bg-[#FFD93D] ${
                    jobTypeFilter === type ? "bg-[#ff9800] text-white" : ""
                  }`}
                >
                  {type === "All Types" ? "All Types" : formatJobType(type)}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface PositionCardProps {
  position: TPOSITION;
  colorClass: string;
  onViewDetails: (position: TPOSITION) => void;
  onApply: (jobId: string) => void;
}

const PositionCard = ({
  position,
  colorClass,
  onViewDetails,
  onApply,
}: PositionCardProps) => {
  const Icon = getJobIcon(position.jobTitle);

  return (
    <div
      className={`flex min-w-0 flex-col gap-3 rounded-2xl p-4 transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#111827] sm:p-5 ${COMIC_CARD}`}
    >
      <button
        type="button"
        onClick={() => onViewDetails(position)}
        className="flex min-w-0 items-center gap-3 text-left"
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gray-900 text-gray-900 shadow-[3px_3px_0_0_#111827] sm:h-14 sm:w-14 ${colorClass}`}
        >
          {position.thumbnail ? (
            <img
              src={position.thumbnail}
              alt={position.jobTitle}
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
          )}
        </div>
        <h3 className="font-comic min-w-0 break-words text-2xl leading-tight tracking-wide text-gray-900 hover:text-[#ff9800] sm:text-3xl">
          {position.jobTitle}
        </h3>
      </button>

      <div className="flex flex-wrap gap-2">
        <span className="font-comic rounded-full border-2 border-gray-900 bg-[#FFD93D] px-3 py-0.5 text-base tracking-wide text-gray-900 sm:text-lg">
          {formatJobType(position.jobType)}
        </span>
        <span className="font-comic rounded-full border-2 border-gray-900 bg-green-300 px-3 py-0.5 text-base tracking-wide text-gray-900 sm:text-lg">
          {position.location}
        </span>
      </div>

      <p className="line-clamp-3 text-sm leading-relaxed text-gray-700 sm:text-base">
        {position.jobDescription}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t-2 border-dashed border-gray-900/30 pt-3 text-xs font-medium text-gray-700 sm:text-sm">
        <span className="flex min-w-0 items-center gap-1.5">
          <MapPin className="h-4 w-4 shrink-0 text-gray-900" />
          <span className="truncate">{position.location}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4 shrink-0 text-gray-900" />
          {position.applicationCount ?? 0} applicants
        </span>
      </div>

      <button
        type="button"
        onClick={() => onApply(position._id)}
        className={`font-comic mt-auto flex w-full items-center justify-center gap-1.5 rounded-full bg-[#ff9800] px-4 py-2 text-xl tracking-wide text-white hover:bg-[#e68900] sm:text-2xl ${COMIC_BTN}`}
      >
        Apply Now
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
};

const OpenPositions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { openPositions, totalPages, loading } = useSelector(
    (state: RootState) => state.career,
  );

  const [query, setQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailsJob, setDetailsJob] = useState<TPOSITION | null>(null);
  const [applyJobId, setApplyJobId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(
        getOpenPositions({
          page: currentPage,
          limit: LIMIT,
          search: query,
          source: "INTERNAL",
        }),
      );
    }, 300);
    return () => clearTimeout(timeout);
  }, [dispatch, currentPage, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const positions = useMemo(() => {
    if (jobTypeFilter === "All Types") return openPositions;
    return openPositions.filter((p: TPOSITION) => p.jobType === jobTypeFilter);
  }, [openPositions, jobTypeFilter]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const refetch = () =>
    dispatch(
      getOpenPositions({
        page: currentPage,
        limit: LIMIT,
        search: query,
        source: "INTERNAL",
      }),
    );

  const handleApplySuccess = () => {
    setApplyJobId(null);
    refetch();
  };

  const pageBtn = `font-comic rounded-full px-4 py-1 text-lg tracking-wide sm:px-5 sm:py-1.5 sm:text-xl ${COMIC_BTN}`;

  return (
    <div className="mx-auto my-6 space-y-6 px-4 sm:my-10 sm:space-y-8 sm:px-6 md:px-10 lg:px-20">
      <OpenPositionsFilters
        query={query}
        onQueryChange={setQuery}
        jobTypeFilter={jobTypeFilter}
        onJobTypeChange={setJobTypeFilter}
      />

      <div className="flex items-center justify-between">
        <h2 className="font-comic text-4xl tracking-wide text-gray-900 sm:text-5xl">
          Open Positions ({positions.length})
        </h2>
      </div>

      {loading ? (
        <div className={`rounded-2xl p-8 text-center ${COMIC_CARD}`}>
          <p className="font-comic text-3xl tracking-wide text-gray-900">
            Loading jobs...
          </p>
        </div>
      ) : positions.length === 0 ? (
        <div className={`rounded-2xl p-8 text-center ${COMIC_CARD}`}>
          <p className="font-comic text-3xl tracking-wide text-gray-900">
            No jobs match your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 xl:grid-cols-4">
          {positions.map((position: TPOSITION, index: number) => (
            <PositionCard
              key={position._id}
              position={position}
              colorClass={CARD_COLORS[index % CARD_COLORS.length]}
              onViewDetails={setDetailsJob}
              onApply={setApplyJobId}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${pageBtn} bg-white text-gray-900 hover:bg-[#FFD93D]`}
          >
            Previous
          </button>
          <div className="flex flex-wrap justify-center gap-2">
            {getPageNumbers(currentPage, totalPages).map((page, i) =>
              page === "..." ? (
                <span
                  key={`gap-${i}`}
                  className="font-comic px-1 py-1.5 text-2xl text-gray-900 sm:py-2"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${pageBtn} ${
                    currentPage === page
                      ? "bg-[#ff9800] text-white"
                      : "bg-white text-gray-900 hover:bg-[#FFD93D]"
                  }`}
                >
                  {page}
                </button>
              ),
            )}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${pageBtn} bg-white text-gray-900 hover:bg-[#FFD93D]`}
          >
            Next
          </button>
        </div>
      )}

      {detailsJob && (
        <SelectedJobModal
          selectedJob={detailsJob}
          onClose={() => setDetailsJob(null)}
          onApply={(jobId) => {
            setDetailsJob(null);
            setApplyJobId(jobId);
          }}
          isLoading={false}
          fetchError={null}
        />
      )}

      {applyJobId && (
        <JobApplicationForm
          id={applyJobId}
          setIsFormOpen={() => setApplyJobId(null)}
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
};

export default OpenPositions;
