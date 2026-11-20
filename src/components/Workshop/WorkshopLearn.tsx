// src/pages/workshop/WorkshopLearnPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Info,
  NotebookPen,
  Play,
  PlayCircle,
} from "lucide-react";
import {
  VIDEO_URLS,
  buildCurriculum,
  fmtTime,
  getEnrollment,
} from "../../constant/workshops/workshopData";

const INK = "border-[#1f1308]";
const card = `rounded-3xl border-[3px] ${INK} bg-white shadow-[4px_4px_0_#1f1308]`;
const btn = `inline-flex items-center justify-center gap-1.5 rounded-xl border-[3px] ${INK} px-4 py-1.5 text-sm shadow-[2px_2px_0_#1f1308] transition-transform enabled:hover:-translate-y-0.5 enabled:active:translate-x-0.5 enabled:active:translate-y-0.5 enabled:active:shadow-none disabled:opacity-40 disabled:shadow-none`;

const read = <T,>(k: string, f: T): T => {
  try {
    const r = localStorage.getItem(k);
    return r ? (JSON.parse(r) as T) : f;
  } catch {
    return f;
  }
};
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* ignore */
  }
};

type Tab = "about" | "notes";

const WorkshopLearnPage = () => {
  const navigate = useNavigate();
  const enrollment = useMemo(getEnrollment, []);

  // not paid / no enrollment -> send back to registration
  useEffect(() => {
    if (!enrollment) navigate("/workshop-register", { replace: true });
  }, [enrollment, navigate]);

  // Flat list of videos: intro first, then one video per chosen topic.
  const videos = useMemo(
    () => (enrollment ? buildCurriculum(enrollment.topicIds) : []),
    [enrollment],
  );

  const progKey = `workshop:progress:${enrollment?.paidAt ?? 0}`;
  const [done, setDone] = useState<string[]>(() => read<string[]>(progKey, []));
  const [activeId, setActiveId] = useState("intro"); // intro always first
  const [autoplay, setAutoplay] = useState(false); // true after the user clicks a video
  const [tab, setTab] = useState<Tab>("about");
  const [note, setNote] = useState("");

  const idx = Math.max(
    videos.findIndex((v) => v.id === activeId),
    0,
  );
  const active = videos[idx];

  useEffect(() => {
    setNote(read<string>(`${progKey}:note:${activeId}`, ""));
  }, [activeId, progKey]);

  if (!enrollment || !active) return null;

  const select = (id: string, play = true) => {
    setActiveId(id);
    setAutoplay(play);
    if (window.innerWidth < 1024)
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setDoneFor = (id: string, v: boolean) => {
    const next = v
      ? Array.from(new Set([...done, id]))
      : done.filter((d) => d !== id);
    setDone(next);
    write(progKey, next);
  };
  const isDone = done.includes(active.id);

  const completeAndNext = () => {
    setDoneFor(active.id, true);
    if (videos[idx + 1]) select(videos[idx + 1].id);
  };

  const progress = Math.round((done.length / videos.length) * 100);
  const total = videos.reduce((a, v) => a + v.minutes, 0);
  const base = VIDEO_URLS[active.id];
  const src = base
    ? `${base}${base.includes("?") ? "&" : "?"}rel=0${autoplay ? "&autoplay=1" : ""}`
    : "";

  return (
    // overflow-x-clip (NOT hidden) so the sticky videos list keeps working
    <div className="relative min-h-screen overflow-x-clip bg-[#fffaf3] px-4 pb-14 pt-5 font-bold text-[#1f1308] sm:px-8 lg:px-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(#1f1308 1.6px, transparent 1.6px)",
          backgroundSize: "26px 26px",
        }}
      />
      <main className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-5">
        {/* top bar */}
        <div
          className={`${card} flex flex-wrap items-center gap-4 bg-orange-300 p-4`}
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase opacity-70">
              My learning · Age {enrollment.age} · {enrollment.duration}
            </p>
            <h1 className="luckiest-guy-regular truncate text-2xl tracking-wider sm:text-3xl">
              Music Workshop
            </h1>
          </div>
          <div className="flex w-full items-center gap-3 sm:w-72">
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className={`h-4 flex-1 overflow-hidden rounded-full border-[3px] ${INK} bg-white`}
            >
              <div
                className="h-full bg-green-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm">{progress}%</span>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          {/* PLAYER */}
          <div className="flex flex-col gap-4">
            <section className={`${card} overflow-hidden`}>
              <div
                className={`relative aspect-video border-b-[3px] ${INK} bg-[#1f1308]`}
              >
                {src ? (
                  <iframe
                    key={src}
                    src={src}
                    title={active.title}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-orange-200 p-4 text-center">
                    <span
                      className={`flex h-20 w-20 items-center justify-center rounded-full border-[3px] ${INK} bg-white shadow-[4px_4px_0_#1f1308]`}
                    >
                      <Play className="ml-1 h-9 w-9 fill-[#1f1308]" />
                    </span>
                    <span className="luckiest-guy-regular text-[clamp(20px,3.5vw,34px)] tracking-wider">
                      {active.title}
                    </span>
                    <span
                      className={`rounded-full border-[3px] ${INK} bg-white px-3 py-0.5 text-sm`}
                    >
                      Video coming soon
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 p-4 sm:p-5">
                <div>
                  <p className="text-sm font-semibold opacity-70">
                    {active.group} · Video {idx + 1} of {videos.length}
                  </p>
                  <h2 className="luckiest-guy-regular mt-0.5 text-2xl tracking-wider sm:text-4xl">
                    {active.title}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border-[3px] ${INK} bg-yellow-100 px-3 py-0.5 text-sm`}
                  >
                    <Clock className="h-3.5 w-3.5" strokeWidth={3} />{" "}
                    {active.minutes} min
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setDoneFor(active.id, !isDone)}
                      aria-pressed={isDone}
                      className={`${btn} ${isDone ? "bg-green-300" : "bg-white"}`}
                    >
                      <CheckCircle2 className="h-4 w-4" strokeWidth={3} />
                      {isDone ? "Completed" : "Mark complete"}
                    </button>
                    <button
                      disabled={idx === 0}
                      onClick={() => select(videos[idx - 1].id)}
                      className={`${btn} bg-white`}
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={3} /> Prev
                    </button>
                    <button
                      disabled={idx === videos.length - 1}
                      onClick={completeAndNext}
                      className={`${btn} bg-yellow-300`}
                    >
                      Complete &amp; next{" "}
                      <ChevronRight className="h-4 w-4" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* tabs under the video */}
            <section className={`${card} overflow-hidden`}>
              <div
                role="tablist"
                className={`flex gap-2 border-b-[3px] ${INK} bg-orange-50 p-3`}
              >
                {(
                  [
                    ["about", "About", Info],
                    ["notes", "My notes", NotebookPen],
                  ] as const
                ).map(([id, label, Icon]) => (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={tab === id}
                    onClick={() => setTab(id)}
                    className={`inline-flex items-center gap-2 rounded-xl border-[3px] ${INK} px-4 py-1.5 text-sm ${
                      tab === id
                        ? "bg-orange-400 text-white shadow-[2px_2px_0_#1f1308] [text-shadow:1px_1px_0_#1f1308]"
                        : "bg-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={3} /> {label}
                  </button>
                ))}
              </div>
              <div className="min-h-[140px] p-4 sm:p-5">
                {tab === "about" && (
                  <div className="flex flex-col gap-2">
                    <h3 className="luckiest-guy-regular text-xl tracking-wider">
                      {active.title}
                    </h3>
                    <p className="font-medium">{active.about}</p>
                    <p className="text-sm opacity-75">
                      {active.group} · {active.minutes} min
                    </p>
                  </div>
                )}
                {tab === "notes" && (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={note}
                      onChange={(e) => {
                        setNote(e.target.value);
                        write(`${progKey}:note:${activeId}`, e.target.value);
                      }}
                      rows={5}
                      placeholder="Write what you learned or what to practise next..."
                      className={`w-full resize-y rounded-xl border-[3px] ${INK} bg-yellow-50 p-3 font-semibold outline-none focus-visible:ring-4 focus-visible:ring-orange-300`}
                    />
                    <p className="text-xs opacity-70">
                      Saved automatically on this device.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* YOUR VIDEOS: flat list, one row per video, sticky on desktop */}
          <aside className={`${card} overflow-hidden lg:sticky lg:top-24`}>
            <div
              className={`flex items-center justify-between border-b-[3px] ${INK} bg-orange-50 p-4`}
            >
              <h2 className="luckiest-guy-regular text-xl tracking-wider">
                Your videos
              </h2>
              <span className="text-xs opacity-70">
                {done.length}/{videos.length} done · {fmtTime(total)}
              </span>
            </div>

            <ul className="max-h-[60vh] overflow-y-auto lg:max-h-[calc(100vh-13rem)]">
              {videos.map((v, i) => {
                const isActive = v.id === activeId;
                const d = done.includes(v.id);
                return (
                  <li key={v.id}>
                    <button
                      onClick={() => select(v.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex w-full items-center gap-3 px-3 py-3 text-left ${
                        i > 0 ? `border-t-2 border-dashed ${INK}` : ""
                      } ${
                        isActive
                          ? "bg-yellow-300"
                          : v.intro
                            ? "bg-green-200 hover:bg-green-300"
                            : "bg-white hover:bg-orange-50"
                      }`}
                    >
                      {d ? (
                        <CheckCircle2
                          className="h-5 w-5 shrink-0 text-green-600"
                          strokeWidth={3}
                        />
                      ) : isActive ? (
                        <PlayCircle
                          className="h-5 w-5 shrink-0"
                          strokeWidth={3}
                        />
                      ) : (
                        <Circle
                          className="h-5 w-5 shrink-0 opacity-50"
                          strokeWidth={3}
                        />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm leading-tight">
                          {i + 1}. {v.title}
                        </span>
                        <span className="text-xs font-semibold opacity-70">
                          {v.group} · {v.minutes} min
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default WorkshopLearnPage;
