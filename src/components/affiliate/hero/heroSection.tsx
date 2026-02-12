import { useState } from "react";
import { Search, X } from "lucide-react";
import "./affiliate.css";

interface AffiliateHeroSectionProps {
  onSearch: (term: string) => void;
}

const AffiliateHeroSection: React.FC<AffiliateHeroSectionProps> = ({
  onSearch,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (!newValue) {
      onSearch("");
    }
  };

  const handleSearchClick = () => {
    onSearch(inputValue);
  };

  const handleClearClick = () => {
    setInputValue("");
    onSearch("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="relative h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-red-500 overflow-hidden">
      <div className="custom-shape-divider-bottom-affiliate">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px] rotate-180"
        >
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="shape-fill-affiliate"
          />
        </svg>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start h-full text-white text-center px-4 sm:px-6 md:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wider drop-shadow-lg mt-20 sm:mt-28 md:mt-36 lg:mt-44">
          JOIN OUR AFFILIATE PROGRAM
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl opacity-90 max-w-lg sm:max-w-xl md:max-w-2xl">
          Discover exciting opportunities to partner with us — explore positions
          below
        </p>

        <div className="mt-6 sm:mt-8 md:mt-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-3xl flex items-center bg-white/20 border border-white/40 rounded-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all">
          <input
            type="text"
            placeholder="Search affiliate positions..."
            className="flex-1 bg-transparent text-white placeholder-white/80 focus:outline-none text-lg sm:text-xl md:text-2xl"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button
            className="ml-2 sm:ml-3 md:ml-4 p-2 sm:p-3 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
            onClick={handleSearchClick}
            aria-label="Search"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          {inputValue && (
            <button
              className="ml-1 sm:ml-2 p-2 sm:p-3 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
              onClick={handleClearClick}
              aria-label="Clear search"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AffiliateHeroSection;
