import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onClear: () => void;
  hasNoResult: boolean;
}

const CelebrationSearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onClear,
  hasNoResult,
}) => (
  <div className="mb-6 sm:mb-8 max-w-xl mx-auto">
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-12 sm:pl-14 pr-10 sm:pr-12 py-4 sm:py-5 text-base sm:text-lg rounded-2xl border-2 sm:border-3 border-blue-200 focus:border-blue-500 focus:outline-none shadow-xl bg-white/90 backdrop-blur-sm transition-all focus:shadow-2xl"
      />
      {searchQuery && (
        <button
          onClick={onClear}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg sm:text-xl font-bold transition-colors"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
    {hasNoResult && (
      <p className="mt-3 text-center text-sm sm:text-base font-semibold text-gray-600">
        No birthday found
      </p>
    )}
  </div>
);

export default CelebrationSearchBar;
