import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useStatusModal } from "@/context/adda/statusModalContext";
import {
  fetchReportsByDate,
  signDailyReport,
  setDidAsDiscussed,
  fetchMySignature,
  saveMySignature,
  deleteMySignature,
  DailyReportRow,
} from "@/api/dailyReport";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  ArrowLeft,
  PenLine,
  Loader2,
  Search,
  CalendarDays,
  CalendarCheck,
  ClipboardCheck,
  SlidersHorizontal,
  History,
} from "lucide-react";

const LOGO_URL =
  "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png";

const DAY_LABELS = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
const OFF_DAYS = [0, 6];

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const SIGNATURE_MAX_WIDTH = 600;

// how long the "loading next report" screen is shown after signing
const NEXT_REPORT_DELAY_MS = 2500;

type Tab = "type" | "draw" | "upload";
type Filter = "all" | "missing" | "submitted" | "signed";
type DayStatus = DailyReportRow["status"] | "off" | "future" | "unknown";

interface DayStat {
  status: DayStatus;
  complete?: string;
}

interface NextLoading {
  id: string;
  name: string;
  signedName: string;
}

const STATUS: Record<DailyReportRow["status"], { text: string; cls: string }> =
  {
    signed: { text: "Signed", cls: "bg-green-100 text-green-700" },
    submitted: {
      text: "Waiting for signature",
      cls: "bg-blue-100 text-blue-700",
    },
    missing: { text: "Not submitted", cls: "bg-red-100 text-red-600" },
  };

const DAY_CHIP: Record<DayStatus, { text: string; cls: string }> = {
  signed: { text: "Signed", cls: "bg-green-100 text-green-700" },
  submitted: { text: "Waiting", cls: "bg-blue-100 text-blue-700" },
  missing: { text: "Not submitted", cls: "bg-red-100 text-red-600" },
  off: { text: "-", cls: "bg-slate-50 text-slate-400" },
  future: { text: "Upcoming", cls: "bg-slate-50 text-slate-300" },
  unknown: { text: "No data", cls: "bg-slate-50 text-slate-400" },
};

const ruledStyle = {
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent, transparent 27px, #9aa3b2 27px, #9aa3b2 28px)",
  backgroundPosition: "0 28px",
  lineHeight: "28px",
};

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

