import { CSSProperties } from "react";

const INK = "#1f1308";

// ---- inline comic styles ----
const arrowStyle: CSSProperties = {
  background: "#fff",
  border: `3px solid ${INK}`,
  boxShadow: `3px 3px 0 ${INK}`,
};

interface NavigationArrowsProps {
  paginate: (direction: number) => void;
}

const NavigationArrows = ({ paginate }: NavigationArrowsProps) => (
  <>
    {/* Left Arrow */}
    <button
      onClick={() => paginate(-1)}
      aria-label="Previous workshop"
      style={arrowStyle}
      className="
        -ml-4 md:-mr-0 absolute left-2
        top-1/2 -translate-y-1/2
        sm:-translate-x-6
        z-20
        p-2 sm:p-4
        rounded-full
        hover:scale-110 hover:bg-yellow-200
        transition
      "
    >
      <svg
        className="w-4 h-4 sm:w-6 sm:h-6"
        fill="none"
        stroke={INK}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    {/* Right Arrow */}
    <button
      onClick={() => paginate(1)}
      aria-label="Next workshop"
      style={arrowStyle}
      className="
        -mr-4 md:-mr-0 absolute right-2
        top-1/2 -translate-y-1/2
        sm:translate-x-6
        z-20
        p-2 sm:p-4
        rounded-full
        hover:scale-110 hover:bg-yellow-200
        transition
      "
    >
      <svg
        className="w-4 h-4 sm:w-6 sm:h-6"
        fill="none"
        stroke={INK}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  </>
);

export default NavigationArrows;
