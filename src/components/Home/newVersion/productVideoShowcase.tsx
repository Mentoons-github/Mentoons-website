import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
} from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface Video {
  id: number;
  title: string;
  videoUrl: string;
  span: string;
}

const VIDEOS: Video[] = [
  {
    id: 1,
    title: "Conversation Story Cards (20+ years)",
    videoUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1785843686037-d25cd6ff-890c-4eba-8502-bbf4b56388d5.mp4",
    span: "sm:col-span-2 sm:row-span-2",
  },
  {
    id: 2,
    title: "Coloring Books",
    videoUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1785845233611-69c0a612-89ba-4866-826e-9ea832dd9ef7.mp4",
    span: "sm:col-span-1 sm:row-span-1",
  },
  {
    id: 3,
    title: "Conversation Starter Cards",
    videoUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1785845343325-cb512926-371d-4fc7-9fd3-40decc5ee931.mp4",
    span: "sm:col-span-1 sm:row-span-2",
  },
  {
    id: 4,
    title: "Journals",
    videoUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1785845495654-55c26a8b-14da-45f8-8a87-3e7d553ab682.mp4",
    span: "sm:col-span-1 sm:row-span-1",
  },
  {
    id: 5,
    title: "Silent Stories",
    videoUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1785845627983-09b37bab-2315-40b3-92c5-22cd918252ee.mp4",
    span: "sm:col-span-1 sm:row-span-1",
  },
  {
    id: 6,
    title: "Story Re-teller Cards",
    videoUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1785845797288-7d675dc6-29c6-4aea-aebd-f81a4473795b.mp4",
    span: "sm:col-span-2 sm:row-span-1",
  },
  {
    id: 7,
    title: "All Product Intro",
    videoUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1785845873777-560e674a-2899-498c-b6aa-f452b58a6f4c.mp4",
    span: "sm:col-span-1 sm:row-span-1",
  },
];

const formatDuration = (seconds: number) => {
  if (!isFinite(seconds) || seconds <= 0) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const burstWords = ["POW!", "BAM!", "ZAP!", "WHAM!", "BOOM!", "CLICK!"];
const burstFills = ["#fde047", "#f9a8d4", "#86efac", "#93c5fd", "#fdba74"];

const burstPoints = Array.from({ length: 16 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 16;
  const radius = i % 2 === 0 ? 48 : 33;
  return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
}).join(" ");

const smokePuffs = Array.from({ length: 12 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 12 + 0.3;
  const r = 70 + (i % 3) * 18;
  const drift = 60 + (i % 3) * 15;
  return {
    x: Math.cos(a) * r,
    y: Math.sin(a) * r,
    size: 44 + (i % 4) * 14,
    dx: Math.cos(a) * drift,
    dy: Math.sin(a) * drift - 24,
    delay: (i % 4) * 0.04,
    tone: ["#ffffff", "#e5e7eb", "#d1d5db"][i % 3],
  };
});

const rays = Array.from({ length: 14 }, (_, i) => i * (360 / 14));

const flyStars = Array.from({ length: 8 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 8 + 0.4;
  return {
    dx: Math.cos(a) * 150,
    dy: Math.sin(a) * 130,
    size: 18 + (i % 3) * 6,
    fill: i % 2 === 0 ? "#fde047" : "#ffffff",
    delay: 0.05 + (i % 4) * 0.04,
  };
});

const ImpactFx = ({ word, fill }: { word: string; fill: string }) => (
  <div
    className="pv-fx pointer-events-none absolute left-1/2 top-1/2 z-50"
    aria-hidden="true"
  >
    {smokePuffs.map((p, i) => (
      <div
        key={`puff-${i}`}
        className="pv-puff"
        style={
          {
            left: p.x - p.size / 2,
            top: p.y - p.size / 2,
            width: p.size,
            height: p.size,
            background: p.tone,
            animationDelay: `${p.delay}s`,
            ["--dx" as string]: `${p.dx}px`,
            ["--dy" as string]: `${p.dy}px`,
          } as CSSProperties
        }
      />
    ))}

    <div className="pv-ring" />

    {rays.map((deg, i) => (
      <div
        key={`ray-${i}`}
        className="pv-ray-wrap"
        style={{ transform: `rotate(${deg}deg)` }}
      >
        <div className="pv-ray" />
      </div>
    ))}

    <div className="pv-burst-big">
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{ overflow: "visible", filter: "drop-shadow(4px 4px 0 #000)" }}
      >
        <polygon
          points={burstPoints}
          fill={fill}
          stroke="#000"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="pv-font absolute inset-0 flex items-center justify-center text-black"
        style={{ fontSize: "50px" }}
      >
        {word}
      </span>
    </div>

    {flyStars.map((s, i) => (
      <div
        key={`fly-${i}`}
        className="pv-fly"
        style={
          {
            left: -s.size / 2,
            top: -s.size / 2,
            animationDelay: `${s.delay}s`,
            ["--dx" as string]: `${s.dx}px`,
            ["--dy" as string]: `${s.dy}px`,
          } as CSSProperties
        }
      >
        <svg
          viewBox="0 0 24 24"
          width={s.size}
          height={s.size}
          style={{ overflow: "visible" }}
        >
          <polygon
            points="12,1 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9"
            fill={s.fill}
            stroke="#000"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ))}

    <span
      className="pv-minitag pv-chip-font"
      style={
        { left: -170, top: -120, ["--r" as string]: "-12deg" } as CSSProperties
      }
    >
      OOF!
    </span>
    <span
      className="pv-minitag pv-chip-font"
      style={
        {
          left: 80,
          top: 70,
          animationDelay: "0.12s",
          ["--r" as string]: "10deg",
        } as CSSProperties
      }
    >
      YEAH!
    </span>
  </div>
);

