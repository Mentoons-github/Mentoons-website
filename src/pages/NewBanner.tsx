import gsap from "gsap";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const workshops = [
  {
    title: "Comic Making",
    image: "/assets/home/banner/new banner/workshops/workshops.png",
    icon: "/assets/home/banner/new banner/icon.png",
    accent: "#fb923c",
    tilt: -2.5,
    description:
      "Make your own comic from scratch. learning basics of comic making",
    link: "/mentoons-workshops",
  },
  {
    title: "Art & Craft",
    icon: "/assets/workshopv2/new/kalakrithi.png",
    image: "/assets/home/banner/new banner/workshops/art.png",
    accent: "#22c55e",
    tilt: 2,
    description:
      "Unleash your imagination with art & craft your own masterpieces",
    link: "/mentoons-workshops?category=KalaKriti",
  },
  {
    title: "Music",
    icon: "/assets/workshopv2/new/Swar2.png",
    image: "/assets/home/banner/new banner/workshops/music.png",
    accent: "#a855f7",
    tilt: -1.5,
    description:
      "Musical adventure exploring rhythm, sing catchy songs & try out different instruments",
    link: "/mentoons-workshops?category=Swar",
  },
  {
    title: "Laughter",
    icon: "/assets/workshopv2/new/hasyaras-04.png",
    image: "/assets/home/banner/new banner/workshops/laughter.png",
    accent: "#ef4444",
    tilt: 2.5,
    description:
      "Giggle challenges, playful movements & stress-busting laughter exercises",
    link: "/mentoons-workshops?category=Hasyaras",
  },
  {
    title: "Story Telling",
    icon: "/assets/workshopv2/new/instant katha-05.png",
    image: "/assets/home/banner/new banner/workshops/story telling.png",
    accent: "#3b82f6",
    tilt: -2,
    description:
      "Bring vibrant characters to life & learn how to spin your own tales",
    link: "/mentoons-workshops?category=Instant%20Katha",
  },
];

const highlights = [
  "For Ages 6-12 Yrs & 13-19 Yrs",
  "Weekend Batches",
  "Certified Programs",
  "Safe & Protective",
];

const clouds = [
  { top: "6%", left: "8%", scale: 1, duration: 48, delay: 0, opacity: 1 },
  {
    top: "22%",
    left: "35%",
    scale: 0.65,
    duration: 62,
    delay: -18,
    opacity: 1,
  },
  { top: "3%", left: "55%", scale: 1.25, duration: 55, delay: -36, opacity: 1 },
  { top: "31%", left: "18%", scale: 0.5, duration: 40, delay: -8, opacity: 1 },
  {
    top: "12%",
    left: "72%",
    scale: 0.85,
    duration: 52,
    delay: -44,
    opacity: 1,
  },
  { top: "26%", left: "42%", scale: 1.1, duration: 58, delay: -27, opacity: 1 },
  { top: "17%", left: "2%", scale: 0.6, duration: 35, delay: -13, opacity: 1 },
];

const stars = [
  { top: "6%", left: "12%", size: 3, duration: 1.2, delay: 0, fill: "#fde047" },
  {
    top: "10%",
    left: "28%",
    size: 2,
    duration: 1.5,
    delay: 0.4,
    fill: "#ffffff",
  },
  {
    top: "4%",
    left: "45%",
    size: 4,
    duration: 1.3,
    delay: 0.8,
    fill: "#fde047",
  },
  {
    top: "15%",
    left: "62%",
    size: 2,
    duration: 1.6,
    delay: 0.2,
    fill: "#ffffff",
  },
  {
    top: "8%",
    left: "78%",
    size: 3,
    duration: 1.1,
    delay: 1.1,
    fill: "#fde047",
  },
  {
    top: "20%",
    left: "90%",
    size: 2,
    duration: 1.4,
    delay: 0.6,
    fill: "#ffffff",
  },
  {
    top: "22%",
    left: "8%",
    size: 2,
    duration: 1.2,
    delay: 1.4,
    fill: "#fde047",
  },
  {
    top: "26%",
    left: "35%",
    size: 3,
    duration: 1.7,
    delay: 0.3,
    fill: "#ffffff",
  },
  {
    top: "18%",
    left: "52%",
    size: 2,
    duration: 1.2,
    delay: 1.7,
    fill: "#fde047",
  },
  {
    top: "12%",
    left: "70%",
    size: 4,
    duration: 1.5,
    delay: 0.9,
    fill: "#ffffff",
  },
  {
    top: "30%",
    left: "20%",
    size: 2,
    duration: 1.3,
    delay: 1.2,
    fill: "#fde047",
  },
  {
    top: "3%",
    left: "58%",
    size: 3,
    duration: 1.4,
    delay: 0.5,
    fill: "#ffffff",
  },
];

