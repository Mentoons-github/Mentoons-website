import { Clock, TrendingUp } from "lucide-react";

// Fonts come from index.css:
// .font-comic -> Bangers, .font-comic-chip -> Luckiest Guy, .font-number -> Cabin

interface SearchHeaderProps {
  searchQuery: string;
  totalResults: number;
}

const SearchHeader = ({ searchQuery, totalResults }: SearchHeaderProps) => {
  return (
    <div className="bg-blue-500 border-b-4 border-black shadow-[0_6px_0_0_#EC9600] sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-comic tracking-wider text-3xl sm:text-4xl md:text-5xl text-white mb-4 [text-shadow:3px_3px_0_#000] [-webkit-text-stroke:1px_#000]">
              Search Results for "
              <span className="text-yellow-300">{searchQuery}</span>"
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="font-comic-chip tracking-wider flex items-center space-x-2 bg-yellow-300 text-black px-3 py-1 rounded-lg border-[3px] border-black shadow-[3px_3px_0_0_#000] -rotate-1">
                <TrendingUp className="w-5 h-5 text-black" />
                <span>
                  Found{" "}
                  <span className="font-number font-bold">{totalResults}</span>{" "}
                  results
                </span>
              </span>
              <span className="font-comic-chip tracking-wider flex items-center space-x-2 bg-white text-black px-3 py-1 rounded-lg border-[3px] border-black shadow-[3px_3px_0_0_#000] rotate-1">
                <Clock className="w-4 h-4 text-black" />
                <span>Updated just now</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
