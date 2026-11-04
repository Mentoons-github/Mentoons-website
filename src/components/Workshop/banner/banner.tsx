import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./banner.css";

gsap.registerPlugin(ScrollTrigger);

/* Height of your fixed/sticky navbar in px. Change this if the pinned
   workshops section sits too high or too low. */
const NAV_OFFSET = 80;

interface Slide {
  src: string;
  alt: string;
  name: string;
  blurb: string;
  skills: string[];
  color: string;
  radius: string;
  tilt: number;
  pattern: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  decor: [string, string];
}

interface LineProps {
  text: string;
  delay?: number;
  color: string;
}

const SLIDES: Slide[] = [
  {
    src: "/assets/workshopv2/new/hasyaras-04.png",
    alt: "Hasyaras workshop",
    name: "Hasyaras",
    blurb:
      "Comics and comedy. Kids build funny characters, write punchlines and draw their own comic strips.",
    skills: ["Comics", "Humour", "Drawing"],
    color: "#ff4f8b",
    radius: "30px",
    tilt: -6,
    pattern:
      "radial-gradient(rgba(255,255,255,0.55) 2.5px, transparent 3px) 0 0 / 16px 16px",
    tag: "HA HA!",
    tagBg: "#ffd23f",
    tagColor: "#e8453c",
    decor: ["😂", "🤣"],
  },
  {
    src: "/assets/workshopv2/new/instant katha-05.png",
    alt: "Instant Katha workshop",
    name: "Instant Katha",
    blurb:
      "Storytelling on the spot. Kids invent characters and plots, then tell them out loud with confidence.",
    skills: ["Storytelling", "Speaking", "Imagination"],
    color: "#1f5fff",
    radius: "50% 50% 24px 24px / 38% 38% 24px 24px",
    tilt: 4,
    pattern:
      "repeating-linear-gradient(45deg, rgba(255,255,255,0.28) 0 8px, transparent 8px 18px)",
    tag: "ONCE UPON!",
    tagBg: "#fff3a3",
    tagColor: "#1f5fff",
    decor: ["📖", "✨"],
  },
  {
    src: "/assets/workshopv2/new/kalakrithi.png",
    alt: "Kalakriti workshop",
    name: "Kalakriti",
    blurb:
      "Art and craft. Kids paint, cut, fold and make something they can proudly take home.",
    skills: ["Art", "Craft", "Colour"],
    color: "#8b5cf6",
    radius: "30% 70% 62% 38% / 42% 38% 62% 58%",
    tilt: -4,
    pattern:
      "conic-gradient(rgba(255,255,255,0.3) 25%, transparent 0 50%, rgba(255,255,255,0.3) 0 75%, transparent 0) 0 0 / 28px 28px",
    tag: "CREATE!",
    tagBg: "#2bb673",
    tagColor: "#ffffff",
    decor: ["🎨", "✂️"],
  },
  {
    src: "/assets/workshopv2/new/Swar2.png",
    alt: "Swar workshop",
    name: "Swar",
    blurb:
      "Singing and music. Kids warm up their voices, learn rhythm and sing together as a group.",
    skills: ["Singing", "Rhythm", "Confidence"],
    color: "#2bb673",
    radius: "50%",
    tilt: 0,
    pattern:
      "repeating-radial-gradient(circle at center, rgba(255,255,255,0.3) 0 5px, transparent 5px 16px)",
    tag: "SING!",
    tagBg: "#ff8a2a",
    tagColor: "#ffffff",
    decor: ["🎵", "🎤"],
  },
];

const EMOJIS: string[] = ["🎨", "✂️", "🎵", "😂", "📖", "⭐", "🖍️"];
const MARQUEE_WORDS = ["HASYARAS", "INSTANT KATHA", "KALAKRITI", "SWAR"];
const MARQUEE_STARS = ["★", "✦", "●", "▲"];
const SLIDE_INTERVAL = 3500;

/* Layout CSS for the workshops section. Kept here so it works without
   touching banner.css. Cards are sized from the viewport height, so they
   always fit on screen on desktop. */
