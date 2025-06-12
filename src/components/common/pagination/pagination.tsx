import React from "react";
import { motion } from "framer-motion";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showPageSizeSelector = true,
  pageSizeOptions = [5, 10, 20, 50],
  onPageSizeChange,
  className = "",
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const pageNumberVariants = {
    inactive: {
      backgroundColor: "#ffffff",
      color: "#6b7280",
      scale: 1,
    },
    active: {
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      scale: 1.1,
    },
    hover: {
      backgroundColor: "#e5e7eb",
      scale: 1.05,
    },
  };

  if (totalPages <= 1) return null;

  return (
    <motion.div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          variants={buttonVariants}
          whileHover={currentPage !== 1 ? "hover" : undefined}
          whileTap={currentPage !== 1 ? "tap" : undefined}
          title="First page"
        >
          <MdKeyboardDoubleArrowLeft className="w-5 h-5" />
        </motion.button>

        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          variants={buttonVariants}
          whileHover={currentPage !== 1 ? "hover" : undefined}
          whileTap={currentPage !== 1 ? "tap" : undefined}
          title="Previous page"
        >
          <MdKeyboardArrowLeft className="w-5 h-5" />
        </motion.button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <motion.button
                  onClick={() => onPageChange(page as number)}
                  className="px-3 py-2 min-w-[40px] text-sm font-medium rounded-lg border border-gray-300 transition-all"
                  variants={pageNumberVariants}
                  initial="inactive"
                  animate={currentPage === page ? "active" : "inactive"}
                  whileHover={currentPage !== page ? "hover" : undefined}
                  whileTap="tap"
                >
                  {page}
                </motion.button>
              )}
            </div>
          ))}
        </div>

        <motion.button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          variants={buttonVariants}
          whileHover={currentPage !== totalPages ? "hover" : undefined}
          whileTap={currentPage !== totalPages ? "tap" : undefined}
          title="Next page"
        >
          <MdKeyboardArrowRight className="w-5 h-5" />
        </motion.button>

        <motion.button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          variants={buttonVariants}
          whileHover={currentPage !== totalPages ? "hover" : undefined}
          whileTap={currentPage !== totalPages ? "tap" : undefined}
          title="Last page"
        >
          <MdKeyboardDoubleArrowRight className="w-5 h-5" />
        </motion.button>
      </div>

      {showPageSizeSelector && onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">per page</span>
        </div>
      )}
    </motion.div>
  );
};

export default Pagination;
