import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  CSSProperties,
  PointerEvent as ReactPointerEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  BarChart3,
  ShieldCheck,
  Users,
  Heart,
  Grid2x2,
  User,
  UserRound,
  Search,
  ChevronDown,
  Tag,
  FileText,
  ArrowUpDown,
  Clock,
  ArrowRight,
  Users2,
  History,
  AlertCircle,
  Inbox,
  Check,
  X,
  type LucideIcon,
} from "lucide-react";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ProductType } from "@/utils/enum";
import {
  AgeCategory,
  AssessmentProduct,
  ProductBase,
} from "@/types/productTypes";

const features = [
  { icon: BarChart3, label: "Quick & Easy" },
  { icon: ShieldCheck, label: "Research Based" },
  { icon: Users, label: "Personalized Insights" },
  { icon: Heart, label: "Support Growth" },
];

const tabs = [
  { id: "all", label: "All Assessments", icon: Grid2x2 },
  { id: "children", label: "For Children (6 - 12 yrs)", icon: User },
  { id: "teens", label: "For Teens (13 - 19 yrs)", icon: UserRound },
  { id: "parents", label: "For Parents", icon: Users },
];

const tabAgeCategories: Record<string, AgeCategory[]> = {
  children: [AgeCategory.CHILD],
  teens: [AgeCategory.TEEN, AgeCategory.YOUNG_ADULT],
  parents: [AgeCategory.PARENTS],
};

/* ---------- Hiring flip card config ---------- */

// encodeURI handles the spaces in the file names
const HIRING_FRONT_IMG = encodeURI(
  "/assets/v3/assessment/Hiring banners mentors.png",
);
const HIRING_BACK_IMG = encodeURI(
  "/assets/v3/assessment/Hiring banners teachers.png",
);
const HIRING_LINK = "/join-us";

/* ---------- Filter / sort config ---------- */

const ALL = "all";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "title-asc", label: "Title (A - Z)" },
  { value: "title-desc", label: "Title (Z - A)" },
  { value: "duration-asc", label: "Shortest first" },
  { value: "duration-desc", label: "Longest first" },
  { value: "newest", label: "Newest first" },
];

type FilterKey = "age" | "category" | "format" | "sort";

interface FilterOption {
  value: string;
  label: string;
}

/** Safely read a string field from loosely typed product data */
const getStr = (obj: unknown, key: string): string => {
  const v = (obj as Record<string, unknown> | undefined | null)?.[key];
  return typeof v === "string" ? v.trim() : "";
};

/** Adjust these two helpers if your API uses different field names */
const getCategory = (p: ProductBase): string =>
  getStr(p.details, "category") || getStr(p, "category");

const getFormat = (p: ProductBase): string =>
  getStr(p.details, "format") ||
  getStr(p.details, "type") ||
  getStr(p, "format");

const getDuration = (p: ProductBase): number =>
  Number((p.details as AssessmentProduct["details"])?.duration) || 0;

const getCreatedAt = (p: ProductBase): number => {
  const t = new Date(getStr(p, "createdAt")).getTime();
  return Number.isNaN(t) ? 0 : t;
};

/* ---------- "Free trial expired" - show only once per user ---------- */

const isTrialExpiredMessage = (msg: string): boolean =>
  /trial/i.test(msg) && /(expired|ended|over)/i.test(msg);

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  const m = (err as { message?: unknown } | null)?.message;
  return typeof m === "string" ? m : fallback;
};

const trialKey = (userId?: string | null) =>
  `trial-expired-seen:${userId || "guest"}`;

const hasSeenTrialNotice = (userId?: string | null): boolean => {
  try {
    return localStorage.getItem(trialKey(userId)) === "1";
  } catch {
    return false;
  }
};

const markTrialNoticeSeen = (userId?: string | null) => {
  try {
    localStorage.setItem(trialKey(userId), "1");
  } catch {
    /* ignore */
  }
};

const uniqueOptions = (values: string[]): FilterOption[] =>
  Array.from(new Set(values.filter(Boolean)))
    .sort((a, b) => a.localeCompare(b))
    .map((v) => ({ value: v, label: v }));

interface AssessmentHistoryItem {
  _id: string;
  assessmentTitle: string;
  ageCategory?: string;
  score?: number;
  totalQuestions?: number;
  status: "started" | "completed";
  completedAt: string;
  product?: {
    _id: string;
    title: string;
    productImages?: { imageUrl: string }[];
  };
}

