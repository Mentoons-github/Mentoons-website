import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getJobBySlug,
  getOpenPositions,
  clearSelectedJob,
} from "@/redux/careerSlice";
import HeroSection from "@/components/Careerpage/heroSection/heroSection";
import JobsList from "@/components/Careerpage/jobsList";
import EmployeeTestimonials from "@/components/Careerpage/EmployeeTestimonials";
import SelectedJobModal from "@/components/modals/career/selectedJobModal";
import { JobApplicationForm } from "@/components/shared/FAQSection/FAQCard";

export type OpenPositionsType = {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  jobType: string;
  location: string;
  applicationCount: number;
  skillsRequired: string[];
  thumbnail: string;
};

const CareerPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");
  const jobsListRef = useRef<HTMLDivElement>(null);

  const { selectedJob, loading, error } = useSelector(
    (state: RootState) => state.career,
  );

  const [formJobId, setFormJobId] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const { slug } = useParams<{ slug: string }>();
  const jobName = searchParams.get("job");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (jobsListRef.current && value) {
      jobsListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleApply = (jobId: string) => {
    setFormJobId(jobId);
  };

  const closeJobModal = () => {
    dispatch(clearSelectedJob());
  };

  const closeForm = () => {
    setFormJobId(null);
  };

  const handleApplicationSuccess = () => {
    setFormJobId(null);
    dispatch(clearSelectedJob());
  };

  const getOpenPositionsData = async () => {
    if (slug) {
      dispatch(getJobBySlug(slug));
    } else {
      dispatch(getOpenPositions({ source: "INTERNAL" }));
    }
  };

  useEffect(() => {
    getOpenPositionsData();
  }, [slug]);

  useEffect(() => {
    if (jobName && jobsListRef.current) {
      setTimeout(() => {
        jobsListRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [jobName]);

  return (
    <div>
      {selectedJob && (
        <SelectedJobModal
          selectedJob={selectedJob}
          onClose={closeJobModal}
          onApply={handleApply}
          isLoading={loading}
          fetchError={error}
        />
      )}

      {formJobId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <JobApplicationForm
              id={formJobId}
              setIsFormOpen={closeForm}
              onSuccess={handleApplicationSuccess}
            />
          </div>
        </div>
      )}

      <HeroSection onSearch={handleSearch} />
      <JobsList
        searchTerm={searchTerm}
        ref={jobsListRef}
        targetJobName={jobName}
      />
      <EmployeeTestimonials />
    </div>
  );
};

export default CareerPage;
