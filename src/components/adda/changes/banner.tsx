import { useEffect, useState } from "react";

const ChangesBanner = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Mentoons Simplifying";

  useEffect(() => {
    let currentIndex = 0;
    let typingInterval: ReturnType<typeof setInterval>;

    const startTyping = () => {
      typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            currentIndex = 0;
            setDisplayText("");
            startTyping();
          }, 3000);
        }
      }, 100);
    };

    startTyping();

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="relative h-[80vh] min-h-[500px] flex items-center justify-center bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 overflow-hidden px-4">
      <div className="absolute top-6 left-4 sm:top-10 sm:left-8 md:left-1/4 lg:left-1/4 animate-float w-1/3 sm:w-1/4 md:w-1/5 lg:w-auto max-w-[200px] md:max-w-[250px] lg:max-w-none">
        <img
          src="/assets/home/banner/Online zoom meeting of several people.png"
          alt="meeting"
          className="w-full h-auto drop-shadow-2xl"
        />
      </div>

      <div className="absolute top-6 right-4 sm:top-10 sm:right-8 md:right-1/4 lg:right-1/4 animate-float-delayed w-1/4 sm:w-1/5 md:w-[15%] lg:w-[10%] max-w-[140px] md:max-w-[180px] lg:max-w-[200px]">
        <img
          src="/assets/adda/simplifying/psychologists.png"
          alt="psychologists"
          className="w-full h-auto drop-shadow-2xl"
        />
      </div>

      <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-6 md:bottom-10 md:right-10 animate-float-reverse w-24 sm:w-32 md:w-40 lg:w-48">
        <img
          src="/assets/home/banner/fillers/SVG.png"
          alt="decoration"
          className="w-full h-auto drop-shadow-2xl"
        />
      </div>

      {/* Center text */}
      <div className="z-10 text-center px-4">
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white drop-shadow-lg flex items-center justify-center gap-1 flex-wrap">
          <h1 className="tracking-tight break-words">{displayText}</h1>
          <span className="animate-pulse text-white">|</span>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        @keyframes float-reverse {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(25px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 3.5s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4.5s ease-in-out infinite 0.5s;
        }
      `}</style>
    </div>
  );
};

export default ChangesBanner;
