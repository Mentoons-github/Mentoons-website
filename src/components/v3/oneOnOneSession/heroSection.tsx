import { useLayoutEffect, useRef } from "react";
import { ShieldCheck, Heart, Gift } from "lucide-react";

/* ---- Inline comic animations (Web Animations API, no CSS needed) ---- */
type ComicKind = "slam" | "pop" | "drop" | "panel" | "shake";

const COMIC = {
  slam: (r: number) => ({
    duration: 700,
    easing: "ease-out",
    frames: [
      { opacity: 0, transform: "translateY(-40px) scale(2.4) rotate(-6deg)" },
      {
        offset: 0.55,
        opacity: 1,
        transform: `translateY(0px) scale(0.94) rotate(${r + 1}deg)`,
      },
      {
        offset: 0.75,
        opacity: 1,
        transform: `translateY(0px) scale(1.03) rotate(${r - 0.5}deg)`,
      },
      { opacity: 1, transform: `translateY(0px) scale(1) rotate(${r}deg)` },
    ] as Keyframe[],
  }),
  pop: (r: number) => ({
    duration: 650,
    easing: "ease-out",
    frames: [
      { opacity: 0, transform: "translateY(40px) scale(0.6) rotate(-6deg)" },
      {
        offset: 0.6,
        opacity: 1,
        transform: `translateY(-8px) scale(1.04) rotate(${r + 2}deg)`,
      },
      {
        offset: 0.8,
        opacity: 1,
        transform: `translateY(2px) scale(0.99) rotate(${r}deg)`,
      },
      { opacity: 1, transform: `translateY(0px) scale(1) rotate(${r}deg)` },
    ] as Keyframe[],
  }),
  drop: (r: number) => ({
    duration: 900,
    easing: "ease-out",
    frames: [
      { opacity: 0, transform: "translateY(-140px) rotate(-20deg)" },
      { offset: 0.55, opacity: 1, transform: "translateY(12px) rotate(6deg)" },
      { offset: 0.75, opacity: 1, transform: "translateY(-6px) rotate(-3deg)" },
      { opacity: 1, transform: `translateY(0px) rotate(${r}deg)` },
    ] as Keyframe[],
  }),
  panel: (r: number) => ({
    duration: 800,
    easing: "ease-out",
    frames: [
      {
        opacity: 0,
        transform: `perspective(900px) rotateY(-70deg) scale(0.7) rotate(${r}deg)`,
      },
      {
        offset: 0.7,
        opacity: 1,
        transform: `perspective(900px) rotateY(8deg) scale(1.03) rotate(${r}deg)`,
      },
      {
        opacity: 1,
        transform: `perspective(900px) rotateY(0deg) scale(1) rotate(${r}deg)`,
      },
    ] as Keyframe[],
  }),
  shake: () => ({
    duration: 350,
    easing: "linear",
    frames: [
      { transform: "translate(0px, 0px)" },
      { offset: 0.2, transform: "translate(-6px, 3px)" },
      { offset: 0.4, transform: "translate(5px, -4px)" },
      { offset: 0.6, transform: "translate(-4px, -2px)" },
      { offset: 0.8, transform: "translate(3px, 2px)" },
      { transform: "translate(0px, 0px)" },
    ] as Keyframe[],
  }),
};

/* Plays once on load, or when the element scrolls into view (onView).
   `rotate` = the element's existing Tailwind tilt in degrees (e.g. -1). */
const useComic = <T extends HTMLElement>(
  kind: ComicKind,
  delay = 0,
  rotate = 0,
  onView = false,
) => {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof el.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const spec = COMIC[kind](rotate);
    const play = () => {
      el.style.opacity = "";
      el.animate(spec.frames, {
        duration: spec.duration,
        delay,
        easing: spec.easing,
        fill: "backwards",
      });
    };

    if (!onView || typeof IntersectionObserver === "undefined") {
      play();
      return;
    }

    el.style.opacity = "0";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
};

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

/* Same <li> as before; only adds the staggered pop animation */
const TrustChip = ({
  icon: Icon,
  label,
  bg,
  delay,
}: {
  icon: (typeof TRUST_POINTS)[number]["icon"];
  label: string;
  bg: string;
  delay: number;
}) => {
  const ref = useComic<HTMLLIElement>("pop", delay);
  return (
    <li
      ref={ref}
      className={`font-comic-chip flex items-center gap-2 rounded-full border-2 border-gray-900 px-4 py-2 text-sm tracking-wide text-gray-900 shadow-[3px_3px_0_0_#111827] ${bg}`}
    >
      <Icon className="h-5 w-5" strokeWidth={2.5} />
      {label}
    </li>
  );
};

const HeroSection = () => {
  const panelShakeRef = useComic<HTMLDivElement>("shake", 550);
  const badgeRef = useComic<HTMLImageElement>("drop", 900);
  const h1Ref = useComic<HTMLHeadingElement>("slam", 150);
  const introRef = useComic<HTMLParagraphElement>("pop", 950, -1);
  const imagePanelRef = useComic<HTMLDivElement>("panel", 700);

  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
      <section
        style={HALFTONE_BG}
        className="w-full border-b-2 border-gray-900 px-4 py-6 sm:px-6 sm:py-10"
      >
        <div
          ref={panelShakeRef}
          className="relative grid w-full grid-cols-1 items-center gap-8 overflow-hidden rounded-2xl border-2 border-gray-900 bg-[#ff9800] px-5 pb-10 pt-32 shadow-[8px_8px_0_0_#111827] sm:px-8 sm:py-12 lg:grid-cols-2 lg:px-14"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={HALFTONE_OVERLAY}
          />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full border-4 border-gray-900 bg-[#FFD93D] opacity-70" />

          {/* Psychologist badge: same position and size as the assessment banner */}
          <img
            src="/assets/LandingPage/psyco.png"
            alt="Carefully crafted by psychologists"
            ref={badgeRef}
            className="absolute -top-3 -right-4 z-20 pointer-events-none object-contain w-28 h-28 sm:w-44 sm:h-44 lg:w-56 lg:h-56"
          />

          <div className="relative z-10">
            <h1
              ref={h1Ref}
              className="font-comic mt-2 text-5xl leading-tight tracking-wide text-white sm:text-6xl md:text-7xl [transform-origin:left_center]"
              style={{
                WebkitTextStroke: "2px #111827",
                textShadow: "5px 5px 0 #111827",
              }}
            >
              One-on-One
              <br />
              with a Psychologist
            </h1>

            <p
              ref={introRef}
              className="mt-6 inline-block -rotate-1 rounded-2xl border-2 border-gray-900 bg-white px-5 py-3 text-left text-base font-medium leading-relaxed text-gray-900 shadow-[5px_5px_0_0_#111827] sm:text-lg"
            >
              A safe, supportive space for children and teens to talk, be heard,
              and grow with expert guidance.
            </p>

            <ul className="mt-8 flex flex-wrap gap-3">
              {TRUST_POINTS.map(({ id, icon, label, bg }, index) => (
                <TrustChip
                  key={id}
                  icon={icon}
                  label={label}
                  bg={bg}
                  delay={1250 + index * 130}
                />
              ))}
            </ul>
          </div>

          <div className="relative z-10 flex items-center justify-center">
            <div
              ref={imagePanelRef}
              className="rounded-2xl border-2 border-gray-900 bg-white p-4 shadow-[6px_6px_0_0_#111827]"
            >
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
