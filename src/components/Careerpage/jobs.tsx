import { ChevronDown, MapPin, Clock, Users, Tag } from "lucide-react";

export interface JobPosting {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  jobType: "FULLTIME" | "PARTTIME" | "CONTRACT" | "INTERNSHIP";
  location: string;
  skillsRequired: string[];
  applicationCount: number;
  thumbnail: string;
  responsibilities?: string[];
  requirements?: string[];
  whatWeOffer?: string[];
}

interface JobOpeningsProps {
  job: JobPosting;
  handleJobSelect: (val: string) => void;
  isExpanded?: boolean;
  onExpandChange?: (jobId: string, isExpanded: boolean) => void;
}

const JobOpenings = ({
  job,
  handleJobSelect,
  isExpanded = false,
  onExpandChange,
}: JobOpeningsProps) => {
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

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "FULLTIME":
        return "bg-green-100 text-green-800";
      case "PARTTIME":
        return "bg-blue-100 text-blue-800";
      case "CONTRACT":
        return "bg-purple-100 text-purple-800";
      case "INTERNSHIP":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleToggleExpand = () => {
    onExpandChange?.(job._id, !isExpanded);
  };

  return (
    <div className="relative">
      <div
        className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden mt-2 sm:mt-3 md:mt-4 ${
          isExpanded ? "border-blue-300 shadow-md" : "border-gray-200"
        }`}
      >
        <div
          className={`flex items-center justify-between p-4 sm:p-5 md:p-6 cursor-pointer transition-colors ${
            isExpanded ? "bg-blue-50" : "hover:bg-gray-50"
          }`}
          onClick={handleToggleExpand}
        >
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            {job.thumbnail && (
              <img
                src={job.thumbnail}
                alt={`${job.jobTitle} thumbnail`}
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg object-cover border border-gray-200 shadow-sm"
              />
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h1
                  className={`text-lg sm:text-xl md:text-2xl font-semibold transition-colors ${
                    isExpanded
                      ? "text-blue-700"
                      : "text-gray-900 hover:text-blue-600"
                  }`}
                >
                  {job.jobTitle}
                </h1>
                <span className="text-xs sm:text-sm text-gray-500 ml-2 sm:ml-4">
                  2 days ago
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getJobTypeColor(
                      job.jobType
                    )}`}
                  >
                    {formatJobType(job.jobType)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{job.applicationCount} applicants</span>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-4 sm:ml-6">
            <ChevronDown
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                isExpanded
                  ? "rotate-180 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-blue-200 rounded-xl shadow-lg mt-1 sm:mt-2">
          <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6 bg-blue-50">
            <div className="max-h-[60vh] sm:max-h-[70vh] md:max-h-96 overflow-y-auto custom-scrollbar">
              <div className="space-y-4 sm:space-y-5 pr-2">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                    Job Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {job.jobDescription}
                  </p>
                </div>

                {job.skillsRequired.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg flex items-center gap-2">
                      <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg flex items-center gap-2">
                      <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                      Responsibilities
                    </h3>
                    <ul className="text-gray-700 space-y-1 text-sm sm:text-base">
                      {job.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></span>
                          <span>{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg flex items-center gap-2">
                      <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                      Requirements
                    </h3>
                    <ul className="text-gray-700 space-y-1 text-sm sm:text-base">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></span>
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.whatWeOffer && job.whatWeOffer.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg flex items-center gap-2">
                      <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                      What We Offer
                    </h3>
                    <ul className="text-gray-700 space-y-1 text-sm sm:text-base">
                      {job.whatWeOffer.map((offer, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></span>
                          <span>{offer}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200">
              <button
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto text-sm sm:text-base"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJobSelect(job._id);
                }}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
      .custom-scrollbar {
        overflow-y: auto;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px sm:8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }

      /* Firefox support */
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #cbd5e1 #f1f5f9;
      }
    `}</style>
    </div>
  );
};

export default JobOpenings;
