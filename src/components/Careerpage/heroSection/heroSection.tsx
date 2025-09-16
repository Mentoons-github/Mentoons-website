import { useState } from "react";
import { Search, X } from "lucide-react";
import "./heroSection.css";

interface HeroSectionProps {
  onSearch: (term: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
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
    <div className="relative h-screen bg-orange-500 overflow-hidden">
      <div className="custom-shape-divider-bottom-1756712573">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-start h-full text-white text-center px-4">
        <h1 className="text-6xl font-extrabold tracking-wider drop-shadow-lg mt-44">
          MENTOONS IS HIRING
        </h1>
        <p className="mt-4 text-lg opacity-90">
          Find your dream job with us — start your search below
        </p>

        <div className="mt-10 w-full max-w-3xl flex items-center bg-white/20 border border-white/40 rounded-full px-8 py-5 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all">
          <input
            type="text"
            placeholder="Search job here..."
            className="flex-1 bg-transparent text-white placeholder-white focus:outline-none text-2xl"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button
            className="ml-4 p-3 rounded-full bg-white/30 hover:bg-white/40 transition-colors"
            onClick={handleSearchClick}
          >
            <Search className="w-6 h-6 text-white" />
          </button>
          {inputValue && (
            <button
              className="ml-2 p-3 rounded-full bg-white/30 hover:bg-white/40 transition-colors"
              onClick={handleClearClick}
            >
              <X className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
