import { forwardRef } from "react";
import { MapPin, Briefcase, Users, SearchX } from "lucide-react";
import { TPOSITION } from "@/redux/careerSlice";

interface AffiliatePositionsListProps {
  positions: TPOSITION[];
  onPositionClick: (slug: string) => void;
  loading: boolean;
  searchTerm: string;
}

const AffiliatePositionsList = forwardRef<
  HTMLDivElement,
  AffiliatePositionsListProps
>(({ positions, onPositionClick, loading, searchTerm }, ref) => {
  const getJobTypeBadgeColor = (jobType: string) => {
    switch (jobType) {
      case "FULLTIME":
        return "bg-green-100 text-green-700 border-green-200";
      case "PARTTIME":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "CONTRACT":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "INTERNSHIP":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatJobType = (jobType: string) => {
    switch (jobType) {
      case "FULLTIME":
        return "Full Time";
      case "PARTTIME":
        return "Part Time";
      case "CONTRACT":
        return "Contract";
      case "INTERNSHIP":
        return "Internship";
      default:
        return jobType;
    }
  };

  if (loading) {
    return (
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-md animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-50 rounded-full mb-4">
            {searchTerm ? (
              <SearchX className="w-10 h-10 text-orange-500" />
            ) : (
              <Briefcase className="w-10 h-10 text-orange-500" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {searchTerm
              ? "No Positions Found"
              : "No Open Positions at the Moment"}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            {searchTerm ? (
              <>
                We couldn't find any positions matching{" "}
                <span className="font-semibold text-orange-600">
                  "{searchTerm}"
                </span>
                .
              </>
            ) : (
              "Check back soon for new affiliate opportunities!"
            )}
          </p>
          {searchTerm && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3">Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  Marketing
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  Sales
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  Content Creator
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  Partnership
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          {searchTerm ? "Search Results" : "Available Positions"}
        </h2>
        <p className="text-gray-600 mt-2">
          {searchTerm && (
            <span>
              Found{" "}
              <span className="font-semibold text-orange-600">
                {positions.length}
              </span>{" "}
              {positions.length === 1 ? "position" : "positions"} matching "
              {searchTerm}" •{" "}
            </span>
          )}
          {positions.length} {positions.length === 1 ? "position" : "positions"}{" "}
          available
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {positions.map((position) => (
          <div
            key={position._id}
            onClick={() => onPositionClick(position.slug)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-orange-300 group"
          >
            {/* Thumbnail */}
            {position.thumbnail && (
              <div className="h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                <img
                  src={position.thumbnail}
                  alt={position.jobTitle}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}

            <div className="p-6">
              {/* Job Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                {position.jobTitle}
              </h3>

              {/* Job Type Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getJobTypeBadgeColor(position.jobType)}`}
                >
                  {formatJobType(position.jobType)}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm truncate">{position.location}</span>
              </div>

              {/* Application Count */}
              <div className="flex items-center text-gray-600 mb-4">
                <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm">
                  {position.applicationCount} applicant
                  {position.applicationCount !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Skills */}
              {position.skillsRequired &&
                position.skillsRequired.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {position.skillsRequired.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {position.skillsRequired.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          +{position.skillsRequired.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

              {/* Description Preview */}
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {position.jobDescription}
              </p>

              {/* View Details Button */}
              <button className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform group-hover:scale-105">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

AffiliatePositionsList.displayName = "AffiliatePositionsList";

export default AffiliatePositionsList;
