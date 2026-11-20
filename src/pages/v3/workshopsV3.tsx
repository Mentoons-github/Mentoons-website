import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SLIDES } from "@/components/Workshop/banner/banner";
import type { WorkshopCategory } from "@/types";

const KEYWORDS: Record<string, string> = {
  Kalakriti: "art",
  "Instant Katha": "story",
  Hasyaras: "laugh",
  Swar: "music",
};

const COLOR_OVERRIDES: Record<string, string> = {
  Kalakriti: "#f26a1b",
  Hasyaras: "#e63b2e",
};

const LIGHT_COLORS: Record<string, string> = {
  Hasyaras: "#ff8f85",
  "Instant Katha": "#8fb0ff",
  Kalakriti: "#ffb066",
  Swar: "#7fe3ae",
};

const NAV_OFFSET = 80;
const VIEW_PADDING = 16;
const HEADER_H = 120;

const FIT_HEIGHT = `calc(100vh - ${NAV_OFFSET}px - ${VIEW_PADDING * 2}px - ${HEADER_H}px)`;

const tint = (hex: string, amount = 0.45) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const mix = (v: number) =>
    Math.round(v + (255 - v) * amount)
      .toString(16)
      .padStart(2, "0");
  return `#${mix((n >> 16) & 255)}${mix((n >> 8) & 255)}${mix(n & 255)}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pickImage = (g: any): string | undefined =>
  g?.image ?? g?.imageUrl ?? g?.img ?? g?.thumbnail ?? g?.poster;

const norm = (r: string) => r.replace(/\s/g, "").replace(/[–—]/g, "-");

const backendImages = (
  categories: WorkshopCategory[],
  name: string,
): [string | undefined, string | undefined] => {
  const kw = KEYWORDS[name];
  const w = categories
    .flatMap((c) => c.workshops)
    .find((x) => x.workshopName.toLowerCase().includes(kw));
  const find = (range: string) =>
    pickImage(w?.ageGroups.find((g) => norm(g.ageRange) === range));
  return [find("6-12"), find("13-19")];
};

const WHATSAPP_NUMBER = "91XXXXXXXXXX";
const WHATSAPP_TEXT = "Hi Mentoons! Please send me the workshop details.";

const AGES = ["6–12", "13–19"] as const;

type Detail = {
  title: string;
  ageImages: [string, string];
  about: [string[], string[]];
};

const DETAILS: Record<string, Detail> = {
  Kalakriti: {
    title: "Art Therapy · Art, Paint & DIY",
    ageImages: [
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1786444426730-a38339a0-6e21-49ed-84f4-b8dc5c6b3b5f.png",
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1786444469493-2e44199e-eb57-49a5-8122-faf79378b428.png",
    ],
    about: [
      [
        "Are you tired of feeling distracted and unproductive?",
        "Join our art and painting workshops to discover a unique approach to improving your focus, eliminating negativity and reducing screen and mobile time.",
        "Dive into an immersive experience that will leave you feeling rejuvenated, inspired, and ready to take on any challenge.",
      ],
      [
        "Unleash your creativity and learn the power of using art as an effective tool to boost productivity.",
        "Use paint and DIY projects to improve focus, release stress and cut down screen time.",
      ],
    ],
  },
  "Instant Katha": {
    title: "Story Telling Therapy",
    ageImages: [
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1786444152653-34e90b5f-5d0b-406f-9f34-83a81bd465fa.png",
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1786444047514-4a892f42-a5f2-44e6-882c-fe49dfd50e06.png",
    ],
    about: [
      [
        "Our Story Telling Therapy program gives children engaging, hands-on learning that builds creativity, critical thinking and personal growth in a supportive environment.",
      ],
      [
        "Teens sharpen narrative skills, public speaking and critical thinking by building and telling their own stories.",
      ],
    ],
  },
  Hasyaras: {
    title: "Laughter Therapy",
    ageImages: [
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1786443814592-874ddf60-1437-4372-8ce3-052546933894.png",
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1786443527388-23588795-06d2-4312-a2ee-8272b9a01543.png",
    ],
    about: [
      [
        "Our Laughter Therapy program gives children engaging, hands-on learning that builds creativity, critical thinking and personal growth in a supportive environment.",
      ],
      [
        "Teens use humour and comic-making to ease stress, build confidence and express themselves.",
      ],
    ],
  },
  Swar: {
    title: "Music Therapy",
    ageImages: [
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1786444566541-469d0dd1-a797-4b12-952f-0260053a08ce.png",
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1786444917654-f45a7324-3f72-417c-8764-9674456ed010.png",
    ],
    about: [
      [
        "Our Music Therapy program gives children engaging, hands-on learning that builds creativity, critical thinking and personal growth in a supportive environment.",
      ],
      [
        "Teens explore rhythm, singing and music as a way to focus, relax and build confidence in a group.",
      ],
    ],
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

type ExperienceWorkshop = {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  audience: "genz";
  activities: string[];
  outcome: string;
  duration?: string;
};

const EXPERIENCE_WORKSHOPS: ExperienceWorkshop[] = [
  {
    id: "storytellers",
    name: "The Storytellers Club",
    subtitle: "Find your voice. Tell your story.",
    icon: "🎤",
    color: "#8066E8",
    audience: "genz",
    duration: "8 sessions · 4 weekends",
    activities: [
      "Storytelling for interviews",
      "Personal storytelling",
      "Brand storytelling",
      "Storytelling for business",
      "Turning ideas into presentations",
    ],
    outcome: "Create a personal story portfolio.",
  },
  {
    id: "art-boundaries",
    name: "Art Without Boundaries",
    subtitle: "Make something only you could make.",
    icon: "🎨",
    color: "#F26A1B",
    audience: "genz",
    activities: [
      "Expressive painting",
      "Abstract art",
      "Art and emotions",
      "Creative thinking",
      "Selling and presenting original artwork",
    ],
    outcome: "Build a personal art portfolio and exhibition.",
  },
  {
    id: "music",
    name: "Behind The Music",
    subtitle: "Discover the stories behind the sound.",
    icon: "🎧",
    color: "#269A80",
    audience: "genz",
    activities: [
      "Evolution of music genres",
      "Stories behind iconic albums",
      "Music and psychology",
      "Artist journeys",
      "Music, culture and society",
    ],
    outcome: "Develop music appreciation and a creative presentation.",
  },
  {
    id: "creator",
    name: "Creator to Entrepreneur",
    subtitle: "Turn your ideas into a real project.",
    icon: "🚀",
    color: "#D94D72",
    audience: "genz",
    activities: [
      "Find your creative strength",
      "Build a personal brand",
      "Create a portfolio",
      "Understand audiences",
      "Develop ethical income-generating ideas",
    ],
    outcome: "Complete a practical creative project.",
  },
  {
    id: "life-skills",
    name: "Life Skills Lab",
    subtitle: "Real-world skills, real confidence.",
    icon: "🧠",
    color: "#377ED9",
    audience: "genz",
    activities: [
      "Communication",
      "Critical thinking",
      "Decision-making",
      "Emotional intelligence",
      "Collaboration and leadership",
    ],
    outcome: "Create a personal development roadmap.",
  },
];

// Decorative, non-interactive comic doodles. Respect reduced-motion settings.
function PlayfulDoodles({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion();
  const doodles = compact
    ? [
        { symbol: "✦", left: "8%", top: "13%", delay: 0 },
        { symbol: "★", left: "84%", top: "72%", delay: 0.7 },
      ]
    : [
        { symbol: "✦", left: "3%", top: "8%", delay: 0 },
        { symbol: "★", left: "89%", top: "12%", delay: 0.6 },
        { symbol: "✿", left: "6%", top: "64%", delay: 1.1 },
        { symbol: "✧", left: "92%", top: "82%", delay: 0.3 },
      ];
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {doodles.map((d, i) => (
        <motion.span
          key={`${d.symbol}-${i}`}
          className="absolute select-none text-2xl font-black text-white/40 sm:text-4xl"
          style={{ left: d.left, top: d.top }}
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -11, 0], rotate: [-9, 10, -9], scale: [1, 1.12, 1] }
          }
          transition={{
            duration: 3.6 + i * 0.35,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {d.symbol}
        </motion.span>
      ))}
    </div>
  );
}

function ExperienceSection({
  audience,
  whatsappNumber,
}: {
  audience: "genz";
  whatsappNumber: string;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const workshops = EXPERIENCE_WORKSHOPS.filter(
    (item) => item.audience === audience,
  );
  return (
    <div className="mt-16 sm:mt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="text-center"
      >
        <span className="inline-block -rotate-2 rounded-full border-[3px] border-[#1f1308] bg-[#ffd23f] px-5 py-1 font-luckiest text-base text-[#1f1308] shadow-[4px_4px_0_#1f1308] sm:text-lg">
          LEARN BY DOING
        </span>
        <h2 className="font-luckiest mt-6 text-3xl leading-tight text-[#1f1308] sm:text-5xl">
          GEN Z<span className="text-[#e63b2e]">EXPERIENCES</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base font-semibold text-[#46382a] sm:text-lg">
          "Not another classroom. Explore, create, collaborate and leave with
          something you've made."
        </p>
      </motion.div>

      <div className="mt-9 grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:gap-8">
        {workshops.map((item, index) => {
          const active = expanded === item.id;
          const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi Mentoons! I'd like details about ${item.name}.`)}`;
          return (
            <motion.article
              key={item.id}
              layout
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -6, rotate: index % 2 ? 0.5 : -0.5 }
              }
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{
                duration: 0.45,
                delay: (index % 2) * 0.09,
                ease: EASE,
                layout: { duration: 0.35 },
              }}
              className="relative min-w-0 overflow-hidden rounded-[22px] border-[3px] border-[#1f1308] bg-white shadow-[6px_6px_0_#1f1308]"
            >
              <div
                className="relative overflow-hidden p-5 sm:p-6"
                style={{ backgroundColor: item.color }}
              >
                <PlayfulDoodles compact />
                <div className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full border-[14px] border-white/20" />
                <div className="pointer-events-none absolute -bottom-16 right-24 h-28 w-28 rounded-full border-[10px] border-white/15" />
                <div className="relative flex items-start gap-4">
                  <motion.div
                    animate={
                      reduceMotion
                        ? undefined
                        : { rotate: [0, -7, 6, 0], y: [0, -4, 0] }
                    }
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    }}
                    whileHover={{ rotate: -10, scale: 1.12 }}
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#1f1308] bg-[#fff7df] text-4xl shadow-[4px_4px_0_#1f1308] sm:h-20 sm:w-20 sm:text-5xl"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-full bg-white/90 px-3 py-0.5 text-xs font-extrabold uppercase tracking-wide text-[#1f1308]">
                      Gen Z experience
                    </span>
                    <h3 className="font-luckiest mt-2 text-2xl leading-tight text-white [text-shadow:2px_2px_0_#1f1308] sm:text-3xl">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-white sm:text-base">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                {item.duration && (
                  <span className="relative mt-4 inline-flex rounded-lg border-2 border-[#1f1308] bg-[#ffd23f] px-3 py-1 text-sm font-extrabold text-[#1f1308]">
                    {item.duration}
                  </span>
                )}
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-xs font-black uppercase tracking-widest text-[#6b5744]">
                  Your takeaway
                </p>
                <p className="mt-1 text-base font-bold text-[#1f1308]">
                  {item.outcome}
                </p>
                <button
                  type="button"
                  aria-expanded={active}
                  aria-controls={`experience-details-${item.id}`}
                  onClick={() => setExpanded(active ? null : item.id)}
                  className="mt-5 flex w-full items-center justify-between rounded-xl border-[3px] border-[#1f1308] bg-[#fff0c5] px-4 py-3 text-left font-luckiest text-lg text-[#1f1308] transition-colors hover:bg-[#ffd23f] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#377ED9]"
                >
                  {active ? "HIDE ACTIVITIES" : "EXPLORE WORKSHOP"}
                  <motion.span
                    animate={{
                      rotate: active ? 180 : 0,
                      scale: active ? 1.2 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    aria-hidden="true"
                  >
                    ⌄
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      id={`experience-details-${item.id}`}
                      key="details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="pt-5">
                        <p className="font-luckiest text-xl text-[#1f1308]">
                          WHAT YOU'LL EXPLORE
                        </p>
                        <ul className="mt-3 space-y-2">
                          {item.activities.map((activity, activityIndex) => (
                            <motion.li
                              key={activity}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: activityIndex * 0.065 }}
                              className="flex items-start gap-2 text-sm font-semibold leading-relaxed text-[#30251b] sm:text-base"
                            >
                              <span
                                className="mt-0.5 shrink-0 font-black"
                                style={{ color: item.color }}
                                aria-hidden="true"
                              >
                                ✦
                              </span>
                              <span>{activity}</span>
                            </motion.li>
                          ))}
                        </ul>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex items-center justify-center rounded-full border-[3px] border-[#1f1308] bg-[#ffd23f] px-5 py-2 font-luckiest text-base text-[#1f1308] shadow-[3px_3px_0_#1f1308] transition-transform hover:-translate-y-0.5"
                        >
                          ASK ABOUT THIS WORKSHOP ↗
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

const WorkshopV3 = ({
  categories = [],
}: {
  categories?: WorkshopCategory[];
}) => {
  const [open, setOpen] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const [age, setAge] = useState<0 | 1>(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  const changeAge = (i: 0 | 1) => {
    if (i === age) return;
    setDir(i > age ? 1 : -1);
    setAge(i);
  };

  const snapCardToView = (name: string) => {
    const el = cardRefs.current[name];
    if (!el) return;
    const top =
      window.scrollY +
      el.getBoundingClientRect().top -
      NAV_OFFSET -
      VIEW_PADDING;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_TEXT,
  )}`;

  return (
    <section className="font-luckiest-scope relative w-full overflow-hidden border-b-4 border-[#1f1308] bg-[#ffe9a8]">
      <div className="comic-halftone pointer-events-none absolute inset-0 opacity-60" />
      <PlayfulDoodles />

      <img
        src="/assets/home/psychologist-developed.png"
        alt="Carefully crafted by psychologists"
        className="pointer-events-none absolute right-2 top-2 z-20 h-auto w-20 drop-shadow-[3px_3px_0_rgba(0,0,0,0.55)] sm:right-4 sm:w-32 md:w-36 lg:right-6 lg:w-40 xl:right-8 xl:w-48"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 sm:px-8 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, scale: 0.85, y: 18 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
          className="font-luckiest text-center text-4xl text-[#1f1308] sm:px-28 sm:text-5xl lg:px-36 lg:text-6xl xl:px-44"
        >
          WORKSHOPS BY <span className="text-[#e63b2e]">MENTOONS</span>
        </motion.h2>
        <p className="font-luckiest mt-2 text-center text-lg text-[#f26a1b] sm:px-28 sm:text-xl lg:px-36 xl:px-44">
          Developed and delivered by psychologists
        </p>

        <div className="mt-5 flex justify-center gap-3">
          {AGES.map((a, i) => (
            <motion.button
              key={a}
              type="button"
              onClick={() => changeAge(i as 0 | 1)}
              whileTap={{ scale: 0.92, x: 2, y: 2 }}
              whileHover={{ y: -2 }}
              animate={{
                boxShadow:
                  age === i ? "1px 1px 0 #1f1308" : "3px 3px 0 #1f1308",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="font-luckiest relative overflow-hidden rounded-full border-[3px] border-[#1f1308] bg-white px-5 py-1 text-lg sm:text-xl"
            >
              {age === i && (
                <motion.span
                  layoutId="age-pill"
                  className="absolute inset-0 bg-[#ffd23f]"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative z-10 text-[#1f1308]">AGES {a}</span>
            </motion.button>
          ))}
        </div>

        <div className="mt-10 space-y-10">
          {SLIDES.map((s) => {
            const isOpen = open === s.name;
            const d = DETAILS[s.name];
            const color = COLOR_OVERRIDES[s.name] ?? s.color;
            const light = LIGHT_COLORS[s.name] ?? tint(color);
            const bg = age === 0 ? color : light;
            const dark = age === 1;
            const fromApi = backendImages(categories, s.name);
            const imgs = [
              d?.ageImages[0] ?? fromApi[0],
              d?.ageImages[1] ?? fromApi[1],
            ];
            return (
              <motion.article
                key={s.name}
                initial={{ opacity: 0, y: 38, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.5, ease: EASE }}
                ref={(el) => {
                  cardRefs.current[s.name] = el;
                }}
                className="relative rounded-2xl border-[4px] border-[#1f1308] shadow-[8px_8px_0_#1f1308]"
              >
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[12px]">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={age}
                      className="absolute inset-0"
                      style={{ background: `${s.pattern}, ${bg}` }}
                      initial={{
                        clipPath:
                          dir === 1
                            ? "circle(0% at 100% 0%)"
                            : "circle(0% at 0% 0%)",
                      }}
                      animate={{
                        clipPath:
                          dir === 1
                            ? "circle(150% at 100% 0%)"
                            : "circle(150% at 0% 0%)",
                      }}
                      exit={{ transition: { duration: 0.7 } }}
                      transition={{ duration: 0.65, ease: EASE }}
                    />
                  </AnimatePresence>
                </div>

                <span
                  className="slide-tag font-luckiest"
                  style={{ background: s.tagBg, color: s.tagColor }}
                >
                  {s.tag}
                </span>

                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : s.name)}
                  className="relative z-10 flex w-full items-center gap-4 p-4 text-left"
                >
                  <motion.img
                    whileHover={
                      reduceMotion ? undefined : { rotate: -7, scale: 1.08 }
                    }
                    transition={{ type: "spring", stiffness: 260, damping: 15 }}
                    src={s.src}
                    alt={s.alt}
                    className="h-20 w-20 rounded-lg border-[3px] border-[#1f1308] bg-white object-contain"
                  />
                  <span>
                    <motion.span
                      className="font-luckiest block text-4xl leading-none sm:text-5xl"
                      animate={{
                        color: dark ? "#1f1308" : "#ffffff",
                        textShadow: dark
                          ? "2px 2px 0 #ffffff"
                          : "2px 2px 0 #1f1308",
                      }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                    >
                      {s.name}
                    </motion.span>
                    <motion.span
                      className="block text-base font-bold sm:text-lg"
                      animate={{ color: dark ? "#1f1308" : "#ffffff" }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                    >
                      {d?.title}
                    </motion.span>
                  </span>
                  <motion.span
                    className="ml-auto pr-2 text-3xl"
                    animate={{
                      rotate: isOpen ? 90 : 0,
                      color: dark ? "#1f1308" : "#ffffff",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    ▶
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      onAnimationComplete={() => {
                        if (open === s.name) snapCardToView(s.name);
                      }}
                      className="relative z-10 overflow-hidden"
                    >
                      <div
                        className="grid gap-4 px-4 pb-4 md:h-[var(--fit)] md:min-h-[320px] md:grid-cols-[minmax(0,min(380px,38%))_1fr] md:grid-rows-[minmax(0,1fr)] md:gap-5"
                        style={{ ["--fit" as string]: FIT_HEIGHT }}
                      >
                        <div className="mx-auto aspect-square w-full max-w-[380px] overflow-hidden rounded-2xl border-[3px] border-[#1f1308] bg-white shadow-[5px_5px_0_#1f1308] md:max-h-full md:self-center">
                          <img
                            src={s.src}
                            alt={s.alt}
                            className="h-full w-full object-contain p-2"
                          />
                        </div>

                        <div className="flex min-w-0 flex-col gap-4 md:h-full md:min-h-0">
                          <div className="overflow-hidden rounded-xl border-[3px] border-[#1f1308] bg-white p-4 shadow-[5px_5px_0_#1f1308] md:min-h-0 md:flex-1 md:overflow-y-auto">
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.div
                                key={age}
                                initial={{ opacity: 0, x: dir * 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: dir * -50 }}
                                transition={{ duration: 0.28, ease: EASE }}
                              >
                                <h3 className="font-luckiest text-2xl text-[#1f1308] [text-shadow:2px_2px_0_#f26a1b] sm:text-3xl">
                                  WHAT'S IT ABOUT?
                                </h3>
                                {d?.about[age].map((p, idx) => (
                                  <motion.p
                                    key={p}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      delay: 0.08 + idx * 0.07,
                                      duration: 0.3,
                                    }}
                                    className="mt-1.5 text-base font-semibold leading-snug text-[#1f1308] md:text-[clamp(13px,1.9vh,17px)]"
                                  >
                                    {p}
                                  </motion.p>
                                ))}
                                {age === 0 && (
                                  <p className="mt-1.5 text-base font-semibold leading-snug text-[#1f1308] md:text-[clamp(13px,1.9vh,17px)]">
                                    {s.blurb}
                                  </p>
                                )}

                                <div className="mt-3 flex flex-wrap gap-2">
                                  {s.skills.map((k, idx) => (
                                    <motion.span
                                      key={k}
                                      initial={{ opacity: 0, scale: 0.6 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 18,
                                        delay: 0.15 + idx * 0.06,
                                      }}
                                      className="font-luckiest rounded-full border-2 border-[#1f1308] px-3 py-0.5 text-sm text-white sm:text-base"
                                      style={{ background: color }}
                                    >
                                      {k}
                                    </motion.span>
                                  ))}
                                  <motion.span
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 400,
                                      damping: 18,
                                      delay: 0.35,
                                    }}
                                    className="font-luckiest rounded-full border-2 border-[#1f1308] bg-white px-3 py-0.5 text-sm text-[#1f1308] sm:text-base"
                                  >
                                    AGE {AGES[age]}
                                  </motion.span>
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          </div>

                          <div className="grid grid-cols-2 gap-4 md:shrink-0">
                            {AGES.map((a, i) => (
                              <motion.button
                                key={a}
                                type="button"
                                onClick={() => changeAge(i as 0 | 1)}
                                aria-pressed={age === i}
                                whileTap={{ scale: 0.94 }}
                                animate={{
                                  y: age === i ? -4 : 0,
                                  scale: age === i ? 1.03 : 1,
                                  boxShadow:
                                    age === i
                                      ? "5px 5px 0 #ffd23f, 7px 7px 0 #1f1308"
                                      : "4px 4px 0 #1f1308",
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 380,
                                  damping: 22,
                                }}
                                className="overflow-hidden rounded-xl border-[3px] border-[#1f1308] bg-white text-left"
                              >
                                <div className="aspect-square w-full md:aspect-auto md:h-[clamp(80px,19vh,190px)]">
                                  <img
                                    src={imgs[i]}
                                    alt={`${s.name} for ages ${a}`}
                                    className="h-full w-full object-contain p-1"
                                    loading="lazy"
                                    onError={() =>
                                      console.warn("Image failed:", imgs[i])
                                    }
                                  />
                                </div>
                                <motion.span
                                  className="font-luckiest block border-t-[3px] border-[#1f1308] py-1 text-center text-lg"
                                  animate={{
                                    backgroundColor: age === i ? color : light,
                                    color: age === i ? "#ffffff" : "#1f1308",
                                  }}
                                  transition={{ duration: 0.35 }}
                                >
                                  AGES {a}
                                </motion.span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-pill"
          >
            <span className="cta-pill-icon">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="#1f5fff">
                <path d="M12 0C12.7 6.5 17.5 11.3 24 12 17.5 12.7 12.7 17.5 12 24 11.3 17.5 6.5 12.7 0 12 6.5 11.3 11.3 6.5 12 0Z" />
              </svg>
            </span>
            <span className="font-luckiest text-xl tracking-wide sm:text-2xl">
              Send Workshop Details
            </span>
          </a>
        </div>

        <ExperienceSection audience="genz" whatsappNumber={WHATSAPP_NUMBER} />
      </div>
    </section>
  );
};

export default WorkshopV3;
