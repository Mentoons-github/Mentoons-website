// src/pages/workshop/RegisterWorkshopPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, ChevronDown, Clock, Play } from "lucide-react";
import {
  AGES,
  DURATIONS,
  GROUPS,
  TOPICS,
  formatPrice,
  saveEnrollment,
  topicLimitFor,
  type DurationOption,
} from "../../constant/workshops/workshopData";

const INK = "border-[#1f1308]";
const card = `rounded-3xl border-[3px] ${INK} bg-white shadow-[4px_4px_0_#1f1308]`;
const pill = (selected: boolean) =>
  `rounded-xl border-[3px] ${INK} text-[#1f1308] font-bold transition-all duration-150 ${
    selected
      ? "bg-yellow-300 shadow-[1px_1px_0_#1f1308] translate-x-[2px] translate-y-[2px]"
      : "bg-white shadow-[3px_3px_0_#1f1308] hover:-translate-y-0.5 hover:bg-yellow-100"
  }`;

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
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] ${INK} bg-orange-400 luckiest-guy-regular text-white [text-shadow:1px_1px_0_#1f1308]`}
    >
      {n}
    </span>
    <h2 className="luckiest-guy-regular text-2xl tracking-wider [text-shadow:2px_2px_0_#fb923c]">
      {title}
    </h2>
    {right && <div className="ml-auto">{right}</div>}
  </div>
);

