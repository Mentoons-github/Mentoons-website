import { useState, useEffect } from "react";

const ColorClashLobby = ({
  showDifficultyModal,
}: {
  showDifficultyModal: () => void;
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[url('/assets/games/colorClash/bg.jpg')] bg-cover bg-center px-4 sm:px-6 overflow-hidden">
      {/* MAIN CONTENT CONTAINER */}
      <div className="flex flex-col items-center justify-center w-full max-w-screen-2xl mx-auto py-4">
        {/* TITLE + BUTTON CONTAINER */}
        <div className="flex flex-col items-center w-full">
          {/* TITLE IMAGE */}
          <div
            className={`transform transition-all duration-1000 ease-out w-full flex justify-center ${
              showContent
                ? "translate-y-0 opacity-100"
                : "-translate-y-16 sm:-translate-y-24 md:-translate-y-32 opacity-0"
            } mb-2 sm:mb-4 md:mb-6`}
          >
            <div className="w-[90%] xs:w-[85%] sm:w-[80%] md:w-[75%] lg:w-[70%] xl:w-[65%] 2xl:w-[60%]">
              <img
                src="/assets/games/colorClash/title.png"
                alt="Color Clash"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>

          {/* RED BALL BUTTON - Added bounce animation back with slower speed */}
          <button
            onClick={showDifficultyModal}
            className={`
              relative
              w-36 h-36 xs:w-40 xs:h-40
              sm:w-48 sm:h-48
              md:w-56 md:h-56
              lg:w-64 lg:h-64
              xl:w-72 xl:h-72
              2xl:w-80 2xl:h-80
              rounded-full
              bg-gradient-to-br from-red-500 via-red-600 to-red-800
              border-4 xs:border-5 sm:border-6 md:border-7 lg:border-8 border-red-400
              shadow-xl sm:shadow-2xl
              flex flex-col items-center justify-center
              active:scale-95 hover:scale-105 transition-transform duration-200
              group
              overflow-visible
              transform transition-all duration-700 delay-200
              -mt-1 xs:-mt-2 sm:-mt-3 md:-mt-4 lg:-mt-5 xl:-mt-6
              ${
                showContent
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-16 sm:translate-y-20 md:translate-y-24 opacity-0 scale-80"
              }
              animate-bounce-slow
            `}
          >
            <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-70"></span>
            <span className="absolute inset-2 xs:inset-3 sm:inset-4 md:inset-5 lg:inset-6 rounded-full animate-ping delay-500 bg-red-300 opacity-50"></span>

            <span
              className="absolute top-2 left-3 xs:top-3 xs:left-4 sm:top-4 sm:left-6 md:top-5 md:left-8 lg:top-6 lg:left-10 xl:top-8 xl:left-12 
              w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 2xl:w-40 2xl:h-40 
              bg-white/40 rounded-full blur-xl sm:blur-2xl"
            ></span>

            <div className="relative z-10 text-center px-2">
              <p
                className="text-white font-black tracking-wider drop-shadow-2xl
                text-2xl xs:text-2.5xl
                sm:text-3xl
                md:text-4xl
                lg:text-5xl
                xl:text-5xl
                2xl:text-6xl"
              >
                START
              </p>
              <p
                className="text-white font-black tracking-widest drop-shadow-2xl
                text-2.5xl xs:text-3xl
                sm:text-3.5xl
                md:text-4.5xl
                lg:text-5.5xl
                xl:text-6xl
                2xl:text-7xl
                -mt-0.5 xs:-mt-1 sm:-mt-1.5 md:-mt-2 lg:-mt-2.5 xl:-mt-3"
              >
                GAME
              </p>
            </div>

            <span className="hidden lg:block absolute bottom-4 right-6 w-12 h-12 bg-white/20 rounded-full blur-lg"></span>
          </button>
        </div>

        {/* HINT TEXT */}
        <p
          className={`text-white/80 animate-pulse text-center px-4
            mt-4 xs:mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-14
            text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl
            ${showContent ? "opacity-100" : "opacity-0"} delay-800`}
        >
          Tap the ball to play!
        </p>

        {/* Optional decorative elements */}
        <div className="hidden lg:flex items-center justify-center space-x-8 mt-8 xl:mt-12 2xl:mt-16 opacity-60">
          <div className="w-16 h-1 bg-red-400 rounded-full"></div>
          <span className="text-red-200 text-sm xl:text-base">⚡</span>
          <div className="w-16 h-1 bg-red-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ColorClashLobby;
