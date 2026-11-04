import { useEffect, useMemo, useState, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Clock,
  Play,
  Star,
} from "lucide-react";
import { WorkshopCategory } from "@/types";
import { COLOR_THEME } from "@/constant/constants";
import {
  AGES,
  DURATIONS,
  GROUPS,
  TOPICS,
  formatPrice,
  saveEnrollment,
  topicLimitFor,
  type DurationOption,
} from "@/constant/workshops/workshopData";

const INK = "#1f1308";
const INK_B = "border-[#1f1308]";

const halftone: CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(31,19,8,0.12) 1.5px, transparent 1.6px)",
  backgroundSize: "14px 14px",
};
const panel: CSSProperties = {
  background: "#fff",
  border: `3px solid ${INK}`,
  borderRadius: 14,
  boxShadow: `5px 5px 0 ${INK}`,
};
const hard = (n = 3): CSSProperties => ({
  border: `3px solid ${INK}`,
  boxShadow: `${n}px ${n}px 0 ${INK}`,
});
const heading: CSSProperties = { color: INK, textShadow: "2px 2px 0 #fb923c" };

const pill = (selected: boolean) =>
  `rounded-xl border-[3px] ${INK_B} text-[#1f1308] font-bold transition-all duration-150 ${
    selected
      ? "bg-yellow-300 shadow-[1px_1px_0_#1f1308] translate-x-[2px] translate-y-[2px]"
      : "bg-white shadow-[3px_3px_0_#1f1308] hover:-translate-y-0.5 hover:bg-yellow-100"
  }`;

type Tab = "overview" | "ages" | "why" | "kids" | "register";
const TABS: { id: Tab; label: string; short: string }[] = [
  { id: "overview", label: "Overview", short: "Info" },
  { id: "ages", label: "Age Groups", short: "Ages" },
  { id: "why", label: "Why Choose Us", short: "Why Us" },
  { id: "kids", label: "Kids Say", short: "Kids" },
  { id: "register", label: "Register", short: "Join" },
];

/* ---------------- Testimonials ----------------
   PLACEHOLDER copy. Replace with real quotes from kids (with permission).
   Keep them about the kid's own experience (no teachers / family / class).
   To override per workshop, add a `testimonials` array on the workshop
   object in your data: { quote, name, age, avatar? }[]                    */
interface Testimonial {
  quote: string;
  name: string;
  age: number | string;
  avatar?: string;
}

const AVATAR_BG = ["#fde047", "#f9a8d4", "#93c5fd", "#86efac", "#c4b5fd"];

const TESTIMONIALS: Record<string, Testimonial[]> = {
  hasyaras: [
    {
      quote:
        "I made my own comic hero and everyone laughed at my punchline. Best day ever!",
      name: "Aarav",
      age: 8,
      avatar: "😂",
    },
    {
      quote:
        "I never thought I could draw funny faces, but now I draw them all the time.",
      name: "Meera",
      age: 10,
      avatar: "🖍️",
    },
    {
      quote:
        "I made a comic strip with my very own characters. I want to make another one!",
      name: "Kabir",
      age: 9,
      avatar: "🤣",
    },
  ],
  katha: [
    {
      quote:
        "I told a story about a dragon who was scared of fire. I wasn't nervous at all!",
      name: "Ishaan",
      age: 9,
      avatar: "📖",
    },
    {
      quote:
        "I love making up characters on the spot. Now I feel confident telling stories out loud.",
      name: "Anaya",
      age: 11,
      avatar: "✨",
    },
    {
      quote: "Everyone clapped when I finished my story. I felt like a star!",
      name: "Rohan",
      age: 7,
      avatar: "⭐",
    },
  ],
  kalakri: [
    {
      quote: "I painted a peacock and took it home. I'm so proud of it!",
      name: "Diya",
      age: 8,
      avatar: "🎨",
    },
    {
      quote:
        "Cutting, folding and colouring is so much fun. I made a paper lantern!",
      name: "Vihaan",
      age: 10,
      avatar: "✂️",
    },
    {
      quote:
        "I like that there's no wrong way to make art. I just try whatever I want.",
      name: "Saanvi",
      age: 12,
      avatar: "🌈",
    },
  ],
  swar: [
    {
      quote:
        "We sang together and it sounded so good. I want to sing every day now.",
      name: "Myra",
      age: 9,
      avatar: "🎵",
    },
    {
      quote: "I was shy to sing before, but now I sing loudly and happily.",
      name: "Advait",
      age: 11,
      avatar: "🎤",
    },
    {
      quote: "The rhythm games were my favourite. I clap along to every song!",
      name: "Tara",
      age: 7,
      avatar: "🥁",
    },
  ],
  default: [
    {
      quote:
        "I made new friends and learned so many cool things. I can't wait to come back!",
      name: "Aditi",
      age: 9,
      avatar: "😄",
    },
    {
      quote: "Every session was full of surprises and I had so much fun.",
      name: "Arjun",
      age: 10,
      avatar: "🌟",
    },
    {
      quote: "It was fun, creative and I got to show everybody what I made.",
      name: "Navya",
      age: 8,
      avatar: "🎉",
    },
  ],
};