/* ---------- Comic inline styles (fonts from common css variables) ---------- */

const INK = "#111827";
const ORANGE = "#ff9800";
const ORANGE_DARK = "#ea580c";
const YELLOW = "#ffd23f";
const YELLOW_SOFT = "#ffe08a";

const sectionStyle: CSSProperties = {
  width: "100%",
  backgroundColor: "#F5F5F4",
  backgroundImage: "radial-gradient(#d6d3d1 1.2px, transparent 1.2px)",
  backgroundSize: "16px 16px",
  fontFamily: "var(--font-comic)",
  letterSpacing: "0.04em",
};

/* ----- Banner (styled after JoinOurTeam hero) ----- */

const bannerStyle: CSSProperties = {
  backgroundColor: ORANGE,
  border: `2px solid ${INK}`,
  borderRadius: "16px",
  boxShadow: `8px 8px 0 0 ${INK}`,
};

const bannerOverlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  backgroundImage:
    "radial-gradient(rgba(17,24,39,0.16) 1.6px, transparent 1.6px)",
  backgroundSize: "16px 16px",
};

const bannerCircleStyle: CSSProperties = {
  position: "absolute",
  bottom: "-5rem",
  left: "-5rem",
  width: "14rem",
  height: "14rem",
  borderRadius: "9999px",
  border: `4px solid ${INK}`,
  backgroundColor: "#FFD93D",
  opacity: 0.7,
  pointerEvents: "none",
};

const bannerTitleStyle: CSSProperties = {
  fontFamily: "var(--font-comic)",
  fontWeight: 400,
  lineHeight: 1.15,
  letterSpacing: "0.05em",
  color: "#fff",
  WebkitTextStroke: `2px ${INK}`,
  textShadow: `5px 5px 0 ${INK}`,
};

const bannerTextStyle: CSSProperties = {
  display: "inline-block",
  transform: "rotate(-1deg)",
  background: "#fff",
  color: INK,
  border: `2px solid ${INK}`,
  borderRadius: "16px",
  boxShadow: `5px 5px 0 0 ${INK}`,
  padding: "0.75rem 1.25rem",
  textAlign: "left",
  fontFamily: "var(--font-comic)",
  fontSize: "1.2rem",
  letterSpacing: "0.05em",
  lineHeight: 1.5,
};

const bannerImageCardStyle: CSSProperties = {
  background: "#fff",
  border: `2px solid ${INK}`,
  borderRadius: "16px",
  boxShadow: `6px 6px 0 0 ${INK}`,
  padding: "1rem",
};

const bannerImageStyle: CSSProperties = {
  width: "100%",
  maxWidth: "24rem",
  maxHeight: "16rem",
  objectFit: "contain",
  background: "#FFFBEB",
  border: `2px solid ${INK}`,
  borderRadius: "12px",
};

const featureCardStyle: CSSProperties = {
  background: "#fff",
  border: `2px solid ${INK}`,
  borderRadius: "12px",
  boxShadow: `4px 4px 0 0 ${INK}`,
  padding: "0.6rem 0.75rem",
  textAlign: "left",
};

const featureLabelStyle: CSSProperties = {
  fontFamily: "var(--font-comic)",
  fontSize: "1rem",
  letterSpacing: "0.05em",
  color: INK,
  lineHeight: 1.15,
};

/* ----- Rest of the page ----- */

const tabStyle = (active: boolean): CSSProperties => ({
  background: active ? YELLOW : "#fff",
  border: `4px solid ${INK}`,
  borderRadius: "14px",
  boxShadow: active ? `2px 2px 0 ${INK}` : `6px 6px 0 ${INK}`,
  transform: active ? "translate(4px, 4px)" : "none",
  fontFamily: "var(--font-comic-chip)",
  fontWeight: 400,
  fontSize: "1.1rem",
  letterSpacing: "0.05em",
  color: INK,
  cursor: "pointer",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
});

const searchBoxStyle: CSSProperties = {
  background: "#fff",
  border: `3px solid ${INK}`,
  borderRadius: "12px",
  boxShadow: `4px 4px 0 ${INK}`,
};

