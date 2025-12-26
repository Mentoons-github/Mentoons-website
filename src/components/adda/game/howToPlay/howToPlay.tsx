import { Joystick, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ICONS_MAP } from "@/utils/game/iconFinder";
import { useState, useEffect } from "react";
import { Instructions } from "@/constant/adda/game/instructions";

interface HowToPlayProps {
  instructions: Instructions[];
  isModalOpen: boolean;
  setClose: () => void;
}

const HowToPlay = ({ instructions, isModalOpen, setClose }: HowToPlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loadedMedia, setLoadedMedia] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsFullscreen(false);
  }, [currentStep]);

  if (!isModalOpen || instructions.length === 0) return null;

  const currentInstruction = instructions[currentStep];
  const IconComponent = ICONS_MAP[currentInstruction.icon] || Joystick;
  const hasMedia = currentInstruction.type && currentInstruction.media;
  const currentMediaUrl = currentInstruction.media || "";
  const isCurrentMediaLoaded = loadedMedia.has(currentMediaUrl);

  const handleMediaLoad = () => {
    if (currentMediaUrl) {
      setLoadedMedia((prev) => new Set(prev).add(currentMediaUrl));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => {
      if (prev === 0) {
        return instructions.length - 1;
      }
      return prev - 1;
    });
  };

  const handleNext = () => {
    setCurrentStep((prev) => {
      if (prev === instructions.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[9999] p-3 sm:p-4 md:p-6 backdrop-blur-sm">
      <div className="w-full max-w-[92vw] sm:max-w-3xl lg:max-w-5xl h-[90vh] sm:h-[88vh] border-2 border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 shadow-2xl relative flex flex-col">
        <button
          onClick={setClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-full p-1.5"
          aria-label="Close"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex flex-col items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3 flex-shrink-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center tracking-wider drop-shadow-lg">
            HOW TO PLAY
          </h1>
          <p className="text-white/70 text-xs sm:text-sm font-medium">
            Step {currentStep + 1} of {instructions.length}
          </p>
        </div>

        {isFullscreen && hasMedia && (
          <div
            className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-full p-2"
              aria-label="Exit fullscreen"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center">
              {currentInstruction.type === "image" ? (
                <img
                  src={currentInstruction.media}
                  alt={`Step ${currentStep + 1} - Fullscreen`}
                  className="max-w-full max-h-[95vh] object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : currentInstruction.type === "video" ? (
                <video
                  key={`fullscreen-${currentInstruction.media}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="max-w-full max-h-[95vh] object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <source src={currentInstruction.media} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : null}
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-xs sm:text-sm bg-black/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
              Click anywhere to close
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-between min-h-0 overflow-hidden py-2">
          {hasMedia ? (
            <>
              <div
                className="relative flex items-center justify-center w-full px-2"
                style={{ maxHeight: "calc(100% - 100px)" }}
              >
                <div className="relative max-w-full max-h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/20 blur-2xl rounded-2xl scale-105 animate-pulse" />

                  {currentInstruction.type === "image" ? (
                    <div
                      className="relative cursor-pointer group"
                      onClick={() => setIsFullscreen(true)}
                    >
                      {!isCurrentMediaLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/10 rounded-xl backdrop-blur-sm min-h-[150px] min-w-[200px]">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                      <img
                        src={currentInstruction.media}
                        alt={`Step ${currentStep + 1}`}
                        className={`relative max-w-full max-h-full object-contain rounded-xl shadow-2xl border-2 border-white/40 transition-all duration-500 group-hover:scale-[1.01] ${
                          isCurrentMediaLoaded
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95"
                        }`}
                        style={{
                          maxHeight: "calc(90vh - 250px)",
                          maxWidth: "100%",
                          filter:
                            "drop-shadow(0 10px 40px rgba(0,0,0,0.4)) brightness(1.05)",
                        }}
                        onLoad={handleMediaLoad}
                      />
                      <div className="absolute top-2 right-2 bg-emerald-500/90 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-sm border border-white/30 shadow-lg">
                        IMAGE
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-xl">
                        <div className="bg-white/90 text-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                          </svg>
                          <span className="hidden sm:inline">
                            Click to expand
                          </span>
                          <span className="sm:hidden">Expand</span>
                        </div>
                      </div>
                    </div>
                  ) : currentInstruction.type === "video" ? (
                    <div
                      className="relative cursor-pointer group"
                      onClick={() => setIsFullscreen(true)}
                    >
                      <video
                        key={currentInstruction.media}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="relative max-w-full max-h-full object-contain rounded-xl shadow-2xl border-2 border-white/40 transition-all duration-300 group-hover:scale-[1.01]"
                        style={{
                          maxHeight: "calc(90vh - 250px)",
                          maxWidth: "100%",
                          filter:
                            "drop-shadow(0 10px 40px rgba(0,0,0,0.4)) brightness(1.05)",
                        }}
                        onLoadedData={handleMediaLoad}
                      >
                        <source
                          src={currentInstruction.media}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                      <div className="absolute top-2 right-2 bg-red-500/90 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-sm border border-white/30 shadow-lg flex items-center gap-1">
                        <svg
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        VIDEO
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-xl">
                        <div className="bg-white/90 text-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                          </svg>
                          <span className="hidden sm:inline">
                            Click to expand
                          </span>
                          <span className="sm:hidden">Expand</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 sm:gap-2.5 w-full flex-shrink-0 px-3 min-h-[90px] justify-center bg-gradient-to-t from-black/10 to-transparent pt-2 rounded-b-xl">
                <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm border-2 border-white/40 shadow-lg">
                  <IconComponent
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white drop-shadow-lg"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-center text-white text-xs sm:text-sm md:text-base lg:text-lg leading-snug font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-3xl">
                  {currentInstruction.text}
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full gap-4 sm:gap-6">
              <div className="flex items-center justify-center flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm border-2 border-white/40 shadow-lg">
                  <IconComponent
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white drop-shadow-lg"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center w-full px-4">
                <p className="text-center text-white text-base sm:text-lg md:text-xl leading-relaxed font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-lg">
                  {currentInstruction.text}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:gap-3 mt-2 sm:mt-3 flex-shrink-0">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {instructions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/70 ${
                  index === currentStep
                    ? "bg-white w-5 sm:w-6 md:w-8"
                    : "bg-white/40 w-1.5 sm:w-2"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg transition-all duration-200 border border-white/30 hover:border-white/50 flex-shrink-0 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span>Prev</span>
            </button>

            <button
              onClick={setClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2.5 bg-white text-teal-600 text-xs sm:text-sm md:text-base font-bold rounded-lg transition-all duration-200 hover:bg-white/90 hover:scale-105 active:scale-95 shadow-lg"
            >
              Got it!
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg transition-all duration-200 border border-white/30 hover:border-white/50 flex-shrink-0 hover:scale-105 active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;
