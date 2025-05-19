import { useState } from "react";

const ViewAllFriends = ({ onNavigate }: { onNavigate: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full flex justify-center mt-2">
      <button
        onClick={onNavigate}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative py-2 px-4 rounded-lg font-medium
          transition-all duration-300 ease-in-out
          border border-orange-300
          ${
            isHovered
              ? "bg-orange-100 text-orange-700"
              : "bg-white text-orange-500"
          }
          hover:shadow-md
          flex items-center justify-center gap-2
          w-full md:w-auto
        `}
      >
        <div
          className={`
          flex items-center justify-center
          transition-transform duration-300
          ${isHovered ? "translate-x-1" : ""}
        `}
        >
          <span className="font-medium">Search Friends</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`ml-1 transition-transform duration-300 ${
              isHovered ? "translate-x-1" : ""
            }`}
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default ViewAllFriends;
