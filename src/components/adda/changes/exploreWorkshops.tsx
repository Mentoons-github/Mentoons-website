import { WorkshopFormValues } from "@/utils/formik/admin/addWorkshopForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllWorkshops } from "@/api/workshop/workshops";
import { useAsyncEffect } from "@/hooks";

const INK = "#1a1a1a";

const UNWANTED_IMAGE = [
  "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1759234938507-b72e75aa-f04d-495a-bdb8-23ee0223d299.png",
  "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1759234940170-86763a83-9253-4a79-8e39-9d1260ad5fd5.png",
  "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1759235982570-cdc97188-a8d5-498c-bd65-9faf59c02781.png",
];

/* Shared comic button style for the carousel controls */
const comicBtn =
  "flex items-center justify-center w-11 h-11 rounded-full bg-[#FFD60A] text-[#1a1a1a] border-[3px] border-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a] transition-all duration-100 hover:bg-white hover:-translate-x-px hover:-translate-y-px active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]";

const ExploreWorkshops = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useAsyncEffect(
    async () => {
      const response = await getAllWorkshops();

      const workshops = response.data.data.flatMap(
        (workshop: WorkshopFormValues) => {
          const allImages = workshop.workshops.flatMap((w) =>
            w.ageGroups.map((g) => g.image),
          );
          const uniqueImages = [...new Set(allImages)];

          return uniqueImages.filter(
            (img) => !UNWANTED_IMAGE.includes(img as string),
          );
        },
      );

      setWorkshops(workshops);
    },
    [],
    { errorMessage: "Error fetching workshops" },
  );

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || workshops.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % workshops.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, workshops.length]);

  const total = workshops.length;
  const leftIndex = (currentIndex - 1 + total) % total;
  const rightIndex = (currentIndex + 1) % total;

  const handleNavigate = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <div
      className="px-4 py-20"
      style={{
        backgroundColor: "#FFF6D6",
        backgroundImage: `radial-gradient(${INK}22 1.6px, transparent 1.8px)`,
        backgroundSize: "18px 18px",
      }}
    >
      <div className="text-center mb-14">
        <h2
          className="font-comic mb-5"
          style={{
            fontSize: "clamp(2.8rem, 8vw, 5rem)",
            lineHeight: 1.05,
            color: "#FF6A00",
            letterSpacing: "0.04em",
            WebkitTextStroke: `3px ${INK}`,
            paintOrder: "stroke fill",
            textShadow: `5px 5px 0 ${INK}`,
            transform: "rotate(-1.5deg)",
            display: "inline-block",
          }}
        >
          Explore Our Workshops
        </h2>

        <div
          className="max-w-2xl mx-auto bg-white font-bold text-base md:text-lg text-[#1a1a1a] px-5 py-3"
          style={{
            border: `3px solid ${INK}`,
            boxShadow: `5px 5px 0 ${INK}`,
            transform: "rotate(0.6deg)",
          }}
        >
          Discover engaging workshops designed to inspire creativity and
          learning
        </div>

        {total > 0 && (
          <div
            className="font-comic-chip inline-block mt-6 px-5 py-1 bg-[#2D9CFF] text-white text-xl"
            style={{
              border: `3px solid ${INK}`,
              borderRadius: 999,
              boxShadow: `4px 4px 0 ${INK}`,
              textShadow: `2px 2px 0 ${INK}`,
              letterSpacing: "0.06em",
            }}
            aria-live="polite"
          >
            {currentIndex + 1} / {total}
          </div>
        )}
      </div>

      {total === 0 ? (
        <div
          className="font-comic flex items-center justify-center text-center animate-pulse"
          style={{
            fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
            color: "#fff",
            letterSpacing: "0.05em",
            WebkitTextStroke: `3px ${INK}`,
            paintOrder: "stroke fill",
            textShadow: `5px 5px 0 ${INK}`,
          }}
        >
          Loading Workshops...
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4">
          {/* Left preview */}
          <div
            className="w-1/3 cursor-pointer transition-all duration-200 hover:scale-105 hover:-rotate-2"
            onClick={() => handleNavigate(leftIndex)}
          >
            <img
              src={workshops[leftIndex]}
              alt={`Workshop ${leftIndex + 1}`}
              className="w-full h-full object-contain opacity-60 bg-white"
              style={{
                border: `3px solid ${INK}`,
                borderRadius: 12,
                boxShadow: `5px 5px 0 ${INK}`,
              }}
            />
          </div>

          {/* Main panel */}
          <div
            onClick={() => navigate("/mentoons-workshops")}
            className="group relative cursor-pointer w-1/2 -mx-10 z-10 overflow-hidden bg-white transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
            style={{
              border: `5px solid ${INK}`,
              borderRadius: 16,
              boxShadow: `10px 10px 0 ${INK}`,
            }}
          >
            <img
              src={workshops[currentIndex]}
              alt={`Workshop ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />

            {/* Tap-to-open tag */}
            <span
              className="font-comic-chip absolute top-3 left-3 px-3 py-0.5 bg-[#FF3B3B] text-white text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
              style={{
                border: `3px solid ${INK}`,
                borderRadius: 8,
                boxShadow: `3px 3px 0 ${INK}`,
                textShadow: `2px 2px 0 ${INK}`,
                transform: "rotate(-4deg)",
                letterSpacing: "0.06em",
              }}
            >
              OPEN!
            </span>

            {/* Controls */}
            <div
              className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150"
              style={{
                background: `linear-gradient(to top, ${INK}cc, transparent)`,
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(leftIndex);
                  }}
                  className={comicBtn}
                  aria-label="Previous workshop"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAutoPlaying(!isAutoPlaying);
                  }}
                  className={comicBtn}
                  aria-label={isAutoPlaying ? "Pause" : "Play"}
                >
                  {isAutoPlaying ? (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(rightIndex);
                  }}
                  className={comicBtn}
                  aria-label="Next workshop"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
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
              </div>
            </div>
          </div>

          {/* Right preview */}
          <div
            className="w-1/3 cursor-pointer transition-all duration-200 hover:scale-105 hover:rotate-2"
            onClick={() => handleNavigate(rightIndex)}
          >
            <img
              src={workshops[rightIndex]}
              alt={`Workshop ${rightIndex + 1}`}
              className="w-full h-full object-contain opacity-60 bg-white"
              style={{
                border: `3px solid ${INK}`,
                borderRadius: 12,
                boxShadow: `5px 5px 0 ${INK}`,
              }}
            />
          </div>
        </div>
      )}

      {/* Dots */}
      {total > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-12">
          {workshops.map((_, index) => (
            <button
              key={index}
              onClick={() => handleNavigate(index)}
              className={`h-4 transition-all duration-200 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a] ${
                index === currentIndex
                  ? "w-10 bg-[#FF6A00]"
                  : "w-4 bg-white hover:bg-[#FFD60A]"
              }`}
              style={{
                border: `3px solid ${INK}`,
                borderRadius: 999,
                boxShadow: index === currentIndex ? `3px 3px 0 ${INK}` : "none",
              }}
              aria-label={`Go to workshop ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreWorkshops;
