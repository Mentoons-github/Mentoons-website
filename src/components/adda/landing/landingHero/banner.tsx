import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import gsap from "gsap";

type SlideShape = "circle" | "triangle" | "star";

interface Slide {
  id: number;
  tag: string;
  headline: string;
  sub: string;
  cta: string;
  accent: string;
  bg: string;
  shape: SlideShape;
  emoji: string;
  badges: string[];
  highlightWord: string;
}

const slides: Slide[] = [
  {
    id: 1,
    tag: "⚡ LIMITED OFFER",
    headline: "3 Day Trial",
    highlightWord: "Trial",
    sub: "Try everything free for 3 days — full access with zero hassle.",
    cta: "Claim Your Trial",
    accent: "#a8ff78",
    bg: "from-[#071a0e] via-[#0f2e1a] to-[#1a4a2e]",
    shape: "circle",
    emoji: "🎯",
    badges: ["✓ Full Access", "✓ Zero Risk"],
  },
  {
    id: 2,
    tag: "🎓 WORKSHOPS",
    headline: "Workshops",
    highlightWord: "Workshops",
    sub: "Workshops for ages 6–12 with hands-on play-based learning, and ages 13–19 with advanced, expert-led sessions.",
    cta: "Explore Workshops",
    accent: "#f9c74f",
    bg: "from-[#0a0a1e] via-[#1a1a2e] to-[#16213e]",
    shape: "triangle",
    emoji: "🧠",
    badges: ["Ages 6–12", "Ages 13–19", "Expert Led", "Live Sessions"],
  },
  {
    id: 3,
    tag: "🛍️ PRODUCTS",
    headline: "Products",
    highlightWord: "Products",
    sub: "Products built for kids, teens, adults and parents — designed around how each age group thinks, plays, and grows.",
    cta: "Shop by Age",
    accent: "#ff9f43",
    bg: "from-[#1a0505] via-[#2e0f0f] to-[#4a1a1a]",
    shape: "star",
    emoji: "🚀",
    badges: ["Kids", "Teens", "Adults", "Parents"],
  },
];

interface ShapeDecorProps {
  shape: SlideShape;
  accent: string;
  shapeRef: React.RefObject<HTMLDivElement>;
}

