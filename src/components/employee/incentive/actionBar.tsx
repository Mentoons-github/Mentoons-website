import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ChevronDown } from "lucide-react";
import { FaFilter } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useState } from "react";

interface ActionBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
}

const sortOptions = [
  { label: "Amount: Low → High", value: "amount_asc" },
  { label: "Amount: High → Low", value: "amount_desc" },
  { label: "Newest First", value: "date_desc" },
  { label: "Oldest First", value: "date_asc" },
  { label: "Status: Pending First", value: "status_pending" },
];

const ActionBar = ({
  searchTerm,
  onSearchChange,
  sortValue,
  onSortChange,
}: ActionBarProps) => {
  const [sortOpen, setSortOpen] = useState(false);

  const buttonHover = {
    boxShadow: "0px 12px 20px -10px rgba(0,0,0,0.4)",
    y: -5,
  };

  const buttonActive = {
    y: 0,
    boxShadow: "none",
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      <motion.button
        whileHover={buttonHover}
        whileTap={buttonActive}
        className="flex items-center gap-3 px-6 py-3 rounded-xl border bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-medium shadow-md"
      >
        <FaFilter className="w-5 h-5" />
        Filter
      </motion.button>

      <div className="w-full max-w-xl">
        <div className="flex items-center gap-3 rounded-2xl bg-white shadow-lg border border-gray-200 px-5 py-4 transition-all duration-200 hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by source or ID..."
            className="flex-1 bg-transparent text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="relative inline-block text-left">
        <motion.button
          whileHover={buttonHover}
          whileTap={buttonActive}
          onClick={() => setSortOpen((prev) => !prev)}
          className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-red-500 text-white text-lg font-medium shadow-md"
        >
          Sort By
          <motion.span animate={{ rotate: sortOpen ? 180 : 0 }}>
            <ChevronDown className="w-5 h-5" />
          </motion.span>
        </motion.button>

        {sortOpen && (
          <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-gray-300 bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setSortOpen(false);
                  }}
                  className={`block w-full px-5 py-3 text-left text-sm font-medium ${
                    sortValue === option.value
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionBar;