/* ------------------------------------------------------------------ */
/* Compact video-style topic card (4 per row on xl)                    */
/* Add `thumbnail?: string` to your topic type in workshopData to show */
/* real images. Without it, the gradient + play button is shown.       */
/* ------------------------------------------------------------------ */
type Topic = (typeof TOPICS)[number] & { thumbnail?: string };

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
    className={`overflow-hidden rounded-xl border-[3px] ${INK} transition-all duration-150 ${
      isSel
        ? "translate-x-[2px] translate-y-[2px] bg-yellow-300 shadow-[1px_1px_0_#1f1308]"
        : "bg-white shadow-[3px_3px_0_#1f1308]"
    } ${locked ? "opacity-50" : ""}`}
  >
    {/* Thumbnail */}
    <button
      type="button"
      disabled={disabled}
      aria-pressed={isSel}
      aria-label={`${isSel ? "Remove" : "Add"} ${t.name}`}
      onClick={onToggle}
      className={`group relative block aspect-video w-full overflow-hidden border-b-[3px] ${INK} bg-gradient-to-br from-orange-300 via-yellow-200 to-orange-400 disabled:cursor-not-allowed`}
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

      {/* Play button */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full border-[2.5px] ${INK} bg-white shadow-[2px_2px_0_#1f1308] transition-transform duration-150 group-hover:scale-110`}
        >
          <Play
            className="ml-0.5 h-4 w-4 fill-[#1f1308] text-[#1f1308]"
            strokeWidth={2}
          />
        </span>
      </span>

      {/* Group tag */}
      <span
        className={`absolute left-1.5 top-1.5 max-w-[60%] truncate rounded border-2 ${INK} bg-white px-1.5 text-[9px] uppercase leading-4`}
      >
        {t.group}
      </span>

      {/* Selected check */}
      <span
        className={`absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${INK} ${
          isSel ? "bg-green-500" : "bg-white/90"
        }`}
      >
        {isSel && <Check className="h-3 w-3 text-white" strokeWidth={4} />}
      </span>

      {/* Duration badge */}
      <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-0.5 rounded bg-[#1f1308] px-1.5 py-px text-[10px] text-white">
        <Clock className="h-2.5 w-2.5" strokeWidth={3} />
        {t.minutes} min
      </span>
    </button>

    {/* Info */}
    <div className="flex flex-col gap-2 p-2">
      <h3 className="line-clamp-2 min-h-[2rem] text-[13px] leading-4">
        {t.name}
      </h3>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`w-full rounded-md border-2 ${INK} py-0.5 text-xs disabled:cursor-not-allowed ${
          isSel ? "bg-green-500 text-white" : "bg-white hover:bg-yellow-100"
        }`}
      >
        {isSel ? "✓ Added" : "+ Add"}
      </button>
    </div>

    {/* Details */}
    <button
      type="button"
      aria-expanded={open}
      onClick={onDetails}
      className={`flex w-full items-center justify-between border-t-2 border-dashed ${INK} px-2 py-1 text-[11px]`}
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
          <p className="px-2 pb-2 text-xs font-medium">{t.about}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const RegisterWorkshopPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [age, setAge] = useState("");
  const [durationLabel, setDurationLabel] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [group, setGroup] = useState(params.get("category") ?? "All");
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Sticky breaks when ANY ancestor has overflow hidden/auto/scroll.
  // This finds those ancestors and switches them to "clip" (same look,
  // but sticky works). Restored when you leave the page.
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const changed: { el: HTMLElement; ox: string; oy: string }[] = [];
    let el = gridRef.current?.parentElement ?? null;
    while (el && el !== document.documentElement) {
      const cs = getComputedStyle(el);
      const bad = (v: string) =>
        v === "hidden" || v === "auto" || v === "scroll";
      if (bad(cs.overflowX) || bad(cs.overflowY)) {
        changed.push({ el, ox: el.style.overflowX, oy: el.style.overflowY });
        el.style.overflowX = "clip";
        el.style.overflowY = "clip";
      }
      el = el.parentElement;
    }
    return () =>
      changed.forEach(({ el, ox, oy }) => {
        el.style.overflowX = ox;
        el.style.overflowY = oy;
      });
  }, []);

  const duration = DURATIONS.find((d) => d.label === durationLabel);
  const limit = duration ? topicLimitFor(duration) : 0;
  const remaining = limit - selected.length;
  const ready = Boolean(age && duration && selected.length === limit);

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
      age,
      duration: duration.label,
      price: duration.price,
      topicIds: selected,
      paidAt: Date.now(),
    });
    navigate("/workshop-learn");
  };

  const ctaLabel = ready
    ? `Proceed to Payment · ${formatPrice(duration!.price)} →`
    : !age
      ? "Select age to continue"
      : !duration
        ? "Select a duration"
        : `Select ${remaining} more topic${remaining === 1 ? "" : "s"}`;

  return (
    // NOTE: no overflow-* class here, any overflow on an ancestor breaks sticky.
    // pb-28 on small screens leaves room for the fixed bottom bar.
    <div className="relative min-h-screen bg-[#fffaf3] px-4 pb-28 pt-5 font-bold text-[#1f1308] sm:px-8 lg:px-12 lg:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(#1f1308 1.6px, transparent 1.6px)",
          backgroundSize: "26px 26px",
        }}
      />
      <main className="relative z-10 mx-auto flex max-w-[1300px] flex-col gap-6">
        <button
          onClick={() => navigate(-1)}
          className={`inline-flex items-center gap-2 self-start rounded-xl border-[3px] ${INK} bg-white px-4 py-1.5 shadow-[3px_3px_0_#1f1308] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`}
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={3} /> Back
        </button>

        <header>
          <h1 className="luckiest-guy-regular text-5xl tracking-wider text-white [-webkit-text-stroke:1.5px_#1f1308] [paint-order:stroke_fill] [text-shadow:3px_3px_0_#1f1308] md:text-6xl">
            Register Now
          </h1>
          <p className="mt-2 text-lg font-medium">
            Pick the age group, a plan, then the videos your child wants to
            learn.
          </p>
        </header>

        {/* Left = Your Plan (fixed 300px, sticky). Right = steps. */}
        <div
          ref={gridRef}
          className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]"
        >
          {/* LEFT: sticky "Your Plan" (desktop only) */}
          <aside
            className={`${card} hidden flex-col gap-4 bg-yellow-100 p-5 lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto`}
          >
            <h2 className="luckiest-guy-regular text-2xl tracking-wider [text-shadow:2px_2px_0_#fb923c]">
              Your Plan
            </h2>

            <dl className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between">
                <dt className="opacity-70">Age group</dt>
                <dd>{age || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="opacity-70">Duration</dt>
                <dd>{duration?.label ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="opacity-70">Topics</dt>
                <dd>{duration ? `${selected.length}/${limit}` : "—"}</dd>
              </div>
            </dl>

            {chosen.length > 0 && (
              <ul
                className={`max-h-56 overflow-y-auto rounded-xl border-[3px] ${INK} bg-white p-2 text-sm`}
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
              className={`flex items-baseline justify-between border-t-[3px] border-dashed ${INK} pt-3`}
            >
              <span>Total</span>
              <span className="luckiest-guy-regular text-3xl tracking-wider">
                {duration ? formatPrice(duration.price) : "₹0"}
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
              className={`luckiest-guy-regular w-full rounded-xl border-[3px] py-3.5 text-xl tracking-widest ${
                ready
                  ? `${INK} bg-green-500 text-white shadow-[4px_4px_0_#1f1308] [text-shadow:2px_2px_0_#1f1308]`
                  : "cursor-not-allowed border-[#8a7a66] bg-[#e7d9c4] text-[#8a7a66]"
              }`}
            >
              {ctaLabel}
            </motion.button>
          </aside>

          {/* RIGHT: steps */}
          <div className="flex min-w-0 flex-col gap-6">
            {/* Step 1 */}
            <section
              className={`${card} flex flex-col gap-4 bg-orange-100 p-5`}
            >
              <StepHeader n={1} title="Select Age" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {AGES.map((a) => (
                  <button
                    key={a}
                    aria-pressed={age === a}
                    onClick={() => setAge(a)}
                    className={`${pill(age === a)} px-2 py-3 text-lg`}
                  >
                    Age {a}
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2 */}
            <section
              className={`${card} flex flex-col gap-4 p-5 transition-opacity ${age ? "" : "pointer-events-none opacity-45"}`}
            >
              <StepHeader n={2} title="Select Duration" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {DURATIONS.map((d) => (
                  <button
                    key={d.label}
                    disabled={!age}
                    aria-pressed={durationLabel === d.label}
                    onClick={() => chooseDuration(d)}
                    className={`${pill(durationLabel === d.label)} flex flex-col items-center px-2 py-4`}
                  >
                    <span className="text-lg">{d.label}</span>
                    <span className="luckiest-guy-regular text-2xl tracking-wider text-orange-600">
                      {formatPrice(d.price)}
                    </span>
                    <span className="text-xs font-medium opacity-70">
                      {topicLimitFor(d)} videos
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3 */}
            <section
              className={`${card} flex flex-col gap-4 p-5 transition-opacity ${duration ? "" : "pointer-events-none opacity-45"}`}
            >
              <StepHeader
                n={3}
                title="Choose Your Videos"
                right={
                  duration && (
                    <span
                      className={`rounded-full border-[3px] ${INK} bg-yellow-300 px-3 py-0.5 text-sm`}
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

              {/* group filter */}
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {GROUPS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGroup(g)}
                    className={`shrink-0 rounded-full border-[3px] ${INK} px-4 py-1 text-sm ${
                      group === g
                        ? "bg-orange-400 text-white [text-shadow:1px_1px_0_#1f1308]"
                        : "bg-white hover:bg-orange-100"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* video cards: 2 / 3 / 4 per row */}
              <div className="grid grid-cols-2 items-start gap-3 md:grid-cols-3 xl:grid-cols-4">
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
                        setOpenTopic(openTopic === t.id ? null : t.id)
                      }
                    />
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Mobile/tablet sticky summary bar (below 1024px) */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t-[3px] ${INK} bg-yellow-100 px-4 py-3 lg:hidden`}
      >
        <div className="text-sm leading-tight">
          <div className="opacity-70">
            {duration ? `${selected.length}/${limit} topics` : "No plan yet"}
          </div>
          <div className="luckiest-guy-regular text-2xl tracking-wider">
            {duration ? formatPrice(duration.price) : "₹0"}
          </div>
        </div>
        <button
          disabled={!ready}
          onClick={proceed}
          className={`luckiest-guy-regular rounded-xl border-[3px] px-4 py-2 text-base tracking-widest ${
            ready
              ? `${INK} bg-green-500 text-white shadow-[3px_3px_0_#1f1308]`
              : "cursor-not-allowed border-[#8a7a66] bg-[#e7d9c4] text-[#8a7a66]"
          }`}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
};

export default RegisterWorkshopPage;
