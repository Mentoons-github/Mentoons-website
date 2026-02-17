import { useState, useEffect, forwardRef, Ref } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import JobOpenings from "@/components/Careerpage/jobs";
import { JobPosting } from "@/types";
import { getOpenPositions } from "@/redux/careerSlice";
import { JobApplicationForm } from "../shared/FAQSection/FAQCard";

interface JobsListProps {
  searchTerm: string;
  targetJobName?: string | null;
}

const JobsList = forwardRef(
  ({ searchTerm, targetJobName }: JobsListProps, ref: Ref<HTMLDivElement>) => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedJob, setSelectedJob] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
    const limit = 10;

    const { openPositions, totalPages, loading } = useSelector(
      (state: RootState) => state.career,
    );

    useEffect(() => {
      dispatch(
        getOpenPositions({ page: currentPage, limit, search: searchTerm }),
      );
    }, [dispatch, currentPage, limit, searchTerm]);

    useEffect(() => {
      if (targetJobName && openPositions.length > 0) {
        const targetJob = openPositions.find((position: JobPosting) => {
          const jobTitleSlug = position.jobTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          const targetSlug = targetJobName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          return (
            jobTitleSlug === targetSlug ||
            position.jobTitle
              .toLowerCase()
              .includes(targetJobName.toLowerCase())
          );
        });

        if (targetJob) {
          setExpandedJobId(targetJob._id);

          setTimeout(() => {
            const jobElement = document.querySelector(
              `[data-job-id="${targetJob._id}"]`,
            );
            if (jobElement) {
              jobElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 800);
        }
      }
    }, [targetJobName, openPositions]);

    const handleJobSelect = (job: string) => {
      setSelectedJob(job);
      setIsFormOpen(true);
    };

    const handleJobExpand = (jobId: string, isExpanded: boolean) => {
      setExpandedJobId(isExpanded ? jobId : null);
    };

    const filteredPositions = openPositions.filter((position: JobPosting) => {
      return searchTerm
        ? position.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            position.jobDescription
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            position.skillsRequired.some((skill) =>
              skill.toLowerCase().includes(searchTerm.toLowerCase()),
            ) ||
            (position.responsibilities &&
              position.responsibilities.some((responsibility) =>
                responsibility.toLowerCase().includes(searchTerm.toLowerCase()),
              )) ||
            (position.requirements &&
              position.requirements.some((requirement) =>
                requirement.toLowerCase().includes(searchTerm.toLowerCase()),
              )) ||
            (position.whatWeOffer &&
              position.whatWeOffer.some((offer) =>
                offer.toLowerCase().includes(searchTerm.toLowerCase()),
              ))
        : true;
    });

    useEffect(() => {
      if (ref && typeof ref !== "function" && ref?.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [currentPage]);

    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };

    return (
      <div ref={ref} className="p-10 mt-20">
        <div className="mb-10">
          <h1 className="text-start font-semibold tracking-wide text-black text-5xl md:text-6xl">
            Be part of our mission
          </h1>
          <p className="mt-4 text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl font-sans">
            We believe in people, passion, and purpose. By joining us, you'll be
            recognized for your ideas, celebrated for your achievements, and
            empowered to grow in an environment that values collaboration and
            innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {loading ? (
            <p className="text-gray-700 text-lg col-span-2">Loading jobs...</p>
          ) : filteredPositions.length > 0 ? (
            filteredPositions.map((position: JobPosting) => (
              <div key={position._id} data-job-id={position._id}>
                <JobOpenings
                  job={position}
                  handleJobSelect={handleJobSelect}
                  isExpanded={expandedJobId === position._id}
                  onExpandChange={handleJobExpand}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-700 text-lg col-span-2">
              No jobs match your search.
            </p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mb-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full border-2 font-medium transition-all duration-300 ${
                currentPage === 1
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-gray-400 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-full border-2 font-medium transition-all duration-300 ${
                      currentPage === page
                        ? "bg-black text-white border-black"
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
              className={`px-4 py-2 rounded-full border-2 font-medium transition-all duration-300 ${
                currentPage === totalPages
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-gray-400 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {isFormOpen && selectedJob && (
          <div className="mb-10">
            <JobApplicationForm
              id={selectedJob}
              setIsFormOpen={setIsFormOpen}
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="w-72 md:w-[28rem] lg:w-[34rem] rounded-2xl overflow-hidden">
            <video
              src={`${
                import.meta.env.VITE_STATIC_URL
              }static/Mentoons Team Video_03.mp4`}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="w-72 md:w-[28rem] lg:w-[34rem]">
            <img
              src="https://mentoons-products.s3.ap-northeast-1.amazonaws.com/1234/team+Illustration+3.png"
              alt=""
              className="object-contain w-full"
            />
          </div>
        </div>
      </div>
    );
  },
);

export default JobsList;