const bursts = [
  {
    word: "POW!",
    top: "50px",
    left: "102%",
    size: 80,
    fill: "#fde047",
    rot: -12,
  },
  {
    word: "WOW!",
    top: "-96px",
    left: "56%",
    size: 88,
    fill: "#f9a8d4",
    rot: 8,
  },
  {
    word: "ZAP!",
    top: "-84px",
    left: "88%",
    size: 70,
    fill: "#86efac",
    rot: -6,
  },
];

const taglineWords = [
  { text: "Creative", bg: "#ef4444", rot: -3 },
  { text: "Engaging", bg: "#3b82f6", rot: 2 },
  { text: "Empowering workshops", bg: "#22c55e", rot: -2 },
];

const burstPoints = Array.from({ length: 16 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 16;
  const radius = i % 2 === 0 ? 48 : 33;
  return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
}).join(" ");

const splitToChars = (text: string) =>
  text.split("").map((char) => (char === " " ? "\u00A0" : char));

const splitToWords = (text: string) => text.split(" ");

const ComicCloud = () => (
  <svg
    viewBox="0 0 160 80"
    width="160"
    height="80"
    style={{ overflow: "visible", filter: "drop-shadow(4px 4px 0 #000)" }}
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
    <path
      d="M104 40 C110 36 118 38 120 44"
      fill="none"
      stroke="#000"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.22"
    />
  </svg>
);

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

