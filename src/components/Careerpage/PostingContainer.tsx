import { useState } from "react";
import Postings from "./Postings";
import { IoChevronBack } from "react-icons/io5";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { JobApplicationForm } from "../shared/FAQSection/FAQCard";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const PostingContainer = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosting, setSelectedPosting] = useState<string | null>(null);
  const openPositions = useSelector(
    (state: RootState) => state.career.openPositions,
  );
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const selectedPosition = openPositions.find(
    (position) => position.jobTitle === selectedPosting,
  );

  const handlePostingClick = (postingTitle: string) => {
    setSelectedPosting(postingTitle);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-10">
      {openPositions.map((position) => (
        <Postings
          key={position._id}
          title={position.jobTitle}
          onClick={() => handlePostingClick(position.jobTitle)}
        />
      ))}

      {isModalOpen && selectedPosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          {isFormOpen ? (
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg p-14 relative">
              <div className="absolute top-4 right-4 z-10 hover:scale-110 transition-transform bg-gradient-to-b from-[#60C6E6] to-[#3D8196] max-w-fit">
                <FaTimes
                  onClick={() => setIsFormOpen(false)}
                  className="text-xl text-white cursor-pointer md:text-2xl lg:text-3xl "
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-center gap-4">
                  <figure className="w-20 h-20">
                    <img
                      src="/assets/Career/form-icon.png"
                      alt="form icon"
                      className="object-contain w-full h-full"
                    />
                  </figure>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-black md:text-3xl lg:text-4xl">
                      {selectedPosition.jobTitle}
                    </h1>
                    <p className="text-sm md:text-base lg:text-lg text-black/50">
                      Fill in the details below and we'll contact you
                    </p>
                  </div>
                </div>
                <JobApplicationForm
                  id={selectedPosition._id}
                  setIsFormOpen={setIsFormOpen}
                />
              </div>
            </div>
          ) : (
            <div className="bg-[url('/assets/Career/posting-bg.png')] bg-cover bg-center w-full max-w-4xl max-h-[90vh] rounded-sm relative">
              <IoChevronBack
                onClick={() => setIsModalOpen(false)}
                className="absolute z-10 text-2xl text-white transition-transform cursor-pointer md:text-3xl lg:text-4xl top-4 left-4 hover:scale-110"
              />

              <div className="p-6 md:p-12 lg:p-16 overflow-y-auto max-h-[90vh]">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  {/* Content Column */}
                  <div className="flex-1">
                    <div className="text-center md:text-left">
                      <h1 className="text-xl font-bold text-white md:text-3xl lg:text-4xl">
                        {selectedPosition.jobTitle}
                      </h1>
                      <div className="flex flex-wrap justify-center gap-2 mt-3 md:gap-4 md:justify-start">
                        <span className="px-3 py-1 text-xs text-white rounded-full bg-white/20 md:text-sm">
                          {selectedPosition.jobType}
                        </span>
                        <span className="px-3 py-1 text-xs text-white rounded-full bg-white/20 md:text-sm">
                          {selectedPosition.location}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 text-white">
                      <h2 className="text-base font-bold md:text-lg lg:text-xl">
                        Description
                      </h2>
                      <p className="mt-2 text-sm md:text-base lg:text-lg">
                        {selectedPosition.jobDescription}
                      </p>
                    </div>

                    <div className="mt-6 text-white">
                      <h2 className="text-base font-bold md:text-lg lg:text-xl">
                        Required Skills
                      </h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedPosition.skillsRequired.map((skill:string, index:number) => (
                          <span
                            key={index}
                            className="bg-white/10 px-3 py-1.5 rounded-lg text-xs md:text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      className="w-full mt-6 text-black bg-white hover:bg-white/80"
                      onClick={async () => {
                        const token = await getToken();
                        if (!token) {
                          navigate("/sign-in");
                        } else {
                          setIsFormOpen(true);
                        }
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>

                  {/* Image Column */}
                  <div className="lg:w-1/3">
                    <img
                      src={selectedPosition.thumbnail}
                      alt="position illustration"
                      className="w-24 md:w-40 lg:w-full max-w-[280px] object-contain opacity-80 transition-all duration-300 hover:opacity-100 mx-auto lg:mx-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostingContainer;