const WORKSHOP_CSS = `
.ws-pin, .hero-root { --nav: ${NAV_OFFSET}px; }
.hero-root.hero-root { height: auto !important; max-height: none !important; }
.hero-root .emoji-bubble {
  width: clamp(46px, 8vh, 72px) !important;
  height: clamp(46px, 8vh, 72px) !important;
  font-size: clamp(1.3rem, 3.6vh, 2rem) !important;
}
@media (min-width: 1024px) {
  .hero-root.hero-root {
    height: calc(100svh - var(--nav)) !important;
    min-height: 540px;
    display: flex;
    align-items: center;
  }
}
.ws-card { display: flex; flex-direction: column; width: 100%; max-width: 420px; }
.ws-frame { position: relative; width: 100%; aspect-ratio: 1 / 1; }
@media (min-width: 1024px) {
  .ws-pin { height: calc(100svh - var(--nav)); }
  .ws-card {
    height: calc(100svh - var(--nav) - 96px);
    width: min(400px, calc((100svh - var(--nav) - 96px) * 0.66));
    max-width: none;
  }
  .ws-frame { aspect-ratio: auto; flex: 1 1 0; min-height: 0; }
}
`;

const Line = ({ text, delay = 0, color }: LineProps) => (
  <span
    className="hero-line block whitespace-nowrap"
    style={
      {
        "--fill": color,
        fontSize: "clamp(2.6rem, 9.5vh, 6rem)",
        lineHeight: 1.02,
      } as CSSProperties
    }
    aria-hidden="true"
  >
    {text.split("").map((ch, i) =>
      ch === " " ? (
        <span key={i} className="inline-block w-[0.3em]" />
      ) : (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: 90, opacity: 0, rotate: -18, scale: 0.4 }}
          animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 14,
            delay: delay + i * 0.06,
          }}
        >
          <motion.span
            className="hero-letter inline-block"
            animate={{ y: [0, -10, 0], rotate: [0, i % 2 ? 3 : -3, 0] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.4 + i * 0.12,
            }}
            whileHover={{ scale: 1.25, rotate: -8 }}
          >
            {ch}
          </motion.span>
        </motion.span>
      ),
    )}
  </span>
);

