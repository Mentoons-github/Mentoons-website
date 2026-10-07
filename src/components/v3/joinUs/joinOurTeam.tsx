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

/* ---------------- icon + label helpers ---------------- */

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

/* Shows at most 5 page buttons with "..." gaps so it fits on phones */
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

/* ---------------- filters bar ---------------- */

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          type="text"
          placeholder="Search job title or keyword..."
          className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-300 sm:h-12 sm:text-base"
        />
      </div>

      <div className="relative w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setShowTypeMenu((s) => !s)}
          className="flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:h-12 sm:w-auto sm:justify-start sm:text-base"
        >
          <span className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-gray-500" />
            {jobTypeFilter === "All Types"
              ? "Job Type"
              : formatJobType(jobTypeFilter)}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {showTypeMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowTypeMenu(false)}
            />
            <div className="absolute left-0 top-full z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white py-2 shadow-lg sm:right-0 sm:left-auto sm:w-48">
              {JOB_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onJobTypeChange(type);
                    setShowTypeMenu(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${
                    jobTypeFilter === type
                      ? "font-semibold text-gray-900"
                      : "text-gray-600"
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

/* ---------------- position card ---------------- */

interface PositionCardProps {
  position: TPOSITION;
  onViewDetails: (position: TPOSITION) => void;
  onApply: (jobId: string) => void;
}

const PositionCard = ({
  position,
  onViewDetails,
  onApply,
}: PositionCardProps) => {
  const Icon = getJobIcon(position.jobTitle);

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
      <button
        type="button"
        onClick={() => onViewDetails(position)}
        className="flex min-w-0 items-center gap-3 text-left"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-white sm:h-12 sm:w-12">
          {position.thumbnail ? (
            <img
              src={position.thumbnail}
              alt={position.jobTitle}
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </div>
        <h3 className="min-w-0 break-words text-base font-semibold text-gray-900 hover:text-blue-600 sm:text-lg">
          {position.jobTitle}
        </h3>
      </button>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 sm:text-sm">
          {formatJobType(position.jobType)}
        </span>
        <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 sm:text-sm">
          {position.location}
        </span>
      </div>

      <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 sm:text-base">
        {position.jobDescription}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-gray-500 sm:text-sm">
        <span className="flex min-w-0 items-center gap-1.5">
          <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="truncate">{position.location}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4 shrink-0 text-gray-400" />
          {position.applicationCount ?? 0} applicants
        </span>
      </div>

      <button
        type="button"
        onClick={() => onApply(position._id)}
        className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-200 sm:text-base"
      >
        Apply Now
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
};

/* ---------------- main component ---------------- */

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

  // debounced fetch on search/page change
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

  // reset to page 1 whenever the search term changes
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

  const pageBtn =
    "rounded-full border-2 px-3 py-1.5 text-sm font-medium transition-all duration-300 sm:px-4 sm:py-2 sm:text-base";

  return (
    <div className="mx-auto my-6 space-y-5 px-4 sm:my-10 sm:space-y-6 sm:px-6 md:px-10 lg:px-20">
      <OpenPositionsFilters
        query={query}
        onQueryChange={setQuery}
        jobTypeFilter={jobTypeFilter}
        onJobTypeChange={setJobTypeFilter}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Open Positions ({positions.length})
        </h2>
      </div>

      {loading ? (
        <p className="text-base text-gray-600">Loading jobs...</p>
      ) : positions.length === 0 ? (
        <p className="text-base text-gray-600">No jobs match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {positions.map((position: TPOSITION) => (
            <PositionCard
              key={position._id}
              position={position}
              onViewDetails={setDetailsJob}
              onApply={setApplyJobId}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${pageBtn} ${
              currentPage === 1
                ? "cursor-not-allowed border-gray-300 text-gray-400"
                : "border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Previous
          </button>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {getPageNumbers(currentPage, totalPages).map((page, i) =>
              page === "..." ? (
                <span
                  key={`gap-${i}`}
                  className="px-1 py-1.5 text-gray-400 sm:py-2"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${pageBtn} ${
                    currentPage === page
                      ? "border-black bg-black text-white"
                      : "border-gray-400 text-gray-700 hover:bg-gray-100"
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
            className={`${pageBtn} ${
              currentPage === totalPages
                ? "cursor-not-allowed border-gray-300 text-gray-400"
                : "border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
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

      {/* JobApplicationForm renders its own full-screen fixed overlay
          (z-[9999], scrollable) — do not wrap it in another fixed
          container here. */}
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
