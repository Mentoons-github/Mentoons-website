import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useStatusModal } from "@/context/adda/statusModalContext";
import {
  fetchReportsByDate,
  signDailyReport,
  fetchMySignature,
  saveMySignature,
  deleteMySignature,
  DailyReportRow,
} from "@/api/dailyReport";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Check,
  Clock,
  AlertCircle,
  ArrowLeft,
  PenLine,
  Loader2,
  Search,
} from "lucide-react";

const LOGO_URL =
  "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png";

const DAY_LABELS = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
// 0 = Sunday, 6 = Saturday. Keep this the same as OFF_DAYS in the backend.
const OFF_DAYS = [0, 6];

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // photo/scan before it is shrunk
const SIGNATURE_MAX_WIDTH = 600;

type Tab = "type" | "draw" | "upload";
type Filter = "all" | "missing" | "submitted" | "signed";

const STATUS: Record<DailyReportRow["status"], { text: string; cls: string }> =
  {
    signed: { text: "Signed", cls: "bg-green-100 text-green-700" },
    submitted: {
      text: "Waiting for signature",
      cls: "bg-blue-100 text-blue-700",
    },
    missing: { text: "Not submitted", cls: "bg-red-100 text-red-600" },
  };

// Ruled-paper look. The line height matches the 28px row so text sits on the lines.
const ruledStyle = {
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent, transparent 27px, #9aa3b2 27px, #9aa3b2 28px)",
  backgroundPosition: "0 28px",
  lineHeight: "28px",
};

/* ---------- date helpers (local time) ---------- */
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

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/* ---------- YES / NO marks (read-only) ---------- */
// The employee's answer is a filled round badge with a tick:
// green for YES, red for NO. The other option stays an empty grey circle.
const YesNoMark = ({ value }: { value?: string }) => (
  <div className="flex gap-6">
    {(["YES", "NO"] as const).map((v) => {
      const selected = value === v;
      const filled =
        v === "YES"
          ? "bg-green-600 border-green-600"
          : "bg-red-600 border-red-600";

      return (
        <div
          key={v}
          className="flex items-center gap-2"
          aria-label={`${v}${selected ? " (selected)" : ""}`}
        >
          <span
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              selected ? filled : "bg-white border-gray-400"
            }`}
          >
            {selected && (
              <Check className="w-5 h-5 text-white" strokeWidth={3.5} />
            )}
          </span>
          <span
            className={`text-lg italic font-extrabold ${
              selected ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {v}
          </span>
        </div>
      );
    })}
  </div>
);

