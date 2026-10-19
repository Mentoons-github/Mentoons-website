import { useLayoutEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import PsychologistCarousel from "./psychologistCarousal";
import { Psychologist } from "@/redux/sessionSlice";

/* ---- Inline comic animations (Web Animations API, no CSS needed) ---- */
type ComicKind = "slam" | "pop";

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

interface PsychologistSectionProps {
  selectedPsychologistId?: string;
  onSelect: (psychologist: Psychologist) => void;
}

const PsychologistSection = ({
  selectedPsychologistId,
  onSelect,
}: PsychologistSectionProps) => {
  const titleRef = useComic<HTMLHeadingElement>("slam", 0, -1, true);
  const linkRef = useComic<HTMLAnchorElement>("pop", 300, 0, true);

  return (
    <section className="mt-10 w-full">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2
          ref={titleRef}
          className={`font-comic inline-block -rotate-1 rounded-2xl border-2 border-gray-900 bg-[#FF5D8F] px-5 py-1 text-3xl tracking-wide text-white shadow-[5px_5px_0_0_#111827] sm:text-4xl`}
          style={{
            WebkitTextStroke: "1px #111827",
            textShadow: "3px 3px 0 #111827",
          }}
        >
          Choose Your Psychologist
        </h2>
        <a
          href="#"
          ref={linkRef}
          className={`font-comic-chip flex items-center gap-1 rounded-xl border-2 border-gray-900 bg-[#FFD93D] px-4 py-2 text-base tracking-wide text-gray-900 shadow-[4px_4px_0_0_#111827] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#111827] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900`}
        >
          View All Psychologists
          <ChevronRight className="h-5 w-5" strokeWidth={3} />
        </a>
      </div>

      <PsychologistCarousel
        selectedPsychologistId={selectedPsychologistId}
        onSelect={onSelect}
      />
    </section>
  );
};

export default PsychologistSection;
