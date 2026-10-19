import type { CSSProperties } from "react";
import OpenPositions from "@/components/v3/joinUs/joinOurTeam";

const HALFTONE_BG = {
  backgroundColor: "#F5F5F4",
  backgroundImage: "radial-gradient(#d6d3d1 1.2px, transparent 1.2px)",
  backgroundSize: "16px 16px",
};

const HALFTONE_OVERLAY = {
  backgroundImage:
    "radial-gradient(rgba(17,24,39,0.16) 1.6px, transparent 1.6px)",
  backgroundSize: "16px 16px",
};

/* Animation only: per-element delay / final rotation via CSS variables */
const anim = (delayMs: number, rotate = "0deg") =>
  ({ "--d": `${delayMs}ms`, "--r": rotate }) as CSSProperties;

const H1_STYLE = {
  WebkitTextStroke: "2px #111827",
  textShadow: "5px 5px 0 #111827",
  "--d": "150ms",
} as CSSProperties;

const HERO_CSS = `
@keyframes jt-slam {
  0%   { opacity: 0; transform: scale(2.4) rotate(-6deg) translateY(-40px); }
  55%  { opacity: 1; transform: scale(0.94) rotate(1deg) translateY(0); }
  75%  { transform: scale(1.03) rotate(-0.5deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
@keyframes jt-shake {
  0%, 100% { transform: translate(0, 0); }
  20% { transform: translate(-6px, 3px); }
  40% { transform: translate(5px, -4px); }
  60% { transform: translate(-4px, -2px); }
  80% { transform: translate(3px, 2px); }
}
@keyframes jt-pop {
  0%   { opacity: 0; transform: scale(0) rotate(-12deg); }
  65%  { opacity: 1; transform: scale(1.12) rotate(calc(var(--r, 0deg) + 3deg)); }
  100% { opacity: 1; transform: scale(1) rotate(var(--r, 0deg)); }
}
@keyframes jt-drop {
  0%   { opacity: 0; transform: translateY(-140px) rotate(-20deg); }
  55%  { opacity: 1; transform: translateY(12px) rotate(6deg); }
  75%  { transform: translateY(-6px) rotate(-3deg); }
  100% { opacity: 1; transform: translateY(0) rotate(0deg); }
}
@keyframes jt-panel {
  0%   { opacity: 0; transform: perspective(900px) rotateY(-70deg) scale(0.7); }
  70%  { opacity: 1; transform: perspective(900px) rotateY(8deg) scale(1.03); }
  100% { opacity: 1; transform: perspective(900px) rotateY(0deg) scale(1); }
}

.jt-shake { animation: jt-shake 0.35s linear 0.55s both; }
.jt-slam  { animation: jt-slam 0.7s cubic-bezier(.2,.9,.3,1.2) var(--d, 0ms) backwards; }
.jt-pop   { animation: jt-pop 0.6s cubic-bezier(.34,1.56,.64,1) var(--d, 0ms) backwards; }
.jt-drop  { animation: jt-drop 0.9s cubic-bezier(.3,1.4,.5,1) var(--d, 0ms) backwards; }
.jt-panel { animation: jt-panel 0.8s cubic-bezier(.3,1.3,.5,1) var(--d, 0ms) backwards; }

@media (prefers-reduced-motion: reduce) {
  .jt-shake, .jt-slam, .jt-pop, .jt-drop, .jt-panel { animation: none !important; }
}
`;

const JoinOurTeam = () => {
  return (
    <div
      style={HALFTONE_BG}
      className="min-h-screen px-4 py-6 sm:px-6 sm:py-10"
    >
      <style>{HERO_CSS}</style>

      <div className="jt-shake relative flex w-full flex-col items-center gap-8 overflow-hidden rounded-2xl border-2 border-gray-900 bg-[#ff9800] px-5 pb-10 pt-24 text-center shadow-[8px_8px_0_0_#111827] sm:px-8 sm:py-12 md:flex-row md:gap-10 md:px-14 md:text-left">
        <div
          className="pointer-events-none absolute inset-0"
          style={HALFTONE_OVERLAY}
        />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full border-4 border-gray-900 bg-[#FFD93D] opacity-70" />

        {/* Psychologists badge - top right, responsive */}
        <div
          style={anim(900)}
          className="jt-drop absolute right-3 top-3 z-20 w-16 sm:right-4 sm:top-4 sm:w-20 md:right-6 md:top-5 md:w-28 lg:right-8 lg:top-6 lg:w-36 xl:w-40 drop-shadow-[4px_4px_0_rgba(17,24,39,0.9)] transition-transform duration-300 hover:rotate-3 hover:scale-105"
        >
          <img
            src="/assets/LandingPage/psyco.png"
            alt="Carefully crafted by psychologists"
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="relative z-10 w-full md:max-w-lg md:shrink-0">
          <h1
            className="jt-slam font-comic mt-2 text-5xl leading-tight tracking-wide text-white sm:text-6xl md:text-7xl"
            style={H1_STYLE}
          >
            Let's Make a Bigger
            <br className="hidden sm:block" /> Impact Together
          </h1>
          <p
            style={anim(950, "-1deg")}
            className="jt-pop mt-6 inline-block -rotate-1 rounded-2xl border-2 border-gray-900 bg-white px-5 py-3 text-left text-base font-medium leading-relaxed text-gray-900 shadow-[5px_5px_0_0_#111827] sm:text-lg"
          >
            At Mentoons, we create meaningful experiences for children, teens
            and families. Join our team and be part of a purpose-driven journey.
          </p>
        </div>

        <div className="relative z-10 flex w-full flex-1 items-center justify-center">
          <div
            style={anim(700)}
            className="jt-panel rounded-2xl border-2 border-gray-900 bg-white p-4 shadow-[6px_6px_0_0_#111827]"
          >
            <img
              src="/assets/v3/joinOurTeam/jointeam.png"
              alt="Team members collaborating around a laptop"
              className="w-full max-w-xs rounded-xl border-2 border-gray-900 bg-[#FFFBEB] object-contain sm:max-w-sm md:max-w-sm lg:max-w-md"
            />
          </div>
        </div>
      </div>

      <OpenPositions />
    </div>
  );
};

export default JoinOurTeam;
