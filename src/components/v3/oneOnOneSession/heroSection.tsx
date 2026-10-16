import { ShieldCheck, Heart, Gift } from "lucide-react";

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

const TRUST_POINTS = [
  {
    id: "safe",
    icon: ShieldCheck,
    label: "Confidential & Safe",
    bg: "bg-[#7AE582]",
  },
  {
    id: "friendly",
    icon: Heart,
    label: "Child-friendly Approach",
    bg: "bg-[#FF5D8F]",
  },
  {
    id: "guidance",
    icon: Gift,
    label: "Personalized Guidance",
    bg: "bg-[#FFD93D]",
  },
];

const HeroSection = () => {
  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
      <section
        style={HALFTONE_BG}
        className="w-full border-b-2 border-gray-900 px-4 py-6 sm:px-6 sm:py-10"
      >
        <div className="relative grid w-full grid-cols-1 items-center gap-8 overflow-hidden rounded-2xl border-2 border-gray-900 bg-[#ff9800] px-5 pb-10 pt-32 shadow-[8px_8px_0_0_#111827] sm:px-8 sm:py-12 lg:grid-cols-2 lg:px-14">
          <div
            className="pointer-events-none absolute inset-0"
            style={HALFTONE_OVERLAY}
          />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full border-4 border-gray-900 bg-[#FFD93D] opacity-70" />

          {/* Psychologist badge: same position and size as the assessment banner */}
          <img
            src="/assets/LandingPage/psyco.png"
            alt="Carefully crafted by psychologists"
            className="absolute -top-3 -right-4 z-20 pointer-events-none object-contain w-28 h-28 sm:w-44 sm:h-44 lg:w-56 lg:h-56"
          />

          <div className="relative z-10">
            <h1
              className="font-comic mt-2 text-5xl leading-tight tracking-wide text-white sm:text-6xl md:text-7xl"
              style={{
                WebkitTextStroke: "2px #111827",
                textShadow: "5px 5px 0 #111827",
              }}
            >
              One-on-One
              <br />
              with a Psychologist
            </h1>

            <p className="mt-6 inline-block -rotate-1 rounded-2xl border-2 border-gray-900 bg-white px-5 py-3 text-left text-base font-medium leading-relaxed text-gray-900 shadow-[5px_5px_0_0_#111827] sm:text-lg">
              A safe, supportive space for children and teens to talk, be heard,
              and grow with expert guidance.
            </p>

            <ul className="mt-8 flex flex-wrap gap-3">
              {TRUST_POINTS.map(({ id, icon: Icon, label, bg }) => (
                <li
                  key={id}
                  className={`font-comic-chip flex items-center gap-2 rounded-full border-2 border-gray-900 px-4 py-2 text-sm tracking-wide text-gray-900 shadow-[3px_3px_0_0_#111827] ${bg}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.5} />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 flex items-center justify-center">
            <div className="rounded-2xl border-2 border-gray-900 bg-white p-4 shadow-[6px_6px_0_0_#111827]">
              <img
                src="/assets/v3/oneOnOneSession/oneonone.png"
                alt="Psychologist session"
                className="h-56 w-full max-w-sm rounded-xl border-2 border-gray-900 bg-[#FFFBEB] object-contain sm:h-72"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