const YesNoMark = ({
  value,
  onSelect,
  disabled,
}: {
  value?: string;
  onSelect?: (v: "YES" | "NO") => void;
  disabled?: boolean;
}) => (
  <div className="flex gap-6">
    {(["YES", "NO"] as const).map((v) => {
      const selected = value === v;
      const filled =
        v === "YES"
          ? "bg-green-600 border-green-600"
          : "bg-red-600 border-red-600";

      const circle = (
        <span
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
            selected ? filled : "bg-white border-gray-400"
          }`}
        >
          {selected && (
            <Check className="w-5 h-5 text-white" strokeWidth={3.5} />
          )}
        </span>
      );

      const label = (
        <span
          className={`text-lg italic font-extrabold ${
            selected ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {v}
        </span>
      );

      return onSelect ? (
        <button
          key={v}
          type="button"
          onClick={() => onSelect(v)}
          disabled={disabled}
          aria-pressed={selected}
          className="flex items-center gap-2 hover:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {circle}
          {label}
        </button>
      ) : (
        <div
          key={v}
          className="flex items-center gap-2"
          aria-label={`${v}${selected ? " (selected)" : ""}`}
        >
          {circle}
          {label}
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
  const yesterdayKey = toKey(addDays(new Date(), -1));

  const linkDate = searchParams.get("date");
  const initialKey =
    linkDate && /^\d{4}-\d{2}-\d{2}$/.test(linkDate) && linkDate <= todayKey
      ? linkDate
      : todayKey;

  const pendingOpenId = useRef<string | null>(searchParams.get("employee"));

  const [weekStart, setWeekStart] = useState<Date>(
    startOfWeek(fromKey(initialKey)),
  );
  const [selectedKey, setSelectedKey] = useState<string>(initialKey);
  const [rows, setRows] = useState<DailyReportRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  // toolbar panels
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [savingDiscussed, setSavingDiscussed] = useState(false);

  const [sigDraft, setSigDraft] = useState<string | null>(null);
  const [useSaved, setUseSaved] = useState(false);
  const [signing, setSigning] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("type");
  const [typedSig, setTypedSig] = useState("");
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const typeCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const hasDrawn = useRef(false);

  const [savedSig, setSavedSig] = useState<string | null>(null);
  const [uploadedSig, setUploadedSig] = useState<string | null>(null);
  const [saveForLater, setSaveForLater] = useState(true);
  const [savingSig, setSavingSig] = useState(false);

  // per-employee week statistics
  const [weekData, setWeekData] = useState<Record<string, DayStat>>({});
  const [weekLoading, setWeekLoading] = useState(false);

  // "loading next report" screen shown after signing
  const [nextLoading, setNextLoading] = useState<NextLoading | null>(null);
  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestId = useRef(0);
  const weekRequestId = useRef(0);

  const weekStartKey = toKey(weekStart);
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
  const hasDiscussed =
    report?.didAsDiscussed === "YES" || report?.didAsDiscussed === "NO";

  // week statistics for the open employee
  const weekValues = Object.values(weekData);
  const statSigned = weekValues.filter((d) => d.status === "signed").length;
  const statWaiting = weekValues.filter((d) => d.status === "submitted").length;
  const statMissing = weekValues.filter((d) => d.status === "missing").length;
  const statSubmitted = statSigned + statWaiting;
  const statWorkingDays = statSubmitted + statMissing;
  const statCompleted = weekValues.filter((d) => d.complete === "YES").length;

  const clearDraft = () => {
    setSigDraft(null);
    setUseSaved(false);
  };

  const cancelNextLoading = () => {
    if (nextTimer.current) {
      clearTimeout(nextTimer.current);
      nextTimer.current = null;
    }
    setNextLoading(null);
  };

  useEffect(() => {
    clearDraft();
    setConfirmOpen(false);
    cancelNextLoading();
    loadRows();
  }, [selectedKey]);

  useEffect(() => {
    if (openId) loadWeekStats(openId);
  }, [openId, weekStartKey]);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const res = await fetchMySignature(token);
      if (res.success) setSavedSig(res.data?.signature ?? null);
    })();
  }, []);

  // clear the pending timer if the page is left
  useEffect(() => {
    return () => {
      if (nextTimer.current) clearTimeout(nextTimer.current);
    };
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

      if (pendingOpenId.current) {
        const target = employees.find(
          (e) => e.employeeId === pendingOpenId.current,
        );
        if (target) setOpenId(target.employeeId);
        pendingOpenId.current = null;
        setSearchParams({}, { replace: true });
      }
    } finally {
      if (myRequest === requestId.current) setLoading(false);
    }
  };

  const loadWeekStats = async (employeeId: string) => {
    const myRequest = ++weekRequestId.current;
    try {
      setWeekLoading(true);
      const token = await getToken();
      if (!token) return;

      const entries = await Promise.all(
        weekDays.map(async (k): Promise<[string, DayStat]> => {
          if (k > todayKey) return [k, { status: "future" }];

          const res = await fetchReportsByDate(k, token);
          if (!res.success || !res.data) return [k, { status: "unknown" }];

          const off =
            res.data.isOffDay ?? OFF_DAYS.includes(fromKey(k).getDay());
          const row = res.data.employees?.find(
            (e) => e.employeeId === employeeId,
          );

          if (!row) return [k, { status: off ? "off" : "unknown" }];
          if (row.status === "missing" && off) return [k, { status: "off" }];

          return [k, { status: row.status, complete: row.report?.complete }];
        }),
      );

      if (myRequest !== weekRequestId.current) return;
      setWeekData(Object.fromEntries(entries));
    } finally {
      if (myRequest === weekRequestId.current) setWeekLoading(false);
    }
  };

  const handleDiscussed = async (value: "YES" | "NO") => {
    if (!openRow || !report?._id || isSigned) return;

    try {
      setSavingDiscussed(true);
      const token = await getToken();
      if (!token) {
        showStatus("error", "Authentication error. Please log in again.");
        return;
      }

      const result = await setDidAsDiscussed(report._id, value, token);
      if (!result.success) {
        showStatus("error", result.error || "Could not save your answer");
        return;
      }

      const updated = result.data?.report;
      setRows((prev) =>
        prev.map((r) =>
          r.employeeId === openRow.employeeId
            ? {
                ...r,
                report: { ...r.report!, didAsDiscussed: value, ...updated },
              }
            : r,
        ),
      );
    } finally {
      setSavingDiscussed(false);
    }
  };

  // Step 1: the "Sign report" button only validates and asks for confirmation
  const requestSign = () => {
    if (!openRow || !report?._id) return;

    if (!hasDiscussed) {
      showStatus("error", 'Please mark "Did as per discussed" before signing.');
      return;
    }
    if (!sigDraft) {
      showStatus("error", "Please add your signature before signing.");
      return;
    }
    setConfirmOpen(true);
  };

  // finds the next report waiting for signature (after the current one, wrapping around)
  const findNextSubmitted = (currentId: string) => {
    const idx = rows.findIndex((r) => r.employeeId === currentId);
    const ordered = [
      ...rows.slice(idx + 1),
      ...rows.slice(0, Math.max(idx, 0)),
    ];
    return (
      ordered.find(
        (r) => r.status === "submitted" && r.employeeId !== currentId,
      ) || null
    );
  };

  // shows the loader for a moment, then opens the next person's report
  const goToNextReport = (next: DailyReportRow, signedName: string) => {
    if (nextTimer.current) clearTimeout(nextTimer.current);

    setNextLoading({
      id: next.employeeId,
      name: next.name,
      signedName,
    });

    nextTimer.current = setTimeout(() => {
      nextTimer.current = null;
      clearDraft();
      setOpenId(next.employeeId);
      setNextLoading(null);
    }, NEXT_REPORT_DELAY_MS);
  };

  // Step 2: runs after the admin confirms in the dialog
  const handleSign = async () => {
    if (!openRow || !report?._id || !sigDraft) return;

    if (!hasDiscussed) {
      showStatus("error", 'Please mark "Did as per discussed" before signing.');
      setConfirmOpen(false);
      return;
    }

    try {
      setSigning(true);
      const token = await getToken();
      if (!token) {
        showStatus("error", "Authentication error. Please log in again.");
        return;
      }

      const payload = useSaved
        ? ({ useSaved: true } as const)
        : { signature: sigDraft };

      const result = await signDailyReport(report._id, payload, token);
      if (!result.success) {
        showStatus("error", result.error || "Failed to sign the report");
        return;
      }

      const signedReport = result.data?.report;
      const signedName = openRow.name;
      const nextRow = findNextSubmitted(openRow.employeeId);

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
      setWeekData((prev) => ({
        ...prev,
        [selectedKey]: { ...prev[selectedKey], status: "signed" },
      }));
      clearDraft();
      showStatus("success", `Report signed for ${signedName}.`);

      if (nextRow) {
        goToNextReport(nextRow, signedName);
      } else {
        showStatus("success", "No more reports waiting for signature.");
      }
    } finally {
      setSigning(false);
      setConfirmOpen(false);
    }
  };

  const useSavedSignature = () => {
    if (!savedSig) return;
    setSigDraft(savedSig);
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

  const changeWeek = (direction: -1 | 1) => {
    const next = addDays(weekStart, direction * 7);
    setWeekStart(next);
    let k = toKey(addDays(next, fromKey(selectedKey).getDay()));
    if (k > todayKey) k = todayKey;
    setSelectedKey(k);
  };

  const pickDate = (value: string) => {
    if (!value || value > todayKey) return;
    setSelectedKey(value);
    setWeekStart(startOfWeek(fromKey(value)));
  };

  // pick from the calendar panel and close it
  const pickFromCalendar = (value: string) => {
    pickDate(value);
    setShowCalendar(false);
  };

  // jump straight to today's report
  const showToday = () => {
    pickDate(todayKey);
    setShowCalendar(false);
    setShowFilters(false);
  };

  // jump straight to yesterday's report
  const showYesterday = () => {
    pickDate(yesterdayKey);
    setShowCalendar(false);
    setShowFilters(false);
  };

  const toggleCalendar = () => {
    setShowCalendar((v) => !v);
    setShowFilters(false);
  };

  const toggleFilters = () => {
    setShowFilters((v) => !v);
    setShowCalendar(false);
  };

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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
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
        px[i + 3] = Math.max(0, Math.min(255, ((230 - lum) * 255) / 130));
      }
      ctx.putImageData(data, 0, 0);

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

  const filterTabs: { key: Filter; label: string; n: number }[] = [
    { key: "all", label: "All", n: rows.length },
    { key: "submitted", label: "Waiting for signature", n: waitingCount },
    { key: "signed", label: "Signed", n: signedCount },
    { key: "missing", label: "Not submitted", n: missingCount },
  ];

  const activeFilter = filterTabs.find((t) => t.key === filter)!;

  const statTiles = [
    { label: "Working days", value: statWorkingDays, cls: "text-slate-800" },
    { label: "Submitted", value: statSubmitted, cls: "text-blue-700" },
    { label: "Signed", value: statSigned, cls: "text-green-700" },
    { label: "Waiting", value: statWaiting, cls: "text-amber-600" },
    { label: "Not submitted", value: statMissing, cls: "text-red-600" },
    { label: "Tasks completed", value: statCompleted, cls: "text-indigo-700" },
  ];

  const selectedLabel = fromKey(selectedKey).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isToday = selectedKey === todayKey;
  const isYesterday = selectedKey === yesterdayKey;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-4 md:p-6">
      <style>{`
        @keyframes nextReportBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <h1 className="mb-4 text-2xl sm:text-3xl font-bold text-black text-left">
          Daily Report
        </h1>

        {/* ---------- Toolbar: calendar + today/yesterday + filter buttons, search ---------- */}
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleCalendar}
              aria-expanded={showCalendar}
              className={`flex-1 sm:flex-none min-w-0 flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition ${
                showCalendar
                  ? "bg-blue-50 border-blue-600 text-blue-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <CalendarDays className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">{selectedLabel}</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform ${
                  showCalendar ? "rotate-180" : ""
                }`}
              />
            </button>

            <button
              onClick={showToday}
              aria-pressed={isToday}
              className={`flex-1 sm:flex-none min-w-0 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition ${
                isToday
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <CalendarCheck
                className={`w-4 h-4 shrink-0 ${
                  isToday ? "text-white" : "text-blue-600"
                }`}
              />
              <span className="truncate">Today's report</span>
            </button>

            <button
              onClick={showYesterday}
              aria-pressed={isYesterday}
              className={`flex-1 sm:flex-none min-w-0 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition ${
                isYesterday
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <History
                className={`w-4 h-4 shrink-0 ${
                  isYesterday ? "text-white" : "text-blue-600"
                }`}
              />
              <span className="truncate">Yesterday's report</span>
            </button>

            {!openRow && (
              <button
                onClick={toggleFilters}
                aria-expanded={showFilters}
                className={`flex-1 sm:flex-none min-w-0 flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition ${
                  showFilters
                    ? "bg-blue-50 border-blue-600 text-blue-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">
                    {activeFilter.label} ({activeFilter.n})
                  </span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}

            {!openRow && (
              <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs sm:ml-auto">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employee"
                  className="border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
            )}
          </div>

          {/* Calendar panel */}
          {showCalendar && (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <input
                  type="date"
                  value={selectedKey}
                  max={todayKey}
                  onChange={(e) => pickFromCalendar(e.target.value)}
                  className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => pickFromCalendar(todayKey)}
                  disabled={selectedKey === todayKey}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Today
                </button>
                <button
                  onClick={() => pickFromCalendar(yesterdayKey)}
                  disabled={selectedKey === yesterdayKey}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Yesterday
                </button>
              </div>

              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => changeWeek(-1)}
                  className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-100"
                  aria-label="Previous week"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium text-slate-500">
                  {displayDate(weekDays[0])} to {displayDate(weekDays[6])}
                </span>
                <button
                  onClick={() => changeWeek(1)}
                  disabled={!canGoNext}
                  className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next week"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {weekDays.map((k) => {
                  const d = fromKey(k);
                  const future = k > todayKey;
                  return (
                    <button
                      key={k}
                      onClick={() => pickFromCalendar(k)}
                      disabled={future}
                      className={`min-w-0 rounded-xl border py-2 text-center transition ${
                        k === selectedKey
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                      } ${future ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      <div className="text-[10px] sm:text-xs font-medium opacity-80">
                        {DAY_LABELS[d.getDay()]}
                      </div>
                      <div
                        className={`text-sm sm:text-lg font-semibold ${
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
            </div>
          )}

          {/* Filter panel */}
          {showFilters && !openRow && (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-wrap gap-2">
              {filterTabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setFilter(t.key);
                    setShowFilters(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                    filter === t.key
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {t.label} ({t.n})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Employees list (always first) ---------- */}
        {!openRow && (
          <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6">
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
                      setShowCalendar(false);
                      setShowFilters(false);
                      setOpenId(r.employeeId);
                    }}
                    className="w-full flex items-center gap-3 sm:gap-4 py-3 px-2 text-left hover:bg-slate-50 rounded-xl transition"
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold shrink-0">
                      {initials(r.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 break-words sm:truncate">
                        {r.name}
                      </div>
                      <div className="text-sm text-slate-500 capitalize break-words sm:truncate">
                        {[r.jobRole, r.department].filter(Boolean).join(" · ")}
                      </div>
                      <span
                        className={`sm:hidden inline-block mt-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS[r.status].cls}`}
                      >
                        {STATUS[r.status].text}
                      </span>
                    </div>
                    <span
                      className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS[r.status].cls}`}
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

        {/* ---------- Loader shown after signing, before the next report ---------- */}
        {openRow && nextLoading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-6">
              <Check className="w-4 h-4" strokeWidth={3} />
              Report signed for {nextLoading.signedName}
            </div>

            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-semibold">
                {initials(nextLoading.name)}
              </div>
              <Loader2 className="w-24 h-24 animate-spin text-blue-300 absolute -top-2 -left-2" />
            </div>

            <div className="text-sm text-slate-500">Loading next report</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-800 mt-1 break-words">
              {nextLoading.name}
            </div>

            <div className="w-full max-w-xs h-2 rounded-full bg-slate-100 overflow-hidden mt-6">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                style={{
                  animation: `nextReportBar ${NEXT_REPORT_DELAY_MS}ms linear forwards`,
                }}
              />
            </div>
          </div>
        )}

        {/* ---------- Selected employee: form (left) + statistics (right) ---------- */}
        {openRow && !nextLoading && (
          <div>
            <div className="mb-4 flex items-center gap-3 flex-wrap">
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

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
              {/* ----- LEFT: report form ----- */}
              <div className="min-w-0">
                {loading ? (
                  <div className="bg-white rounded-2xl shadow-lg flex items-center justify-center py-16 text-slate-500 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    Loading report...
                  </div>
                ) : !report ? (
                  <div className="bg-white rounded-2xl shadow-lg p-10 text-center text-slate-500">
                    {openRow.name} has not submitted a report for{" "}
                    {displayDate(selectedKey)}.
                  </div>
                ) : (
                  <>
                    <div className="bg-white w-full border-2 border-gray-700 shadow-xl">
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

                        <div className="hidden md:flex bg-[#ede8ec] items-center justify-center p-3">
                          <span className="italic font-bold text-gray-800 text-base tracking-widest">
                            NOTES
                          </span>
                        </div>
                      </div>

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
                          <div className="md:hidden italic font-bold text-gray-800 text-sm mb-2">
                            NOTES :
                          </div>
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
                        <div className="md:border-r-2 border-gray-700 p-3 min-h-[110px] flex items-center gap-4 flex-wrap">
                          <span className="italic font-bold text-gray-800 text-sm whitespace-nowrap">
                            DID AS PER DISCUSSED :
                          </span>
                          {isSigned ? (
                            <YesNoMark value={report.didAsDiscussed} />
                          ) : (
                            <div className="flex items-center gap-3">
                              <YesNoMark
                                value={report.didAsDiscussed}
                                onSelect={handleDiscussed}
                                disabled={savingDiscussed}
                              />
                              {savingDiscussed && (
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                              )}
                            </div>
                          )}
                        </div>

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
                              <div className="flex flex-col items-end gap-1">
                                <button
                                  onClick={openModal}
                                  className="text-xs text-blue-600 underline"
                                >
                                  Change
                                </button>
                                <button
                                  onClick={clearDraft}
                                  className="text-xs text-red-500 underline"
                                >
                                  Remove
                                </button>
                              </div>
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
                                {savedSig
                                  ? "Sign another way"
                                  : "Click to sign"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ---------- Sign report button: directly after the form ---------- */}
                    {!isSigned ? (
                      <div className="mt-4 bg-white rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="text-sm min-w-0">
                          {!hasDiscussed ? (
                            <span className="text-amber-700 italic">
                              Mark "Did as per discussed" to enable signing
                            </span>
                          ) : !sigDraft ? (
                            <span className="text-slate-500 italic">
                              Add your signature above to enable signing
                            </span>
                          ) : (
                            <span className="text-green-700 font-medium">
                              Ready to sign this report
                            </span>
                          )}
                        </div>
                        <button
                          onClick={requestSign}
                          disabled={
                            !sigDraft ||
                            !hasDiscussed ||
                            signing ||
                            savingDiscussed
                          }
                          className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {signing ? "Signing..." : "Sign report"}
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4 text-sm font-semibold text-green-700 flex items-center gap-2">
                        <Check className="w-4 h-4" strokeWidth={3} />
                        This report has been signed
                        {report.signedByName
                          ? ` by ${report.signedByName}`
                          : ""}
                        .
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* ----- RIGHT: employee statistics ----- */}
              <aside className="bg-white rounded-2xl shadow-lg p-4 xl:sticky xl:top-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold shrink-0">
                    {initials(openRow.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate">Statistics</span>
                    </div>
                    <div className="text-xs text-slate-500 capitalize truncate">
                      {[openRow.jobRole, openRow.department]
                        .filter(Boolean)
                        .join(" · ") || openRow.name}
                    </div>
                  </div>
                  {weekLoading && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  )}
                </div>

                <div className="text-xs font-medium text-slate-500 mb-2">
                  Week of {displayDate(weekDays[0])} to{" "}
                  {displayDate(weekDays[6])}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {statTiles.map((t) => (
                    <div
                      key={t.label}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center"
                    >
                      <div className={`text-2xl font-bold ${t.cls}`}>
                        {t.value}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {t.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {weekDays.map((k) => {
                    const d = fromKey(k);
                    const day = weekData[k];
                    const chip = DAY_CHIP[day?.status ?? "unknown"];
                    const future = k > todayKey;
                    return (
                      <button
                        key={k}
                        onClick={() => pickDate(k)}
                        disabled={future}
                        className={`w-full flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition ${
                          k === selectedKey
                            ? "border-blue-600 ring-2 ring-blue-200"
                            : "border-slate-200 hover:bg-slate-50"
                        } ${future ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        <span className="text-sm font-medium text-slate-700">
                          {DAY_LABELS[d.getDay()]}, {displayDate(k)}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${chip.cls}`}
                        >
                          {chip.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>

      {/* ---------- Confirm signing dialog ---------- */}
      {confirmOpen && openRow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] max-w-full p-5">
            <div className="font-bold text-slate-800 text-lg mb-1">
              Sign this report?
            </div>
            <p className="text-sm text-slate-600 mb-3">
              You are about to sign the daily report of{" "}
              <span className="font-semibold">{openRow.name}</span> for{" "}
              <span className="font-semibold">{displayDate(selectedKey)}</span>.
              Once signed, it cannot be edited.
            </p>
            {sigDraft && (
              <div className="border border-slate-200 rounded-xl bg-white p-2 flex items-center justify-center min-h-[64px] mb-4">
                <img
                  src={sigDraft}
                  alt="Signature preview"
                  className="max-h-16 max-w-full object-contain"
                />
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={signing}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSign}
                disabled={signing}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow hover:shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {signing && <Loader2 className="w-4 h-4 animate-spin" />}
                {signing ? "Signing..." : "Yes, sign report"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Add signature modal ---------- */}
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
                <button
                  onClick={() => setTypedSig("")}
                  className="text-xs text-red-500 underline mt-1"
                >
                  Clear
                </button>
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
