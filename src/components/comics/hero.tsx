import { motion } from "framer-motion";
import { useEffect, useState, type CSSProperties } from "react";
import { LandingColors } from "@/constant/adda/Landing/landingItems";

/*
  Same theme as NewLandingPage:
    - no black body text: headings are white with a black outline (.cm-title)
      and one color-changing word
    - Bangers / Luckiest Guy fonts
    - paragraph in a white outlined box (.cm-narration)
    - orange comic button (.cm-btn)
  The hero has no background of its own, so the cream dotted page background
  (.cm-page on the Comics page) shows through.
  The styles below are the same definitions as the landing page, so this
  component also looks right on its own.
*/
const heroCss = `
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Luckiest+Guy&display=swap');

@keyframes cm-wiggle {
  0%, 100% { transform: rotate(-2deg) scale(1.06); }
  25% { transform: rotate(3deg) scale(1.08); }
  50% { transform: rotate(-4deg) scale(1.08); }
  75% { transform: rotate(2deg) scale(1.06); }
}

.cm-font {
  font-family: 'Bangers', 'Comic Sans MS', 'Chalkboard SE', cursive !important;
  font-weight: 400 !important;
  letter-spacing: 0.05em;
}
.cm-chip-font {
  font-family: 'Luckiest Guy', 'Bangers', 'Comic Sans MS', cursive !important;
  font-weight: 400 !important;
  letter-spacing: 0.04em;
}
.cm-text {
  font-family: 'Bangers', 'Comic Sans MS', 'Chalkboard SE', cursive !important;
  font-weight: 400 !important;
  letter-spacing: 0.04em;
  line-height: 1.3;
  color: #1f2937;
}
.cm-title, .cm-title * {
  font-family: 'Bangers', 'Comic Sans MS', 'Chalkboard SE', cursive !important;
  font-weight: 400 !important;
}
.cm-title {
  line-height: 1;
  letter-spacing: 0.05em;
  color: #fff;
  -webkit-text-stroke: 3px #000;
  paint-order: stroke fill;
  text-shadow: 4px 4px 0 #000;
}
.cm-narration {
  background: #fff;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 12px;
  padding: 10px 16px;
}
.cm-tag {
  background: #fde047;
  color: #000;
  border: 3px solid #000;
  box-shadow: 3px 3px 0 #000;
  border-radius: 8px;
  padding: 2px 12px;
  transform: rotate(-2deg) skewX(-6deg);
  display: inline-block;
}
.cm-card {
  background: #fff;
  border: 3px solid #000;
  box-shadow: 5px 5px 0 #000;
  border-radius: 16px;
}
.cm-btn {
  background: var(--btn, #f97316);
  color: #fff;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 12px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  transform: rotate(-2deg);
  transition: box-shadow 0.1s ease, filter 0.1s ease;
  cursor: pointer;
}
.cm-btn:hover { filter: brightness(1.08); animation: cm-wiggle 0.4s ease-in-out; }
.cm-btn:active { box-shadow: 0 0 0 #000; transform: rotate(-2deg) translate(3px, 3px); }
.cm-btn:focus-visible { outline: 3px solid #000; outline-offset: 3px; }

.cm-comic-title, .cm-comic-title span { line-height: 1 !important; }

/* Fit the whole hero inside one screen on desktop.
   90px = navbar height. If your navbar is taller/shorter, change only this number. */
@media (min-width: 1024px) {
  .cm-comic-hero {
    height: calc(100vh - 90px);
    height: calc(100svh - 90px);
    min-height: 500px;
  }
  .cm-comic-title { font-size: clamp(2.5rem, 4.6vw, 4.75rem); }
  .cm-comic-img {
    width: auto;
    max-width: 100%;
    max-height: max(220px, calc(100vh - 340px));
    max-height: max(220px, calc(100svh - 340px));
    margin: 0 auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cm-btn:hover { animation: none; }
}
`;

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const pop = {
  hidden: { opacity: 0, scale: 0.85, rotate: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: -2,
    transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
  },
};

