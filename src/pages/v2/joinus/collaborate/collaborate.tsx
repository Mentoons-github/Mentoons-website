import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getJobBySlug,
  getOpenPositions,
  clearSelectedJob,
} from "@/redux/careerSlice";
import JobHeroSection from "@/components/affiliate/hero/heroSection";
import PositionsList from "@/components/affiliate/position/position";
import SelectedJobModal from "@/components/modals/career/selectedJobModal";
import { JobApplicationForm } from "@/components/shared/FAQSection/FAQCard";

export type TPOSITION = {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  slug: string;
  jobType: "FULLTIME" | "PARTTIME" | "CONTRACT" | "INTERNSHIP";
  location: string;
  skillsRequired: string[];
  applicationCount: number;
  thumbnail: string;
  responsibilities?: string[];
  requirements?: string[];
  whatWeOffer: string[];
  applicationSource?: string[];
};

const Collaborate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const positionsListRef = useRef<HTMLDivElement>(null);

  const { openPositions, selectedJob, loading, error } = useSelector(
    (state: RootState) => state.career,
  );

  const title = "JOIN OUR COLLABORATION NETWORK";
  const subTitle =
    "Partner with us on meaningful projects — browse available opportunities below";

  const [formJobId, setFormJobId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getOpenPositions({ source: "COLLABORATE" }));
  }, [dispatch]);

  useEffect(() => {
    if (slug) {
      dispatch(getJobBySlug(slug));
    } else {
      dispatch(clearSelectedJob());
    }
  }, [slug, dispatch]);

  const handlePositionClick = (positionSlug: string) => {
    navigate(`/joinus/collaborate/${positionSlug}`);
  };

  const handleApply = (jobId: string) => {
    setFormJobId(jobId);
  };

  const closeJobModal = () => {
    dispatch(clearSelectedJob());
    navigate("/joinus/collaborate");
  };

  const closeForm = () => {
    setFormJobId(null);
  };

  const handleApplicationSuccess = () => {
    setFormJobId(null);
    dispatch(clearSelectedJob());
    navigate("/joinus/collaborate");
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term && positionsListRef.current) {
      setTimeout(() => {
        positionsListRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  const filteredPositions = openPositions.filter((position) =>
    position.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
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
              applicationSource={"COLLABORATE"}
            />
          </div>
        </div>
      )}

      <JobHeroSection
        subTitle={subTitle}
        title={title}
        onSearch={handleSearch}
      />

      <PositionsList
        ref={positionsListRef}
        positions={filteredPositions}
        onPositionClick={handlePositionClick}
        loading={loading}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default Collaborate;