const getTestimonials = (w: {
  workshopName: string;
  testimonials?: Testimonial[];
}): Testimonial[] => {
  if (w.testimonials?.length) return w.testimonials;
  const name = w.workshopName.toLowerCase();
  const key = Object.keys(TESTIMONIALS).find(
    (k) => k !== "default" && name.includes(k),
  );
  return TESTIMONIALS[key ?? "default"];
};

type Topic = (typeof TOPICS)[number] & { thumbnail?: string };

const StepHeader = ({
  n,
  title,
  right,
}: {
  n: number;
  title: string;
  right?: React.ReactNode;
}) => (
  <div className="flex items-center gap-3">
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] ${INK_B} bg-orange-400 font-comic text-white [text-shadow:1px_1px_0_#1f1308]`}
    >
      {n}
    </span>
    <h4 className="font-comic text-2xl tracking-wider" style={heading}>
      {title}
    </h4>
    {right && <div className="ml-auto">{right}</div>}
  </div>
);

const TestimonialCard = ({ t, i }: { t: Testimonial; i: number }) => (
  <motion.figure
    initial={{ opacity: 0, y: 16, rotate: i % 2 ? 1.5 : -1.5 }}
    animate={{ opacity: 1, y: 0, rotate: 0 }}
    transition={{
      delay: i * 0.08,
      type: "spring",
      stiffness: 200,
      damping: 18,
    }}
    className="relative flex flex-col gap-3 rounded-2xl p-5"
    style={panel}
  >
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((s) => (
        <Star
          key={s}
          className="h-5 w-5 fill-yellow-300 text-[#1f1308]"
          strokeWidth={2}
        />
      ))}
    </div>
    <blockquote
      className="text-lg font-medium leading-snug"
      style={{ color: INK }}
    >
      “{t.quote}”
    </blockquote>
    <figcaption className="mt-auto flex items-center gap-3">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl"
        style={{ ...hard(2), background: AVATAR_BG[i % AVATAR_BG.length] }}
      >
        {t.avatar ?? "🙂"}
      </span>
      <span className="font-comic-chip text-base" style={{ color: INK }}>
        {t.name}
        <span className="block text-xs font-bold opacity-70">Age {t.age}</span>
      </span>
    </figcaption>
  </motion.figure>
);

