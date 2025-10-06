interface NavigationArrowsProps {
  paginate: (direction: number) => void;
}

const NavigationArrows = ({ paginate }: NavigationArrowsProps) => (
  <>
    <button
      onClick={() => paginate(-1)}
      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 p-4 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 border border-gray-200"
    >
      <svg
        className="w-6 h-6 text-gray-700"
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
    <button
      onClick={() => paginate(1)}
      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 p-4 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 border border-gray-200"
    >
      <svg
        className="w-6 h-6 text-gray-700"
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