const searchInputStyle: CSSProperties = {
  fontFamily: "var(--font-comic)",
  fontSize: "1.15rem",
  letterSpacing: "0.05em",
  color: INK,
  background: "transparent",
};

const filterBtnStyle = (active: boolean): CSSProperties => ({
  background: active ? YELLOW : "#fff",
  border: `3px solid ${INK}`,
  borderRadius: "12px",
  boxShadow: `4px 4px 0 ${INK}`,
  fontFamily: "var(--font-comic)",
  fontSize: "1.1rem",
  letterSpacing: "0.05em",
  color: INK,
  cursor: "pointer",
});

const menuStyle: CSSProperties = {
  position: "absolute",
  top: "calc(100% + 8px)",
  left: 0,
  minWidth: "100%",
  width: "max-content",
  maxWidth: "260px",
  maxHeight: "260px",
  overflowY: "auto",
  zIndex: 30,
  background: "#fff",
  border: `3px solid ${INK}`,
  borderRadius: "12px",
  boxShadow: `5px 5px 0 ${INK}`,
  padding: "0.35rem",
};

const menuItemStyle = (selected: boolean): CSSProperties => ({
  background: selected ? YELLOW_SOFT : "transparent",
  borderRadius: "8px",
  fontFamily: "var(--font-comic)",
  fontSize: "1.05rem",
  letterSpacing: "0.05em",
  color: INK,
  cursor: "pointer",
  textAlign: "left",
});

const clearBtnStyle: CSSProperties = {
  background: INK,
  color: "#fff",
  border: `3px solid ${INK}`,
  borderRadius: "12px",
  boxShadow: `4px 4px 0 ${ORANGE}`,
  fontFamily: "var(--font-comic)",
  fontSize: "1.05rem",
  letterSpacing: "0.05em",
  cursor: "pointer",
};

const cardStyle: CSSProperties = {
  background: "#fff",
  border: `4px solid ${INK}`,
  borderRadius: "16px",
  boxShadow: `6px 6px 0 ${INK}`,
};

const cardImageWrapStyle: CSSProperties = {
  background: "#bde0fe",
  borderBottom: `4px solid ${INK}`,
};

const durationBadgeStyle: CSSProperties = {
  background: YELLOW,
  color: INK,
  border: `3px solid ${INK}`,
  borderRadius: "8px",
  boxShadow: `3px 3px 0 ${INK}`,
  fontFamily: "var(--font-comic-chip)",
  fontSize: "0.9rem",
  letterSpacing: "0.05em",
  transform: "rotate(3deg)",
};

const cardTitleStyle: CSSProperties = {
  fontFamily: "var(--font-comic-chip)",
  fontWeight: 400,
  fontSize: "1.3rem",
  letterSpacing: "0.05em",
  color: INK,
};

const cardDescStyle: CSSProperties = {
  fontFamily: "var(--font-comic)",
  fontSize: "1.05rem",
  letterSpacing: "0.04em",
  lineHeight: 1.35,
  color: "#333",
};

const chipStyle: CSSProperties = {
  background: "#b6f2a1",
  color: INK,
  border: `2px solid ${INK}`,
  borderRadius: "999px",
  fontFamily: "var(--font-comic-chip)",
  fontSize: "0.85rem",
  letterSpacing: "0.05em",
};

/* Was purple/pink (#d12881) -> now orange with dark text */
const startBtnStyle: CSSProperties = {
  background: ORANGE,
  color: INK,
  border: `3px solid ${INK}`,
  borderRadius: "10px",
  boxShadow: `4px 4px 0 ${INK}`,
  fontFamily: "var(--font-comic-chip)",
  fontSize: "1.1rem",
  letterSpacing: "0.06em",
  cursor: "pointer",
};

const retryBtnStyle: CSSProperties = {
  ...startBtnStyle,
  background: INK,
  color: "#fff",
  padding: "0.5rem 1.5rem",
};

const stateTitleStyle: CSSProperties = {
  fontFamily: "var(--font-comic-chip)",
  fontSize: "1.4rem",
  letterSpacing: "0.05em",
  color: INK,
};

const stateTextStyle: CSSProperties = {
  fontFamily: "var(--font-comic)",
  fontSize: "1.1rem",
  letterSpacing: "0.05em",
  color: "#333",
};

const stateBoxStyle: CSSProperties = {
  background: "#fff",
  border: `4px dashed ${INK}`,
  borderRadius: "16px",
};

