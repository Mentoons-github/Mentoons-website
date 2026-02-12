import { FaStar } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MdClose } from "react-icons/md";

interface StarRatingFilterProps {
  onFilterChange?: (rating: number | null) => void;
  showClearAll?: boolean;
  ratingCounts?: { [key: number]: number };
}

const StarRatingFilter: React.FC<StarRatingFilterProps> = ({
  onFilterChange,
  showClearAll = true,
  ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleRatingClick = (rating: number) => {
    const newRating = selectedRating === rating ? null : rating;
    setSelectedRating(newRating);
    onFilterChange?.(newRating);
  };

  const handleClearFilter = () => {
    setSelectedRating(null);
    onFilterChange?.(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
        {[5, 4, 3, 2, 1].map((rating) => {
          const isSelected = selectedRating === rating;
          const count = ratingCounts[rating as keyof typeof ratingCounts] || 0;

          return (
            <motion.button
              key={rating}
              onClick={() => handleRatingClick(rating)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={count === 0}
              className={`
                relative group px-4 py-2.5 rounded-xl 
                flex items-center justify-center gap-2
                transition-all duration-300 ease-out
                ${
                  isSelected
                    ? "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg shadow-amber-200"
                    : count === 0
                      ? "bg-gray-100 opacity-50 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 shadow-md hover:shadow-lg"
                }
                border-2 ${isSelected ? "border-amber-500" : count === 0 ? "border-gray-200" : "border-gray-200 hover:border-amber-300"}
              `}
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-base transition-colors ${
                      i < rating
                        ? isSelected
                          ? "text-white"
                          : count === 0
                            ? "text-gray-300"
                            : "text-amber-400"
                        : isSelected
                          ? "text-amber-200"
                          : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Count Badge */}
              <span
                className={`
                  text-xs font-semibold px-2 py-0.5 rounded-full
                  ${
                    isSelected
                      ? "bg-white text-amber-600"
                      : count === 0
                        ? "bg-gray-200 text-gray-500"
                        : "bg-gray-100 text-gray-600 group-hover:bg-amber-50 group-hover:text-amber-600"
                  }
                  transition-colors
                `}
              >
                {count}
              </span>

              {/* Tooltip */}
              {count > 0 && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className={`
                      absolute -top-10 left-1/2 -translate-x-1/2
                      bg-gray-900 text-white px-3 py-1.5 rounded-lg
                      text-xs font-medium whitespace-nowrap
                      opacity-0 group-hover:opacity-100
                      pointer-events-none
                      transition-opacity duration-200
                      shadow-lg
                      z-10
                    `}
                  >
                    {isSelected
                      ? "Remove filter"
                      : `Filter by ${rating} star${rating !== 1 ? "s" : ""}`}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Selected Indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}

        {/* Clear Filter Button */}
        <AnimatePresence>
          {selectedRating !== null && showClearAll && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -10 }}
              onClick={handleClearFilter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                px-4 py-2.5 rounded-xl
                bg-red-50 hover:bg-red-100
                border-2 border-red-200 hover:border-red-300
                text-red-600 hover:text-red-700
                font-medium text-sm
                flex items-center gap-2
                transition-all duration-200
                shadow-md hover:shadow-lg
              "
            >
              <MdClose className="text-lg" />
              Clear Filter
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filter Indicator */}
      <AnimatePresence>
        {selectedRating !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
              <FaStar className="text-amber-500" />
              <span>
                Showing{" "}
                <strong className="text-amber-700">
                  {ratingCounts[selectedRating as keyof typeof ratingCounts]}
                </strong>{" "}
                review
                {ratingCounts[selectedRating as keyof typeof ratingCounts] !== 1
                  ? "s"
                  : ""}{" "}
                with {selectedRating} star{selectedRating !== 1 ? "s" : ""}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StarRatingFilter;
