import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AGES = ["6-12", "13-19"];

interface DurationOption {
  label: string;
  price: number; 
  topicLimit: number;
}

const DURATIONS: DurationOption[] = [
  { label: "4 Weeks", price: 2000, topicLimit: 20 },
  { label: "1 Month", price: 3500, topicLimit: 28 },
  { label: "3 Months", price: 9000, topicLimit: 36 },
  { label: "6 Months", price: 16000, topicLimit: 48 },
];

interface Topic {
  id: string;
  name: string;
  group: string;
  videoDuration: string;
  sessions: number;
  sessionLength: string;
  startDate: string; 
  about: string;
}

const TOPICS: Topic[] = [
  // Vocals
  {
    id: "v1",
    name: "Breathing & Posture",
    group: "Vocals",
    videoDuration: "1h 20m",
    sessions: 4,
    sessionLength: "45 min",
    startDate: "2026-11-09",
    about: "Diaphragm breathing, posture and warm-ups.",
  },
  {
    id: "v2",
    name: "Pitch Control",
    group: "Vocals",
    videoDuration: "1h 45m",
    sessions: 6,
    sessionLength: "45 min",
    startDate: "2026-11-16",
    about: "Train your ear and hit notes accurately.",
  },
  {
    id: "v3",
    name: "Scales & Range",
    group: "Vocals",
    videoDuration: "2h 00m",
    sessions: 6,
    sessionLength: "45 min",
    startDate: "2026-11-23",
    about: "Major/minor scales and expanding vocal range.",
  },
  {
    id: "v4",
    name: "Song Performance",
    group: "Vocals",
    videoDuration: "2h 30m",
    sessions: 8,
    sessionLength: "60 min",
    startDate: "2026-12-01",
    about: "Stage presence and performing a full song.",
  },
  // Guitar
  {
    id: "g1",
    name: "Chords Basics",
    group: "Guitar",
    videoDuration: "1h 30m",
    sessions: 4,
    sessionLength: "45 min",
    startDate: "2026-11-09",
    about: "Open chords and clean chord changes.",
  },
  {
    id: "g2",
    name: "Strumming Patterns",
    group: "Guitar",
    videoDuration: "1h 15m",
    sessions: 4,
    sessionLength: "45 min",
    startDate: "2026-11-16",
    about: "Rhythm, strumming and timing.",
  },
  {
    id: "g3",
    name: "Fingerstyle",
    group: "Guitar",
    videoDuration: "2h 10m",
    sessions: 6,
    sessionLength: "45 min",
    startDate: "2026-11-23",
    about: "Picking patterns and melody playing.",
  },
  {
    id: "g4",
    name: "Lead & Solos",
    group: "Guitar",
    videoDuration: "2h 40m",
    sessions: 8,
    sessionLength: "60 min",
    startDate: "2026-12-01",
    about: "Scales, bends and your first solo.",
  },
  // Keyboard
  {
    id: "k1",
    name: "Keys & Notes",
    group: "Keyboard",
    videoDuration: "1h 10m",
    sessions: 4,
    sessionLength: "45 min",
    startDate: "2026-11-10",
    about: "Finding notes, hand position and reading basics.",
  },
  {
    id: "k2",
    name: "Chords & Progressions",
    group: "Keyboard",
    videoDuration: "1h 50m",
    sessions: 6,
    sessionLength: "45 min",
    startDate: "2026-11-17",
    about: "Play chords and common progressions.",
  },
  {
    id: "k3",
    name: "Both-Hand Playing",
    group: "Keyboard",
    videoDuration: "2h 05m",
    sessions: 6,
    sessionLength: "45 min",
    startDate: "2026-11-24",
    about: "Coordinate left and right hand together.",
  },
  {
    id: "k4",
    name: "Play Your First Song",
    group: "Keyboard",
    videoDuration: "2h 20m",
    sessions: 8,
    sessionLength: "60 min",
    startDate: "2026-12-02",
    about: "Learn and perform a full song.",
  },
  // Drums
  {
    id: "d1",
    name: "Grip & Basic Beats",
    group: "Drums",
    videoDuration: "1h 05m",
    sessions: 4,
    sessionLength: "45 min",
    startDate: "2026-11-10",
    about: "Stick grip, posture and your first beat.",
  },
  {
    id: "d2",
    name: "Rudiments",
    group: "Drums",
    videoDuration: "1h 40m",
    sessions: 6,
    sessionLength: "45 min",
    startDate: "2026-11-17",
    about: "Essential rudiments for speed and control.",
  },
  {
    id: "d3",
    name: "Fills & Transitions",
    group: "Drums",
    videoDuration: "1h 55m",
    sessions: 6,
    sessionLength: "45 min",
    startDate: "2026-11-24",
    about: "Add fills and smooth section changes.",
  },
  {
    id: "d4",
    name: "Playing With Tracks",
    group: "Drums",
    videoDuration: "2h 15m",
    sessions: 8,
    sessionLength: "60 min",
    startDate: "2026-12-02",
    about: "Keep time while playing along with songs.",
  },
  // Violin
  {
    id: "vi1",
    name: "Holding & Bowing",
    group: "Violin",
    videoDuration: "1h 15m",
    sessions: 4,
    sessionLength: "45 min",
    startDate: "2026-11-11",
    about: "Posture, bow hold and open strings.",
  },
  {
    id: "vi2",
    name: "First Position Notes",
    group: "Violin",
    videoDuration: "1h 45m",
    sessions: 6,
    sessionLength: "45 min",
    startDate: "2026-11-18",
    about: "Finger placement and simple tunes.",
  },
  {
    id: "vi3",
    name: "Intonation",
    group: "Violin",
    videoDuration: "2h 00m",
    sessions: 6,
    sessionLength: "45 min",
    startDate: "2026-11-25",
    about: "Play in tune with ear-training drills.",
  },
  {
    id: "vi4",
    name: "Short Pieces",
    group: "Violin",
    videoDuration: "2h 25m",
    sessions: 8,
    sessionLength: "60 min",
    startDate: "2026-12-03",
    about: "Learn and perform beginner pieces.",
  },
  // Music Production
  {
    id: "m1",
    name: "DAW Basics",
    group: "Music Production",
    videoDuration: "1h 30m",
    sessions: 4,
    sessionLength: "45 min",
    startDate: "2026-11-11",
    about: "Navigate a DAW, record and edit audio.",
  },
  {
    id: "m2",
    name: "Beat Making",
    group: "Music Production",
    videoDuration: "2h 00m",
    sessions: 6,
    sessionLength: "45 min",
    startDate: "2026-11-18",
    about: "Build drum patterns and loops.",
  },
  {
    id: "m3",
    name: "Mixing Basics",
    group: "Music Production",
    videoDuration: "2h 10m",
    sessions: 6,
    sessionLength: "45 min",
    startDate: "2026-11-25",
    about: "EQ, compression and balancing a track.",
  },
  {
    id: "m4",
    name: "Finish a Track",
    group: "Music Production",
    videoDuration: "2h 45m",
    sessions: 8,
    sessionLength: "60 min",
    startDate: "2026-12-03",
    about: "Arrange, mix and export your own song.",
  },
];

