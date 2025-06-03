import { Clock, TrendingUp } from "lucide-react";

interface SearchHeaderProps {
  searchQuery: string;
  totalResults: number;
}

const SearchHeader = ({ searchQuery, totalResults }: SearchHeaderProps) => {
  return (
    <div className="bg-blue-600 shadow-xl border-b-4 border-orange-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
              Search Results for "
              <span className="text-orange-300">{searchQuery}</span>"
            </h1>
            <div className="flex items-center space-x-4 text-blue-100">
              <span className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="font-bold">Found {totalResults} results</span>
              </span>
              <span className="text-blue-200">•</span>
              <span className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="font-semibold">Updated just now</span>
              </span>
            </div>
          </div>
          {/* <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3 bg-white border-2 border-orange-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-400 font-semibold text-black shadow-lg"
            >
              <option value="relevance">Most Relevant</option>
              <option value="popular">Most Popular</option>
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
            </select>
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 font-bold shadow-xl">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
