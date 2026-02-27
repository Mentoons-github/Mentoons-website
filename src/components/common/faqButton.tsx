const FaqButton = ({ setShowFAQ }: { setShowFAQ: (val: boolean) => void }) => {
  return (
    <div className="flex justify-end sticky top-20 z-20 -mb-4 mr-5">
      <button
        onClick={() => setShowFAQ(true)}
        className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 hover:from-orange-600 hover:via-orange-500 hover:to-orange-700 border-2 border-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group overflow-hidden"
        aria-label="Open Frequently Asked Questions"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-spin" />
        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-0 group-hover:opacity-75" />
        <svg
          className="absolute inset-0 w-full h-full p-1 -rotate-90 group-hover:rotate-0 transition-transform duration-700 ease-out"
          viewBox="0 0 100 100"
        >
          <defs>
            <path
              id="circlePath"
              d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              fill="none"
            />
          </defs>
          <text
            className="text-[16px] md:text-[20px] fill-white font-bold tracking-[0.2em] uppercase"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
              • FAQ • FAQ •
            </textPath>
          </text>
        </svg>

        <span className="relative text-3xl md:text-4xl text-white font-bold z-10 group-hover:scale-125 transition-transform duration-300">
          ?
        </span>
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
          View FAQ
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900" />
        </span>
      </button>
    </div>
  );
};

export default FaqButton;
