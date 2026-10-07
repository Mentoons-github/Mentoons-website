import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import "./banner.css";
import { SLIDES as IMPORTED_SLIDES } from "@/constant/adda/Landing/slide";
import { useState } from "react";
import NewBanner from "@/pages/NewBanner";

const chipColors = ["#ef4444", "#3b82f6", "#22c55e", "#a855f7"];

const bgStars = [
  { top: "8%", left: "6%", size: 18, fill: "#fde047", duration: 1.3, delay: 0 },
  {
    top: "14%",
    left: "44%",
    size: 14,
    fill: "#ffffff",
    duration: 1.6,
    delay: 0.4,
  },
  {
    top: "6%",
    left: "70%",
    size: 20,
    fill: "#fde047",
    duration: 1.2,
    delay: 0.8,
  },
  {
    top: "22%",
    left: "90%",
    size: 14,
    fill: "#ffffff",
    duration: 1.5,
    delay: 0.2,
  },
  {
    top: "70%",
    left: "4%",
    size: 16,
    fill: "#ffffff",
    duration: 1.4,
    delay: 1,
  },
  {
    top: "80%",
    left: "38%",
    size: 18,
    fill: "#fde047",
    duration: 1.7,
    delay: 0.6,
  },
  {
    top: "64%",
    left: "92%",
    size: 16,
    fill: "#fde047",
    duration: 1.3,
    delay: 1.2,
  },
  {
    top: "40%",
    left: "50%",
    size: 12,
    fill: "#ffffff",
    duration: 1.5,
    delay: 0.3,
  },
];