const NewBanner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const badgeSubRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingLine1Ref = useRef<HTMLSpanElement>(null);
  const headingLine2Ref = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    const ratio = el.scrollLeft / maxScroll;
    const index = Math.round(ratio * (workshops.length - 1));
    setActiveIndex(index);
  };

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[index] as HTMLElement | undefined;
    if (card) {
      el.scrollTo({
        left: card.offsetLeft - el.offsetLeft,
        behavior: "smooth",
      });
    }
    setActiveIndex(index);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { scale: 4, rotate: -40, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.35, ease: "power4.in" },
      )
        .fromTo(
          badgeSubRef.current,
          { scale: 0, rotate: 20, opacity: 0 },
          {
            scale: 1,
            rotate: -3,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(4)",
          },
          "-=0.1",
        )
        .fromTo(
          headingLine1Ref.current?.querySelectorAll(".char") ?? [],
          {
            scale: 3.2,
            y: -50,
            opacity: 0,
            rotate: () => gsap.utils.random(-25, 25),
          },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.22,
            stagger: 0.045,
            ease: "power4.in",
          },
          "-=0.1",
        )
        .to(headingRef.current, {
          x: 7,
          duration: 0.045,
          repeat: 7,
          yoyo: true,
          ease: "none",
        })
        .set(headingRef.current, { x: 0 })
        .fromTo(
          headingLine2Ref.current?.querySelectorAll(".word") ?? [],
          { scale: 0, rotate: -18, opacity: 0 },
          {
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.09,
            ease: "back.out(3)",
          },
          "-=0.25",
        )
        .fromTo(
          taglineRef.current,
          { scale: 0, rotate: 6, opacity: 0 },
          {
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.45,
            ease: "back.out(3)",
          },
          "-=0.15",
        )
        .fromTo(
          taglineRef.current?.querySelectorAll(".tagline-word") ?? [],
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.07,
            ease: "back.out(3)",
          },
          "-=0.3",
        )
        .fromTo(
          descriptionRef.current,
          { x: -80, rotate: -4, opacity: 0 },
          {
            x: 0,
            rotate: 1,
            opacity: 1,
            duration: 0.45,
            ease: "back.out(1.8)",
          },
          "-=0.15",
        )
        .fromTo(
          buttonRef.current,
          { scale: 0, rotate: -20, opacity: 0 },
          {
            scale: 1,
            rotate: -2,
            opacity: 1,
            duration: 0.45,
            ease: "back.out(3)",
          },
          "-=0.2",
        )
        .fromTo(
          cardsRef.current?.children ?? [],
          {
            y: -90,
            scale: 2,
            rotate: () => gsap.utils.random(-12, 12),
            opacity: 0,
          },
          {
            y: 0,
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.13,
            ease: "power4.in",
          },
          "-=0.3",
        )
        .fromTo(
          highlightsRef.current?.children ?? [],
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.35,
            stagger: 0.08,
            ease: "back.out(2)",
          },
          "-=0.2",
        );

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) return;

      const loopStart = tl.duration() + 0.3;

      if (rocketRef.current) {
        gsap.to(rocketRef.current, {
          y: -12,
          rotate: 10,
          duration: 0.5,
          ease: "steps(3)",
          repeat: -1,
          yoyo: true,
          delay: loopStart,
        });
      }

      if (badgeSubRef.current) {
        gsap.to(badgeSubRef.current, {
          rotate: 3,
          scale: 1.07,
          duration: 0.22,
          ease: "steps(1)",
          repeat: -1,
          yoyo: true,
          repeatDelay: 0.35,
          delay: loopStart,
        });
      }

      const headingChars = headingLine1Ref.current?.querySelectorAll(".char");
      if (headingChars && headingChars.length) {
        gsap.set(headingChars, { transformOrigin: "50% 100%" });
        const hop = gsap.timeline({
          repeat: -1,
          repeatDelay: 3,
          delay: loopStart,
        });
        hop
          .to(headingChars, {
            y: -22,
            scaleX: 0.88,
            scaleY: 1.22,
            rotate: -7,
            color: "#fde047",
            duration: 0.18,
            ease: "power2.out",
            stagger: 0.06,
          })
          .to(
            headingChars,
            {
              y: 0,
              scaleX: 1.18,
              scaleY: 0.78,
              rotate: 0,
              duration: 0.12,
              ease: "power2.in",
              stagger: 0.06,
            },
            0.18,
          )
          .to(
            headingChars,
            {
              scaleX: 1,
              scaleY: 1,
              color: "#f97316",
              duration: 0.35,
              ease: "elastic.out(1,0.35)",
              stagger: 0.06,
            },
            0.3,
          );
      }

      const burstEls = headingLine1Ref.current?.querySelectorAll(".sparkle");
      if (burstEls && burstEls.length) {
        gsap.set(burstEls, { scale: 0, opacity: 0 });
        const pop = gsap.timeline({
          repeat: -1,
          repeatDelay: 2,
          delay: loopStart + 0.3,
        });
        pop
          .to(burstEls, {
            scale: 1,
            opacity: 1,
            duration: 0.22,
            ease: "back.out(5)",
            stagger: 0.28,
          })
          .to(
            burstEls,
            {
              rotate: 6,
              duration: 0.08,
              repeat: 5,
              yoyo: true,
              ease: "none",
            },
            "+=0.05",
          )
          .to(
            burstEls,
            {
              scale: 0,
              opacity: 0,
              rotate: 0,
              duration: 0.15,
              ease: "power3.in",
              stagger: 0.2,
            },
            "+=0.4",
          );
      }

      const line2Words = headingLine2Ref.current?.querySelectorAll(".word");
      if (line2Words && line2Words.length) {
        gsap.set(line2Words, { transformOrigin: "50% 100%" });
        const jelly = gsap.timeline({
          repeat: -1,
          repeatDelay: 3,
          delay: loopStart + 0.8,
        });
        line2Words.forEach((w, i) => {
          jelly
            .to(
              w,
              { scaleX: 1.22, scaleY: 0.72, duration: 0.12, ease: "power1.in" },
              i * 0.26,
            )
            .to(
              w,
              {
                scaleX: 0.86,
                scaleY: 1.28,
                y: -20,
                rotate: i % 2 === 0 ? -6 : 6,
                duration: 0.2,
                ease: "power2.out",
              },
              i * 0.26 + 0.12,
            )
            .to(
              w,
              {
                scaleX: 1,
                scaleY: 1,
                y: 0,
                rotate: 0,
                duration: 0.45,
                ease: "elastic.out(1,0.4)",
              },
              i * 0.26 + 0.32,
            );
        });
      }

      const taglineWordsEls =
        taglineRef.current?.querySelectorAll(".tagline-word");
      if (taglineWordsEls && taglineWordsEls.length) {
        const spot = gsap.timeline({
          repeat: -1,
          repeatDelay: 2,
          delay: loopStart + 1.4,
        });
        taglineWordsEls.forEach((w, i) => {
          spot
            .to(
              w,
              {
                scale: 1.18,
                y: -6,
                backgroundColor: "#fde047",
                color: "#000",
                textShadow: "none",
                duration: 0.16,
                ease: "back.out(4)",
              },
              i * 0.3,
            )
            .to(
              w,
              {
                scale: 1,
                y: 0,
                backgroundColor: "",
                color: "",
                textShadow: "",
                duration: 0.25,
                ease: "power2.inOut",
              },
              i * 0.3 + 0.3,
            );
        });
      }

      if (buttonRef.current) {
        const shake = gsap.timeline({
          repeat: -1,
          repeatDelay: 1.6,
          delay: loopStart,
        });
        shake
          .to(buttonRef.current, {
            scale: 1.1,
            rotate: -5,
            duration: 0.1,
            ease: "power2.out",
          })
          .to(buttonRef.current, {
            rotate: 4,
            duration: 0.07,
            repeat: 5,
            yoyo: true,
            ease: "none",
          })
          .to(buttonRef.current, {
            scale: 1,
            rotate: -2,
            duration: 0.25,
            ease: "elastic.out(1,0.4)",
          });
      }

      const highlightSpans = highlightsRef.current?.querySelectorAll(
        "span.highlight-text",
      );
      if (highlightSpans && highlightSpans.length) {
        const glow = gsap.timeline({
          repeat: -1,
          repeatDelay: 2.5,
          delay: loopStart + 2,
        });
        highlightSpans.forEach((s, i) => {
          glow
            .to(
              s,
              {
                scale: 1.12,
                color: "#ea580c",
                rotate: -2,
                duration: 0.2,
                ease: "back.out(4)",
              },
              i * 0.5,
            )
            .to(
              s,
              {
                scale: 1,
                color: "",
                rotate: 0,
                duration: 0.3,
                ease: "power2.inOut",
              },
              i * 0.5 + 0.4,
            );
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex flex-col lg:flex-row items-start justify-start p-4 sm:p-5 bg-gradient-to-b from-sky-400 via-sky-300 to-white/20 min-h-screen lg:min-h-0 lg:h-[calc(100vh-165px)] overflow-x-hidden overflow-y-auto lg:overflow-hidden"
    >
      <style>{`
        @keyframes drift-cloud {
          0%   { transform: scale(var(--cloud-scale)) translateX(0); }
          100% { transform: scale(var(--cloud-scale)) translateX(110vw); }
        }
        @keyframes pop-star {
          0%   { transform: scale(0.6) rotate(-14deg); opacity: 0.5; }
          50%  { transform: scale(1.25) rotate(14deg); opacity: 1; }
          100% { transform: scale(0.6) rotate(-14deg); opacity: 0.5; }
        }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .char, .word { display: inline-block; will-change: transform; }
        .sparkle { position: absolute; pointer-events: none; line-height: 1; z-index: 5; }

        .comic-font {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          letter-spacing: 0.06em;
        }
        .comic-body {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          letter-spacing: 0.05em;
          line-height: 1.25;
        }
        .comic-heading {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          line-height: 0.92;
          letter-spacing: 0.05em;
          -webkit-text-stroke: 3px #000;
          paint-order: stroke fill;
          text-shadow: 4px 4px 0 #000;
        }
        .comic-heading-sub {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          line-height: 1;
          letter-spacing: 0.06em;
          color: #fff;
          -webkit-text-stroke: 2.5px #000;
          paint-order: stroke fill;
          text-shadow: 3px 3px 0 #000;
        }

        .sky-halftone {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.45) 2px, transparent 2.5px);
          background-size: 14px 14px;
          -webkit-mask-image: linear-gradient(180deg, #000 0%, transparent 70%);
          mask-image: linear-gradient(180deg, #000 0%, transparent 70%);
        }

        .comic-badge {
          background: #ef4444;
          color: #fff;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          border-radius: 10px;
          transform: rotate(-3deg) skewX(-6deg);
        }
        .comic-pill {
          background: #fde047;
          color: #000;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 10px;
          transform: rotate(-1deg);
        }
        .comic-chip-font {
          font-family: var(--font-comic-chip) !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }
        .comic-chip {
          background: var(--chip);
          color: #fff;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 6px;
          padding: 2px 10px;
          line-height: 1.2;
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          transform: rotate(var(--rot, 0deg)) skewX(-8deg);
        }
        .comic-caption {
          background: #fde047;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 4px;
          padding: 4px 12px;
          transform: rotate(-1.5deg);
        }
        .comic-narration {
          background: #fff;
          color: #000;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 12px;
          padding: 8px 14px;
          transform: rotate(1deg);
        }
        .comic-cta {
          background: #f97316;
          color: #fff;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 10px;
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          transition: box-shadow 0.1s ease, background 0.1s ease;
        }
        .comic-cta:hover { background: #fb923c; }
        .comic-cta:active { box-shadow: 0 0 0 #000; }
        .comic-bar {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 5px 5px 0 #000;
        }

        .comic-card {
          background: #fffdf5;
          border: 3px solid #000;
          border-radius: 6px;
          box-shadow: 5px 5px 0 #000;
          transform: rotate(var(--tilt, 0deg));
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease;
        }
        .group:hover .comic-card,
        .group:focus-within .comic-card {
          transform: rotate(0deg) translate(-3px, -3px) scale(1.04);
          box-shadow: 9px 9px 0 #000;
        }
        .comic-title {
          background: var(--accent);
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          color: #fff;
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          transform: skewX(-8deg);
        }
        .halftone {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(rgba(0,0,0,0.28) 1.2px, transparent 1.6px);
          background-size: 7px 7px;
          -webkit-mask-image: linear-gradient(135deg, transparent 45%, #000 100%);
          mask-image: linear-gradient(135deg, transparent 45%, #000 100%);
          mix-blend-mode: multiply;
        }
        .comic-bubble {
          background: #fde047;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 14px;
        }
        .comic-bubble::before,
        .comic-bubble::after {
          content: "";
          position: absolute;
          border-style: solid;
          border-color: transparent;
        }
        .comic-bubble::before {
          top: -17px;
          left: 22px;
          border-width: 0 11px 17px 11px;
          border-bottom-color: #000;
        }
        .comic-bubble::after {
          top: -11px;
          left: 25px;
          border-width: 0 8px 13px 8px;
          border-bottom-color: #fde047;
        }
        .comic-btn {
          background: #ef4444;
          color: #fff;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          text-shadow: 1px 1px 0 #000;
          transform: rotate(-3deg);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        .comic-btn:hover { background: #dc2626; transform: rotate(-3deg) scale(1.08); }
        .comic-btn:active { transform: rotate(-3deg) translate(3px, 3px); box-shadow: 0 0 0 #000; }
      `}</style>

      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="sky-halftone" />

        {clouds.map((cloud, index) => (
          <div
            key={`cloud-${index}`}
            className="absolute"
            style={{
              top: cloud.top,
              left: cloud.left,
              opacity: cloud.opacity,
              ["--cloud-scale" as string]: cloud.scale,
              animation: `drift-cloud ${cloud.duration}s linear infinite`,
              animationDelay: `${cloud.delay}s`,
            }}
          >
            <ComicCloud />
          </div>
        ))}

        {stars.map((star, index) => (
          <div
            key={`star-${index}`}
            className="absolute"
            style={{
              top: star.top,
              left: star.left,
              animation: `pop-star ${star.duration}s steps(3) infinite`,
              animationDelay: `${star.delay}s`,
            }}
          >
            <ComicStar size={star.size * 5} fill={star.fill} />
          </div>
        ))}
      </div>

      <div className="w-full lg:w-[400px] xl:w-[520px] lg:flex-shrink-0 flex flex-col items-start justify-start z-10">
        <div className="flex items-center justify-start">
          <div
            ref={rocketRef}
            className="p-3 rounded-full text-3xl sm:text-4xl font-bold text-white"
            style={{ filter: "drop-shadow(3px 3px 0 #000)" }}
          >
            <div ref={badgeRef}>🚀</div>
          </div>
          <div
            ref={badgeSubRef}
            className="comic-badge comic-font px-4 py-1 text-lg sm:text-xl uppercase"
          >
            New Launch
          </div>
        </div>
        <h1
          ref={headingRef}
          className="text-3xl sm:text-4xl lg:text-5xl leading-none mt-2"
          style={{ perspective: "600px" }}
        >
          <span
            ref={headingLine1Ref}
            className="comic-heading relative text-orange-500 text-5xl sm:text-6xl lg:text-4xl xl:text-5xl inline-block"
          >
            {splitToWords("Crafted and designed").map((word, wIndex) => (
              <span
                key={wIndex}
                className="inline-block whitespace-nowrap mr-3"
              >
                {splitToChars(word).map((char, index) => (
                  <span key={index} className="char">
                    {char}
                  </span>
                ))}
              </span>
            ))}
            {bursts.map((b, i) => (
              <span
                key={`burst-${i}`}
                className="sparkle hidden xl:block"
                style={{
                  top: b.top,
                  left: b.left,
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  opacity: 0,
                }}
                aria-hidden="true"
              >
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `rotate(${b.rot}deg)`,
                  }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    width="100%"
                    height="100%"
                    style={{
                      overflow: "visible",
                      filter: "drop-shadow(3px 3px 0 #000)",
                    }}
                  >
                    <polygon
                      points={burstPoints}
                      fill={b.fill}
                      stroke="#000"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="comic-font"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: `${b.size * 0.26}px`,
                      color: "#000",
                      WebkitTextStroke: "0",
                      textShadow: "none",
                    }}
                  >
                    {b.word}
                  </span>
                </span>
              </span>
            ))}
          </span>{" "}
          <br />
          <span
            ref={headingLine2Ref}
            className="comic-heading-sub inline-block text-3xl sm:text-4xl lg:text-2xl xl:text-3xl mt-1"
          >
            {splitToWords("especially for Gen A to Z").map((word, index) => (
              <span key={index} className="word mr-2">
                {word}
              </span>
            ))}
          </span>
        </h1>
        <div
          ref={taglineRef}
          className="flex flex-wrap xl:flex-nowrap items-center justify-start gap-y-3 mt-5"
        >
          {taglineWords.map((word, index) => (
            <span key={index} className="inline-flex items-center">
              {index > 0 && (
                <span className="mx-1.5 inline-block">
                  <ComicStar size={18} fill="#fde047" />
                </span>
              )}
              <span
                className="tagline-word comic-chip comic-chip-font inline-block whitespace-nowrap text-sm sm:text-base uppercase"
                style={
                  {
                    ["--chip" as string]: word.bg,
                    ["--rot" as string]: `${word.rot}deg`,
                  } as CSSProperties
                }
              >
                {word.text}
              </span>
            </span>
          ))}
        </div>
        <p
          ref={descriptionRef}
          className="comic-narration comic-body text-base sm:text-lg mt-4"
        >
          Kick start your learning journey with our exciting hands-on workshops
        </p>

        <button
          ref={buttonRef}
          onClick={() => {
            window.location.href = "/mentoons-workshops";
          }}
          className="comic-cta comic-font mt-4 px-6 py-1.5 text-xl uppercase"
        >
          I am interested
        </button>
      </div>

      <div className="w-full flex-1 min-w-0 flex flex-col items-start justify-start relative z-10">
        <div className="w-full flex justify-center mt-2">
          <span className="comic-pill comic-font text-base sm:text-lg px-5 py-1 text-center uppercase">
            Workshops for Developing Brains
          </span>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full flex flex-nowrap overflow-x-auto xl:overflow-visible snap-x snap-mandatory xl:snap-none no-scrollbar items-start justify-start xl:justify-center gap-5 xl:gap-4 mt-4 px-3 pt-2 pb-8 xl:pr-16"
        >
          <div ref={cardsRef} className="contents">
            {workshops.map((workshop, index) => (
              <div
                key={index}
                className="group relative w-32 sm:w-36 flex-shrink-0 snap-center xl:w-auto xl:flex-1 xl:min-w-0 xl:max-w-[10rem] xl:flex-shrink hover:z-40 focus-within:z-40"
              >
                <div
                  className="comic-card relative p-2 pb-3"
                  style={
                    {
                      ["--tilt" as string]: `${workshop.tilt}deg`,
                      ["--accent" as string]: workshop.accent,
                    } as CSSProperties
                  }
                >
                  <span className="comic-font absolute -top-3 -left-3 z-20 w-7 h-7 rounded-full bg-yellow-300 border-[3px] border-black flex items-center justify-center text-sm leading-none">
                    {index + 1}
                  </span>

                  <h2 className="comic-title comic-font text-sm sm:text-base text-center truncate mb-2 px-2 py-0.5 uppercase">
                    {workshop.title}
                  </h2>

                  <div
                    onClick={() => {
                      window.location.href = workshop.link;
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Go to ${workshop.title}`}
                    className="relative w-full h-32 sm:h-40 xl:h-auto xl:aspect-[4/5] bg-gray-50 border-[3px] border-black rounded-sm overflow-hidden cursor-pointer xl:cursor-default"
                  >
                    <img
                      src={workshop.image}
                      alt={workshop.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="halftone" />
                  </div>

                  <div className="absolute -right-3 -bottom-3 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white border-[3px] border-black shadow-[2px_2px_0_#000] overflow-hidden xl:group-hover:opacity-0 transition-opacity duration-200">
                    <img
                      src={workshop.icon}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="hidden xl:block absolute top-full left-0 right-0 pt-4 z-30 opacity-0 pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 transition-all duration-200">
                    <div className="comic-bubble relative flex flex-col items-center gap-2 px-3 py-3">
                      <p className="comic-body text-sm text-black text-center">
                        {workshop.description}
                      </p>
                      <button
                        onClick={() => {
                          window.location.href = workshop.link;
                        }}
                        className="comic-btn comic-font px-4 py-1 text-sm uppercase"
                      >
                        Explore!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex xl:hidden w-full items-center justify-center gap-2 mt-2">
          {workshops.map((workshop, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to ${workshop.title}`}
              className={`h-2.5 rounded-full border-2 border-black transition-all duration-300 ${
                activeIndex === index ? "w-6 bg-yellow-300" : "w-2.5 bg-white"
              }`}
            />
          ))}
        </div>

        <div className="w-full flex justify-center mt-4 xl:-mt-[44px]">
          <img
            src="/assets/LandingPage/psyco.png"
            alt="Psychologist Verified"
            className="w-48 h-48 sm:w-64 sm:h-64 lg:w-48 lg:h-48 xl:w-44 xl:h-44 object-contain"
          />
        </div>
      </div>

      <div className="hidden lg:relative mt-6 z-30 w-full sm:w-[92%] max-w-6xl mx-auto">
        <div
          ref={highlightsRef}
          className="comic-bar flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-10 rounded-2xl sm:rounded-full px-4 sm:px-8 py-3 sm:py-4"
        >
          {highlights.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 md:gap-6 lg:gap-10"
            >
              <span className="highlight-text comic-font inline-block text-green-800 text-sm sm:text-base md:text-lg whitespace-nowrap">
                {item}
              </span>
              {index < highlights.length - 1 && (
                <span className="h-6 border-l-[3px] border-dotted border-black" />
              )}
            </div>
          ))}
        </div>
      </div>

      <img
        src="/assets/home/banner/new banner/workshops/banner bg.png"
        alt="Banner Background"
        className="hidden lg:block absolute bottom-0 left-0 w-full h-auto object-contain z-0 pointer-events-none"
      />

      <img
        src="/assets/home/banner/new banner/workshops/boy.png"
        alt="Boy"
        className="hidden xl:block absolute bottom-28 right-2 w-[150px] h-auto object-contain z-0 pointer-events-none"
      />
    </div>
  );
};

export default NewBanner;
