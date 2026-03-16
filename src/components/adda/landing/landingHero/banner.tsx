import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import gsap from "gsap";
import { SLIDES } from "@/constant/adda/Landing/slide";
import ShapeDecor from "@/components/Home/newVersion/shapeDecor";
import { NavLink } from "react-router-dom";

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
          ? (prev + 1) % SLIDES.length
          : (prev - 1 + SLIDES.length) % SLIDES.length,
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

    const autoPlay = setInterval(() => go("next"), 15000);

    return () => {
      floatShape.kill();
      floatEmoji.kill();
      clearInterval(autoPlay);
    };
  }, []);

  const slide = SLIDES[current];
  const headlineParts = slide.headline.split(slide.highlightWord);

  const navBtnStyle = {
    width: "clamp(32px, 4.5vw, 48px)",
    height: "clamp(32px, 4.5vw, 48px)",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(10px)",
    boxShadow: `0 4px 20px ${slide.accent}44`,
  };

  return (
    <section
      className="relative w-full select-none px-0"
      style={{ minHeight: 280, height: "clamp(280px, 46vw, 500px)" }}
    >
      <button
        onClick={() => go("prev")}
        aria-label="Previous slide"
        className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full border border-white/30 hover:scale-110 hover:border-white/60 transition-all duration-200"
        style={navBtnStyle}
      >
        <FaChevronLeft
          style={{ fontSize: "clamp(11px, 1.3vw, 15px)", color: "#fff" }}
        />
      </button>

      <button
        onClick={() => go("next")}
        aria-label="Next slide"
        className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full border border-white/30 hover:scale-110 hover:border-white/60 transition-all duration-200"
        style={navBtnStyle}
      >
        <FaChevronRight
          style={{ fontSize: "clamp(11px, 1.3vw, 15px)", color: "#fff" }}
        />
      </button>

      <div
        ref={cardRef}
        className={`mx-8 sm:mx-11 md:mx-13 rounded-2xl sm:rounded-3xl h-full bg-gradient-to-br ${slide.bg} overflow-hidden relative mt-3 sm:mt-4`}
        style={{ boxShadow: `-5px 5px 0px #000, 0 0 60px ${slide.accent}1a` }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <div
          ref={glowRef}
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 78% 50%, ${slide.accent}1e 0%, transparent 65%)`,
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 55%)",
          }}
        />

        <ShapeDecor
          shape={slide.shape}
          accent={slide.accent}
          shapeRef={shapeRef}
        />

        <div
          ref={emojiRef}
          className="absolute hidden sm:block pointer-events-none"
          style={{
            right: "clamp(130px, 18vw, 230px)",
            top: "clamp(12px, 3.5vw, 44px)",
            fontSize: "clamp(28px, 4.5vw, 58px)",
            filter: `drop-shadow(0 0 18px ${slide.accent}bb)`,
          }}
        >
          {slide.emoji}
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-[62%] sm:max-w-[58%] md:max-w-[55%]">
          <div
            ref={tagRef}
            className="mb-2 sm:mb-3 inline-flex items-center gap-2"
          >
            <span
              className="font-black tracking-widest rounded-full uppercase whitespace-nowrap"
              style={{
                background: slide.accent,
                color: "#111",
                fontSize: "clamp(7px, 1.1vw, 11px)",
                letterSpacing: "0.16em",
                padding: "clamp(3px,0.5vw,5px) clamp(8px,1.2vw,14px)",
              }}
            >
              {slide.tag}
            </span>
          </div>

          <h2
            ref={headlineRef}
            className="font-black text-white leading-[1.05] mb-2 sm:mb-3 md:mb-4"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(18px, 3.8vw, 52px)",
              textShadow: "0 3px 20px rgba(0,0,0,0.55)",
            }}
          >
            {headlineParts[0]}
            <span
              style={{
                color: slide.accent,
                textShadow: `0 0 28px ${slide.accent}88`,
              }}
            >
              {slide.highlightWord}
            </span>
            {headlineParts[1]}
          </h2>

          <p
            ref={subRef}
            className="text-white/70 mb-3 sm:mb-5 leading-relaxed hidden sm:block"
            style={{
              fontSize: "clamp(11px, 1.3vw, 14px)",
              maxWidth: "32ch",
            }}
          >
            {slide.sub}
          </p>

          <div
            ref={badgesRef}
            className="flex gap-1 sm:gap-1.5 mb-3 sm:mb-5 flex-wrap"
          >
            {slide.badges.map((b) => (
              <span
                key={b}
                className="font-semibold rounded-full border whitespace-nowrap"
                style={{
                  borderColor: `${slide.accent}55`,
                  color: slide.accent,
                  background: `${slide.accent}14`,
                  fontSize: "clamp(8px, 1vw, 11px)",
                  padding: "clamp(2px,0.3vw,4px) clamp(8px,1vw,12px)",
                }}
              >
                {b}
              </span>
            ))}
          </div>

          <NavLink
            to={slide.link}
            className="inline-flex items-center gap-2 font-black rounded-full w-fit transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95"
            style={{
              background: slide.accent,
              color: "#111",
              boxShadow: `0 5px 24px ${slide.accent}55`,
              fontSize: "clamp(9px, 1.3vw, 13px)",
              padding: "clamp(7px,1vw,11px) clamp(12px,1.8vw,22px)",
            }}
          >
            {slide.cta}
            <span
              className="inline-flex items-center justify-center rounded-full bg-black/20 font-black leading-none"
              style={{
                width: "clamp(16px,1.8vw,22px)",
                height: "clamp(16px,1.8vw,22px)",
                fontSize: "clamp(9px,1.1vw,12px)",
              }}
            >
              →
            </span>
          </NavLink>
        </div>

        <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
          {SLIDES.map((_, i) => (
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
                    ? "clamp(18px, 2.5vw, 26px)"
                    : "clamp(6px, 0.9vw, 8px)",
                height: "clamp(5px, 0.85vw, 7px)",
                background:
                  i === current ? slide.accent : "rgba(255,255,255,0.28)",
                boxShadow: i === current ? `0 0 8px ${slide.accent}88` : "none",
              }}
            />
          ))}
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${slide.accent}66, transparent)`,
          }}
        />
      </div>
    </section>
  );
};

export default LandingBanner;