const spinnerStyle: CSSProperties = {
  border: `5px solid ${YELLOW}`,
  borderTopColor: INK,
};

const historyPanelStyle: CSSProperties = {
  background: "#fff",
  border: `4px solid ${INK}`,
  borderRadius: "16px",
  boxShadow: `8px 8px 0 ${INK}`,
};

const historyTitleStyle: CSSProperties = {
  fontFamily: "var(--font-comic-chip)",
  fontWeight: 400,
  fontSize: "1.4rem",
  letterSpacing: "0.06em",
  color: INK,
};

const historyItemStyle: CSSProperties = {
  background: "#fff8e1",
  border: `3px solid ${INK}`,
  borderRadius: "12px",
  boxShadow: `3px 3px 0 ${INK}`,
};

const historyIconStyle: CSSProperties = {
  background: YELLOW,
  border: `3px solid ${INK}`,
};

const historyBtnStyle = (disabled: boolean): CSSProperties => ({
  background: disabled ? "#e5e5e5" : YELLOW,
  color: disabled ? "#999" : INK,
  border: `3px solid ${disabled ? "#999" : INK}`,
  borderRadius: "10px",
  boxShadow: disabled ? "none" : `4px 4px 0 ${INK}`,
  fontFamily: "var(--font-comic-chip)",
  fontSize: "1.05rem",
  letterSpacing: "0.06em",
  cursor: disabled ? "not-allowed" : "pointer",
});

const modalOverlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 100,
  background: "rgba(17,24,39,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
};

const modalStyle: CSSProperties = {
  background: "#fff",
  border: `4px solid ${INK}`,
  borderRadius: "16px",
  boxShadow: `8px 8px 0 ${INK}`,
  maxWidth: "26rem",
  width: "100%",
  padding: "1.5rem",
  textAlign: "center",
};

/* ----- Flip card styles ----- */

const flipSceneStyle = (dragging: boolean): CSSProperties => ({
  display: "block",
  width: "100%",
  // matches the banner images (1247 x 1864)
  aspectRatio: "1247 / 1864",
  perspective: "1200px",
  cursor: dragging ? "grabbing" : "grab",
  outline: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
  // lets the page still scroll vertically on touch while we handle horizontal drags
  touchAction: "pan-y",
});

const flipInnerStyle = (angle: number, dragging: boolean): CSSProperties => ({
  position: "relative",
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
  // no transition while dragging so the card follows the pointer
  transition: dragging
    ? "none"
    : "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
  transform: `rotateY(${angle}deg)`,
  pointerEvents: "none",
});

const flipFaceStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  overflow: "hidden",
  background: "#fff",
  border: `4px solid ${INK}`,
  borderRadius: "16px",
  boxShadow: `8px 8px 0 ${INK}`,
  pointerEvents: "none", // the <Link> wrapper receives the click
};

const flipImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

/* ---------- Dropdown ---------- */

interface FilterDropdownProps {
  label: string;
  icon: LucideIcon;
  options: FilterOption[];
  value: string;
  defaultValue: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}

