import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

type SearchBarProps = {
  placeholders: string[];
  className?: string;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBar: React.FC<SearchBarProps> = ({
  placeholders,
  className,
  input,
  setInput,
}) => {
  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState<boolean>(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % placeholders.length;
        setPlaceholder(placeholders[newIndex]);
        return newIndex;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [placeholders]);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <div className="flex justify-center w-full">
      <div className={cn(`${className} relative w-full`)}>
        <input type="text" className="hidden" value={index} />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder={placeholder}
          className={` w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            animate ? "scroll-placeholder" : ""
          }`}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-1">
          <FaSearch className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