const WorkshopBanner = ({
  scrollDownWorkshop,
}: {
  scrollDownWorkshop: () => void;
}) => {
  const [index, setIndex] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const root = useRef<HTMLDivElement>(null);
  const slide = SLIDES[index];

  /* Auto-rotating hero slides */
  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_INTERVAL,
    );
    return () => clearInterval(id);
  }, [paused]);

  /* GSAP + ScrollTrigger */
  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* 1. Marquee: runs forever, speeds up while the page scrolls */
        const marquee = gsap.to(".marquee-track", {
          xPercent: -50,
          repeat: -1,
          duration: 28,
          ease: "none",
        });
        ScrollTrigger.create({
          onUpdate: (self) => {
            const dir = self.direction === 1 ? 1 : -1;
            marquee.timeScale(
              dir * (1 + Math.min(Math.abs(self.getVelocity()) / 350, 6)),
            );
            gsap.to(marquee, {
              timeScale: dir,
              duration: 0.8,
              overwrite: true,
            });
          },
        });

        /* 2. Hero parallax: slideshow drifts as you scroll away */
        gsap.to(".banner-visual", {
          yPercent: 10,
          rotate: 2,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-root",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        /* 3. Workshop heading words bounce in */
        gsap.from(".ws-title-word", {
          y: 70,
          rotate: -12,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".ws-pin", start: "top 75%" },
        });
      });

      /* Desktop: pinned horizontal scroll through the workshops */
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = root.current!.querySelector<HTMLElement>(".ws-track")!;
          const distance = () => track.scrollWidth - window.innerWidth;
          const start = `top ${NAV_OFFSET}px`;

          const scrollTween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: ".ws-pin",
              start,
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          gsap.to(".ws-progress-fill", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".ws-pin",
              start,
              end: () => `+=${distance()}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          /* Each card straightens up as it slides into view */
          gsap.utils.toArray<HTMLElement>(".ws-card").forEach((card) => {
            const tilt = Number(card.dataset.tilt || 0);
            gsap.fromTo(
              card,
              { rotate: tilt + 10, y: 40, scale: 0.92 },
              {
                rotate: tilt,
                y: 0,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: scrollTween,
                  start: "left 95%",
                  end: "left 55%",
                  scrub: true,
                },
              },
            );
          });
        },
      );

      /* Mobile / tablet: cards pop in one by one */
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.utils.toArray<HTMLElement>(".ws-card").forEach((card) => {
            gsap.from(card, {
              y: 70,
              rotate: 6,
              opacity: 0,
              duration: 0.7,
              ease: "back.out(1.6)",
              scrollTrigger: { trigger: card, start: "top 88%" },
            });
          });
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <style>{WORKSHOP_CSS}</style>

      {/* ================= HERO ================= */}
      {/* height:auto so the hero grows with its content and is never clipped */}
      <section className="hero-root font-luckiest-scope banner-section relative w-full overflow-hidden border-b-4 border-[#1f1308] bg-[#fff6d8]">
        <div className="comic-halftone pointer-events-none absolute inset-0" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-8 px-6 py-8 sm:px-10 lg:flex-row lg:gap-6 lg:px-16 lg:py-4">
          <div className="hero-copy w-full lg:w-1/2">
            <h1
              className="font-luckiest"
              aria-label="Laugh it. Create it. Sing it."
            >
              <Line text="LAUGH IT." color="#ffd23f" delay={0.1} />
              <div className="ml-6 sm:ml-12 xl:ml-20">
                <Line text="CREATE IT." color="#ff4f8b" delay={0.7} />
              </div>
              <div className="ml-2 sm:ml-5 xl:ml-8">
                <Line text="SING IT." color="#3aa0ff" delay={1.3} />
              </div>
            </h1>

            <motion.p
              className="mt-3 max-w-lg text-sm font-semibold leading-snug text-[#1f1308]/75 xl:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 }}
            >
              Comics, stories, art and music — workshops where kids learn,
              create and grow in a safe and supportive creative space.
            </motion.p>

            {/* Available workshops: click one to jump the slideshow to it */}
            <motion.div
              className="mt-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0 }}
            >
              <p className="font-luckiest mb-2 text-sm tracking-wide text-[#1f1308]">
                4 workshops open for kids:
              </p>
              <div className="flex flex-wrap gap-2">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setIndex(i)}
                    className="font-luckiest rounded-full border-[3px] border-[#1f1308] px-4 py-1 text-sm tracking-wide text-white transition-transform hover:-translate-y-1"
                    style={{
                      background: s.color,
                      boxShadow:
                        i === index ? "4px 4px 0 #1f1308" : "2px 2px 0 #1f1308",
                      transform: i === index ? "rotate(-2deg)" : undefined,
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <motion.button
                onClick={scrollDownWorkshop}
                className="cta-pill"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.1 }}
                whileHover={{ scale: 1.06, rotate: -1 }}
                whileTap={{ scale: 0.96 }}
              >
                <motion.span
                  className="cta-pill-icon"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="#1f5fff">
                    <path d="M12 0C12.7 6.5 17.5 11.3 24 12 17.5 12.7 12.7 17.5 12 24 11.3 17.5 6.5 12.7 0 12 6.5 11.3 11.3 6.5 12 0Z" />
                  </svg>
                </motion.span>
                <span className="font-luckiest text-xl tracking-wide">
                  Book Your Workshop
                </span>
              </motion.button>

              <motion.a
                href="#workshops"
                className="font-luckiest text-lg tracking-wide text-[#1f1308] underline decoration-[#ff4f8b] decoration-4 underline-offset-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.3 }}
              >
                See all workshops ↓
              </motion.a>
            </div>
          </div>

          <div className="flex w-full flex-col items-center lg:w-1/2">
            <motion.div
              className="welcome-ribbon font-luckiest"
              initial={{ opacity: 0, y: -30, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: [-2, 2, -2] }}
              transition={{
                opacity: { delay: 0.4 },
                y: { delay: 0.4, type: "spring" },
                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <span>★</span>
              <span>WELCOME TO MENTOONS WORKSHOPS!</span>
              <span>★</span>
            </motion.div>

            <div
              className="banner-visual relative mt-2"
              style={{
                width: "min(44vh, 100%, 420px)",
                height: "min(44vh, 100vw, 420px)",
              }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  className="absolute inset-[11%]"
                  initial={{ scale: 0.6, opacity: 0, rotate: slide.tilt + 25 }}
                  animate={{ scale: 1, opacity: 1, rotate: slide.tilt }}
                  exit={{ scale: 0.6, opacity: 0, rotate: slide.tilt - 25 }}
                  transition={{ type: "spring", stiffness: 140, damping: 14 }}
                >
                  <div
                    className="h-full w-full border-[3px] border-[#1f1308] p-[8%] shadow-[10px_10px_0_#1f1308]"
                    style={{
                      background: `${slide.pattern}, ${slide.color}`,
                      borderRadius: slide.radius,
                    }}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-2xl border-[3px] border-[#1f1308] bg-white">
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        className="absolute inset-0 h-full w-full object-contain p-2"
                      />
                    </div>
                  </div>

                  <motion.span
                    className="slide-tag font-luckiest"
                    style={{ background: slide.tagBg, color: slide.tagColor }}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: [1, 1.12, 1], rotate: 10 }}
                    transition={{
                      scale: { duration: 1.4, repeat: Infinity, delay: 0.5 },
                      rotate: { type: "spring", delay: 0.3 },
                    }}
                  >
                    {slide.tag}
                  </motion.span>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`d-${index}`}
                  className="absolute inset-0 pointer-events-none"
                >
                  <motion.span
                    className="absolute left-0 top-[42%] text-4xl sm:text-5xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: [0, -14, 0],
                      rotate: [-10, 10, -10],
                    }}
                    transition={{
                      y: { duration: 2, repeat: Infinity },
                      rotate: { duration: 2, repeat: Infinity },
                    }}
                  >
                    {slide.decor[0]}
                  </motion.span>
                  <motion.span
                    className="absolute right-0 top-[55%] text-4xl sm:text-5xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: [0, 14, 0],
                      rotate: [10, -10, 10],
                    }}
                    transition={{
                      y: { duration: 2.4, repeat: Infinity },
                      rotate: { duration: 2.4, repeat: Infinity },
                    }}
                  >
                    {slide.decor[1]}
                  </motion.span>
                </motion.div>
              </AnimatePresence>

              <motion.svg
                viewBox="0 0 100 100"
                className="absolute -left-[2%] top-[0%] w-[17%]"
                animate={{ rotate: [0, 20, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path
                  d="M10 20 A50 50 0 1 0 90 70 L66 62 A26 26 0 1 1 30 32 Z"
                  fill="#ffaab9"
                  stroke="#1f1308"
                  strokeWidth="3"
                />
              </motion.svg>

              <motion.svg
                viewBox="0 0 100 90"
                className="absolute bottom-0 right-[3%] w-[15%]"
                animate={{ y: [0, -10, 0], rotate: [-6, 6, -6] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <polygon
                  points="50,4 96,86 4,86"
                  fill="#ff5c39"
                  stroke="#1f1308"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
              </motion.svg>

              <motion.svg
                viewBox="0 0 24 24"
                className="absolute bottom-[1%] left-[3%] w-[12%]"
                animate={{ rotate: 360, scale: [1, 1.25, 1] }}
                transition={{
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity },
                }}
              >
                <path
                  d="M12 1C12.6 7 17 11.4 23 12 17 12.6 12.6 17 12 23 11.4 17 7 12.6 1 12 7 11.4 11.4 7 12 1Z"
                  fill="#ffd23f"
                  stroke="#1f1308"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </div>

            <div className="mt-3 flex gap-3">
              {SLIDES.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show ${s.alt}`}
                  onClick={() => setIndex(i)}
                  className={`comic-dot ${i === index ? "comic-dot-active" : ""}`}
                  style={i === index ? { background: s.color } : undefined}
                />
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {EMOJIS.map((emoji, i) => (
                <motion.span
                  key={emoji}
                  className="emoji-bubble select-none"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -12, 0],
                    rotate: [0, i % 2 ? 12 : -12, 0],
                  }}
                  transition={{
                    opacity: { delay: 0.6 + i * 0.1 },
                    scale: { delay: 0.6 + i * 0.1, type: "spring" },
                    y: {
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.18,
                    },
                    rotate: {
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.18,
                    },
                  }}
                  whileHover={{ scale: 1.35, rotate: 0 }}
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MARQUEE (speeds up with scroll) ================= */}
      <div
        className="font-luckiest-scope overflow-hidden border-b-4 border-[#1f1308] bg-[#1f1308] py-3"
        aria-hidden="true"
      >
        <div className="marquee-track font-luckiest flex w-max whitespace-nowrap text-2xl tracking-wider text-[#ffd23f] sm:text-3xl">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
                <span key={`${copy}-${i}`} className="flex items-center">
                  <span className="px-6">{w}</span>
                  <span
                    className="text-xl"
                    style={{ color: SLIDES[i % SLIDES.length].color }}
                  >
                    {MARQUEE_STARS[i % MARQUEE_STARS.length]}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================= WORKSHOPS (pinned horizontal scroll on desktop) ================= */}
      <section
        id="workshops"
        className="ws-pin font-luckiest-scope relative w-full overflow-hidden border-b-4 border-[#1f1308] bg-[#ffe9a8]"
      >
        <div className="comic-halftone pointer-events-none absolute inset-0 opacity-60" />

        <div className="ws-track relative z-10 flex flex-col items-center gap-10 px-6 py-14 sm:px-10 lg:h-full lg:w-max lg:flex-row lg:gap-12 lg:px-16 lg:py-0">
          {/* Intro panel */}
          <div className="w-full shrink-0 lg:w-[420px]">
            <h2
              className="font-luckiest text-5xl text-[#1f1308] xl:text-6xl"
              style={{ lineHeight: 1 }}
            >
              <span className="ws-title-word inline-block">EXPLORE</span>{" "}
              <span className="ws-title-word inline-block text-[#ff4f8b]">
                OUR
              </span>
              <br />
              <span className="ws-title-word mt-2 inline-block text-[#1f5fff]">
                WORKSHOPS!
              </span>
            </h2>
            <p className="mt-5 max-w-sm text-base font-semibold text-[#1f1308]/75 xl:text-lg">
              Four creative workshops, each one built around kids love
              to do. Keep scrolling to explore what each one is all about.
            </p>
            <div className="mt-6 hidden h-3 w-64 overflow-hidden rounded-full border-[3px] border-[#1f1308] bg-white lg:block">
              <div
                className="ws-progress-fill h-full origin-left bg-[#ff4f8b]"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>

          {/* Workshop cards */}
          {SLIDES.map((s) => (
            <article
              key={s.name}
              data-tilt={s.tilt / 2}
              className="ws-card relative shrink-0 border-[3px] border-[#1f1308] bg-white p-4 shadow-[8px_8px_0_#1f1308]"
              style={{
                borderRadius: "26px",
                transform: `rotate(${s.tilt / 2}deg)`,
              }}
            >
              <div
                className="ws-frame border-[3px] border-[#1f1308] p-3"
                style={{
                  background: `${s.pattern}, ${s.color}`,
                  borderRadius: "20px",
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-2xl border-[3px] border-[#1f1308] bg-white">
                  <img
                    src={s.src}
                    alt={s.alt}
                    className="absolute inset-0 h-full w-full object-contain p-2"
                    loading="lazy"
                  />
                </div>
              </div>

              <span
                className="slide-tag font-luckiest"
                style={{ background: s.tagBg, color: s.tagColor }}
              >
                {s.tag}
              </span>

              <div className="shrink-0 pt-3">
                <h3
                  className="font-luckiest text-2xl tracking-wide xl:text-3xl"
                  style={{ color: s.color, lineHeight: 1.1 }}
                >
                  {s.name}
                </h3>
                <p className="mt-1.5 text-sm font-semibold leading-snug text-[#1f1308]/80">
                  {s.blurb}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-luckiest rounded-full border-[2px] border-[#1f1308] px-2.5 py-0.5 text-xs tracking-wide text-white"
                      style={{ background: s.color }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}

          {/* End panel */}
          <div className="w-full shrink-0 pb-6 lg:w-[360px] lg:pb-0">
            <p
              className="font-luckiest text-4xl text-[#1f1308] xl:text-5xl"
              style={{ lineHeight: 1.05 }}
            >
              READY TO
              <br />
              <span className="text-[#2bb673]">JOIN IN?</span>
            </p>
            <motion.button
              onClick={scrollDownWorkshop}
              className="cta-pill mt-5"
              whileHover={{ scale: 1.06, rotate: -1 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="cta-pill-icon">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="#1f5fff">
                  <path d="M12 0C12.7 6.5 17.5 11.3 24 12 17.5 12.7 12.7 17.5 12 24 11.3 17.5 6.5 12.7 0 12 6.5 11.3 11.3 6.5 12 0Z" />
                </svg>
              </span>
              <span className="font-luckiest text-xl tracking-wide">
                Book Your Workshop
              </span>
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkshopBanner;