const FilterDropdown = ({
  label,
  icon: Icon,
  options,
  value,
  defaultValue,
  isOpen,
  onToggle,
  onSelect,
}: FilterDropdownProps) => {
  const selected = options.find((o) => o.value === value);
  const isActive = value !== defaultValue;

  return (
    <div className="relative" data-filter-dropdown>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-3"
        style={filterBtnStyle(isActive)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Icon size={18} color={INK} strokeWidth={2.5} />
        {isActive && selected ? `${label}: ${selected.label}` : label}
        <ChevronDown
          size={18}
          color={INK}
          strokeWidth={2.5}
          style={{
            transition: "transform 0.15s ease",
            transform: isOpen ? "rotate(180deg)" : "none",
          }}
        />
      </button>

      {isOpen && (
        <div style={menuStyle} role="listbox">
          {options.length === 0 ? (
            <p className="px-3 py-2" style={stateTextStyle}>
              No options
            </p>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelect(opt.value)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2"
                  style={menuItemStyle(isSelected)}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <Check size={16} color={INK} strokeWidth={3} />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

/* ---------- Hiring flip card ---------- */

/**
 * Drag the card left / right to flip it (it follows your pointer and snaps to
 * the nearest side on release). A plain click (no drag) opens /join-us.
 * Arrow keys also flip it for keyboard users.
 */
const FLIP_THRESHOLD_DEG = 50; // how far you must drag before it flips
const DRAG_TO_ANGLE = 0.6; // degrees of rotation per pixel dragged
const CLICK_SLOP_PX = 6; // movement below this still counts as a click

const HiringFlipCard = () => {
  const [flipped, setFlipped] = useState(false);
  const [delta, setDelta] = useState(0);
  const [dragging, setDragging] = useState(false);

  const startX = useRef(0);
  const pointerDown = useRef(false);
  const didDrag = useRef(false);

  const handlePointerDown = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointerDown.current = true;
    didDrag.current = false;
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (!pointerDown.current) return;
    const dx = e.clientX - startX.current;
    if (!didDrag.current && Math.abs(dx) < CLICK_SLOP_PX) return;
    didDrag.current = true;
    setDragging(true);
    setDelta(Math.max(-180, Math.min(180, dx * DRAG_TO_ANGLE)));
  };

  const endDrag = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (!pointerDown.current) return;
    pointerDown.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);

    if (didDrag.current && Math.abs(delta) >= FLIP_THRESHOLD_DEG) {
      setFlipped((f) => !f);
    }
    setDelta(0);
    setDragging(false);
  };

  const baseAngle = flipped ? 180 : 0;

  return (
    <div>
      <Link
        to={HIRING_LINK}
        aria-label="We are hiring - click to open the Join Us page, drag to flip"
        style={flipSceneStyle(dragging)}
        draggable={false}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={(e) => {
          // a drag should flip the card, not navigate
          if (didDrag.current) {
            e.preventDefault();
            didDrag.current = false;
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
      >
        <div style={flipInnerStyle(baseAngle + delta, dragging)}>
          {/* Front */}
          <div style={flipFaceStyle}>
            <img
              src={HIRING_FRONT_IMG}
              alt="Hiring mentors"
              style={flipImageStyle}
              draggable={false}
            />
          </div>

          {/* Back */}
          <div style={{ ...flipFaceStyle, transform: "rotateY(180deg)" }}>
            <img
              src={HIRING_BACK_IMG}
              alt="Hiring teachers"
              style={flipImageStyle}
              draggable={false}
            />
          </div>
        </div>
      </Link>

      <p
        className="mt-3 text-center"
        style={{ ...stateTextStyle, fontSize: "0.95rem" }}
      >
        Drag to flip &bull; Click to join
      </p>
    </div>
  );
};

/* ---------- Page ---------- */

const AssessmentPage = ({
  activeTab,
  onTabChange,
}: {
  activeTab?: string;
  onTabChange?: (id: string) => void;
}) => {
  const [internalTab, setInternalTab] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ageFilter, setAgeFilter] = useState(ALL);
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [formatFilter, setFormatFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState("default");
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);

  const [showTrialModal, setShowTrialModal] = useState(false);

  const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const current = activeTab ?? internalTab;

  const { getToken, userId } = useAuth();
  const userIdRef = useRef(userId);
  userIdRef.current = userId;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items: products } = useSelector((state: RootState) => state.products);

  const filtersRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (id: string) => {
    setInternalTab(id);
    onTabChange?.(id);
  };

  /* close dropdown on outside click / Escape */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(e.target as Node)
      ) {
        setOpenFilter(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenFilter(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = (await getToken()) || "";
        await dispatch(
          fetchProducts({
            type: ProductType.ASSESSMENT,
            token,
          }),
        ).unwrap();
      } catch (err: unknown) {
        const message = getErrorMessage(err, "Failed to load assessments");
        if (isTrialExpiredMessage(message)) {
          // Show the "free trial expired" notice only the first time
          if (!hasSeenTrialNotice(userIdRef.current)) {
            setShowTrialModal(true);
            markTrialNoticeSeen(userIdRef.current);
          }
          setError(null);
        } else {
          setError(message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, [dispatch, getToken]);

  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      setHistoryError(null);
      const token = (await getToken()) || "";

      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/assessment-history`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 5 },
        },
      );

      setHistory(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching assessment history:", err);
      const apiMessage = axios.isAxiosError(err)
        ? String(err.response?.data?.message ?? "")
        : "";
      if (isTrialExpiredMessage(apiMessage)) {
        if (!hasSeenTrialNotice(userIdRef.current)) {
          setShowTrialModal(true);
          markTrialNoticeSeen(userIdRef.current);
        }
        setHistoryError(null);
      } else {
        setHistoryError("Failed to load history");
      }
    } finally {
      setHistoryLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  /* ----- dropdown options (built from the real data) ----- */

  const ageOptions: FilterOption[] = useMemo(
    () => [
      { value: ALL, label: "All Ages" },
      ...uniqueOptions(
        products.map((p) => (p.ageCategory ? String(p.ageCategory) : "")),
      ),
    ],
    [products],
  );

  const categoryOptions: FilterOption[] = useMemo(
    () => [
      { value: ALL, label: "All Categories" },
      ...uniqueOptions(products.map(getCategory)),
    ],
    [products],
  );

  const formatOptions: FilterOption[] = useMemo(
    () => [
      { value: ALL, label: "All Formats" },
      ...uniqueOptions(products.map(getFormat)),
    ],
    [products],
  );

  /* ----- filter + search + sort ----- */

  const filteredProducts = useMemo(() => {
    const allowedAgeCategories = tabAgeCategories[current];
    const query = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesTab =
        current === "all" ||
        (allowedAgeCategories &&
          allowedAgeCategories.includes(product.ageCategory));

      const matchesSearch =
        !query ||
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query);

      const matchesAge =
        ageFilter === ALL || String(product.ageCategory) === ageFilter;

      const matchesCategory =
        categoryFilter === ALL || getCategory(product) === categoryFilter;

      const matchesFormat =
        formatFilter === ALL || getFormat(product) === formatFilter;

      return (
        matchesTab &&
        matchesSearch &&
        matchesAge &&
        matchesCategory &&
        matchesFormat
      );
    });

    const sorted = [...result];
    switch (sortBy) {
      case "title-asc":
        sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "title-desc":
        sorted.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
      case "duration-asc":
        sorted.sort((a, b) => getDuration(a) - getDuration(b));
        break;
      case "duration-desc":
        sorted.sort((a, b) => getDuration(b) - getDuration(a));
        break;
      case "newest":
        sorted.sort((a, b) => getCreatedAt(b) - getCreatedAt(a));
        break;
      default:
        break;
    }
    return sorted;
  }, [
    products,
    current,
    search,
    ageFilter,
    categoryFilter,
    formatFilter,
    sortBy,
  ]);

  const hasActiveFilters =
    search.trim() !== "" ||
    ageFilter !== ALL ||
    categoryFilter !== ALL ||
    formatFilter !== ALL ||
    sortBy !== "default";

  const clearAll = () => {
    setSearch("");
    setAgeFilter(ALL);
    setCategoryFilter(ALL);
    setFormatFilter(ALL);
    setSortBy("default");
    setOpenFilter(null);
  };

  const toggle = (key: FilterKey) =>
    setOpenFilter((prev) => (prev === key ? null : key));

  const handleStartAssessment = (product: ProductBase) => {
    navigate(`/assessment-questions`, {
      state: {
        questionGallery:
          (product.details as AssessmentProduct["details"])?.questionGallery ||
          [],
        assessment: product.title,
        productId: product._id,
        ageCategory: product.ageCategory,
      },
    });
  };

  return (
    <section style={sectionStyle}>
      {/* ---------- Free trial expired (shown once) ---------- */}
      {showTrialModal && (
        <div style={modalOverlayStyle} onClick={() => setShowTrialModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <AlertCircle
              size={44}
              className="mx-auto mb-3"
              color={ORANGE_DARK}
              strokeWidth={2.5}
            />
            <h2 style={stateTitleStyle}>Your free trial has expired</h2>
            <p className="mt-2 mb-5" style={stateTextStyle}>
              Upgrade your plan to keep taking assessments.
            </p>
            <button
              type="button"
              onClick={() => setShowTrialModal(false)}
              className="px-6 py-2.5"
              style={startBtnStyle}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ---------- Banner ---------- */}
      <div className="px-4 pt-6 sm:px-6 sm:pt-10 md:px-10">
        <div
          className="relative flex w-full flex-col items-center gap-8 overflow-hidden px-5 py-10 text-center sm:px-8 sm:py-12 md:flex-row md:gap-10 md:px-14 md:text-left"
          style={bannerStyle}
        >
          <div style={bannerOverlayStyle} />
          <div style={bannerCircleStyle} />

          {/* Psychologist Verified badge: same corner position on all screens */}
          <img
            src="/assets/LandingPage/psyco.png"
            alt="Psychologist Verified"
            className="absolute -top-3 -right-4 z-20 pointer-events-none object-contain w-28 h-28 sm:w-44 sm:h-44 lg:w-56 lg:h-56"
          />

          <div className="relative z-10 w-full md:max-w-lg md:shrink-0">
            <h1
              className="mt-2 text-5xl sm:text-6xl md:text-6xl"
              style={bannerTitleStyle}
            >
              Small Assessments
              <br className="hidden sm:block" /> Big Insights
            </h1>
            <p className="mt-6" style={bannerTextStyle}>
              Help children, teens and parents understand emotions, behaviours
              and strengths with simple assessments.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col gap-2"
                  style={featureCardStyle}
                >
                  <Icon size={22} color={INK} strokeWidth={2.5} />
                  <span style={featureLabelStyle}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex w-full flex-1 items-center justify-center">
            <div style={bannerImageCardStyle}>
              <img
                src="/assets/v3/assessment/assessment.png"
                alt="banner-img"
                style={bannerImageStyle}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 px-6 md:px-10 pb-10">
        <div className="flex flex-wrap items-stretch w-full gap-4">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = current === id;
            return (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                className="flex-1 flex flex-col items-center justify-center gap-2 px-6 py-6"
                style={tabStyle(isActive)}
              >
                <Icon size={30} color={INK} strokeWidth={2.5} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* ---------- Search + Filters + Sort ---------- */}
        <div
          ref={filtersRef}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <div
            className="flex-1 min-w-[220px] flex items-center gap-2 px-4 py-3"
            style={searchBoxStyle}
          >
            <Search size={20} color={INK} strokeWidth={2.5} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assessments..."
              className="w-full outline-none"
              style={searchInputStyle}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={18} color={INK} strokeWidth={2.5} />
              </button>
            )}
          </div>

          <FilterDropdown
            label="Age Group"
            icon={Users2}
            options={ageOptions}
            value={ageFilter}
            defaultValue={ALL}
            isOpen={openFilter === "age"}
            onToggle={() => toggle("age")}
            onSelect={(v) => {
              setAgeFilter(v);
              setOpenFilter(null);
            }}
          />

          <FilterDropdown
            label="Category"
            icon={Tag}
            options={categoryOptions}
            value={categoryFilter}
            defaultValue={ALL}
            isOpen={openFilter === "category"}
            onToggle={() => toggle("category")}
            onSelect={(v) => {
              setCategoryFilter(v);
              setOpenFilter(null);
            }}
          />

          <FilterDropdown
            label="Format"
            icon={FileText}
            options={formatOptions}
            value={formatFilter}
            defaultValue={ALL}
            isOpen={openFilter === "format"}
            onToggle={() => toggle("format")}
            onSelect={(v) => {
              setFormatFilter(v);
              setOpenFilter(null);
            }}
          />

          <FilterDropdown
            label="Sort by"
            icon={ArrowUpDown}
            options={SORT_OPTIONS}
            value={sortBy}
            defaultValue="default"
            isOpen={openFilter === "sort"}
            onToggle={() => toggle("sort")}
            onSelect={(v) => {
              setSortBy(v);
              setOpenFilter(null);
            }}
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-3"
              style={clearBtnStyle}
            >
              <X size={18} strokeWidth={2.5} />
              Clear
            </button>
          )}
        </div>

        {/* items-start stops the right column from stretching to the cards' height */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="w-full text-center py-16" style={stateBoxStyle}>
                <div
                  className="w-12 h-12 rounded-full animate-spin mx-auto"
                  style={spinnerStyle}
                ></div>
                <p className="mt-4" style={stateTitleStyle}>
                  Loading assessments...
                </p>
              </div>
            ) : error ? (
              <div className="w-full text-center py-16" style={stateBoxStyle}>
                <AlertCircle
                  size={44}
                  className="mx-auto mb-4"
                  color="#e11d48"
                  strokeWidth={2.5}
                />
                <p
                  className="mb-4"
                  style={{ ...stateTitleStyle, color: "#e11d48" }}
                >
                  OOPS! {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  style={retryBtnStyle}
                >
                  Retry
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="w-full text-center py-16" style={stateBoxStyle}>
                <Inbox
                  size={44}
                  className="mx-auto mb-4"
                  color={INK}
                  strokeWidth={2.5}
                />
                <p style={stateTitleStyle}>
                  {hasActiveFilters
                    ? "No assessments match your filters"
                    : "No assessments available right now"}
                </p>
                <p className="mt-1" style={stateTextStyle}>
                  {hasActiveFilters
                    ? "Try changing or clearing your filters"
                    : "Check back later"}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-4 px-5 py-2"
                    style={retryBtnStyle}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const details =
                    product.details as AssessmentProduct["details"];
                  return (
                    <div
                      key={product._id}
                      className="overflow-hidden flex flex-col"
                      style={cardStyle}
                    >
                      <div
                        className="relative h-44 overflow-hidden flex items-center justify-center"
                        style={cardImageWrapStyle}
                      >
                        <img
                          src={
                            product.productImages?.[0]?.imageUrl ||
                            "/placeholder-image.jpg"
                          }
                          alt={product.title}
                          className="w-full h-full object-contain"
                        />
                        <span
                          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1"
                          style={durationBadgeStyle}
                        >
                          <Clock size={14} color={INK} strokeWidth={2.5} />
                          {details?.duration
                            ? `${details.duration} mins`
                            : "N/A"}
                        </span>
                      </div>

                      <div className="p-4 flex flex-col gap-3 flex-1">
                        <div>
                          <h3 className="line-clamp-1" style={cardTitleStyle}>
                            {product.title}
                          </h3>
                          <p
                            className="mt-1 line-clamp-2"
                            style={cardDescStyle}
                          >
                            {product.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1" style={chipStyle}>
                            {product.ageCategory || "N/A"}
                          </span>
                          {details?.difficulty && (
                            <span
                              className="px-3 py-1"
                              style={{ ...chipStyle, background: YELLOW_SOFT }}
                            >
                              {details.difficulty}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleStartAssessment(product)}
                          className="mt-auto flex items-center justify-center gap-2 px-4 py-2.5"
                          style={startBtnStyle}
                        >
                          Start Assessment
                          <ArrowRight size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ---------- Right column: history panel + flip card ---------- */}
          <div className="lg:col-span-1 flex flex-col gap-8 self-start w-full">
            <div className="p-5 flex flex-col" style={historyPanelStyle}>
              <h2 style={historyTitleStyle}>Assessment History</h2>

              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div
                    className="w-8 h-8 rounded-full animate-spin"
                    style={spinnerStyle}
                  ></div>
                </div>
              ) : historyError ? (
                <div className="flex flex-col items-center justify-center text-center gap-2 py-8">
                  <AlertCircle size={30} color="#e11d48" strokeWidth={2.5} />
                  <p style={{ ...stateTextStyle, color: "#e11d48" }}>
                    {historyError}
                  </p>
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center gap-3 py-8">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={historyIconStyle}
                  >
                    <History size={22} color={INK} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p style={{ ...stateTitleStyle, fontSize: "1.2rem" }}>
                      No history yet
                    </p>
                    <p className="mt-1 max-w-[200px]" style={stateTextStyle}>
                      Assessments you complete will show up here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-3 overflow-y-auto max-h-[360px] p-1">
                  {history.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-start gap-3 p-3"
                      style={historyItemStyle}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={historyIconStyle}
                      >
                        <History size={16} color={INK} strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="truncate"
                          style={{
                            fontFamily: "var(--font-comic-chip)",
                            fontSize: "1rem",
                            letterSpacing: "0.05em",
                            color: INK,
                          }}
                        >
                          {item.assessmentTitle}
                        </p>
                        <p className="mt-0.5" style={stateTextStyle}>
                          {new Date(item.completedAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                        {typeof item.score === "number" && (
                          <p
                            className="mt-0.5"
                            style={{ ...stateTextStyle, color: ORANGE_DARK }}
                          >
                            Score: {item.score}
                            {item.totalQuestions
                              ? ` / ${item.totalQuestions}`
                              : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                disabled={history.length === 0}
                className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5"
                style={historyBtnStyle(history.length === 0)}
              >
                View All History
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Flippable hiring card -> /join-us */}
            <HiringFlipCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssessmentPage;
