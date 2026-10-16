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

const JoinOurTeam = () => {
  return (
    <div
      style={HALFTONE_BG}
      className="min-h-screen px-4 py-6 sm:px-6 sm:py-10"
    >
      <div className="relative flex w-full flex-col items-center gap-8 overflow-hidden rounded-2xl border-2 border-gray-900 bg-[#ff9800] px-5 pb-10 pt-24 text-center shadow-[8px_8px_0_0_#111827] sm:px-8 sm:py-12 md:flex-row md:gap-10 md:px-14 md:text-left">
        <div
          className="pointer-events-none absolute inset-0"
          style={HALFTONE_OVERLAY}
        />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full border-4 border-gray-900 bg-[#FFD93D] opacity-70" />

        {/* Psychologists badge - top right, responsive */}
        <div className="absolute right-3 top-3 z-20 w-16 sm:right-4 sm:top-4 sm:w-20 md:right-6 md:top-5 md:w-28 lg:right-8 lg:top-6 lg:w-36 xl:w-40 drop-shadow-[4px_4px_0_rgba(17,24,39,0.9)] transition-transform duration-300 hover:rotate-3 hover:scale-105">
          <img
            src="/assets/LandingPage/psyco.png"
            alt="Carefully crafted by psychologists"
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="relative z-10 w-full md:max-w-lg md:shrink-0">
          <h1
            className="font-comic mt-2 text-5xl leading-tight tracking-wide text-white sm:text-6xl md:text-7xl"
            style={{
              WebkitTextStroke: "2px #111827",
              textShadow: "5px 5px 0 #111827",
            }}
          >
            Let's Make a Bigger
            <br className="hidden sm:block" /> Impact Together
          </h1>
          <p className="mt-6 inline-block -rotate-1 rounded-2xl border-2 border-gray-900 bg-white px-5 py-3 text-left text-base font-medium leading-relaxed text-gray-900 shadow-[5px_5px_0_0_#111827] sm:text-lg">
            At Mentoons, we create meaningful experiences for children, teens
            and families. Join our team and be part of a purpose-driven journey.
          </p>
        </div>

        <div className="relative z-10 flex w-full flex-1 items-center justify-center">
          <div className="rounded-2xl border-2 border-gray-900 bg-white p-4 shadow-[6px_6px_0_0_#111827]">
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
