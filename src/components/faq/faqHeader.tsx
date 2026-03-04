import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { FaQuestionCircle, FaSmileBeam } from "react-icons/fa";

interface FaqHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const FaqHeader = ({ searchQuery, onSearchChange }: FaqHeaderProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLImageElement>(null);
  const star1Ref = useRef<HTMLImageElement>(null);
  const star2Ref = useRef<HTMLImageElement>(null);
  const star3Ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        sunRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
      )
        .fromTo(
          star1Ref.current,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7 },
          "-=0.5",
        )
        .fromTo(
          star2Ref.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" },
          "-=0.4",
        )
        .fromTo(
          star3Ref.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" },
          "-=0.3",
        )
        .fromTo(
          ".faq-q-icon",
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(2)",
          },
          "-=0.3",
        )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: -30, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "back.out(1.4)" },
          "-=0.3",
        )
        .fromTo(
          searchRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.2",
        );

      gsap.to(sunRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
      gsap.to(star1Ref.current, {
        y: -8,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(star2Ref.current, {
        y: 6,
        rotation: 15,
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 0.4,
      });
      gsap.to(star3Ref.current, {
        y: -5,
        rotation: -10,
        duration: 1.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 0.8,
      });
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={headerRef} className="relative">
      <div className="relative flex items-center justify-center bg-blue-300/75 rounded-b-[40px] sm:rounded-b-[60px] overflow-hidden min-h-[180px] sm:min-h-[220px]">
        <img
          ref={sunRef}
          src="assets/faq/sun.png"
          alt="sun"
          className="absolute right-0 -top-2 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36"
        />
        <img
          ref={star1Ref}
          src="assets/faq/star.png"
          alt="star"
          className="absolute left-3 top-2 w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14"
        />
        <img
          ref={star2Ref}
          src="assets/faq/faceless-star.png"
          alt="star"
          className="absolute left-12 sm:left-16 md:left-20 top-1/3 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
        />
        <img
          ref={star3Ref}
          src="assets/faq/star.png"
          alt="star"
          className="absolute left-3 top-1/2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
        />

        <FaQuestionCircle className="faq-q-icon hidden sm:block text-3xl md:text-4xl text-gray-500/75 rotate-45" />
        <div
          ref={titleRef}
          className="px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-8 rounded-2xl sm:rounded-3xl bg-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mx-6 sm:mx-12 md:mx-20 my-8 sm:my-12 md:my-16 shadow-xl text-center"
        >
          Help and FAQ
        </div>
        <FaQuestionCircle className="faq-q-icon hidden sm:block text-3xl md:text-4xl text-gray-500/75 -rotate-45 scale-x-[-1]" />
      </div>

      <div
        ref={searchRef}
        className="absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3 bg-white border-2 border-neutral-200 hover:border-black w-[90%] sm:w-3/4 md:w-1/2 lg:w-1/3 mx-auto rounded-full z-20 shadow-md transition-all duration-200"
        onMouseEnter={() =>
          gsap.to(searchRef.current, {
            scale: 1.02,
            duration: 0.2,
            ease: "power2.out",
          })
        }
        onMouseLeave={() =>
          gsap.to(searchRef.current, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
          })
        }
      >
        <svg
          className="shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search FAQ questions..."
          className="flex-1 py-3 sm:py-4 bg-transparent text-sm sm:text-base md:text-lg focus:outline-none placeholder:text-neutral-400"
        />

        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="text-neutral-400 hover:text-neutral-600 transition-colors shrink-0"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        <div className="w-px h-5 sm:h-6 bg-neutral-200 shrink-0" />

        <div className="relative group shrink-0">
          <button
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, {
                scale: 1.15,
                rotation: 10,
                duration: 0.25,
                ease: "back.out(2)",
              })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, {
                scale: 1,
                rotation: 0,
                duration: 0.25,
                ease: "back.out(2)",
              })
            }
          >
            <FaSmileBeam className="text-4xl sm:text-5xl text-yellow-300 bg-black rounded-full" />
          </button>
          <div className="absolute top-full group-hover:block hidden right-0 mt-1 px-2 py-1 text-xs sm:text-sm bg-black rounded-xl text-white whitespace-nowrap">
            Search
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqHeader;