const AdminDailyReports = () => {
  const { getToken } = useAuth();
  const { showStatus } = useStatusModal();
  const [searchParams, setSearchParams] = useSearchParams();

  const todayKey = toKey(new Date());

  // Opened from the email link -> ?date=YYYY-MM-DD&employee=<employeeId>
  const linkDate = searchParams.get("date");
  const initialKey =
    linkDate && /^\d{4}-\d{2}-\d{2}$/.test(linkDate) && linkDate <= todayKey
      ? linkDate
      : todayKey;

  // The employee from the link. It is opened once that date's rows load.
  const pendingOpenId = useRef<string | null>(searchParams.get("employee"));

  const [weekStart, setWeekStart] = useState<Date>(
    startOfWeek(fromKey(initialKey)),
  );
  const [selectedKey, setSelectedKey] = useState<string>(initialKey);
  const [rows, setRows] = useState<DailyReportRow[]>([]);
  const [isOffDay, setIsOffDay] = useState(false);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  // signing
  // sigDraft is the image shown in the signature box before signing.
  // useSaved = true means the server will use the saved signature
  // and no image is sent.
  const [sigDraft, setSigDraft] = useState<string | null>(null);
  const [useSaved, setUseSaved] = useState(false);
  const [signing, setSigning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("type");
  const [typedSig, setTypedSig] = useState("");
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const typeCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const hasDrawn = useRef(false);

  // saved (scanned) signature stored on the admin's account
  const [savedSig, setSavedSig] = useState<string | null>(null);
  const [uploadedSig, setUploadedSig] = useState<string | null>(null);
  const [saveForLater, setSaveForLater] = useState(true);
  const [savingSig, setSavingSig] = useState(false);

  // ignore answers from older requests when the date changes quickly
  const requestId = useRef(0);

  /* ---------- derived values ---------- */
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    toKey(addDays(weekStart, i)),
  );
  const canGoNext = toKey(addDays(weekStart, 7)) <= todayKey;

  const count = (s: DailyReportRow["status"]) =>
    rows.filter((r) => r.status === s).length;
  const signedCount = count("signed");
  const waitingCount = count("submitted");
  const missingCount = count("missing");

  const visibleRows = rows.filter(
    (r) =>
      (filter === "all" || r.status === filter) &&
      r.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const openRow = rows.find((r) => r.employeeId === openId) || null;
  const report = openRow?.report || null;
  const isSigned = openRow?.status === "signed";

  const clearDraft = () => {
    setSigDraft(null);
    setUseSaved(false);
  };

  /* ---------- data ---------- */
  useEffect(() => {
    setOpenId(null);
    clearDraft();
    loadRows();
  }, [selectedKey]);

  // load the admin's saved signature once
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const res = await fetchMySignature(token);
      if (res.success) setSavedSig(res.data?.signature ?? null);
    })();
  }, []);

  const loadRows = async () => {
    const myRequest = ++requestId.current;
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        showStatus("error", "Authentication error. Please log in again.");
        return;
      }

      const result = await fetchReportsByDate(selectedKey, token);
      if (myRequest !== requestId.current) return;

      if (!result.success || !result.data) {
        setRows([]);
        showStatus("error", result.error || "Failed to fetch reports");
        return;
      }

      const employees = result.data.employees || [];
      setRows(employees);
      setIsOffDay(
        result.data.isOffDay ??
          OFF_DAYS.includes(fromKey(selectedKey).getDay()),
      );

      // Came from the email link, so open that employee's report straight
      // away. If they are not in the list, the full list is shown instead.
      if (pendingOpenId.current) {
        const target = employees.find(
          (e) => e.employeeId === pendingOpenId.current,
        );
        if (target) setOpenId(target.employeeId);
        pendingOpenId.current = null;
        setSearchParams({}, { replace: true }); // clean the URL
      }
    } finally {
      if (myRequest === requestId.current) setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!openRow || !report?._id || !sigDraft) return;

    try {
      setSigning(true);
      const token = await getToken();
      if (!token) {
        showStatus("error", "Authentication error. Please log in again.");
        return;
      }

      // saved signature: send only a flag, the server attaches the image
      const payload = useSaved
        ? ({ useSaved: true } as const)
        : { signature: sigDraft };

      const result = await signDailyReport(report._id, payload, token);
      if (!result.success) {
        showStatus("error", result.error || "Failed to sign the report");
        return;
      }

      const signedReport = result.data?.report;
      setRows((prev) =>
        prev.map((r) =>
          r.employeeId === openRow.employeeId
            ? {
                ...r,
                status: "signed",
                report: { ...r.report!, ...signedReport },
              }
            : r,
        ),
      );
      clearDraft();
      showStatus("success", `Report signed for ${openRow.name}.`);
    } finally {
      setSigning(false);
    }
  };

  /* ---------- saved signature ---------- */
  const useSavedSignature = () => {
    if (!savedSig) return;
    setSigDraft(savedSig); // preview only
    setUseSaved(true);
  };

  const removeSavedSignature = async () => {
    const token = await getToken();
    if (!token) return;
    const res = await deleteMySignature(token);
    if (!res.success) {
      showStatus("error", res.error || "Could not remove saved signature");
      return;
    }
    setSavedSig(null);
    if (useSaved) clearDraft();
    showStatus("success", "Saved signature removed.");
  };

  /* ---------- navigation ---------- */
  const changeWeek = (direction: -1 | 1) => {
    const next = addDays(weekStart, direction * 7);
    setWeekStart(next);
    // keep the same weekday, but never go past today
    let k = toKey(addDays(next, fromKey(selectedKey).getDay()));
    if (k > todayKey) k = todayKey;
    setSelectedKey(k);
  };

  const pickDate = (value: string) => {
    if (!value || value > todayKey) return;
    setSelectedKey(value);
    setWeekStart(startOfWeek(fromKey(value)));
  };

  /* ---------- signature modal ---------- */
  useEffect(() => {
    if (activeTab === "type" && typeCanvasRef.current) {
      const canvas = typeCanvasRef.current;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "36px 'Brush Script MT', cursive";
      ctx.fillStyle = "#1a1a8c";
      ctx.fillText(typedSig, 10, 45);
    }
  }, [typedSig, activeTab, modalOpen]);

  useEffect(() => {
    if (activeTab === "draw" && drawCanvasRef.current) {
      const ctx = drawCanvasRef.current.getContext("2d")!;
      ctx.strokeStyle = "#1a1a8c";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
    }
  }, [activeTab, modalOpen]);

  const openModal = () => {
    setTypedSig("");
    setUploadedSig(null);
    setSaveForLater(true);
    hasDrawn.current = false;
    // if there is no saved signature yet, start on the Upload tab
    setActiveTab(savedSig ? "type" : "upload");
    setModalOpen(true);
  };

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    };
  };

  const onDrawStart = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getPos(e);
    canvas.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const onDrawMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const ctx = drawCanvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    hasDrawn.current = true;
  };

  const onDrawEnd = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = drawCanvasRef.current!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn.current = false;
  };

  // Scanned or photographed signature: shrink it, make the white paper
  // transparent so only the ink is left, then crop to the ink.
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allows choosing the same file again
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showStatus("error", "Please choose an image file (PNG or JPG).");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      showStatus("error", "Image is too large. Maximum size is 5 MB.");
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const scale = Math.min(1, SIGNATURE_MAX_WIDTH / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
        // lum >= 230 -> transparent, lum <= 100 -> solid ink
        px[i + 3] = Math.max(0, Math.min(255, ((230 - lum) * 255) / 130));
      }
      ctx.putImageData(data, 0, 0);

      // crop to the area that actually has ink, with a small margin
      let minX = canvas.width,
        minY = canvas.height,
        maxX = 0,
        maxY = 0;
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          if (px[(y * canvas.width + x) * 4 + 3] > 20) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (maxX > minX && maxY > minY) {
        const pad = 6;
        const sx = Math.max(0, minX - pad);
        const sy = Math.max(0, minY - pad);
        const sw = Math.min(canvas.width - sx, maxX - minX + pad * 2);
        const sh = Math.min(canvas.height - sy, maxY - minY + pad * 2);

        const out = document.createElement("canvas");
        out.width = sw;
        out.height = sh;
        out.getContext("2d")!.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
        setUploadedSig(out.toDataURL("image/png"));
      } else {
        setUploadedSig(canvas.toDataURL("image/png"));
      }

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      showStatus("error", "Could not read that image. Try another file.");
    };

    img.src = url;
  };

  const applySig = async () => {
    // Uploaded scan: optionally save it to the account, then use the saved one
    if (activeTab === "upload") {
      if (!uploadedSig) {
        setModalOpen(false);
        return;
      }

      if (saveForLater) {
        try {
          setSavingSig(true);
          const token = await getToken();
          if (!token) {
            showStatus("error", "Authentication error. Please log in again.");
            return;
          }
          const res = await saveMySignature(uploadedSig, token);
          if (!res.success) {
            showStatus("error", res.error || "Could not save signature");
            return;
          }
          setSavedSig(uploadedSig);
          setSigDraft(uploadedSig);
          setUseSaved(true);
          showStatus("success", "Signature saved to your account.");
        } finally {
          setSavingSig(false);
        }
      } else {
        // one-off use, the image itself is sent
        setSigDraft(uploadedSig);
        setUseSaved(false);
      }

      setModalOpen(false);
      return;
    }

    let url: string | null = null;
    if (activeTab === "type" && typedSig.trim())
      url = typeCanvasRef.current?.toDataURL() ?? null;
    if (activeTab === "draw" && hasDrawn.current)
      url = drawCanvasRef.current?.toDataURL() ?? null;

    if (url) {
      setSigDraft(url);
      setUseSaved(false);
    }
    setModalOpen(false);
  };

  /* ---------- UI ---------- */
  const filterTabs: { key: Filter; label: string; n: number }[] = [
    { key: "all", label: "All", n: rows.length },
    { key: "submitted", label: "Waiting for signature", n: waitingCount },
    { key: "signed", label: "Signed", n: signedCount },
    { key: "missing", label: "Not submitted", n: missingCount },
  ];

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
                <h1 className="text-2xl md:text-3xl font-bold">
                  Employee Daily Reports
                </h1>
                <p className="text-blue-100 mt-1">
                  {fromKey(selectedKey).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {[
                {
                  label: "Signed",
                  value: signedCount,
                  icon: <CheckCircle2 className="w-6 h-6" />,
                },
                {
                  label: "Waiting for signature",
                  value: waitingCount,
                  icon: <Clock className="w-6 h-6" />,
                },
                {
                  label: "Not submitted",
                  value: missingCount,
                  icon: <AlertCircle className="w-6 h-6" />,
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

        {/* Date picker + week strip */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-5 mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <label className="text-sm font-medium text-slate-600">
              Select date
            </label>
            <input
              type="date"
              value={selectedKey}
              max={todayKey}
              onChange={(e) => pickDate(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => pickDate(todayKey)}
              disabled={selectedKey === todayKey}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Today
            </button>
          </div>

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
                const d = fromKey(k);
                const future = k > todayKey;
                const off = OFF_DAYS.includes(d.getDay());
                return (
                  <button
                    key={k}
                    onClick={() => pickDate(k)}
                    disabled={future}
                    className={`rounded-xl border py-2 px-1 text-center transition ${
                      k === selectedKey
                        ? "bg-blue-600 border-blue-600 text-white"
                        : off
                          ? "bg-slate-50 border-slate-200 text-slate-400"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    } ${future ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <div className="text-xs font-medium opacity-80">
                      {DAY_LABELS[d.getDay()]}
                    </div>
                    <div
                      className={`text-lg font-semibold ${
                        k === todayKey && k !== selectedKey
                          ? "underline decoration-orange-500 decoration-2 underline-offset-4"
                          : ""
                      }`}
                    >
                      {d.getDate()}
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

        {/* ---------- Employee list ---------- */}
        {!openRow && (
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {filterTabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setFilter(t.key)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                      filter === t.key
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t.label} ({t.n})
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employee"
                  className="border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-56"
                />
              </div>
            </div>

            {isOffDay && (
              <div className="mb-4 rounded-xl bg-slate-100 text-slate-600 text-sm px-4 py-3">
                This is a day off, so reports are not expected.
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                Loading employees...
              </div>
            ) : visibleRows.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                {rows.length === 0
                  ? "No active employees found."
                  : "No employees match this filter."}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {visibleRows.map((r) => (
                  <button
                    key={r.employeeId}
                    onClick={() => {
                      clearDraft();
                      setOpenId(r.employeeId);
                    }}
                    className="w-full flex items-center gap-4 py-3 px-2 text-left hover:bg-slate-50 rounded-xl transition"
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold shrink-0">
                      {initials(r.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 truncate">
                        {r.name}
                      </div>
                      <div className="text-sm text-slate-500 truncate capitalize">
                        {[r.jobRole, r.department].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS[r.status].cls}`}
                    >
                      {STATUS[r.status].text}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------- Task sheet for the chosen employee ---------- */}
        {openRow && (
          <div>
            <div className="max-w-4xl mx-auto mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => {
                    setOpenId(null);
                    clearDraft();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  All employees
                </button>
                <span className="font-semibold text-slate-800">
                  {openRow.name}
                </span>
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold ${STATUS[openRow.status].cls}`}
                >
                  {STATUS[openRow.status].text}
                </span>
              </div>

              {report && !isSigned && (
                <button
                  onClick={handleSign}
                  disabled={!sigDraft || signing}
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {signing ? "Signing..." : "Sign report"}
                </button>
              )}
            </div>

            {!report ? (
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-10 text-center text-slate-500">
                {openRow.name} has not submitted a report for{" "}
                {displayDate(selectedKey)}.
              </div>
            ) : (
              <div className="bg-white w-full max-w-4xl mx-auto border-2 border-gray-700 shadow-xl">
                <div className="flex justify-end gap-1 px-3 pt-2 pb-1">
                  {DAY_LABELS.map((d, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-xs font-bold text-gray-700">
                        {d}
                      </span>
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
                      <span className="flex-1 border-b border-gray-500 text-base italic font-bold text-gray-900">
                        {displayDate(selectedKey)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="italic font-bold text-gray-800 text-sm whitespace-nowrap">
                        NAME :
                      </span>
                      <span className="flex-1 border-b border-gray-500 text-base italic font-bold text-gray-900">
                        {openRow.name}
                      </span>
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

                {/* TASK and NOTES: larger, darker text */}
                <div className="grid grid-cols-1 md:grid-cols-2 border-t-2 border-gray-700">
                  <div className="md:border-r-2 border-gray-700 p-3 min-h-[260px]">
                    <div className="italic font-bold text-gray-800 text-sm mb-2">
                      TASK :
                    </div>
                    <div
                      className="text-base font-medium text-gray-900 whitespace-pre-wrap break-words"
                      style={ruledStyle}
                    >
                      {report.task}
                    </div>
                  </div>
                  <div className="p-3 min-h-[260px] border-t-2 md:border-t-0 border-gray-700">
                    <div
                      className="text-base font-medium text-gray-900 whitespace-pre-wrap break-words"
                      style={ruledStyle}
                    >
                      {report.notes}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 border-t-2 border-gray-700">
                  <div className="md:border-r-2 border-gray-700 p-3 min-h-[72px]">
                    <div className="italic font-bold text-gray-800 text-sm mb-1">
                      TOOLS AND RESOURCES :
                    </div>
                    <div className="text-base font-medium text-gray-900 border-b border-gray-400 min-h-[28px]">
                      {report.tools}
                    </div>
                  </div>

                  {/* COMPLETE / INCOMPLETE */}
                  <div className="bg-[#f5eef8] flex flex-col items-center justify-center p-3 min-h-[72px] border-t-2 md:border-t-0 border-gray-700">
                    <div className="italic font-bold text-gray-800 text-sm text-center">
                      COMPLETE OR INCOMPLETE :
                    </div>
                    <div className="italic font-bold text-gray-800 text-sm mb-2">
                      (YES/NO)
                    </div>
                    <YesNoMark value={report.complete} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 border-t-2 border-gray-700">
                  <div className="md:border-r-2 border-gray-700 p-3 min-h-[72px]">
                    <div className="italic font-bold text-gray-800 text-sm mb-1">
                      REASON (If not Completed):
                    </div>
                    <div className="text-base font-medium text-gray-900 whitespace-pre-wrap break-words border-b border-gray-400 min-h-[48px]">
                      {report.reason}
                    </div>
                  </div>
                  <div className="p-3 min-h-[72px] border-t-2 md:border-t-0 border-gray-700">
                    <div className="italic font-bold text-gray-800 text-sm mb-1">
                      PLAN OF ACTION :
                    </div>
                    <div className="text-base font-medium text-gray-900 whitespace-pre-wrap break-words border-b border-gray-400 min-h-[48px]">
                      {report.plan}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 border-t-2 border-gray-700">
                  {/* DID AS PER DISCUSSED */}
                  <div className="md:border-r-2 border-gray-700 p-3 min-h-[110px] flex items-center gap-4 flex-wrap">
                    <span className="italic font-bold text-gray-800 text-sm whitespace-nowrap">
                      DID AS PER DISCUSSED :
                    </span>
                    <YesNoMark value={report.didAsDiscussed} />
                  </div>

                  {/* Signature (admin) */}
                  <div className="p-3 min-h-[110px] flex items-center gap-2 border-t-2 md:border-t-0 border-gray-700">
                    <span className="italic font-bold text-gray-800 text-sm">
                      SIGNATURE :
                    </span>

                    {isSigned && report.signature ? (
                      <>
                        <div className="flex-1 h-20 border-b border-gray-500 flex items-end overflow-hidden">
                          <img
                            src={report.signature}
                            alt="Admin signature"
                            className="h-full max-w-full object-contain object-left mix-blend-multiply"
                          />
                        </div>
                        {report.signedByName && (
                          <span className="text-[11px] text-gray-500 whitespace-nowrap">
                            {report.signedByName}
                          </span>
                        )}
                      </>
                    ) : sigDraft ? (
                      <>
                        <div className="flex-1 h-20 border-b border-gray-500 flex items-end overflow-hidden">
                          <img
                            src={sigDraft}
                            alt="Signature preview"
                            className="h-full max-w-full object-contain object-left mix-blend-multiply"
                          />
                        </div>
                        <button
                          onClick={openModal}
                          className="text-xs text-blue-600 underline"
                        >
                          Change
                        </button>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-wrap items-center gap-3 border-b border-gray-500 pb-1">
                        {savedSig && (
                          <button
                            onClick={useSavedSignature}
                            className="h-8 px-3 border border-green-600 text-green-700 text-xs font-semibold hover:bg-green-50"
                          >
                            Use Digital signature
                          </button>
                        )}
                        <button
                          onClick={openModal}
                          className="flex items-center gap-2 text-xs text-blue-600 italic hover:underline"
                        >
                          <PenLine className="w-4 h-4" />
                          {savedSig ? "Sign another way" : "Click to sign"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Signature modal (type, draw or upload a scan) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div className="bg-white border-2 border-gray-700 w-[480px] max-w-full p-5">
            <div className="font-bold text-gray-800 text-sm mb-3">
              Add signature
            </div>
            <div className="flex border-b-2 border-gray-700 mb-4">
              {(["type", "draw", "upload"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-1.5 text-sm font-bold capitalize border-b-2 -mb-0.5 ${
                    activeTab === t
                      ? "text-[#1a1a8c] border-[#1a1a8c]"
                      : "text-gray-500 border-transparent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {activeTab === "type" && (
              <div>
                <input
                  type="text"
                  className="w-full border border-gray-400 p-2 text-2xl outline-none"
                  style={{ fontFamily: "'Brush Script MT', cursive" }}
                  placeholder="Type your signature"
                  value={typedSig}
                  onChange={(e) => setTypedSig(e.target.value)}
                />
                <canvas
                  ref={typeCanvasRef}
                  width={440}
                  height={60}
                  className="mt-2 border border-gray-200 block max-w-full"
                />
              </div>
            )}

            {activeTab === "draw" && (
              <div>
                <canvas
                  ref={drawCanvasRef}
                  width={440}
                  height={120}
                  className="border border-gray-400 cursor-crosshair block touch-none max-w-full"
                  onPointerDown={onDrawStart}
                  onPointerMove={onDrawMove}
                  onPointerUp={onDrawEnd}
                  onPointerLeave={onDrawEnd}
                />
                <button
                  onClick={clearCanvas}
                  className="text-xs text-red-500 underline mt-1"
                >
                  Clear
                </button>
              </div>
            )}

            {activeTab === "upload" && (
              <div>
                <label className="block border-2 border-dashed border-gray-400 p-4 text-center text-sm text-gray-600 cursor-pointer hover:bg-blue-50">
                  Click to choose your scanned signature (PNG or JPG)
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                  />
                </label>

                {uploadedSig && (
                  <div className="mt-3">
                    <div className="border border-gray-300 bg-white p-2 flex items-center justify-center min-h-[80px]">
                      <img
                        src={uploadedSig}
                        alt="Uploaded signature"
                        className="max-h-24 max-w-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <label className="flex items-center gap-2 text-xs text-gray-700">
                        <input
                          type="checkbox"
                          checked={saveForLater}
                          onChange={(e) => setSaveForLater(e.target.checked)}
                        />
                        Save as my signature for future reports
                      </label>
                      <button
                        onClick={() => setUploadedSig(null)}
                        className="text-xs text-red-500 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {savedSig && (
                  <div className="mt-3 border-t border-gray-200 pt-3">
                    <div className="text-xs text-gray-600 mb-1">
                      Currently saved signature
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="border border-gray-300 bg-white p-1 flex-1 flex items-center justify-center min-h-[48px]">
                        <img
                          src={savedSig}
                          alt="Saved signature"
                          className="max-h-12 max-w-full object-contain"
                        />
                      </div>
                      <button
                        onClick={removeSavedSignature}
                        className="text-xs text-red-500 underline"
                      >
                        Delete saved
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-3">
                  Tip: sign with a dark pen on plain white paper, in good light,
                  and crop close to the signature. You only need to do this
                  once.
                </p>
              </div>
            )}

            <div className="flex gap-2 mt-4 justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-1.5 text-sm font-bold border-2 border-gray-700 bg-white text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={applySig}
                disabled={savingSig}
                className="px-4 py-1.5 text-sm font-bold border-2 border-[#1a1a8c] bg-[#1a1a8c] text-white disabled:opacity-50"
              >
                {savingSig ? "Saving..." : "Apply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDailyReports;