const ComicHero = () => {
  // color-changing highlight words, same as the landing page
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % LandingColors.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const highlight = LandingColors[colorIndex];

  return (
    <div className="cm-comic-hero relative flex flex-col justify-center py-8 lg:py-4">
      <style>{heroCss}</style>

      {/* Psychologist badge: always pinned to the top-right corner (absolute, outside the layout).
          The tag + heading get right padding so nothing ever sits under it. */}
      <img
        src="/assets/home/psychologist-developed.png"
        alt="Carefully crafted by psychologists"
        className="pointer-events-none absolute right-2 top-2 z-30 h-auto w-24 drop-shadow-[3px_3px_0_rgba(0,0,0,0.55)] sm:right-4 sm:w-28 md:w-32 lg:right-6 lg:w-36 xl:right-10 xl:w-44"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
        className="relative mx-auto w-full max-w-7xl px-4 lg:flex lg:items-center lg:gap-14 lg:px-8"
      >
        <div className="flex-1 space-y-5 text-left lg:space-y-4">
          {/* tag + heading: right padding keeps them clear of the badge on small screens */}
          <div className="space-y-5 pr-24 sm:pr-32 md:pr-36 lg:space-y-4 lg:pr-0">
            {/* eyebrow tag */}
            <motion.div variants={fadeUp}>
              <span className="cm-tag cm-chip-font text-base uppercase sm:text-lg">
                Digital Wellness Series
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="cm-title cm-comic-title text-5xl sm:text-6xl md:text-7xl"
            >
              <span className="sm:block">
                <span style={{ color: highlight }}>E-Comics</span> &amp;
              </span>{" "}
              <span className="sm:block">
                <span style={{ color: highlight }}>Audio</span> Comics
              </span>
            </motion.h1>
          </div>

          <motion.p
            variants={fadeUp}
            className="cm-narration cm-text max-w-xl text-xl md:text-2xl lg:text-xl"
            style={{ transform: "rotate(1deg)" }}
          >
            Welcome to the world of meaningful stories and valuable life
            lessons. Our comics help children and teenagers navigate{" "}
            <span className="cm-text" style={{ color: "#f97316" }}>
              important life topics
            </span>{" "}
            with ease and enjoyment — social media, safety, gadget addiction,
            and more, told the way kids actually want to read them.
          </motion.p>

          <motion.div variants={fadeUp} className="flex justify-start">
            <a href="#comics" className="inline-block">
              <button
                className="cm-btn cm-font inline-flex items-center gap-2 px-8 py-3 text-2xl uppercase"
                style={{ ["--btn" as string]: "#f97316" } as CSSProperties}
              >
                Explore Comics
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  →
                </motion.span>
              </button>
            </a>
          </motion.div>
        </div>

        <div className="relative mt-14 flex flex-1 justify-center lg:mt-0 lg:pt-40">
          {/* comic panel frame */}
          <motion.div
            variants={pop}
            className="cm-card relative w-full max-w-md p-3 sm:p-4 md:max-w-lg"
            style={{ boxShadow: "8px 8px 0 #000", borderWidth: 4 }}
          >
            {/* corner tape */}
            <div className="absolute -left-4 -top-3 h-7 w-16 rotate-[-8deg] border border-black/20 bg-yellow-300/90 shadow-sm" />
            <div className="absolute -right-4 -top-3 h-7 w-16 rotate-[8deg] border border-black/20 bg-yellow-300/90 shadow-sm" />

            <div className="overflow-hidden rounded-lg border-[3px] border-black">
              <motion.img
                src="/assets/comic-V2/comic-hero-v2.png"
                alt="comic page hero Image"
                className="cm-comic-img h-auto w-full"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* pow burst badge */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              whileInView={{ scale: 1, rotate: -12 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 260,
                damping: 15,
              }}
              className="absolute -bottom-6 -right-6 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28"
            >
              <svg
                viewBox="0 0 100 100"
                className="absolute h-full w-full"
                style={{ filter: "drop-shadow(3px 3px 0 #000)" }}
              >
                <polygon
                  points="50,2 61,22 82,15 78,38 98,50 78,62 82,85 61,78 50,98 39,78 18,85 22,62 2,50 22,38 18,15 39,22"
                  fill="#fde047"
                  stroke="black"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="cm-font relative px-2 text-center text-base leading-none text-black sm:text-lg">
                PICK
                <br />
                YOURS!
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComicHero;
