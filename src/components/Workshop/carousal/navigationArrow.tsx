interface NavigationArrowsProps {
  paginate: (direction: number) => void;
}

const NavigationArrows = ({ paginate }: NavigationArrowsProps) => (
  <>
    {/* Left Arrow */}
    <button
      onClick={() => paginate(-1)}
      className="
      
        -ml-4 md:-mr-0 absolute left-2  
        top-1/2 -translate-y-1/2 
        sm:-translate-x-6
        z-20 
        p-2 sm:p-4 
        bg-white 
        rounded-full 
        shadow-lg 
        hover:scale-110 
        transition
        border border-gray-200
      "
    >
      <svg
        className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    {/* Right Arrow */}
    <button
      onClick={() => paginate(1)}
      className="
        -mr-4 md:-mr-0 absolute right-2 
        top-1/2 -translate-y-1/2 
        sm:translate-x-6
        z-20 
        p-2 sm:p-4 
        bg-white 
        rounded-full 
        shadow-lg 
        hover:scale-110 
        transition
        border border-gray-200
      "
    >
      <svg
        className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  </>
);

export default NavigationArrows;
