import { useState, useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { fetchMyReports, submitDailyReport } from "@/api/dailyReport";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Loader2,
  Lock,
} from "lucide-react";

const LOGO_URL =
  "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png";

const DAY_LABELS = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
// 0 = Sunday, 6 = Saturday. Change this to match your working days.
const OFF_DAYS = [0, 6];

type YesNo = "YES" | "NO" | "";
type DayState = "submitted" | "missed" | "pending" | "off" | "future";

// What the employee fills in
interface ReportForm {
  task: string;
  notes: string;
  tools: string;
  complete: YesNo;
  reason: string;
  plan: string;
  didAsDiscussed: YesNo;
}

// What comes back from the server (signature fields are set by the admin only)
interface ReportRecord extends ReportForm {
  date: string; // "YYYY-MM-DD"
  submittedAt?: string;
  signature?: string | null;
  signedByName?: string | null;
  signedAt?: string | null;
}

/* ---------- date helpers (local time, no timezone surprises) ---------- */
const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const fromKey = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const startOfWeek = (d: Date) => addDays(d, -d.getDay());

const displayDate = (k: string) => {
  const d = fromKey(k);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}/${d.getFullYear()}`;
};

const emptyForm = (): ReportForm => ({
  task: "",
  notes: "",
  tools: "",
  complete: "",
  reason: "",
  plan: "",
  didAsDiscussed: "",
});

const pickForm = (r: ReportRecord): ReportForm => ({
  task: r.task || "",
  notes: r.notes || "",
  tools: r.tools || "",
  complete: r.complete || "",
  reason: r.reason || "",
  plan: r.plan || "",
  didAsDiscussed: r.didAsDiscussed || "",
});

const dayStyles: Record<DayState, string> = {
  submitted: "border-green-300 bg-green-50 text-green-700",
  missed: "border-red-300 bg-red-50 text-red-600",
  pending: "border-amber-300 bg-amber-50 text-amber-700",
  off: "border-slate-200 bg-slate-50 text-slate-400",
  future: "border-slate-200 bg-white text-slate-300 cursor-not-allowed",
};

const dayLabel: Record<DayState, string> = {
  submitted: "Submitted",
  missed: "Missed",
  pending: "Pending",
  off: "Off",
  future: "",
};

const ruledStyle = {
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent, transparent 27px, #b0b8c4 27px, #b0b8c4 28px)",
  backgroundPosition: "0 28px",
  lineHeight: "28px",
};

const DailyReport = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { showStatus } = useStatusModal();

  const todayKey = toKey(new Date());

  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date()));
  const [selectedKey, setSelectedKey] = useState<string>(todayKey);
  const [reports, setReports] = useState<Record<string, ReportRecord>>({});
  const [form, setForm] = useState<ReportForm>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // unsaved edits kept while the person switches between days
  const drafts = useRef<Record<string, ReportForm>>({});

  /* ---------- derived values ---------- */
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    toKey(addDays(weekStart, i)),
  );

  const getDayState = (k: string): DayState => {
    if (OFF_DAYS.includes(fromKey(k).getDay())) return "off";
    if (k > todayKey) return "future";
    if (reports[k]) return "submitted";
    return k === todayKey ? "pending" : "missed";
  };

  const savedReport = reports[selectedKey];
  const selectedState = getDayState(selectedKey);
  const isPastDay = selectedKey < todayKey;
  // The admin has signed this report, so it can no longer be changed.
  const signed = !!savedReport?.signature;

  // Locked: weekends, future days, admin-signed reports, and past days
  // that are already submitted. Today (until signed) and missed past days stay editable.
  const locked =
    selectedState === "off" ||
    selectedState === "future" ||
    signed ||
    (selectedState === "submitted" && isPastDay);

  const workingDays = weekDays.filter(
    (k) => getDayState(k) !== "off" && k <= todayKey,
  );
  const submittedCount = workingDays.filter((k) => reports[k]).length;
  const missedCount = workingDays.filter(
    (k) => !reports[k] && k < todayKey,
  ).length;

  const canGoNext = toKey(addDays(weekStart, 7)) <= todayKey;

  /* ---------- data ---------- */
  useEffect(() => {
    fetchWeek();
  }, [weekStart]);

  useEffect(() => {
    const saved = reports[selectedKey];
    const base = emptyForm();
    setForm(
      saved
        ? { ...base, ...pickForm(saved) }
        : drafts.current[selectedKey] || base,
    );
    setErrors([]);
  }, [selectedKey, reports]);

  const fetchWeek = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        showStatus("error", "Authentication error. Please log in again.");
        return;
      }

      const result = await fetchMyReports(
        toKey(weekStart),
        toKey(addDays(weekStart, 6)),
        token,
      );

      if (!result.success || !result.data) {
        showStatus("error", result.error || "Failed to fetch daily reports");
        return;
      }

      const map: Record<string, ReportRecord> = {};
      (result.data.reports || []).forEach((r) => {
        map[String(r.date).slice(0, 10)] = r as ReportRecord;
      });
      setReports(map);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const missing: string[] = [];
    if (!form.task.trim()) missing.push("Task");
    if (!form.complete) missing.push("Complete or incomplete");
    if (form.complete === "NO" && !form.reason.trim())
      missing.push("Reason (required when not completed)");
    if (!form.didAsDiscussed) missing.push("Did as per discussed");

    if (missing.length) {
      setErrors(missing);
      return;
    }
    setErrors([]);

    try {
      setSaving(true);
      const token = await getToken();
      if (!token) {
        showStatus("error", "Authentication error. Please log in again.");
        return;
      }

      // No signature here: only the admin can sign a report.
      // The server works out the "late" flag itself.
      const result = await submitDailyReport(
        {
          date: selectedKey,
          task: form.task,
          notes: form.notes,
          tools: form.tools,
          complete: form.complete,
          reason: form.complete === "NO" ? form.reason : "",
          plan: form.plan,
          didAsDiscussed: form.didAsDiscussed,
        },
        token,
      );

      if (!result.success) {
        showStatus("error", result.error || "Failed to save the report");
        return;
      }

      delete drafts.current[selectedKey];
      setReports((prev) => ({
        ...prev,
        [selectedKey]: {
          ...prev[selectedKey],
          ...form,
          date: selectedKey,
          submittedAt: new Date().toISOString(),
        },
      }));
      showStatus("success", `Report for ${displayDate(selectedKey)} saved.`);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- navigation ---------- */
  const selectDay = (k: string) => {
    if (getDayState(k) === "future") return;
    if (!reports[selectedKey]) drafts.current[selectedKey] = form;
    setSelectedKey(k);
  };

  const changeWeek = (direction: -1 | 1) => {
    if (!reports[selectedKey]) drafts.current[selectedKey] = form;
    const next = addDays(weekStart, direction * 7);
    setWeekStart(next);
    const monday = toKey(addDays(next, 1));
    setSelectedKey(monday > todayKey ? todayKey : monday);
  };

  /* ---------- form helpers ---------- */
  const handle =
    (field: keyof ReportForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  /* ---------- UI ---------- */
  const statusChip = () => {
    if (selectedState === "off")
      return {
        text: "Weekend, no report needed",
        cls: "bg-slate-100 text-slate-600",
      };
    if (signed)
      return { text: "Signed by admin", cls: "bg-green-100 text-green-700" };
    if (savedReport)
      return {
        text: "Submitted, waiting for admin signature",
        cls: "bg-blue-100 text-blue-700",
      };
    if (selectedState === "missed")
      return { text: "Missed", cls: "bg-red-100 text-red-600" };
    return { text: "Not submitted", cls: "bg-amber-100 text-amber-700" };
  };
  const chip = statusChip();

  const fieldCls = "disabled:cursor-not-allowed disabled:text-gray-800";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-800 rounded-2xl p-6 md:p-8 text-white shadow-2xl mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Daily Report</h1>
                <p className="text-blue-100 mt-1">
                  Fill this in every evening after work.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {[
                {
                  label: "Submitted this week",
                  value: submittedCount,
                  icon: <CheckCircle2 className="w-6 h-6" />,
                },
                {
                  label: "Missed this week",
                  value: missedCount,
                  icon: <AlertCircle className="w-6 h-6" />,
                },
                {
                  label: "Working days so far",
                  value: workingDays.length,
                  icon: <CalendarDays className="w-6 h-6" />,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">{s.label}</p>
                      <p className="text-3xl font-bold">{s.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      {s.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Week strip */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-5 mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => changeWeek(-1)}
              className="w-10 h-10 shrink-0 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-7 gap-1.5 md:gap-3 flex-1">
              {weekDays.map((k) => {
                const st = getDayState(k);
                const d = fromKey(k);
                return (
                  <button
                    key={k}
                    onClick={() => selectDay(k)}
                    disabled={st === "future"}
                    className={`rounded-xl border py-2 px-1 text-center transition ${dayStyles[st]} ${
                      k === selectedKey ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <div className="text-xs font-medium opacity-80">
                      {DAY_LABELS[d.getDay()]}
                    </div>
                    <div
                      className={`text-lg font-semibold ${
                        k === todayKey
                          ? "underline decoration-orange-500 decoration-2 underline-offset-4"
                          : ""
                      }`}
                    >
                      {d.getDate()}
                    </div>
                    <div className="text-[11px] h-4 hidden sm:block">
                      {dayLabel[st]}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => changeWeek(1)}
              disabled={!canGoNext}
              className="w-10 h-10 shrink-0 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next week"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="max-w-4xl mx-auto mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-semibold ${chip.cls}`}
            >
              {chip.text}
            </span>
            <span className="text-slate-600 text-sm">
              {fromKey(selectedKey).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
            {loading && (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            )}
          </div>

          {selectedState !== "off" && selectedState !== "future" && !signed && (
            <button
              onClick={handleSubmit}
              disabled={locked || saving}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving
                ? "Saving..."
                : savedReport
                  ? "Update report"
                  : isPastDay
                    ? "Submit late report"
                    : "Submit report"}
            </button>
          )}
        </div>

        {errors.length > 0 && (
          <div className="max-w-4xl mx-auto mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
            Please fill in: {errors.join(", ")}.
          </div>
        )}

        {/* Report sheet */}
        <div className="bg-white w-full max-w-4xl mx-auto border-2 border-gray-700 shadow-xl">
          <div className="flex justify-end gap-1 px-3 pt-2 pb-1">
            {DAY_LABELS.map((d, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-700">{d}</span>
                <div
                  className={`w-6 h-6 border border-gray-500 mt-0.5 ${
                    fromKey(selectedKey).getDay() === i
                      ? "bg-blue-400"
                      : "bg-white"
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] border-t-2 border-gray-700">
            <div className="bg-[#b8d8e8] md:border-r-2 border-gray-700 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="italic font-bold text-gray-800 text-sm whitespace-nowrap">
                  DATE :
                </span>
                <input
                  type="text"
                  value={displayDate(selectedKey)}
                  readOnly
                  className="flex-1 bg-transparent border-b border-gray-500 text-sm outline-none italic font-semibold text-gray-800"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="italic font-bold text-gray-800 text-sm whitespace-nowrap">
                  NAME :
                </span>
                <input
                  type="text"
                  value={user?.fullName || ""}
                  readOnly
                  className="flex-1 bg-transparent border-b border-gray-500 text-sm outline-none italic font-semibold text-gray-800"
                />
              </div>
            </div>

            <div className="bg-[#b8d8e8] md:border-r-2 border-gray-700 flex items-center justify-center px-6 py-3">
              <img
                src={LOGO_URL}
                alt="Logo"
                className="w-48 h-24 object-contain"
              />
            </div>

            <div className="bg-[#ede8ec] flex items-center justify-center p-3">
              <span className="italic font-bold text-gray-800 text-base tracking-widest">
                NOTES
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t-2 border-gray-700 md:h-[340px]">
            <div className="md:border-r-2 border-gray-700 p-3 flex flex-col h-[260px] md:h-auto">
              <div className="italic font-bold text-gray-800 text-sm mb-2">
                TASK :
              </div>
              <textarea
                value={form.task}
                onChange={handle("task")}
                disabled={locked}
                className={`flex-1 resize-none outline-none text-sm text-gray-800 bg-transparent ${fieldCls}`}
                style={ruledStyle}
              />
            </div>
            <div className="p-3 flex flex-col h-[260px] md:h-auto border-t-2 md:border-t-0 border-gray-700">
              <textarea
                value={form.notes}
                onChange={handle("notes")}
                disabled={locked}
                className={`flex-1 resize-none outline-none text-sm text-gray-800 bg-transparent ${fieldCls}`}
                style={ruledStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t-2 border-gray-700">
            <div className="md:border-r-2 border-gray-700 p-3 bg-white min-h-[72px]">
              <div className="italic font-bold text-gray-800 text-sm mb-1">
                TOOLS AND RESOURCES :
              </div>
              <input
                type="text"
                value={form.tools}
                onChange={handle("tools")}
                disabled={locked}
                className={`w-full border-b border-gray-400 outline-none text-sm bg-transparent ${fieldCls}`}
              />
            </div>
            <div className="bg-[#f5eef8] flex flex-col items-center justify-center p-3 min-h-[72px] border-t-2 md:border-t-0 border-gray-700">
              <div className="italic font-bold text-gray-800 text-sm text-center">
                COMPLETE OR INCOMPLETE :
              </div>
              <div className="italic font-bold text-gray-800 text-sm mb-1">
                (YES/NO)
              </div>
              <div className="flex gap-4">
                {(["YES", "NO"] as const).map((v) => (
                  <label
                    key={v}
                    className="flex items-center gap-1 text-sm font-bold italic text-gray-800 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="complete"
                      value={v}
                      checked={form.complete === v}
                      disabled={locked}
                      onChange={() => setForm((f) => ({ ...f, complete: v }))}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t-2 border-gray-700">
            <div className="md:border-r-2 border-gray-700 p-3 bg-white min-h-[72px]">
              <div className="italic font-bold text-gray-800 text-sm mb-1">
                REASON (If not Completed):
              </div>
              <textarea
                value={form.reason}
                onChange={handle("reason")}
                disabled={locked}
                rows={2}
                className={`w-full resize-none outline-none text-sm bg-transparent border-b border-gray-300 ${fieldCls}`}
              />
            </div>
            <div className="p-3 bg-white min-h-[72px] border-t-2 md:border-t-0 border-gray-700">
              <div className="italic font-bold text-gray-800 text-sm mb-1">
                PLAN OF ACTION :
              </div>
              <textarea
                value={form.plan}
                onChange={handle("plan")}
                disabled={locked}
                rows={2}
                className={`w-full resize-none outline-none text-sm bg-transparent border-b border-gray-300 ${fieldCls}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t-2 border-gray-700">
            <div className="md:border-r-2 border-gray-700 p-3 bg-white min-h-[110px] flex items-center gap-3 flex-wrap">
              <span className="italic font-bold text-gray-800 text-sm whitespace-nowrap">
                DID AS PER DISCUSSED :
              </span>
              <div className="flex gap-4">
                {(["YES", "NO"] as const).map((v) => (
                  <label
                    key={v}
                    className="flex items-center gap-1 text-sm font-bold italic text-gray-800 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="didAsDiscussed"
                      value={v}
                      checked={form.didAsDiscussed === v}
                      disabled={locked}
                      onChange={() =>
                        setForm((f) => ({ ...f, didAsDiscussed: v }))
                      }
                    />
                    {v}
                  </label>
                ))}
              </div>
            </div>

            {/* Signature: admin only. Employees see it locked. */}
            <div className="p-3 bg-gray-50 min-h-[110px] flex items-center gap-2 border-t-2 md:border-t-0 border-gray-700">
              <span className="italic font-bold text-gray-800 text-sm">
                SIGNATURE :
              </span>
              <div className="flex-1 h-20 border-b border-gray-500 flex items-end overflow-hidden">
                {signed ? (
                  <img
                    src={savedReport!.signature!}
                    alt="Admin signature"
                    className="h-full max-w-full object-contain object-left mix-blend-multiply"
                  />
                ) : (
                  <span className="text-xs text-gray-400 italic flex items-center gap-1 pb-1">
                    <Lock className="w-3 h-3" />
                    Admin signs after review
                  </span>
                )}
              </div>
              {signed && savedReport?.signedByName && (
                <span className="text-[11px] text-gray-500 whitespace-nowrap">
                  {savedReport.signedByName}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;