const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

interface RegisterWorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const pill = (selected: boolean) =>
  `rounded-xl border-[3px] border-[#1f1308] text-[#1f1308] font-semibold transition-all duration-150 ${
    selected
      ? "bg-yellow-300 shadow-[1px_1px_0_#1f1308] translate-x-[2px] translate-y-[2px]"
      : "bg-white shadow-[3px_3px_0_#1f1308] hover:-translate-y-0.5 hover:bg-yellow-100"
  }`;

const StepBadge = ({ n }: { n: number }) => (
  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[3px] border-[#1f1308] bg-orange-400 luckiest-guy-regular text-base text-white [text-shadow:1px_1px_0_#1f1308]">
    {n}
  </span>
);

const StepTitle = ({ children }: { children: string }) => (
  <h2 className="luckiest-guy-regular text-2xl tracking-wider text-[#1f1308] [text-shadow:2px_2px_0_#fb923c]">
    {children}
  </h2>
);

const RegisterWorkshopModal = ({
  isOpen,
  onClose,
}: RegisterWorkshopModalProps) => {
  const navigate = useNavigate();
  const [age, setAge] = useState("");
  const [durationLabel, setDurationLabel] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [openTopic, setOpenTopic] = useState<string | null>(null); // FAQ-style accordion

  // reset every time the modal opens
  useEffect(() => {
    if (isOpen) {
      setAge("");
      setDurationLabel("");
      setSelectedTopics([]);
      setOpenTopic(null);
    }
  }, [isOpen]);

  // close on Esc + lock page scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  const duration = DURATIONS.find((d) => d.label === durationLabel);
  const limit = duration?.topicLimit ?? 0;
  const remaining = limit - selectedTopics.length;
  const ready = Boolean(age && duration && selectedTopics.length === limit);

  const chooseDuration = (d: DurationOption) => {
    setDurationLabel(d.label);
    // if the new plan allows fewer topics, trim the selection
    setSelectedTopics((prev) => prev.slice(0, d.topicLimit));
  };

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) => {
      if (prev.includes(id)) return prev.filter((t) => t !== id);
      if (prev.length >= limit) return prev;
      return [...prev, id];
    });
  };

  const chosen = TOPICS.filter((t) => selectedTopics.includes(t.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1308]/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Register for workshop"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative flex max-h-[92vh] w-full max-w-xl flex-col gap-5 overflow-y-auto rounded-3xl border-4 border-[#1f1308] bg-orange-300 p-5 shadow-[8px_8px_0_#1f1308] md:p-7"
          >
            {/* Close */}
            <motion.button
              type="button"
              onClick={onClose}
              aria-label="Close"
              whileHover={{
                scale: 1.1,
                rotate: 90,
                backgroundColor: "#fde047",
              }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-[#1f1308] bg-white shadow-[3px_3px_0_#1f1308]"
            >
              <X className="h-5 w-5 text-[#1f1308]" strokeWidth={3} />
            </motion.button>

            {/* Header */}
            <div className="pr-12">
              <h1 className="luckiest-guy-regular text-4xl tracking-wider text-white [-webkit-text-stroke:1.5px_#1f1308] [paint-order:stroke_fill] [text-shadow:3px_3px_0_#1f1308]">
                Register Now
              </h1>
              <p className="mt-1 text-base font-medium text-[#1f1308]">
                Pick the age group, a plan, then the topics your child wants to
                learn.
              </p>
            </div>

            {/* Step 1 — Age */}
            <section className="flex flex-col gap-3 rounded-2xl border-[3px] border-[#1f1308] bg-white p-4 shadow-[5px_5px_0_#1f1308]">
              <div className="flex items-center gap-3">
                <StepBadge n={1} />
                <StepTitle>Select Age</StepTitle>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {AGES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={age === a}
                    onClick={() => setAge(a)}
                    className={`${pill(age === a)} px-2 py-3 text-lg`}
                  >
                    Age {a}
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2 — Duration / Plan */}
            <section
              className={`flex flex-col gap-3 rounded-2xl border-[3px] border-[#1f1308] bg-white p-4 shadow-[5px_5px_0_#1f1308] transition-opacity duration-200 ${
                age ? "opacity-100" : "pointer-events-none opacity-45"
              }`}
              aria-disabled={!age}
            >
              <div className="flex items-center gap-3">
                <StepBadge n={2} />
                <StepTitle>Select Duration</StepTitle>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {DURATIONS.map((d) => (
                  <button
                    key={d.label}
                    type="button"
                    disabled={!age}
                    aria-pressed={durationLabel === d.label}
                    onClick={() => chooseDuration(d)}
                    className={`${pill(durationLabel === d.label)} flex flex-col items-center px-2 py-3`}
                  >
                    <span className="text-lg">{d.label}</span>
                    <span className="luckiest-guy-regular text-xl tracking-wider text-orange-600">
                      {formatPrice(d.price)}
                    </span>
                    <span className="text-xs font-medium text-[#1f1308]/70">
                      {d.topicLimit} topics
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3 — Topics */}
            <section
              className={`flex flex-col gap-3 rounded-2xl border-[3px] border-[#1f1308] bg-white p-4 shadow-[5px_5px_0_#1f1308] transition-opacity duration-200 ${
                duration ? "opacity-100" : "pointer-events-none opacity-45"
              }`}
              aria-disabled={!duration}
            >
              <div className="flex items-center gap-3">
                <StepBadge n={3} />
                <StepTitle>Select Topics</StepTitle>
                {duration && (
                  <span className="ml-auto rounded-full border-[3px] border-[#1f1308] bg-yellow-300 px-3 py-0.5 text-sm font-bold text-[#1f1308]">
                    {selectedTopics.length}/{limit}
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-[#1f1308]/80">
                {duration
                  ? remaining > 0
                    ? `Your ${duration.label} plan includes ${limit} topics. Pick ${remaining} more. Tap “Details” to see videos, sessions and start date.`
                    : `All ${limit} topics selected. Deselect one to swap.`
                  : "Choose a duration first to unlock topics."}
              </p>

              {/* Flat list — no group headings */}
              <div className="flex max-h-[360px] flex-col gap-2 overflow-y-auto pr-1">
                {TOPICS.map((t) => {
                  const selected = selectedTopics.includes(t.id);
                  const locked = !selected && remaining <= 0;
                  const open = openTopic === t.id;
                  return (
                    <div
                      key={t.id}
                      className={`rounded-xl border-[3px] border-[#1f1308] ${
                        selected ? "bg-yellow-300" : "bg-white"
                      } ${locked ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center gap-2 p-2">
                        <button
                          type="button"
                          disabled={!duration || locked}
                          aria-pressed={selected}
                          onClick={() => toggleTopic(t.id)}
                          className="flex flex-1 items-center gap-3 text-left font-semibold text-[#1f1308] disabled:cursor-not-allowed"
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-[3px] border-[#1f1308] ${
                              selected ? "bg-green-500" : "bg-white"
                            }`}
                          >
                            {selected && (
                              <Check
                                className="h-4 w-4 text-white"
                                strokeWidth={4}
                              />
                            )}
                          </span>
                          <span className="text-base">{t.name}</span>
                        </button>

                        <button
                          type="button"
                          aria-expanded={open}
                          aria-controls={`topic-${t.id}`}
                          onClick={() => setOpenTopic(open ? null : t.id)}
                          className="flex shrink-0 items-center gap-1 rounded-lg border-[2px] border-[#1f1308] bg-white px-2 py-1 text-xs font-bold text-[#1f1308] hover:bg-yellow-100"
                        >
                          Details
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              open ? "rotate-180" : ""
                            }`}
                            strokeWidth={3}
                          />
                        </button>
                      </div>

                      {/* FAQ-style details */}
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            id={`topic-${t.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-2 border-t-[3px] border-dashed border-[#1f1308] px-3 py-3 text-sm text-[#1f1308]">
                              <p className="font-medium">{t.about}</p>
                              <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
                                <div>
                                  <dt className="text-xs font-bold uppercase text-[#1f1308]/60">
                                    Video duration
                                  </dt>
                                  <dd className="font-semibold">
                                    {t.videoDuration}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-xs font-bold uppercase text-[#1f1308]/60">
                                    Sessions
                                  </dt>
                                  <dd className="font-semibold">
                                    {t.sessions} × {t.sessionLength}
                                  </dd>
                                </div>
                                <div className="col-span-2">
                                  <dt className="text-xs font-bold uppercase text-[#1f1308]/60">
                                    Sessions start on
                                  </dt>
                                  <dd className="font-semibold">
                                    {formatDate(t.startDate)}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Summary */}
            <AnimatePresence>
              {ready && duration && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-2 rounded-xl border-[3px] border-[#1f1308] bg-yellow-300 px-4 py-3 text-base font-semibold text-[#1f1308] shadow-[3px_3px_0_#1f1308]">
                    <div className="flex items-center justify-between gap-3">
                      <span>
                        Age {age} · {duration.label} · {chosen.length} topics
                      </span>
                      <span className="luckiest-guy-regular text-2xl tracking-wider">
                        {formatPrice(duration.price)}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-0.5 text-sm font-medium">
                      {chosen.map((t) => (
                        <li key={t.id} className="flex justify-between gap-2">
                          <span>{t.name}</span>
                          <span className="shrink-0">
                            starts {formatDate(t.startDate)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA */}
            <motion.button
              type="button"
              disabled={!ready}
              onClick={() => {
                if (!duration) return;
                onClose();
                navigate(
                  `/payment?age=${encodeURIComponent(age)}&duration=${encodeURIComponent(duration.label)}&topics=${encodeURIComponent(selectedTopics.join(","))}&price=${duration.price}`,
                );
              }}
              whileHover={ready ? { y: -2 } : undefined}
              whileTap={ready ? { x: 3, y: 3 } : undefined}
              className={`luckiest-guy-regular w-full rounded-xl border-[3px] py-3.5 text-2xl tracking-widest transition-colors ${
                ready
                  ? "border-[#1f1308] bg-green-500 text-white shadow-[4px_4px_0_#1f1308] [text-shadow:2px_2px_0_#1f1308] active:shadow-none"
                  : "cursor-not-allowed border-[#8a7a66] bg-[#e7d9c4] text-[#8a7a66]"
              }`}
            >
              {ready
                ? `Proceed to Payment · ${formatPrice(duration!.price)} →`
                : !age
                  ? "Select age to continue"
                  : !duration
                    ? "Select a duration"
                    : `Select ${remaining} more topic${remaining === 1 ? "" : "s"}`}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterWorkshopModal;
