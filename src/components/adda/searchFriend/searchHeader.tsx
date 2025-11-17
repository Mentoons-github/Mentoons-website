import { Clock, TrendingUp } from "lucide-react";

interface SearchHeaderProps {
  searchQuery: string;
  totalResults: number;
}

const SearchHeader = ({ searchQuery, totalResults }: SearchHeaderProps) => {
  return (
    <div className="bg-blue-600 shadow-xl border-b-4 border-orange-500 sticky top-0 z-10">
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
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
