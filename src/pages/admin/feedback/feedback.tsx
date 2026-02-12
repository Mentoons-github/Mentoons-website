import StarRatingFilter from "@/components/admin/feedback/starRatingFilter";
import { FaStar } from "react-icons/fa6";
import { BiUser } from "react-icons/bi";
import { MdDateRange, MdCheckCircle } from "react-icons/md";
import { fetchFeedback, saveDisplayReviews } from "@/api/feedback/feeedback";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { useEffect, useState } from "react";
import { FeedbackItem } from "@/pages/v2/feedback/feedback";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";

const Feedback = () => {
  const { showStatus } = useStatusModal();
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [filteredData, setFilteredData] = useState<FeedbackItem[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedForDisplay, setSelectedForDisplay] = useState<Set<string>>(
    new Set(),
  );
  const { getToken } = useAuth();
  const [selectionMode, setSelectionMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const MAX_DISPLAY_REVIEWS = 3;

  const allFeedback = async (page: number = 1, append: boolean = false) => {
    setLoading(true);
    const response = await fetchFeedback(10, page);
    console.log("API Response:", response);

    if (!response.success) {
      showStatus("error", response.message!);
      setLoading(false);
      return;
    }

    const newFeedback = response.data.data.feedback;
    const total = response.data.data.totalPages || 1;

    setTotalPages(total);
    setHasMore(page < total);

    if (append) {
      setFeedbackData((prev) => [...prev, ...newFeedback]);
    } else {
      setFeedbackData(newFeedback);
    }

    setLoading(false);
  };

  useEffect(() => {
    allFeedback(1, false);
  }, []);

  useEffect(() => {
    const sorted = [...feedbackData].sort((a, b) => {
      const aShown = a.showToUser === true;
      const bShown = b.showToUser === true;
      if (aShown && !bShown) return -1;
      if (!aShown && bShown) return 1;
      return 0;
    });

    if (selectedRating === null) {
      setFilteredData(sorted);
    } else {
      setFilteredData(sorted.filter((f) => f.rating === selectedRating));
    }
  }, [selectedRating, feedbackData]);

  const getRatingCounts = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbackData.forEach((f) => {
      if (f.rating >= 1 && f.rating <= 5) {
        counts[f.rating as keyof typeof counts]++;
      }
    });
    return counts;
  };

  const ratingCounts = getRatingCounts();

  const handleFilterChange = (rating: number | null) => {
    setSelectedRating(rating);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    allFeedback(nextPage, true);
  };

  const toggleSelection = (id: string) => {
    if (!id) {
      console.error("Cannot select review without ID");
      return;
    }

    setSelectedForDisplay((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (newSet.size >= MAX_DISPLAY_REVIEWS) {
          showStatus(
            "info",
            `You can only select up to ${MAX_DISPLAY_REVIEWS} reviews for display`,
          );
          return prev;
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSaveSelection = async () => {
    if (selectedForDisplay.size !== MAX_DISPLAY_REVIEWS) {
      showStatus(
        "info",
        `Please select exactly ${MAX_DISPLAY_REVIEWS} reviews`,
      );
      return;
    }

    setSaving(true);
    const reviewIds = Array.from(selectedForDisplay);

    console.log("Saving selected reviews:", reviewIds);

    const response = await saveDisplayReviews({ reviewIds, getToken });

    console.log(response);
    if (response.success) {
      showStatus("success", "Reviews successfully selected for user display!");
      setSelectionMode(false);
      setSelectedForDisplay(new Set());
    } else {
      showStatus(
        "error",
        response.message || "Failed to save selected reviews",
      );
    }

    setSaving(false);
  };

  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedForDisplay(new Set());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateAverageRating = () => {
    if (feedbackData.length === 0) return "0.0";
    const sum = feedbackData.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / feedbackData.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Customer Feedback
              </h1>
              <p className="text-gray-600">
                Review and manage customer feedback and ratings
              </p>
            </div>

            {feedbackData.length > 0 && (
              <button
                onClick={() => {
                  if (selectionMode) {
                    handleCancelSelection();
                  } else {
                    setSelectionMode(true);
                  }
                }}
                disabled={saving}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectionMode
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                }`}
              >
                {selectionMode
                  ? "Cancel Selection"
                  : "Select Reviews for Display"}
              </button>
            )}
          </div>

          <AnimatePresence>
            {selectionMode && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-4"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {selectedForDisplay.size}
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">
                        Selection Mode Active
                      </p>
                      <p className="text-sm text-green-700">
                        Select {MAX_DISPLAY_REVIEWS} reviews to display on the
                        user-facing page
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelSelection}
                      disabled={saving}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSelection}
                      disabled={
                        selectedForDisplay.size !== MAX_DISPLAY_REVIEWS ||
                        saving
                      }
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          Save Selection ({selectedForDisplay.size}/
                          {MAX_DISPLAY_REVIEWS})
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!selectionMode && feedbackData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Filter by Rating
            </h2>
            <StarRatingFilter
              onFilterChange={handleFilterChange}
              ratingCounts={ratingCounts}
            />
          </div>
        )}

        {feedbackData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Feedback</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {feedbackData.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaStar className="text-blue-600 text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {calculateAverageRating()}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FaStar className="text-yellow-600 text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">5-Star Reviews</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {ratingCounts[5]}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FaStar className="text-green-600 text-2xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && feedbackData.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading feedback...</p>
          </div>
        )}

        {!loading && filteredData.length === 0 && feedbackData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaStar className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Feedback Yet
            </h3>
            <p className="text-gray-500">
              No customer feedback has been submitted yet.
            </p>
          </div>
        ) : !loading && filteredData.length === 0 && feedbackData.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaStar className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Matching Reviews
            </h3>
            <p className="text-gray-500">
              No reviews with {selectedRating} star
              {selectedRating !== 1 ? "s" : ""} found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData.map((feedback, index) => {
              const feedbackId = feedback._id || `feedback-${index}`;
              const isSelected = selectedForDisplay.has(feedbackId);

              return (
                <motion.div
                  key={feedbackId}
                  layout
                  className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 relative ${
                    selectionMode
                      ? "cursor-pointer hover:border-2 hover:border-green-300"
                      : ""
                  } ${
                    isSelected
                      ? "border-2 border-green-500 ring-2 ring-green-200"
                      : "border-2 border-transparent"
                  }`}
                  onClick={() =>
                    selectionMode &&
                    feedback._id &&
                    !saving &&
                    toggleSelection(feedbackId)
                  }
                >
                  {selectionMode && (
                    <div className="absolute top-4 right-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isSelected
                            ? "bg-green-500"
                            : "bg-gray-200 border-2 border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <MdCheckCircle className="text-white text-xl" />
                        )}
                      </motion.div>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                        {feedback.user?.picture ? (
                          <img
                            src={feedback.user.picture}
                            alt={feedback.user.name || "User avatar"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BiUser className="text-2xl" />
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {feedback.user?.name || "Anonymous User"}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MdDateRange className="mr-1" />
                          {feedback.createdAt
                            ? formatDate(feedback.createdAt)
                            : "N/A"}
                        </div>
                      </div>
                    </div>

                    {!selectionMode && (
                      <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1 rounded-full">
                        <FaStar className="text-amber-400 text-sm" />
                        <span className="font-semibold text-gray-700">
                          {feedback.rating}.0
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-xl ${
                          i < feedback.rating
                            ? "text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {feedback.feedback}
                  </p>

                  {(feedback.showToUser || isSelected) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      <MdCheckCircle />
                      {isSelected
                        ? "Selected for user display"
                        : "Currently displayed to users"}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {!selectedRating && hasMore && filteredData.length > 0 && !loading && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Load More Feedback (Page {currentPage + 1} of {totalPages})
            </button>
          </div>
        )}

        {selectedRating !== null && filteredData.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Showing {filteredData.length} review
              {filteredData.length !== 1 ? "s" : ""} with {selectedRating} star
              {selectedRating !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