const VideoCard = ({
  t,
  isSel,
  locked,
  disabled,
  open,
  onToggle,
  onDetails,
}: {
  t: Topic;
  isSel: boolean;
  locked: boolean;
  disabled: boolean;
  open: boolean;
  onToggle: () => void;
  onDetails: () => void;
}) => (
  <div
    className={`overflow-hidden rounded-xl border-[3px] ${INK_B} transition-all duration-150 ${
      isSel
        ? "translate-x-[2px] translate-y-[2px] bg-yellow-300 shadow-[1px_1px_0_#1f1308]"
        : "bg-white shadow-[3px_3px_0_#1f1308]"
    } ${locked ? "opacity-50" : ""}`}
  >
    <button
      type="button"
      disabled={disabled}
      aria-pressed={isSel}
      aria-label={`${isSel ? "Remove" : "Add"} ${t.name}`}
      onClick={onToggle}
      className={`group relative block aspect-video w-full overflow-hidden border-b-[3px] ${INK_B} bg-gradient-to-br from-orange-300 via-yellow-200 to-orange-400 disabled:cursor-not-allowed`}
    >
      {t.thumbnail && (
        <img
          src={t.thumbnail}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {isSel && <div className="absolute inset-0 bg-black/20" />}

      <span className="absolute inset-0 flex items-center justify-center">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full border-[2.5px] ${INK_B} bg-white shadow-[2px_2px_0_#1f1308] transition-transform duration-150 group-hover:scale-110`}
        >
          <Play
            className="ml-0.5 h-4 w-4 fill-[#1f1308] text-[#1f1308]"
            strokeWidth={2}
          />
        </span>
      </span>

      <span
        className={`absolute left-1.5 top-1.5 max-w-[60%] truncate rounded border-2 ${INK_B} bg-white px-1.5 text-[9px] uppercase leading-4`}
      >
        {t.group}
      </span>

      <span
        className={`absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${INK_B} ${
          isSel ? "bg-green-500" : "bg-white/90"
        }`}
      >
        {isSel && <Check className="h-3 w-3 text-white" strokeWidth={4} />}
      </span>

      <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-0.5 rounded bg-[#1f1308] px-1.5 py-px text-[10px] text-white">
        <Clock className="h-2.5 w-2.5" strokeWidth={3} />
        {t.minutes} min
      </span>
    </button>

    <div className="flex flex-col gap-2 p-2">
      <h3 className="line-clamp-2 min-h-[2rem] text-[13px] font-bold leading-4 text-[#1f1308]">
        {t.name}
      </h3>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`w-full rounded-md border-2 ${INK_B} py-0.5 text-xs font-bold text-[#1f1308] disabled:cursor-not-allowed ${
          isSel ? "bg-green-500 text-white" : "bg-white hover:bg-yellow-100"
        }`}
      >
        {isSel ? "✓ Added" : "+ Add"}
      </button>
    </div>

    <button
      type="button"
      aria-expanded={open}
      onClick={onDetails}
      className={`flex w-full items-center justify-between border-t-2 border-dashed ${INK_B} px-2 py-1 text-[11px] font-bold text-[#1f1308]`}
    >
      Details
      <ChevronDown
        className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        strokeWidth={3}
      />
    </button>
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <p className="px-2 pb-2 text-xs font-medium text-[#1f1308]">
            {t.about}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

interface Props {
  categories: WorkshopCategory[];
  currentCategoryIndex?: number;
  currentWorkshopIndex?: number;
  setCurrentCategoryIndex?: (i: number) => void;
  setCurrentWorkshopIndex?: (i: number) => void;
  direction?: number;
  setDirection?: (d: number) => void;
  workshopRef: React.Ref<HTMLElement>;
}

const WorkshopInfoCarousel = ({
  workshopRef,
  categories,
  currentCategoryIndex: extCat,
  currentWorkshopIndex: extWs,
  setCurrentCategoryIndex: setExtCat,
  setCurrentWorkshopIndex: setExtWs,
  setDirection: setExtDir,
}: Props) => {
  const navigate = useNavigate();
  const [catIdx, setCatIdx] = useState(extCat ?? 0);
  const [wsIdx, setWsIdx] = useState(extWs ?? 0);
  const [dir, setDir] = useState(1);
  const [tab, setTab] = useState<Tab>("overview");
  const [ageIdx, setAgeIdx] = useState(0);
  const [openBenefit, setOpenBenefit] = useState<number | null>(0);

  const [regAge, setRegAge] = useState("");
  const [durationLabel, setDurationLabel] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [group, setGroup] = useState("All");
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  useEffect(() => {
    if (extCat !== undefined) setCatIdx(extCat);
  }, [extCat]);
  useEffect(() => {
    if (extWs !== undefined) setWsIdx(extWs);
  }, [extWs]);

  useEffect(() => {
    setTab("overview");
    setAgeIdx(0);
    setOpenBenefit(0);
  }, [catIdx, wsIdx]);

  const flat = useMemo(
    () =>
      categories.flatMap((c, ci) => c.workshops.map((_, wi) => ({ ci, wi }))),
    [categories],
  );

  const duration = DURATIONS.find((d) => d.label === durationLabel);
  const limit = duration ? topicLimitFor(duration) : 0;
  const remaining = limit - selected.length;
  const ready = Boolean(regAge && duration && selected.length === limit);

  const visible = useMemo(
    () => (group === "All" ? TOPICS : TOPICS.filter((t) => t.group === group)),
    [group],
  );
  const chosen = TOPICS.filter((t) => selected.includes(t.id));

  const chooseDuration = (d: DurationOption) => {
    setDurationLabel(d.label);
    setSelected((p) => p.slice(0, topicLimitFor(d)));
  };
  const toggle = (id: string) =>
    setSelected((p) =>
      p.includes(id)
        ? p.filter((x) => x !== id)
        : p.length >= limit
          ? p
          : [...p, id],
    );

  const proceed = () => {
    if (!ready || !duration) return;
    saveEnrollment({
      age: regAge,
      duration: duration.label,
      price: duration.price,
      topicIds: selected,
      paidAt: Date.now(),
    });
    navigate("/workshop-learn");
  };

  const ctaLabel = ready
    ? `Proceed to Payment · ${formatPrice(duration!.price)} →`
    : !regAge
      ? "Select age to continue"
      : !duration
        ? "Select a duration"
        : `Select ${remaining} more topic${remaining === 1 ? "" : "s"}`;

  const category = categories[catIdx];
  const workshop = category?.workshops[wsIdx];
  const theme = COLOR_THEME[catIdx % COLOR_THEME.length];

  if (!category || !workshop) return null;

  const position = flat.findIndex((p) => p.ci === catIdx && p.wi === wsIdx);

  const goTo = (ci: number, wi: number, d?: number) => {
    const newDir = d ?? (ci > catIdx || (ci === catIdx && wi > wsIdx) ? 1 : -1);
    setDir(newDir);
    setCatIdx(ci);
    setWsIdx(wi);
    setExtCat?.(ci);
    setExtWs?.(wi);
    setExtDir?.(newDir);
  };

  const step = (d: number) => {
    const next = flat[(position + d + flat.length) % flat.length];
    goTo(next.ci, next.wi, d);
  };

  const ages = workshop.ageGroups || [];
  const age = ages[Math.min(ageIdx, Math.max(ages.length - 1, 0))];
  const heroImg = ages.find((a) => a.image)?.image;
  const testimonials = getTestimonials(
    workshop as typeof workshop & { testimonials?: Testimonial[] },
  );

  return (
    <section
      ref={workshopRef}
      className="relative lg:min-h-screen"
      style={{ background: "#fff7e6" }}
    >
      <div className="absolute inset-0 pointer-events-none" style={halftone} />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <h1
          className="font-comic text-5xl md:text-7xl mb-4 text-start"
          style={{
            color: INK,
            letterSpacing: "0.03em",
            lineHeight: 1.05,
            textShadow: "3px 3px 0 #fb923c",
          }}
        >
          {category.categoryName}
        </h1>
        <p className="text-xl text-start font-medium" style={{ color: INK }}>
          {category.description ||
            "Discover engaging, educational experiences designed to inspire and nurture young minds"}
        </p>

        <div className="mt-8 -mx-4 px-4 overflow-x-auto pb-3">
          <div className="flex gap-3 w-max md:w-auto md:flex-wrap">
            {categories.map((c, i) => {
              const active = i === catIdx;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i, 0)}
                  style={{
                    ...hard(3),
                    color: active ? "#fff" : INK,
                    textShadow: active ? `2px 2px 0 ${INK}` : "none",
                  }}
                  className={`font-comic-chip tracking-wide px-4 py-2 rounded-full whitespace-nowrap transition-all hover:-translate-y-0.5 ${
                    active
                      ? `bg-gradient-to-r ${theme.primary}`
                      : "bg-white hover:bg-orange-100"
                  }`}
                >
                  {c.categoryName}
                </button>
              );
            })}
          </div>
        </div>

        {category.workshops.length > 1 && (
          <div className="mt-2 -mx-4 px-4 overflow-x-auto pb-3">
            <div className="flex gap-2 w-max md:w-auto md:flex-wrap">
              {category.workshops.map((w, i) => {
                const active = i === wsIdx;
                return (
                  <button
                    key={i}
                    onClick={() => goTo(catIdx, i)}
                    style={{
                      border: `2px solid ${INK}`,
                      boxShadow: active ? "none" : `2px 2px 0 ${INK}`,
                    }}
                    className={`font-comic-chip text-sm px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                      active
                        ? "bg-yellow-300 translate-x-[2px] translate-y-[2px]"
                        : "bg-white hover:bg-yellow-100"
                    }`}
                  >
                    {w.workshopName}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4 relative">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={`${catIdx}-${wsIdx}`}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{
                ...panel,
                borderWidth: 4,
                boxShadow: `8px 8px 0 ${INK}`,
                overflow: "hidden",
              }}
              className="rounded-3xl"
            >
              <div className="grid lg:grid-cols-5">
                <div
                  className={`lg:col-span-2 relative p-6 md:p-8 flex flex-col text-white bg-gradient-to-br ${theme.primary}`}
                  style={{ borderRight: `0 solid ${INK}` }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ ...halftone, opacity: 0.8 }}
                  />
                  <div className="relative z-10 flex flex-col h-full">
                    <span
                      className="self-start font-comic-chip text-sm px-3 py-1 rounded-full bg-yellow-300"
                      style={{ ...hard(2), color: INK }}
                    >
                      Workshop {position + 1} of {flat.length}
                    </span>

                    <h3
                      className="font-comic text-4xl sm:text-5xl md:text-6xl leading-tight mt-4 break-words"
                      style={{
                        color: "#fff",
                        letterSpacing: "0.04em",
                        WebkitTextStroke: `1.5px ${INK}`,
                        paintOrder: "stroke fill",
                        textShadow: `3px 3px 0 ${INK}`,
                      }}
                    >
                      {workshop.workshopName}
                    </h3>

                    {heroImg && (
                      <img
                        src={heroImg}
                        alt={workshop.workshopName}
                        className="mt-5 w-full max-h-56 object-contain rounded-xl bg-white"
                        style={hard(4)}
                      />
                    )}

                    <div className="mt-6 flex flex-wrap gap-2">
                      {ages.map((a, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setAgeIdx(i);
                            setTab("ages");
                          }}
                          className="font-comic-chip text-sm px-3 py-1 rounded-full bg-white hover:bg-yellow-200 transition-colors"
                          style={{ ...hard(2), color: INK }}
                        >
                          Age {a.ageRange}
                        </button>
                      ))}
                    </div>

                    <div className="mt-auto pt-6 flex flex-wrap gap-3">
                      {/* <button
                        onClick={() => setTab("register")}
                        className="font-comic text-xl tracking-widest px-6 py-3 rounded-xl bg-yellow-300 hover:bg-yellow-200 active:translate-x-[2px] active:translate-y-[2px] transition-all"
                        style={{ ...hard(4), color: INK }}
                      >
                        Register Now
                      </button> */}
                      {workshop.workshopName
                        .toLowerCase()
                        .includes("career corner") && (
                        <button
                          onClick={() => navigate("/services")}
                          className="font-comic-chip px-5 py-3 rounded-xl bg-white hover:bg-orange-100 transition-colors"
                          style={{ ...hard(3), color: INK }}
                        >
                          View Our Services
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="lg:col-span-3 p-4 md:p-8"
                  style={{ background: "#fdba74" }}
                >
                  <div
                    className="grid grid-cols-5 gap-1.5 md:gap-3"
                    role="tablist"
                  >
                    {TABS.map((t) => (
                      <button
                        key={t.id}
                        role="tab"
                        aria-selected={tab === t.id}
                        onClick={() => setTab(t.id)}
                        style={{
                          ...hard(tab === t.id ? 1 : 3),
                          background: tab === t.id ? "#fde047" : "#fff",
                          color: INK,
                        }}
                        className={`font-comic-chip tracking-wide py-2.5 rounded-xl text-[11px] sm:text-sm md:text-base transition-all ${
                          tab === t.id
                            ? "translate-x-[2px] translate-y-[2px]"
                            : "hover:-translate-y-0.5"
                        }`}
                      >
                        <span className="hidden md:inline">{t.label}</span>
                        <span className="md:hidden">{t.short}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 min-h-[320px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={tab + ageIdx}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {tab === "overview" && (
                          <div className="p-5 md:p-6 rounded-2xl" style={panel}>
                            <h4
                              className="font-comic text-3xl tracking-wide mb-3"
                              style={heading}
                            >
                              What's it about?
                            </h4>
                            <div
                              className="space-y-3 text-lg leading-relaxed"
                              style={{ color: INK }}
                            >
                              {workshop.overview ? (
                                workshop.overview
                                  .split("\n")
                                  .filter(Boolean)
                                  .map((l, i) => <p key={i}>{l}</p>)
                              ) : (
                                <p>
                                  Our {workshop.workshopName} program gives
                                  children engaging, hands-on learning that
                                  builds creativity, critical thinking and
                                  personal growth in a supportive environment.
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => setTab("ages")}
                              className="mt-5 font-comic-chip px-4 py-2 rounded-xl bg-yellow-300 hover:bg-yellow-200 transition-colors"
                              style={{ ...hard(3), color: INK }}
                            >
                              See age groups →
                            </button>
                          </div>
                        )}

                        {tab === "ages" && age && (
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {ages.map((a, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setAgeIdx(i);
                                    setOpenBenefit(0);
                                  }}
                                  className="font-comic-chip px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5"
                                  style={{
                                    ...hard(3),
                                    background:
                                      i === ageIdx ? "#fde047" : "#fff",
                                    color: INK,
                                  }}
                                >
                                  Age {a.ageRange}
                                </button>
                              ))}
                            </div>

                            <div className="p-5 rounded-2xl" style={panel}>
                              <h4
                                className="font-comic text-2xl tracking-wide mb-2"
                                style={heading}
                              >
                                Our Focus
                              </h4>
                              <p
                                className="text-lg leading-relaxed"
                                style={{ color: INK }}
                              >
                                {age.serviceOverview}
                              </p>
                            </div>

                            <div className="space-y-3">
                              <h4
                                className="font-comic text-2xl tracking-wide"
                                style={heading}
                              >
                                Benefits
                              </h4>
                              {(age.benefits || []).map((b, i) => {
                                const open = openBenefit === i;
                                return (
                                  <div
                                    key={i}
                                    className="rounded-xl bg-white"
                                    style={hard(3)}
                                  >
                                    <button
                                      onClick={() =>
                                        setOpenBenefit(open ? null : i)
                                      }
                                      className="w-full flex items-center justify-between gap-3 p-4 text-left"
                                      aria-expanded={open}
                                    >
                                      <span
                                        className="font-comic-chip text-lg tracking-wide"
                                        style={{ color: INK }}
                                      >
                                        {b.title}
                                      </span>
                                      <ChevronDown
                                        className={`w-6 h-6 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                                        style={{ color: INK }}
                                      />
                                    </button>
                                    <AnimatePresence initial={false}>
                                      {open && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{
                                            height: "auto",
                                            opacity: 1,
                                          }}
                                          exit={{ height: 0, opacity: 0 }}
                                          className="overflow-hidden"
                                        >
                                          <p
                                            className="px-4 pb-4 leading-relaxed"
                                            style={{ color: INK }}
                                          >
                                            {b.description}
                                          </p>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {tab === "why" && (
                          <div className="grid gap-4 sm:grid-cols-2">
                            {(workshop.whyChooseUs || []).map((r, i) => (
                              <div
                                key={i}
                                className="p-5 rounded-2xl"
                                style={panel}
                              >
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-gradient-to-r ${theme.primary}`}
                                  style={hard(3)}
                                >
                                  <span
                                    className="font-comic text-white text-2xl"
                                    style={{ textShadow: `2px 2px 0 ${INK}` }}
                                  >
                                    {i + 1}
                                  </span>
                                </div>
                                <h5
                                  className="font-comic text-2xl tracking-wide mb-2"
                                  style={heading}
                                >
                                  {r.heading}
                                </h5>
                                <p
                                  className="leading-relaxed"
                                  style={{ color: INK }}
                                >
                                  {r.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {tab === "kids" && (
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h4
                                className="font-comic text-3xl tracking-wide"
                                style={heading}
                              >
                                What kids say
                              </h4>
                              <span
                                className="font-comic-chip rounded-full bg-white px-3 py-1 text-sm"
                                style={{ ...hard(2), color: INK }}
                              >
                                {workshop.workshopName}
                              </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                              {testimonials.map((t, i) => (
                                <TestimonialCard
                                  key={`${t.name}-${i}`}
                                  t={t}
                                  i={i}
                                />
                              ))}
                            </div>

                            <button
                              onClick={() => setTab("register")}
                              className="font-comic-chip px-4 py-2 rounded-xl bg-yellow-300 hover:bg-yellow-200 transition-colors"
                              style={{ ...hard(3), color: INK }}
                            >
                              Join them →
                            </button>
                          </div>
                        )}

                        {tab === "register" && (
                          <div className="flex h-[520px] flex-col gap-4 overflow-y-auto overflow-x-hidden overscroll-contain pb-2 pr-2 font-bold text-[#1f1308] [scrollbar-color:#1f1308_transparent] [scrollbar-width:thin] lg:h-[600px]">
                            <section
                              className={`flex flex-col gap-4 rounded-2xl border-[3px] ${INK_B} bg-orange-100 p-5 shadow-[4px_4px_0_#1f1308]`}
                            >
                              <StepHeader n={1} title="Select Age" />
                              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {AGES.map((a) => (
                                  <button
                                    key={a}
                                    aria-pressed={regAge === a}
                                    onClick={() => setRegAge(a)}
                                    className={`${pill(regAge === a)} px-2 py-3 text-lg`}
                                  >
                                    Age {a}
                                  </button>
                                ))}
                              </div>
                            </section>

                            <section
                              className={`flex flex-col gap-4 rounded-2xl border-[3px] ${INK_B} bg-white p-5 shadow-[4px_4px_0_#1f1308] transition-opacity ${regAge ? "" : "pointer-events-none opacity-45"}`}
                            >
                              <StepHeader n={2} title="Select Duration" />
                              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                {DURATIONS.map((d) => (
                                  <button
                                    key={d.label}
                                    disabled={!regAge}
                                    aria-pressed={durationLabel === d.label}
                                    onClick={() => chooseDuration(d)}
                                    className={`${pill(durationLabel === d.label)} flex flex-col items-center px-2 py-4`}
                                  >
                                    <span className="text-lg">{d.label}</span>
                                    <span className="font-comic text-2xl tracking-wider text-orange-600">
                                      {formatPrice(d.price)}
                                    </span>
                                    <span className="text-xs font-medium opacity-70">
                                      {topicLimitFor(d)} videos
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </section>

                            <section
                              className={`flex flex-col gap-4 rounded-2xl border-[3px] ${INK_B} bg-white p-5 shadow-[4px_4px_0_#1f1308] transition-opacity ${duration ? "" : "pointer-events-none opacity-45"}`}
                            >
                              <StepHeader
                                n={3}
                                title="Choose Your Videos"
                                right={
                                  duration && (
                                    <span
                                      className={`rounded-full border-[3px] ${INK_B} bg-yellow-300 px-3 py-0.5 text-sm`}
                                    >
                                      {selected.length}/{limit}
                                    </span>
                                  )
                                }
                              />
                              <p className="text-sm font-medium opacity-80">
                                {duration
                                  ? remaining > 0
                                    ? `Your ${duration.label} plan includes ${limit} topics. Pick ${remaining} more.`
                                    : `All ${limit} topics selected. Deselect one to swap.`
                                  : "Choose a duration first to unlock topics."}
                              </p>

                              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                                {GROUPS.map((g) => (
                                  <button
                                    key={g}
                                    onClick={() => setGroup(g)}
                                    className={`shrink-0 rounded-full border-[3px] ${INK_B} px-4 py-1 text-sm ${
                                      group === g
                                        ? "bg-orange-400 text-white [text-shadow:1px_1px_0_#1f1308]"
                                        : "bg-white hover:bg-orange-100"
                                    }`}
                                  >
                                    {g}
                                  </button>
                                ))}
                              </div>

                              <div className="grid grid-cols-2 items-start gap-3 xl:grid-cols-3">
                                {visible.map((t) => {
                                  const isSel = selected.includes(t.id);
                                  const locked = !isSel && remaining <= 0;
                                  return (
                                    <VideoCard
                                      key={t.id}
                                      t={t}
                                      isSel={isSel}
                                      locked={locked}
                                      disabled={!duration || locked}
                                      open={openTopic === t.id}
                                      onToggle={() => toggle(t.id)}
                                      onDetails={() =>
                                        setOpenTopic(
                                          openTopic === t.id ? null : t.id,
                                        )
                                      }
                                    />
                                  );
                                })}
                              </div>
                            </section>

                            <section
                              className={`flex flex-col gap-4 rounded-2xl border-[3px] ${INK_B} bg-yellow-100 p-5 shadow-[4px_4px_0_#1f1308]`}
                            >
                              <h4
                                className="font-comic text-2xl tracking-wider"
                                style={heading}
                              >
                                Your Plan
                              </h4>

                              <dl className="flex flex-col gap-1 text-sm">
                                <div className="flex justify-between">
                                  <dt className="opacity-70">Age group</dt>
                                  <dd>{regAge || "—"}</dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="opacity-70">Duration</dt>
                                  <dd>{duration?.label ?? "—"}</dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="opacity-70">Topics</dt>
                                  <dd>
                                    {duration
                                      ? `${selected.length}/${limit}`
                                      : "—"}
                                  </dd>
                                </div>
                              </dl>

                              {chosen.length > 0 && (
                                <ul
                                  className={`max-h-48 overflow-y-auto rounded-xl border-[3px] ${INK_B} bg-white p-2 text-sm`}
                                >
                                  {chosen.map((t) => (
                                    <li
                                      key={t.id}
                                      className="flex items-center justify-between gap-2 py-0.5"
                                    >
                                      <span className="truncate">{t.name}</span>
                                      <button
                                        onClick={() => toggle(t.id)}
                                        className="shrink-0 text-xs text-red-600 underline"
                                      >
                                        remove
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              <div
                                className={`flex items-baseline justify-between border-t-[3px] border-dashed ${INK_B} pt-3`}
                              >
                                <span>Total</span>
                                <span className="font-comic text-3xl tracking-wider">
                                  {duration
                                    ? formatPrice(duration.price)
                                    : "₹0"}
                                </span>
                              </div>

                              <ul className="flex flex-col gap-1 text-xs font-semibold opacity-80">
                                <li>✓ Instant access to all your videos</li>
                                <li>✓ Welcome &amp; intro video included</li>
                                <li>✓ Learn at your own pace, on any device</li>
                              </ul>

                              <motion.button
                                disabled={!ready}
                                onClick={proceed}
                                whileHover={ready ? { y: -2 } : undefined}
                                whileTap={ready ? { x: 3, y: 3 } : undefined}
                                className={`font-comic w-full rounded-xl border-[3px] py-3.5 text-xl tracking-widest ${
                                  ready
                                    ? `${INK_B} bg-green-500 text-white shadow-[4px_4px_0_#1f1308] [text-shadow:2px_2px_0_#1f1308]`
                                    : "cursor-not-allowed border-[#8a7a66] bg-[#e7d9c4] text-[#8a7a66]"
                                }`}
                              >
                                {ctaLabel}
                              </motion.button>
                            </section>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {flat.length > 1 && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={() => step(-1)}
              aria-label="Previous workshop"
              className="flex items-center gap-1 font-comic-chip px-4 py-2.5 rounded-full bg-white hover:bg-yellow-200 transition-colors"
              style={{ ...hard(3), color: INK }}
            >
              <ChevronLeft className="w-5 h-5" />{" "}
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {flat.map((p, i) => (
                <button
                  key={i}
                  onClick={() => goTo(p.ci, p.wi)}
                  aria-label={`Go to workshop ${i + 1}`}
                  style={{ border: `2px solid ${INK}` }}
                  className={`h-4 rounded-full transition-all duration-300 ${
                    i === position
                      ? `w-10 bg-gradient-to-r ${theme.primary}`
                      : "w-4 bg-white hover:bg-orange-200"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => step(1)}
              aria-label="Next workshop"
              className="flex items-center gap-1 font-comic-chip px-4 py-2.5 rounded-full bg-white hover:bg-yellow-200 transition-colors"
              style={{ ...hard(3), color: INK }}
            >
              <span className="hidden sm:inline">Next</span>{" "}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkshopInfoCarousel;