const ComicStar = ({ size, fill }: { size: number; fill: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    style={{ overflow: "visible" }}
  >
    <polygon
      points="12,1 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9"
      fill={fill}
      stroke="#000"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const LandingBanner = () => {
  const OUR_CORE_SLIDE = {
    id: 99,
    img: "/assets/home/newPage/bg/banner/community banner.png",
    type: "flip",
    tag: "Our Core",
    headline: "Discover Our Core",
    highlightWord: "Core",
    sub: "Understanding the roots of digital addiction",
    badges: ["Awareness", "Recovery", "Community"],
    accent: "#ff6b35",
    bg: "from-[#0d2137] via-[#0a3d2e] to-[#0f2d1a]",
    shape: "circle",
    emoji: "🧠",
    link: "/community",
    cta: "Join Community →",
    items: [],
  };
  const MENTOONS_MYTHOS_SLIDE = {
    id: 100,
    img: "/assets/home/newPage/bg/mythos.png",
    type: "flip",
    tag: "Mentoons Mythos",
    headline: "The Inner Cosmos",
    highlightWord: "Cosmos",
    sub: "Blending psychology and spiritual guidance to help you understand yourself and your path",
    badges: ["Psychology", "Spirituality", "Self-Discovery"],
    accent: "#6c5ce7",
    bg: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
    shape: "circle",
    emoji: "🌌",
    link: "https://mentoonsmythos.com/",
    cta: "Explore Your Path →",
    items: [],
  };

  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next");
  const [displaySlide, setDisplaySlide] = useState(0);

  const genericSlides = [
    ...IMPORTED_SLIDES,
    OUR_CORE_SLIDE,
    MENTOONS_MYTHOS_SLIDE,
  ];

  const totalCount = genericSlides.length + 1;
  const isFirstSlide = displaySlide === 0;
  const slide = !isFirstSlide ? genericSlides[displaySlide - 1] : null;

  const goToSlide = (index: number) => {
    if (animating || index === displaySlide) return;
    setDirection(index > displaySlide ? "next" : "prev");
    setAnimating(true);
    setTimeout(() => {
      setDisplaySlide(index);
      setAnimating(false);
    }, 500);
  };

  const handlePrev = () => {
    if (animating) return;
    setDirection("prev");
    setAnimating(true);
    setTimeout(() => {
      setDisplaySlide((prev) => (prev === 0 ? totalCount - 1 : prev - 1));
      setAnimating(false);
    }, 500);
  };

  const handleNext = () => {
    if (animating) return;
    setDirection("next");
    setAnimating(true);
    setTimeout(() => {
      setDisplaySlide((prev) => (prev === totalCount - 1 ? 0 : prev + 1));
      setAnimating(false);
    }, 500);
  };

  const driftingClouds = [
    { top: 8, width: 90, duration: 28, delay: 0, opacity: 0.55 },
    { top: 20, width: 60, duration: 36, delay: 6, opacity: 0.4 },
    { top: 55, width: 110, duration: 32, delay: 3, opacity: 0.35 },
    { top: 70, width: 70, duration: 42, delay: 10, opacity: 0.45 },
    { top: 35, width: 80, duration: 38, delay: 15, opacity: 0.3 },
    { top: 82, width: 55, duration: 30, delay: 8, opacity: 0.5 },
    { top: 14, width: 100, duration: 45, delay: 20, opacity: 0.25 },
    { top: 62, width: 65, duration: 34, delay: 12, opacity: 0.4 },
  ];

  return (
    <section
      className={`relative overflow-hidden landing-section ${
        isFirstSlide
          ? "min-h-[calc(100vh-165px)] h-auto bg-white"
          : "h-[calc(100vh-165px)] min-h-[560px] bg-sky-300"
      }`}
    >
      <style>{`
        @keyframes cloud-drift-lr {
          0%   { transform: translateX(-200px); }
          100% { transform: translateX(110vw); }
        }
        @keyframes pop-star {
          0%   { transform: scale(0.6) rotate(-14deg); opacity: 0.5; }
          50%  { transform: scale(1.25) rotate(14deg); opacity: 1; }
          100% { transform: scale(0.6) rotate(-14deg); opacity: 0.5; }
        }
        @keyframes comic-slam {
          0%   { transform: scale(2.6) rotate(-8deg); opacity: 0; }
          55%  { transform: scale(0.92) rotate(1deg); opacity: 1; }
          78%  { transform: scale(1.06) rotate(0deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes comic-pop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          70%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes comic-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-7px); }
          40% { transform: translateX(7px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes comic-wiggle {
          0%, 84%, 100% { transform: scale(1) rotate(0deg); }
          88% { transform: scale(1.1) rotate(-5deg); }
          92% { transform: scale(1.1) rotate(4deg); }
          96% { transform: scale(1.05) rotate(-3deg); }
        }
        @keyframes comic-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        .cloud-drift-lr {
          position: absolute;
          pointer-events: none;
          animation: cloud-drift-lr linear infinite;
          will-change: transform;
          overflow: visible;
          filter: drop-shadow(4px 4px 0 #000);
        }
        .anim-slam { animation: comic-slam 0.45s cubic-bezier(.2,.8,.3,1) both; }
        .anim-slam-shake {
          animation: comic-slam 0.45s cubic-bezier(.2,.8,.3,1) both, comic-shake 0.3s linear 0.5s both;
        }
        .anim-pop { animation: comic-pop 0.45s cubic-bezier(.2,.9,.3,1.4) both; }
        .anim-wiggle { animation: comic-wiggle 3s ease-in-out 1.2s infinite; }
        .anim-bob { animation: comic-bob 1.4s steps(4) infinite; }

        .comic-font {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          letter-spacing: 0.06em;
        }
        .comic-chip-font {
          font-family: var(--font-comic-chip) !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }
        .comic-heading {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          line-height: 0.95;
          letter-spacing: 0.05em;
          color: #fff;
          -webkit-text-stroke: 3px #000;
          paint-order: stroke fill;
          text-shadow: 4px 4px 0 #000;
        }
        .comic-heading *, .comic-welcome * {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
        }
        .comic-heading .hl { color: #f97316; }
        .comic-welcome {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          letter-spacing: 0.06em;
          color: #fff;
          -webkit-text-stroke: 2px #000;
          paint-order: stroke fill;
          text-shadow: 3px 3px 0 #000;
        }
        .comic-welcome .hl { color: #fde047; }
        .comic-tag {
          background: #fde047;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 8px;
          padding: 2px 12px;
          transform: rotate(-2deg) skewX(-6deg);
          display: inline-block;
        }
        .comic-sticker {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 999px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .comic-narration {
          background: #fff;
          color: #000;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 12px;
          padding: 8px 14px;
          transform: rotate(1deg);
          letter-spacing: 0.05em;
          line-height: 1.25;
        }
        .comic-chip {
          background: var(--chip);
          color: #fff;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 6px;
          padding: 1px 10px;
          line-height: 1.2;
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          transform: rotate(var(--rot, 0deg)) skewX(-8deg);
          display: inline-block;
        }
        .comic-cta {
          background: #f97316;
          color: #fff;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 10px;
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          transition: box-shadow 0.1s ease, background 0.1s ease, transform 0.1s ease;
          transform: rotate(-2deg);
        }
        .comic-cta:hover { background: #fb923c; transform: rotate(-2deg) scale(1.06); }
        .comic-cta:active { box-shadow: 0 0 0 #000; transform: rotate(-2deg) translate(3px, 3px); }
        .comic-tile {
          border: 3px solid #000;
          box-shadow: 5px 5px 0 #000;
          border-radius: 8px;
          transform: rotate(var(--tilt, 0deg));
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease;
        }
        .group:hover .comic-tile {
          transform: rotate(0deg) translate(-3px, -3px) scale(1.06);
          box-shadow: 9px 9px 0 #000;
        }
        .comic-bar {
          transition: opacity 0.15s ease;
        }
        .landing-section:has(.comic-card:hover) .comic-bar,
        .landing-section:has(.comic-card:focus-within) .comic-bar {
          opacity: 0;
          pointer-events: none;
        }
        .comic-bar {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 5px 5px 0 #000;
        }
        .comic-arrow {
          background: #fde047;
          border: 3px solid #000;
          box-shadow: 2px 2px 0 #000;
          transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
        }
        .comic-arrow:hover { background: #facc15; }
        .comic-arrow:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }
        .sky-halftone {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.45) 2px, transparent 2.5px);
          background-size: 14px 14px;
          -webkit-mask-image: linear-gradient(180deg, #000 0%, transparent 70%);
          mask-image: linear-gradient(180deg, #000 0%, transparent 70%);
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          .banner-right-img { display: none !important; }
          .banner-center-grid { display: grid !important; gap: 1.25rem !important; padding: 1rem !important; }
          .banner-center-grid .banner-grid-item { width: 5rem !important; height: 5rem !important; }
          .banner-left { width: 55% !important; margin-left: 1.5rem !important; }
          .banner-headline { font-size: 3.5rem !important; }
        }

        @media (max-width: 1024px) {
          .cloud-bg-drift {
            animation: none;
          }
        }

        @media (max-width: 768px) {
          .banner-right-img { display: none !important; }
          .banner-center-grid { display: none !important; }
          .banner-left { margin-left: 1rem !important; width: 90% !important; }
          .banner-headline { font-size: 2.8rem !important; }
          .banner-sub { font-size: 0.85rem !important; }
        }

        @media (max-width: 480px) {
          .banner-headline { font-size: 2rem !important; }
          .banner-left { margin-left: 0.75rem !important; }
        }
      `}</style>

      {!isFirstSlide && (
        <>
          <div className="sky-halftone" style={{ zIndex: 0 }} />

          {driftingClouds.map((c, i) => (
            <svg
              key={i}
              className="cloud-drift-lr"
              style={{
                top: `${c.top}%`,
                width: `${Math.round(c.width * 1.5)}px`,
                height: `${Math.round(c.width * 0.75)}px`,
                animationDuration: `${c.duration}s`,
                animationDelay: `-${c.delay}s`,
                opacity: Math.min(1, c.opacity + 0.5),
                zIndex: 0,
              }}
              viewBox="0 0 160 80"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M40 70 C18 70 8 54 22 44 C16 28 38 20 50 30 C56 10 88 8 98 28 C112 16 140 26 134 46 C152 50 148 70 128 70 Z"
                fill="#ffffff"
                stroke="#000"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M44 58 C54 63 72 63 86 58"
                fill="none"
                stroke="#000"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.22"
              />
            </svg>
          ))}

          <img
            className="absolute inset-0 h-full w-full pointer-events-none cloud-bg-drift"
            style={{ zIndex: 1 }}
            src="/assets/home/newPage/bg/landing-bg.png"
            alt="hero-bg"
          />

          {bgStars.map((s, i) => (
            <div
              key={`star-${i}`}
              className="absolute pointer-events-none"
              style={{
                top: s.top,
                left: s.left,
                zIndex: 1,
                animation: `pop-star ${s.duration}s steps(3) infinite`,
                animationDelay: `${s.delay}s`,
              }}
            >
              <ComicStar size={s.size} fill={s.fill} />
            </div>
          ))}
        </>
      )}

      <div
        key={displaySlide}
        style={{ position: "relative", zIndex: 2 }}
        className={`${
          isFirstSlide
            ? "min-h-[calc(100vh-165px)]"
            : "flex items-center justify-center gap-5 h-full pb-16"
        } ${
          animating
            ? direction === "next"
              ? "cloud-exit-left"
              : "cloud-exit-right"
            : direction === "next"
              ? "cloud-enter-right"
              : "cloud-enter-left"
        }`}
      >
        {isFirstSlide ? (
          <NewBanner />
        ) : (
          <>
            <div className="banner-left flex flex-col items-start justify-start ml-20 w-1/2">
              <div className="flex items-center gap-3 mb-3">
                <div className="anim-pop">
                  <div className="comic-sticker text-2xl">{slide!.emoji}</div>
                </div>
                <div className="anim-pop" style={{ animationDelay: "0.1s" }}>
                  <span className="comic-tag comic-font text-lg uppercase">
                    {slide!.tag}
                  </span>
                </div>
              </div>

              <div className="anim-slam" style={{ animationDelay: "0.15s" }}>
                <h1 className="comic-welcome text-3xl">
                  Welcome to <span className="hl">Mentoons</span>
                </h1>
              </div>

              <div
                className="anim-slam-shake"
                style={{ animationDelay: "0.25s" }}
              >
                <h1 className="banner-headline comic-heading text-6xl xl:text-7xl mt-1">
                  {slide!.headline.split(" ").map((word, i) =>
                    word === slide!.highlightWord ? (
                      <span key={i} className="hl">
                        {word}{" "}
                      </span>
                    ) : (
                      <span key={i}>{word} </span>
                    ),
                  )}
                </h1>
              </div>

              <div
                className="anim-slam mt-4 max-w-sm"
                style={{ animationDelay: "0.55s" }}
              >
                <p className="banner-sub comic-narration comic-font text-lg">
                  {slide!.sub}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {slide!.badges?.map((badge, i) => (
                  <div
                    key={i}
                    className="anim-pop"
                    style={{ animationDelay: `${0.7 + i * 0.1}s` }}
                  >
                    <span
                      className="comic-chip comic-chip-font text-sm uppercase"
                      style={
                        {
                          ["--chip" as string]:
                            chipColors[i % chipColors.length],
                          ["--rot" as string]: `${i % 2 === 0 ? -3 : 2}deg`,
                        } as React.CSSProperties
                      }
                    >
                      {badge}
                    </span>
                  </div>
                ))}
              </div>

              <div className="anim-pop mt-5" style={{ animationDelay: "1s" }}>
                <div className="anim-wiggle">
                  <a href={slide!.link}>
                    <button className="comic-cta comic-font px-6 py-2 text-2xl uppercase cursor-pointer">
                      {slide!.cta}
                    </button>
                  </a>
                </div>
              </div>
            </div>

            <div className="banner-center-grid grid grid-cols-2 place-items-center gap-10 p-6">
              {slide!.items?.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className="anim-slam"
                  style={{ animationDelay: `${0.3 + index * 0.12}s` }}
                >
                  <a href={item.link} className="group block">
                    {"image" in item && item.image ? (
                      <div
                        className="comic-tile banner-grid-item w-28 h-28 overflow-hidden bg-white"
                        style={
                          {
                            ["--tilt" as string]: `${index % 2 === 0 ? -3 : 3}deg`,
                          } as React.CSSProperties
                        }
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="sr-only">{item.name}</span>
                      </div>
                    ) : (
                      <div
                        className="comic-tile banner-grid-item w-28 h-28 flex items-center justify-center p-3 text-center"
                        style={
                          {
                            ["--tilt" as string]: `${index % 2 === 0 ? -3 : 3}deg`,
                            backgroundColor:
                              "color" in item ? `${item.color}` : slide!.accent,
                          } as React.CSSProperties
                        }
                      >
                        <span
                          className="comic-font text-base leading-tight"
                          style={{ color: "#000000" }}
                        >
                          {item.name}
                        </span>
                      </div>
                    )}
                  </a>
                </div>
              ))}
            </div>

            <div className="banner-right-img w-1/2 flex items-center justify-center">
              <div
                className="anim-slam w-full"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="anim-bob">
                  <img
                    src={slide!.img}
                    className="w-full"
                    alt="right-content"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="comic-bar absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-3 py-2 rounded-full">
        <button
          onClick={handlePrev}
          className="comic-arrow w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="text-black text-sm" />
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`rounded-full border-2 border-black transition-all duration-300 ${
                index === displaySlide
                  ? "w-7 h-3 bg-orange-500"
                  : "w-3 h-3 bg-white hover:bg-yellow-200"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="comic-arrow w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
          aria-label="Next slide"
        >
          <FaChevronRight className="text-black text-sm" />
        </button>
      </div>
    </section>
  );
};

export default LandingBanner;