const ProductVideoShowCase = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [durations, setDurations] = useState<Record<number, number>>({});
  const [loadedIds, setLoadedIds] = useState<Record<number, boolean>>({});
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [burst, setBurst] = useState<{
    id: number;
    word: string;
    fill: string;
  } | null>(null);
  const burstTimer = useRef<number | null>(null);

  const handleExploreMore = () => {
    navigate("/products");
  };

  const handleVideoClick = (video: Video, index: number) => {
    if (burst) return;
    setBurst({
      id: video.id,
      word: burstWords[Math.floor(Math.random() * burstWords.length)],
      fill: burstFills[index % burstFills.length],
    });
    burstTimer.current = window.setTimeout(() => {
      setActiveVideo(video);
      setBurst(null);
      burstTimer.current = null;
    }, 750);
  };

  const handleLoadedMetadata = useCallback(
    (id: number, e: React.SyntheticEvent<HTMLVideoElement>) => {
      const duration = e.currentTarget.duration;
      setDurations((prev) =>
        prev[id] === duration ? prev : { ...prev, [id]: duration },
      );
      setLoadedIds((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
    },
    [],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (burstTimer.current) window.clearTimeout(burstTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!activeVideo) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  useEffect(() => {
    if (activeVideo && modalVideoRef.current) {
      modalVideoRef.current.play().catch(() => {});
    }
  }, [activeVideo]);

  const modalContent = activeVideo && (
    <div
      className="pv-backdrop fixed inset-0 z-[9999] flex items-center justify-center px-4"
      onClick={() => setActiveVideo(null)}
    >
      <div
        className="pv-modal relative w-full max-w-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setActiveVideo(null)}
          aria-label="Close video"
          className="pv-close absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white"
        >
          <X className="w-5 h-5" strokeWidth={3} />
        </button>

        <video
          ref={modalVideoRef}
          src={activeVideo.videoUrl}
          className="w-full aspect-video bg-black"
          controls
          autoPlay
          playsInline
        />

        <div className="pv-modal-caption px-6 py-3">
          <p className="pv-font text-2xl text-black">{activeVideo.title}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pv-root space-y-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Luckiest+Guy&display=swap');

        @keyframes pv-slam {
          0%   { transform: translateY(50px) scale(0.8) rotate(-5deg); opacity: 0; }
          60%  { transform: translateY(-6px) scale(1.04) rotate(1deg); opacity: 1; }
          100% { transform: none; opacity: 1; }
        }
        @keyframes pv-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
        @keyframes pv-wiggle {
          0%, 100% { transform: rotate(-2deg) scale(1.06); }
          25% { transform: rotate(3deg) scale(1.08); }
          50% { transform: rotate(-4deg) scale(1.08); }
          75% { transform: rotate(2deg) scale(1.06); }
        }

        .pv-font, .pv-font * {
          font-family: 'Bangers', 'Comic Sans MS', 'Chalkboard SE', cursive !important;
          font-weight: 400 !important;
          letter-spacing: 0.05em;
        }
        .pv-chip-font {
          font-family: 'Luckiest Guy', 'Bangers', 'Comic Sans MS', cursive !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }
        .pv-title, .pv-title * {
          font-family: 'Bangers', 'Comic Sans MS', 'Chalkboard SE', cursive !important;
          font-weight: 400 !important;
        }
        .pv-title {
          line-height: 1;
          letter-spacing: 0.05em;
          color: #fff;
          -webkit-text-stroke: 3px #000;
          paint-order: stroke fill;
          text-shadow: 4px 4px 0 #000;
        }
        .pv-title .pv-hl { color: #f97316; }
        .pv-sub {
          display: inline-block;
          background: #fff;
          color: #000;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 10px;
          padding: 4px 14px;
          transform: rotate(-1deg);
        }
        .pv-btn {
          background: #f97316;
          color: #fff;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 12px;
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          transform: rotate(-2deg);
          transition: box-shadow 0.1s ease, filter 0.1s ease;
          cursor: pointer;
        }
        .pv-btn:hover { filter: brightness(1.08); animation: pv-wiggle 0.4s ease-in-out; }
        .pv-btn:active { box-shadow: 0 0 0 #000; transform: rotate(-2deg) translate(3px, 3px); }

        .pv-tile {
          background: #fde68a;
          border: 3px solid #000;
          box-shadow: 5px 5px 0 #000;
          border-radius: 12px;
          transform: rotate(var(--tilt, 0deg));
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease;
          animation: pv-slam 0.5s cubic-bezier(.2,.8,.3,1) backwards;
          animation-delay: var(--d, 0s);
        }
        .pv-tile:hover {
          transform: rotate(0deg) translate(-3px, -3px) scale(1.03);
          box-shadow: 9px 9px 0 #000;
          z-index: 5;
        }
        .pv-halftone {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(rgba(0,0,0,0.3) 1.2px, transparent 1.6px);
          background-size: 7px 7px;
          -webkit-mask-image: linear-gradient(135deg, transparent 45%, #000 100%);
          mask-image: linear-gradient(135deg, transparent 45%, #000 100%);
          mix-blend-mode: multiply;
        }
        .pv-loading {
          background-color: #fde68a;
          background-image: radial-gradient(rgba(0,0,0,0.15) 1.6px, transparent 2px);
          background-size: 12px 12px;
        }
        .pv-num {
          background: #fde047;
          border: 3px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          line-height: 1;
        }
        .pv-play {
          background: #fde047;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 999px;
          transition: transform 0.15s ease;
        }
        .pv-play-hover { animation: pv-pulse 0.5s steps(3) infinite; }
        .pv-badge {
          background: #fff;
          color: #000;
          border: 3px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 6px;
          padding: 0 6px;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        .pv-caption {
          background: #fde047;
          color: #000;
          border-top: 3px solid #000;
        }

        .pv-backdrop {
          background-color: rgba(0,0,0,0.82);
          background-image: radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 2px);
          background-size: 14px 14px;
        }
        .pv-modal {
          background: #fff;
          border: 4px solid #000;
          box-shadow: 10px 10px 0 #000;
          border-radius: 14px;
          animation: pv-slam 0.4s cubic-bezier(.2,.8,.3,1) backwards;
        }
        .pv-modal-caption {
          background: #fde047;
          border-top: 4px solid #000;
        }
        .pv-close {
          background: #ef4444;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        .pv-close:hover { transform: rotate(8deg) scale(1.1); }
        .pv-close:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }

        @keyframes pv-burst-in {
          0%   { transform: scale(0) rotate(-35deg); opacity: 0; }
          35%  { transform: scale(1.3) rotate(8deg); opacity: 1; }
          55%  { transform: scale(0.95) rotate(-4deg); }
          100% { transform: scale(1.05) rotate(0deg); opacity: 1; }
        }
        @keyframes pv-flash {
          0%   { opacity: 0.95; }
          100% { opacity: 0; }
        }
        @keyframes pv-shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-5px, 3px); }
          50% { transform: translate(5px, -3px); }
          75% { transform: translate(-3px, -4px); }
        }
        @keyframes pv-smoke {
          0%   { transform: translate(0, 0) scale(0.2); opacity: 0; }
          25%  { opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(1.5); opacity: 0; }
        }
        @keyframes pv-ring {
          0%   { transform: scale(0.2); opacity: 1; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes pv-ray {
          0%   { transform: translateY(-70px) scaleY(0.3); opacity: 1; }
          100% { transform: translateY(-160px) scaleY(1.3); opacity: 0; }
        }
        @keyframes pv-fly {
          0%   { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
          25%  { transform: translate(calc(var(--dx) * 0.4), calc(var(--dy) * 0.4)) scale(1.2) rotate(120deg); }
          100% { transform: translate(var(--dx), var(--dy)) scale(0.5) rotate(360deg); opacity: 0; }
        }
        @keyframes pv-minitag {
          0%   { transform: scale(0) rotate(0deg); opacity: 0; }
          40%  { transform: scale(1.25) rotate(var(--r)); opacity: 1; }
          100% { transform: scale(1) rotate(var(--r)); opacity: 1; }
        }
        @keyframes pv-punch {
          0%   { transform: scale(1) rotate(0deg); }
          20%  { transform: scale(0.9) rotate(-2deg); }
          45%  { transform: scale(1.08) rotate(2deg); }
          70%  { transform: scale(0.98) rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .pv-punch-wrap { animation: pv-punch 0.4s ease-out; }
        .pv-puff {
          position: absolute;
          border-radius: 50%;
          border: 3px solid #000;
          box-shadow: inset -7px -7px 0 rgba(0,0,0,0.12);
          animation: pv-smoke 0.75s ease-out both;
        }
        .pv-ring {
          position: absolute;
          left: -60px;
          top: -60px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 5px solid #000;
          animation: pv-ring 0.55s ease-out both;
        }
        .pv-ray-wrap {
          position: absolute;
          left: -3px;
          top: -16px;
          width: 6px;
          height: 32px;
        }
        .pv-ray {
          width: 100%;
          height: 100%;
          background: #000;
          border-radius: 3px;
          animation: pv-ray 0.5s ease-out both;
        }
        .pv-burst-big {
          position: absolute;
          left: -95px;
          top: -95px;
          width: 190px;
          height: 190px;
          animation: pv-burst-in 0.5s cubic-bezier(.2,.9,.3,1.2) both;
        }
        .pv-fly {
          position: absolute;
          animation: pv-fly 0.75s ease-out both;
        }
        .pv-minitag {
          position: absolute;
          background: #fff;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 8px;
          padding: 0 10px;
          font-size: 1.15rem;
          line-height: 1.5;
          animation: pv-minitag 0.5s cubic-bezier(.2,.9,.3,1.3) both;
        }
        @media (max-width: 639px) {
          .pv-root { overflow-x: clip; }
          .pv-fx { transform: scale(0.65); }
        }
        .pv-flash {
          background: #fff;
          pointer-events: none;
          animation: pv-flash 0.35s ease-out forwards;
        }
        .pv-shake { animation: pv-shake 0.08s linear 6; }

        @media (prefers-reduced-motion: reduce) {
          .pv-tile, .pv-modal, .pv-play-hover, .pv-shake, .pv-punch-wrap { animation: none; }
        }
      `}</style>

      <div className="flex items-end justify-between gap-4">
        <div className="space-y-4">
          <h2 className="pv-title text-5xl md:text-6xl">
            Our <span className="pv-hl">Products</span>
          </h2>
          <p className="pv-sub pv-font text-lg md:text-xl">
            Watch how it works, straight from the source
          </p>
        </div>

        <button
          onClick={handleExploreMore}
          className="pv-btn pv-font hidden sm:inline-flex items-center gap-2 px-8 py-3 text-2xl uppercase"
        >
          Explore More →
        </button>
      </div>

      <div className="grid grid-cols-2 auto-rows-[160px] sm:grid-cols-4 sm:auto-rows-[140px] gap-5 lg:gap-6">
        {VIDEOS.map((video, index) => (
          <div
            key={video.id}
            className={`relative ${video.span} ${
              burst?.id === video.id ? "pv-punch-wrap" : ""
            }`}
            style={{ zIndex: burst?.id === video.id ? 40 : undefined }}
          >
            <button
              type="button"
              onClick={() => handleVideoClick(video, index)}
              onMouseEnter={() => setHoveredId(video.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="pv-tile relative text-left group overflow-hidden w-full h-full"
              style={
                {
                  ["--tilt" as string]: `${index % 2 === 0 ? -1.5 : 1.5}deg`,
                  ["--d" as string]: `${index * 0.09}s`,
                } as CSSProperties
              }
            >
              {!loadedIds[video.id] && (
                <div className="pv-loading absolute inset-0 flex items-center justify-center animate-pulse">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-9 h-9 fill-orange-400"
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}

              <video
                src={video.videoUrl}
                className={`absolute inset-0 w-full h-full object-cover ${
                  burst?.id === video.id ? "pv-shake" : ""
                }`}
                preload="metadata"
                muted
                playsInline
                onLoadedMetadata={(e) => handleLoadedMetadata(video.id, e)}
                onLoadedData={() =>
                  setLoadedIds((prev) =>
                    prev[video.id] ? prev : { ...prev, [video.id]: true },
                  )
                }
              />

              <div className="pv-halftone" />

              <span className="pv-num pv-font absolute top-2 left-2 z-10">
                {index + 1}
              </span>

              <div className="absolute inset-0 flex items-center justify-center pb-6">
                <div
                  className={`pv-play w-12 h-12 flex items-center justify-center ${
                    hoveredId === video.id ? "pv-play-hover" : ""
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-red-500 ml-0.5"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              <span className="pv-badge pv-font absolute top-2 right-2 z-10">
                {formatDuration(durations[video.id])}
              </span>

              <p className="pv-caption pv-font absolute bottom-0 left-0 right-0 px-3 py-1 text-lg truncate">
                {video.title}
              </p>

              {burst?.id === video.id && (
                <div className="pv-flash absolute inset-0 z-20" />
              )}
            </button>

            {burst?.id === video.id && (
              <ImpactFx word={burst.word} fill={burst.fill} />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleExploreMore}
        className="pv-btn pv-font sm:hidden w-full inline-flex items-center justify-center gap-2 px-8 py-3 text-2xl uppercase"
      >
        Explore More →
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </div>
  );
};

export default ProductVideoShowCase;
