import { useEffect, useState } from "react";

const INK = "#1a1a1a";

const ChangesBanner = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Mentoons Simplifying";

  useEffect(() => {
    let currentIndex = 0;
    let typingInterval: ReturnType<typeof setInterval>;
    let restartTimeout: ReturnType<typeof setTimeout>;

    const startTyping = () => {
      typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          restartTimeout = setTimeout(() => {
            currentIndex = 0;
            setDisplayText("");
            startTyping();
          }, 3000);
        }
      }, 100);
    };

    startTyping();

    return () => {
      clearInterval(typingInterval);
      clearTimeout(restartTimeout);
    };
  }, []);

  return (
    <div
      className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden px-4"
      style={{
        borderBottom: `6px solid ${INK}`,
        backgroundColor: "#FFB020",
        // comic "speed lines" radiating from the centre
        backgroundImage:
          "repeating-conic-gradient(from 0deg at 50% 50%, #FFC94D 0deg 6deg, #FFB020 6deg 12deg)",
      }}
    >
      {/* halftone overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${INK}30 1.5px, transparent 1.8px)`,
          backgroundSize: "10px 10px",
          maskImage:
            "radial-gradient(circle at 50% 50%, transparent 25%, #000 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, transparent 25%, #000 100%)",
        }}
      />

      <div className="absolute top-6 left-4 sm:top-10 sm:left-8 md:left-1/4 lg:left-1/4 animate-float w-1/3 sm:w-1/4 md:w-1/5 lg:w-auto max-w-[200px] md:max-w-[250px] lg:max-w-none">
        <img
          src="/assets/home/banner/Online zoom meeting of several people.png"
          alt="meeting"
          className="w-full h-auto"
          style={{ filter: `drop-shadow(5px 5px 0 ${INK})` }}
        />
      </div>

      <div className="absolute top-6 right-4 sm:top-10 sm:right-8 md:right-1/4 lg:right-1/4 animate-float-delayed w-1/4 sm:w-1/5 md:w-[15%] lg:w-[10%] max-w-[140px] md:max-w-[180px] lg:max-w-[200px]">
        <img
          src="/assets/adda/simplifying/psychologists.png"
          alt="psychologists"
          className="w-full h-auto"
          style={{ filter: `drop-shadow(5px 5px 0 ${INK})` }}
        />
      </div>

      <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-6 md:bottom-10 md:right-10 animate-float-reverse w-24 sm:w-32 md:w-40 lg:w-48">
        <img
          src="/assets/home/banner/fillers/SVG.png"
          alt="decoration"
          className="w-full h-auto"
          style={{ filter: `drop-shadow(5px 5px 0 ${INK})` }}
        />
      </div>

      {/* Center title */}
      <div className="z-10 text-center px-4">
        <div className="flex items-center justify-center gap-1 flex-wrap">
          <h1
            className="font-comic break-words"
            style={{
              fontSize: "clamp(3rem, 10vw, 7rem)",
              lineHeight: 1.05,
              color: "#fff",
              letterSpacing: "0.04em",
              WebkitTextStroke: `4px ${INK}`,
              paintOrder: "stroke fill",
              textShadow: `7px 7px 0 ${INK}`,
              transform: "rotate(-2deg)",
              minHeight: "1.1em",
            }}
          >
            {displayText}
          </h1>
          <span
            aria-hidden
            className="animate-pulse font-comic"
            style={{
              fontSize: "clamp(3rem, 10vw, 7rem)",
              lineHeight: 1,
              color: INK,
            }}
          >
            |
          </span>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%      { transform: translateY(-25px) rotate(2deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50%      { transform: translateY(25px) rotate(-2deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50%      { transform: translateY(-20px) rotate(-2deg); }
        }
        .animate-float         { animation: float 4s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 3.5s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 4.5s ease-in-out infinite 0.5s; }

        @media (prefers-reduced-motion: reduce) {
          .animate-float, .animate-float-reverse, .animate-float-delayed { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default ChangesBanner;