const ShapeDecor = ({ shape, accent, shapeRef }: ShapeDecorProps) => {
  const base = "absolute pointer-events-none opacity-90";

  if (shape === "circle")
    return (
      <div
        ref={shapeRef}
        className={`${base} right-4 sm:right-8 top-4 sm:top-8`}
        style={{ filter: `drop-shadow(0 0 40px ${accent}99)` }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 220 220"
          className="w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52"
        >
          <circle
            cx="110"
            cy="110"
            r="100"
            fill="none"
            stroke={accent}
            strokeWidth="3"
          />
          <circle cx="110" cy="110" r="70" fill={accent} fillOpacity="0.07" />
          <circle cx="110" cy="110" r="40" fill={accent} fillOpacity="0.12" />
          <circle cx="65" cy="65" r="12" fill={accent} fillOpacity="0.5" />
          <circle cx="155" cy="155" r="8" fill={accent} fillOpacity="0.6" />
          <circle cx="160" cy="70" r="5" fill={accent} fillOpacity="0.8" />
          <circle cx="55" cy="150" r="6" fill={accent} fillOpacity="0.4" />
        </svg>
      </div>
    );

  if (shape === "triangle")
    return (
      <div
        ref={shapeRef}
        className={`${base} right-4 sm:right-8 top-4 sm:top-8`}
        style={{ filter: `drop-shadow(0 0 40px ${accent}99)` }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 220 220"
          className="w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52"
        >
          <polygon
            points="110,12 208,198 12,198"
            fill="none"
            stroke={accent}
            strokeWidth="3"
          />
          <polygon
            points="110,55 170,162 50,162"
            fill={accent}
            fillOpacity="0.12"
          />
          <polygon
            points="110,90 140,145 80,145"
            fill={accent}
            fillOpacity="0.18"
          />
          <circle cx="110" cy="12" r="7" fill={accent} fillOpacity="0.9" />
          <circle cx="208" cy="198" r="7" fill={accent} fillOpacity="0.9" />
          <circle cx="12" cy="198" r="7" fill={accent} fillOpacity="0.9" />
        </svg>
      </div>
    );

  return (
    <div
      ref={shapeRef}
      className={`${base} right-4 sm:right-8 top-4 sm:top-8`}
      style={{ filter: `drop-shadow(0 0 40px ${accent}99)` }}
    >
      <svg
        width="180"
        height="180"
        viewBox="0 0 220 220"
        className="w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52"
      >
        <polygon
          points="110,10 130,80 210,80 150,125 170,200 110,155 50,200 70,125 10,80 90,80"
          fill="none"
          stroke={accent}
          strokeWidth="3"
        />
        <polygon
          points="110,45 124,88 168,88 133,112 146,155 110,132 74,155 87,112 52,88 96,88"
          fill={accent}
          fillOpacity="0.15"
        />
        <polygon
          points="110,75 118,98 142,98 123,112 130,136 110,122 90,136 97,112 78,98 102,98"
          fill={accent}
          fillOpacity="0.25"
        />
      </svg>
    </div>
  );
};

const LandingBanner = () => {
  const [current, setCurrent] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const animateIn = () => {
    const tl = gsap.timeline();
    tl.fromTo(
      tagRef.current,
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "back.out(2.5)" },
    )
      .fromTo(
        headlineRef.current,
        { y: 50, opacity: 0, skewX: -6 },
        { y: 0, opacity: 1, skewX: 0, duration: 0.55, ease: "expo.out" },
        "-=0.15",
      )
      .fromTo(
        subRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
        "-=0.3",
      )
      .fromTo(
        badgesRef.current ? Array.from(badgesRef.current.children) : [],
        { scale: 0.6, opacity: 0, y: 10 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.07,
          ease: "back.out(2)",
        },
        "-=0.25",
      )
      .fromTo(
        ctaRef.current,
        { x: -24, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.2",
      )
      .fromTo(
        shapeRef.current,
        { scale: 0.3, opacity: 0, rotation: -45 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.55)",
        },
        "-=0.55",
      )
      .fromTo(
        emojiRef.current,
        { scale: 0, opacity: 0, rotation: -20 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.45,
          ease: "back.out(3)",
        },
        "-=0.45",
      );
  };

  const animateOut = (dir: "next" | "prev", cb: () => void) => {
    const x = dir === "next" ? -80 : 80;
    gsap.to(
      [
        tagRef.current,
        headlineRef.current,
        subRef.current,
        badgesRef.current,
        ctaRef.current,
      ],
      {
        x,
        opacity: 0,
        duration: 0.28,
        stagger: 0.03,
        ease: "power3.in",
        onComplete: cb,
      },
    );
    gsap.to([shapeRef.current, emojiRef.current], {
      scale: 0.4,
      opacity: 0,
      duration: 0.28,
      ease: "power2.in",
    });
  };

  const go = (dir: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);
    animateOut(dir, () => {
      gsap.set(
        [
          tagRef.current,
          headlineRef.current,
          subRef.current,
          badgesRef.current,
          ctaRef.current,
          shapeRef.current,
          emojiRef.current,
        ],
        { x: 0 },
      );
      setCurrent((prev) =>
        dir === "next"
          ? (prev + 1) % slides.length
          : (prev - 1 + slides.length) % slides.length,
      );
      setIsAnimating(false);
    });
  };

  useEffect(() => {
    animateIn();
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.7,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [current]);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "expo.out" },
    );

    const floatShape = gsap.to(shapeRef.current, {
      y: -20,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    const floatEmoji = gsap.to(emojiRef.current, {
      y: -12,
      rotation: 5,
      duration: 2.0,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.5,
    });

    const autoPlay = setInterval(() => go("next"), 8000);

    return () => {
      floatShape.kill();
      floatEmoji.kill();
      clearInterval(autoPlay);
    };
  }, []);

  const slide = slides[current];

  const headlineParts = slide.headline.split(slide.highlightWord);

  return (
    <section
      className="relative w-full select-none"
      style={{ minHeight: 340, height: "clamp(340px, 50vw, 520px)" }}
    >
      <button
        onClick={() => go("prev")}
        aria-label="Previous slide"
        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full border border-white/40 hover:scale-110 transition-all duration-200 group"
        style={{
          width: "clamp(36px,5vw,52px)",
          height: "clamp(36px,5vw,52px)",
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          boxShadow: `0 4px 20px ${slide.accent}44`,
        }}
      >
        <FaChevronLeft
          className="transition-colors"
          style={{ fontSize: "clamp(12px,1.5vw,16px)", color: "#fff" }}
        />
      </button>
      <button
        onClick={() => go("next")}
        aria-label="Next slide"
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full border border-white/40 hover:scale-110 transition-all duration-200 group"
        style={{
          width: "clamp(36px,5vw,52px)",
          height: "clamp(36px,5vw,52px)",
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          boxShadow: `0 4px 20px ${slide.accent}44`,
        }}
      >
        <FaChevronRight
          className="transition-colors"
          style={{ fontSize: "clamp(12px,1.5vw,16px)", color: "#fff" }}
        />
      </button>

      <div
        ref={cardRef}
        className={`mx-10 sm:mx-12 md:mx-14 rounded-2xl sm:rounded-3xl h-full bg-gradient-to-br ${slide.bg} overflow-hidden relative mt-4`}
        style={{ boxShadow: `-6px 6px 0px #000, 0 0 60px ${slide.accent}22` }}
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div
          ref={glowRef}
          className="absolute inset-0 opacity-0 transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at 75% 50%, ${slide.accent}22 0%, transparent 65%)`,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)",
          }}
        />

        <ShapeDecor
          shape={slide.shape}
          accent={slide.accent}
          shapeRef={shapeRef}
        />

        <div
          ref={emojiRef}
          className="absolute hidden sm:block"
          style={{
            right: "clamp(160px, 22vw, 260px)",
            top: "clamp(16px, 4vw, 48px)",
            fontSize: "clamp(32px, 5vw, 64px)",
            filter: `drop-shadow(0 0 20px ${slide.accent}bb)`,
          }}
        >
          {slide.emoji}
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-8 md:px-12 max-w-[58%] sm:max-w-[60%]">
          <div
            ref={tagRef}
            className="mb-2 sm:mb-4 inline-flex items-center gap-2"
          >
            <span
              className="font-black tracking-widest px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase"
              style={{
                background: slide.accent,
                color: "#111",
                fontSize: "clamp(8px, 1.2vw, 11px)",
                letterSpacing: "0.18em",
              }}
            >
              {slide.tag}
            </span>
          </div>

          <h2
            ref={headlineRef}
            className="font-black text-white leading-none mb-2 sm:mb-4"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(22px, 4.5vw, 56px)",
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            {headlineParts[0]}
            <span
              style={{
                color: slide.accent,
                textShadow: `0 0 30px ${slide.accent}88`,
              }}
            >
              {slide.highlightWord}
            </span>
            {headlineParts[1]}
          </h2>

          <p
            ref={subRef}
            className="text-white/65 mb-3 sm:mb-6 leading-relaxed max-w-xs hidden sm:block"
            style={{ fontSize: "clamp(11px, 1.4vw, 15px)" }}
          >
            {slide.sub}
          </p>

          <div
            ref={badgesRef}
            className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-7 flex-wrap"
          >
            {slide.badges.map((b) => (
              <span
                key={b}
                className="font-bold rounded-full border"
                style={{
                  borderColor: `${slide.accent}55`,
                  color: slide.accent,
                  background: `${slide.accent}14`,
                  fontSize: "clamp(9px, 1.1vw, 12px)",
                  padding: "2px 10px",
                }}
              >
                {b}
              </span>
            ))}
          </div>

          <button
            ref={ctaRef}
            className="inline-flex items-center gap-2 font-black rounded-full w-fit transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            style={{
              background: slide.accent,
              color: "#111",
              boxShadow: `0 6px 28px ${slide.accent}66`,
              fontSize: "clamp(10px, 1.4vw, 14px)",
              padding: "clamp(8px, 1.2vw, 12px) clamp(14px, 2vw, 24px)",
            }}
          >
            {slide.cta}
            <span
              className="inline-flex items-center justify-center rounded-full bg-black/20 font-black"
              style={{
                width: "clamp(18px,2vw,24px)",
                height: "clamp(18px,2vw,24px)",
                fontSize: "clamp(10px,1.2vw,13px)",
              }}
            >
              →
            </span>
          </button>
        </div>

        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!isAnimating && i !== current)
                  go(i > current ? "next" : "prev");
              }}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width:
                  i === current
                    ? "clamp(20px, 3vw, 28px)"
                    : "clamp(6px, 1vw, 8px)",
                height: "clamp(6px, 1vw, 8px)",
                background:
                  i === current ? slide.accent : "rgba(255,255,255,0.25)",
                boxShadow: i === current ? `0 0 8px ${slide.accent}88` : "none",
              }}
            />
          ))}
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-30"
          style={{
            background: `linear-gradient(90deg, transparent, ${slide.accent}, transparent)`,
          }}
        />
      </div>
    </section>
  );
};

export default LandingBanner;
