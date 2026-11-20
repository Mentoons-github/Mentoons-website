import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AGE_GROUPS,
  staticSalesAnalytics,
  type AgeGroup,
  type SalesAnalyticsData,
  type SalesCategory,
  type SalesOrder,
  type SalesProduct,
} from "./salesAnalytics";

const PERIOD_OPTIONS = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 365, label: "1 year" },
];

const SORT_OPTIONS = [
  { key: "revenue", label: "Revenue" },
  { key: "units", label: "Units" },
  { key: "orders", label: "Orders" },
  { key: "name", label: "Name (A-Z)" },
] as const;
type SortKey = (typeof SORT_OPTIONS)[number]["key"];

const FALLBACK_COLOR = "#94A3B8";
const OTHER = "Other locations";

interface UseSalesAnalyticsResult {
  data: SalesAnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useSalesAnalytics = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _range: { from: string; to: string },
): UseSalesAnalyticsResult => ({
  data: staticSalesAnalytics,
  loading: false,
  error: null,
  refetch: () => undefined,
});

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const inrCompact = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${Math.round(n)}`;
};

const tooltipStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  border: "none",
  borderRadius: "1rem",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
const parseISO = (s: string) => new Date(`${s}T00:00:00`);
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const daysBetween = (a: Date, b: Date) =>
  Math.round((b.getTime() - a.getTime()) / 86400000);
const startOfWeek = (d: Date) => addDays(d, -((d.getDay() + 6) % 7));
const fmtDay = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const fmtDayYear = (d: Date) =>
  d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const fmtMonth = (d: Date) =>
  d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });

type Grain = "day" | "week" | "month";

const bucketOf = (d: Date, grain: Grain) => {
  if (grain === "day") return { key: iso(d), label: fmtDay(d) };
  if (grain === "week") {
    const s = startOfWeek(d);
    return { key: iso(s), label: fmtDay(s) };
  }
  return { key: `${d.getFullYear()}-${d.getMonth()}`, label: fmtMonth(d) };
};

interface Bucket {
  period: string;
  orders: number;
  units: number;
  revenue: number;
  [k: string]: string | number;
}

const buildBuckets = (
  list: SalesOrder[],
  fromISO: string,
  toISO: string,
  grain: Grain,
  productMap: Record<string, SalesProduct>,
  categories: SalesCategory[],
): Bucket[] => {
  const map = new Map<string, Bucket>();
  const end = parseISO(toISO);
  for (let d = parseISO(fromISO); d <= end; d = addDays(d, 1)) {
    const b = bucketOf(d, grain);
    if (!map.has(b.key)) {
      const empty: Bucket = {
        period: b.label,
        orders: 0,
        units: 0,
        revenue: 0,
      };
      categories.forEach((c) => (empty[c.key] = 0));
      map.set(b.key, empty);
    }
  }
  for (const o of list) {
    const p = productMap[o.productId];
    const bucket = map.get(bucketOf(parseISO(o.date), grain).key);
    if (!p || !bucket) continue;
    const rev = o.units * p.price;
    bucket.orders += 1;
    bucket.units += o.units;
    bucket.revenue += rev;
    bucket[p.category] = Number(bucket[p.category] ?? 0) + rev;
  }
  return [...map.values()];
};

const KpiCard = ({
  title,
  value,
  sub,
  gradient,
}: {
  title: string;
  value: string;
  sub?: string;
  gradient: string;
}) => (
  <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
    <div
      className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold text-white bg-gradient-to-r ${gradient} mb-3`}
    >
      {title}
    </div>
    <div className="text-3xl font-bold text-gray-800 break-words">{value}</div>
    {sub && <div className="text-sm text-gray-500 mt-1">{sub}</div>}
  </div>
);

const Card = ({
  title,
  subtitle,
  children,
  className = "",
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) => (
  <div
    className={`bg-white shadow-lg rounded-3xl p-6 sm:p-8 border border-gray-100 ${className}`}
  >
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

const PageShell = ({ children }: { children: ReactNode }) => (
  <div className="container p-4 mx-auto">{children}</div>
);

const LoadingState = () => (
  <PageShell>
    <div className="flex flex-col items-center justify-center py-40">
      <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
      <p className="mt-4 text-gray-600 font-medium">Loading sales analytics…</p>
    </div>
  </PageShell>
);

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <PageShell>
    <div className="flex flex-col items-center justify-center py-40 text-center">
      <p className="text-xl font-bold text-gray-800">
        Couldn't load sales analytics
      </p>
      <p className="mt-2 text-gray-600">{message}</p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={onRetry}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
        >
          Try again
        </button>
        <Link
          to="/admin/dashboard"
          className="px-5 py-2 rounded-xl text-sm font-semibold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  </PageShell>
);

const GrowthBadge = ({ growth }: { growth: number | null }) => {
  if (growth === null) {
    return <span className="font-semibold text-gray-400">No prior sales</span>;
  }
  return (
    <span
      className={`font-semibold ${
        growth >= 0 ? "text-emerald-600" : "text-red-500"
      }`}
    >
      {growth >= 0 ? "+" : ""}
      {growth}% vs previous period
    </span>
  );
};

const pillClass = (active: boolean) =>
  `px-4 py-2 rounded-xl text-sm font-semibold transition ${
    active
      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
  }`;

const inputClass =
  "px-3 py-2 rounded-xl text-sm bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400";

const SalesAnalytics = () => {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [preset, setPreset] = useState<number | null>(30);
  const [customFrom, setCustomFrom] = useState(iso(addDays(today, -29)));
  const [customTo, setCustomTo] = useState(iso(today));
  const [category, setCategory] = useState<string>("all");
  const [age, setAge] = useState<AgeGroup | "all">("all");
  const [city, setCity] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [rankBy, setRankBy] = useState<"units" | "revenue">("units");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const detailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedId) return;
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedId]);

  const [fromISO, toISO] = useMemo(() => {
    let f = preset ? iso(addDays(today, -(preset - 1))) : customFrom;
    let t = preset ? iso(today) : customTo;
    if (f > t) [f, t] = [t, f];
    return [f, t];
  }, [preset, customFrom, customTo, today]);

  const { data, loading, error, refetch } = useSalesAnalytics({
    from: fromISO,
    to: toISO,
  });

  const categories = useMemo(() => data?.categories ?? [], [data]);
  const products = useMemo(() => data?.products ?? [], [data]);
  const locations = useMemo(() => data?.locations ?? [], [data]);
  const orders = useMemo(() => data?.orders ?? [], [data]);

  const categoryMap = useMemo(
    () =>
      Object.fromEntries(categories.map((c) => [c.key, c])) as Record<
        string,
        SalesCategory
      >,
    [categories],
  );
  const productMap = useMemo(
    () =>
      Object.fromEntries(products.map((p) => [p.id, p])) as Record<
        string,
        SalesProduct
      >,
    [products],
  );
  const stateOf = useMemo(
    () => Object.fromEntries(locations.map((l) => [l.city, l.state])),
    [locations],
  );

  const activeKey =
    category !== "all" && categoryMap[category] ? category : "all";
  const activeCats = useMemo(
    () =>
      activeKey === "all"
        ? categories
        : categories.filter((c) => c.key === activeKey),
    [activeKey, categories],
  );

  const rangeDays = daysBetween(parseISO(fromISO), parseISO(toISO)) + 1;
  const grain: Grain =
    rangeDays <= 45 ? "day" : rangeDays <= 150 ? "week" : "month";
  const grainLabel =
    grain === "day" ? "daily" : grain === "week" ? "weekly" : "monthly";
  const periodLabel = preset
    ? `Last ${PERIOD_OPTIONS.find((p) => p.days === preset)?.label ?? `${preset} days`}`
    : `${fmtDayYear(parseISO(fromISO))} to ${fmtDayYear(parseISO(toISO))}`;

  const q = search.trim().toLowerCase();

  const selectOrders = useMemo(
    () => (from: string, to: string) =>
      orders.filter((o) => {
        if (o.date < from || o.date > to) return false;
        if (city !== "all" && o.city !== city) return false;
        const p = productMap[o.productId];
        if (!p) return false;
        if (age !== "all" && p.ageGroup !== age) return false;
        if (q && !p.name.toLowerCase().includes(q)) return false;
        return true;
      }),
    [orders, productMap, city, age, q],
  );

  const baseOrders = useMemo(
    () => selectOrders(fromISO, toISO),
    [selectOrders, fromISO, toISO],
  );

  const prevOrders = useMemo(() => {
    const prevTo = iso(addDays(parseISO(fromISO), -1));
    const prevFrom = iso(addDays(parseISO(fromISO), -rangeDays));
    return selectOrders(prevFrom, prevTo);
  }, [selectOrders, fromISO, rangeDays]);

  const filtered = useMemo(
    () =>
      activeKey === "all"
        ? baseOrders
        : baseOrders.filter(
            (o) => productMap[o.productId]?.category === activeKey,
          ),
    [baseOrders, activeKey, productMap],
  );

  const catStats = useMemo(() => {
    const rev: Record<string, number> = {};
    const units: Record<string, number> = {};
    const prev: Record<string, number> = {};
    for (const o of baseOrders) {
      const p = productMap[o.productId];
      rev[p.category] = (rev[p.category] ?? 0) + o.units * p.price;
      units[p.category] = (units[p.category] ?? 0) + o.units;
    }
    for (const o of prevOrders) {
      const p = productMap[o.productId];
      prev[p.category] = (prev[p.category] ?? 0) + o.units * p.price;
    }
    return categories.map((c) => ({
      ...c,
      revenue: rev[c.key] ?? 0,
      units: units[c.key] ?? 0,
      growth: prev[c.key]
        ? Math.round((((rev[c.key] ?? 0) - prev[c.key]) / prev[c.key]) * 100)
        : null,
    }));
  }, [baseOrders, prevOrders, categories, productMap]);

  const productRows = useMemo(() => {
    const m = new Map<
      string,
      {
        units: number;
        orders: number;
        revenue: number;
        cities: Record<string, number>;
      }
    >();
    for (const o of filtered) {
      const p = productMap[o.productId];
      const e = m.get(p.id) ?? { units: 0, orders: 0, revenue: 0, cities: {} };
      const rev = o.units * p.price;
      e.units += o.units;
      e.orders += 1;
      e.revenue += rev;
      e.cities[o.city] = (e.cities[o.city] ?? 0) + rev;
      m.set(p.id, e);
    }
    const rows = [...m.entries()].map(([id, e]) => ({
      ...productMap[id],
      units: e.units,
      orders: e.orders,
      revenue: e.revenue,
      topCity:
        Object.entries(e.cities).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-",
    }));
    rows.sort((a, b) =>
      sortKey === "name"
        ? a.name.localeCompare(b.name)
        : b[sortKey] - a[sortKey],
    );
    return rows;
  }, [filtered, productMap, sortKey]);

  const locationRows = useMemo(() => {
    const m = new Map<
      string,
      {
        orders: number;
        units: number;
        revenue: number;
        customers: Set<number>;
        perCat: Record<string, number>;
      }
    >();
    for (const o of filtered) {
      const p = productMap[o.productId];
      const e = m.get(o.city) ?? {
        orders: 0,
        units: 0,
        revenue: 0,
        customers: new Set<number>(),
        perCat: {},
      };
      const rev = o.units * p.price;
      e.orders += 1;
      e.units += o.units;
      e.revenue += rev;
      e.customers.add(o.customerId);
      e.perCat[p.category] = (e.perCat[p.category] ?? 0) + rev;
      m.set(o.city, e);
    }
    return [...m.entries()]
      .map(([cityName, e]) => ({
        city: cityName,
        state: stateOf[cityName] ?? "",
        orders: e.orders,
        units: e.units,
        revenue: e.revenue,
        customers: e.customers.size,
        perCat: e.perCat,
      }))
      .sort((a, b) => {
        if (a.city === OTHER) return 1;
        if (b.city === OTHER) return -1;
        return b.revenue - a.revenue;
      });
  }, [filtered, productMap, stateOf]);

  const trend = useMemo(
    () => buildBuckets(filtered, fromISO, toISO, grain, productMap, categories),
    [filtered, fromISO, toISO, grain, productMap, categories],
  );

  const matrix = useMemo(() => {
    const m: Record<string, Record<string, number>> = {};
    for (const o of filtered) {
      const p = productMap[o.productId];
      m[p.id] = m[p.id] ?? {};
      m[p.id][o.city] = (m[p.id][o.city] ?? 0) + o.units * p.price;
    }
    return m;
  }, [filtered, productMap]);

  const topByLocation = useMemo(() => {
    const m: Record<
      string,
      Record<string, { units: number; revenue: number }>
    > = {};
    for (const o of filtered) {
      const p = productMap[o.productId];
      const byProduct = (m[o.city] = m[o.city] ?? {});
      const e = (byProduct[p.id] = byProduct[p.id] ?? { units: 0, revenue: 0 });
      e.units += o.units;
      e.revenue += o.units * p.price;
    }
    return locationRows.map((l) => ({
      city: l.city,
      state: l.state,
      products: Object.entries(m[l.city] ?? {})
        .map(([id, e]) => ({ ...productMap[id], ...e }))
        .sort((a, b) => b[rankBy] - a[rankBy])
        .slice(0, 3),
    }));
  }, [filtered, productMap, locationRows, rankBy]);

  const selected = productRows.find((p) => p.id === selectedId) ?? null;
  const selectedOrders = useMemo(
    () =>
      selectedId ? filtered.filter((o) => o.productId === selectedId) : [],
    [filtered, selectedId],
  );
  const selectedTrend = useMemo(
    () =>
      buildBuckets(
        selectedOrders,
        fromISO,
        toISO,
        grain,
        productMap,
        categories,
      ),
    [selectedOrders, fromISO, toISO, grain, productMap, categories],
  );
  const selectedLocations = useMemo(() => {
    const m: Record<
      string,
      { orders: number; units: number; revenue: number }
    > = {};
    for (const o of selectedOrders) {
      const p = productMap[o.productId];
      const e = (m[o.city] = m[o.city] ?? { orders: 0, units: 0, revenue: 0 });
      e.orders += 1;
      e.units += o.units;
      e.revenue += o.units * p.price;
    }
    return Object.entries(m)
      .map(([c, e]) => ({ city: c, state: stateOf[c] ?? "", ...e }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [selectedOrders, productMap, stateOf]);

  if (!data && loading) return <LoadingState />;
  if (!data) {
    return (
      <ErrorState
        message={error ?? "No data returned from the server"}
        onRetry={refetch}
      />
    );
  }

  const totalRevenue = productRows.reduce((s, p) => s + p.revenue, 0);
  const totalUnits = productRows.reduce((s, p) => s + p.units, 0);
  const totalOrders = filtered.length;
  const uniqueCustomers = new Set(filtered.map((o) => o.customerId)).size;
  const avgOrder = totalOrders ? totalRevenue / totalOrders : 0;
  const topProduct = [...productRows].sort((a, b) => b.revenue - a.revenue)[0];
  const topLocation = [...locationRows].sort(
    (a, b) => b.revenue - a.revenue,
  )[0];

  const barProducts = [...productRows]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)
    .map((p) => ({
      name: p.name.length > 26 ? `${p.name.slice(0, 26)}…` : p.name,
      revenue: p.revenue,
      color: categoryMap[p.category]?.color ?? FALLBACK_COLOR,
    }));

  const barLocations = locationRows.map((l) => ({
    city: l.city,
    revenue: l.revenue,
  }));

  const filtersActive =
    activeKey !== "all" || age !== "all" || city !== "all" || q !== "";
  const clearFilters = () => {
    setCategory("all");
    setAge("all");
    setCity("all");
    setSearch("");
    setSelectedId(null);
  };

  const hasSales = totalOrders > 0 || filtersActive;

  return (
    <PageShell>
      <div className="mb-8">
        <Link
          to="/admin/dashboard"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          ← Back to dashboard
        </Link>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-bold">Sales Analytics</h1>
            <p className="text-gray-600">
              Category, product and location wise sales · {periodLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PERIOD_OPTIONS.map((p) => (
              <button
                key={p.days}
                onClick={() => setPreset(p.days)}
                className={pillClass(preset === p.days)}
              >
                {p.label}
              </button>
            ))}
            <div
              className={`flex items-center gap-2 rounded-xl px-2 py-1 ${
                preset === null ? "bg-blue-50 ring-2 ring-blue-400" : ""
              }`}
            >
              <input
                type="date"
                value={customFrom}
                max={iso(today)}
                onChange={(e) => {
                  if (!e.target.value) return;
                  setCustomFrom(e.target.value);
                  setPreset(null);
                }}
                className={inputClass}
                aria-label="From date"
              />
              <span className="text-sm text-gray-500">to</span>
              <input
                type="date"
                value={customTo}
                max={iso(today)}
                onChange={(e) => {
                  if (!e.target.value) return;
                  setCustomTo(e.target.value);
                  setPreset(null);
                }}
                className={inputClass}
                aria-label="To date"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={refetch} className="font-semibold underline">
              Retry
            </button>
          </div>
        )}
      </div>

      <div
        className={`transition-opacity ${loading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setCategory("all")}
            className={pillClass(activeKey === "all")}
          >
            All categories
          </button>
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeKey === c.key
                  ? "text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
              style={activeKey === c.key ? { backgroundColor: c.color } : {}}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <select
            value={age}
            onChange={(e) => setAge(e.target.value as AgeGroup | "all")}
            className={inputClass}
            aria-label="Age group"
          >
            <option value="all">All age groups</option>
            {AGE_GROUPS.map((a) => (
              <option key={a.key} value={a.key}>
                {a.label}
              </option>
            ))}
          </select>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
            aria-label="Location"
          >
            <option value="all">All locations</option>
            {locations.map((l) => (
              <option key={l.city} value={l.city}>
                {l.city}
                {l.state ? `, ${l.state}` : ""}
              </option>
            ))}
          </select>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className={`${inputClass} w-56`}
            aria-label="Search products"
          />

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className={inputClass}
            aria-label="Sort products by"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.key} value={s.key}>
                Sort by: {s.label}
              </option>
            ))}
          </select>

          {filtersActive && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100"
            >
              Clear filters
            </button>
          )}
        </div>

        {!hasSales || totalOrders === 0 ? (
          <Card
            title="No sales found"
            subtitle={`No orders match these filters for ${periodLabel.toLowerCase()}.`}
            className="mb-8"
          >
            <p className="text-gray-500">
              Try a longer period, a different location, or clear the filters.
            </p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KpiCard
                title="Total revenue"
                value={inr(totalRevenue)}
                sub={`${totalOrders.toLocaleString("en-IN")} orders · ${uniqueCustomers.toLocaleString("en-IN")} customers`}
                gradient="from-emerald-500 to-emerald-600"
              />
              <KpiCard
                title="Units sold"
                value={totalUnits.toLocaleString("en-IN")}
                sub={`Avg. order value ${inr(avgOrder)}`}
                gradient="from-blue-500 to-blue-600"
              />
              <KpiCard
                title="Top product"
                value={topProduct ? topProduct.name : "-"}
                sub={topProduct ? inr(topProduct.revenue) : undefined}
                gradient="from-purple-500 to-purple-600"
              />
              <KpiCard
                title="Top location"
                value={topLocation ? topLocation.city : "-"}
                sub={topLocation ? inr(topLocation.revenue) : undefined}
                gradient="from-orange-500 to-orange-600"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <Card
                title="Revenue trend"
                subtitle={`${periodLabel}, ${grainLabel}${
                  activeKey === "all" ? ", split by category" : ""
                }`}
                className="lg:col-span-2"
              >
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trend}
                      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E5E7EB"
                        opacity={0.6}
                      />
                      <XAxis
                        dataKey="period"
                        stroke="#6B7280"
                        fontSize={12}
                        minTickGap={24}
                      />
                      <YAxis
                        stroke="#6B7280"
                        fontSize={12}
                        tickFormatter={(v) => inrCompact(Number(v))}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value, name) => [
                          inr(Number(value ?? 0)),
                          categoryMap[String(name)]?.label ?? String(name),
                        ]}
                      />
                      {activeCats.map((c) => (
                        <Area
                          key={c.key}
                          type="monotone"
                          dataKey={c.key}
                          stackId="1"
                          stroke={c.color}
                          fill={c.color}
                          fillOpacity={0.55}
                          strokeWidth={2}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Revenue by category" subtitle={periodLabel}>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={catStats}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E5E7EB"
                        opacity={0.6}
                      />
                      <XAxis
                        type="number"
                        stroke="#6B7280"
                        fontSize={12}
                        tickFormatter={(v) => inrCompact(Number(v))}
                      />
                      <YAxis
                        type="category"
                        dataKey="label"
                        stroke="#6B7280"
                        fontSize={11}
                        width={130}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value) => [
                          inr(Number(value ?? 0)),
                          "Revenue",
                        ]}
                      />
                      <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                        {catStats.map((c) => (
                          <Cell key={c.key} fill={c.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {catStats.map((c) => (
                <button
                  key={c.key}
                  onClick={() =>
                    setCategory(activeKey === c.key ? "all" : c.key)
                  }
                  className={`text-left bg-white shadow-lg rounded-2xl p-5 border transition hover:shadow-xl ${
                    activeKey === c.key ? "border-2" : "border-gray-100"
                  }`}
                  style={activeKey === c.key ? { borderColor: c.color } : {}}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {c.label}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {inr(c.revenue)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {c.units.toLocaleString("en-IN")}
                  </div>
                  <div className="mt-3 text-xs">
                    <GrowthBadge growth={c.growth} />
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card title="Product wise sales" subtitle="Top 8 by revenue">
                <div className="w-full h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barProducts}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E5E7EB"
                        opacity={0.6}
                      />
                      <XAxis
                        type="number"
                        stroke="#6B7280"
                        fontSize={12}
                        tickFormatter={(v) => inrCompact(Number(v))}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#6B7280"
                        fontSize={11}
                        width={170}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value) => [
                          inr(Number(value ?? 0)),
                          "Revenue",
                        ]}
                      />
                      <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                        {barProducts.map((p, i) => (
                          <Cell key={i} fill={p.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card
                title="Location wise sales"
                subtitle="Revenue by buyer location"
              >
                <div className="w-full h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barLocations}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="locBar" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#4F46E5"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4F46E5"
                            stopOpacity={0.4}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E5E7EB"
                        opacity={0.6}
                      />
                      <XAxis
                        dataKey="city"
                        stroke="#6B7280"
                        fontSize={11}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        stroke="#6B7280"
                        fontSize={12}
                        tickFormatter={(v) => inrCompact(Number(v))}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value) => [
                          inr(Number(value ?? 0)),
                          "Revenue",
                        ]}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="url(#locBar)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {selected && (
              <div ref={detailRef} className="scroll-mt-4">
                <Card
                  title={selected.name}
                  subtitle={`Sales by date and location · ${periodLabel} · ${
                    categoryMap[selected.category]?.label ?? selected.category
                  } · ages ${selected.ageGroup}`}
                  className="mb-8"
                  action={
                    <button
                      onClick={() => setSelectedId(null)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    >
                      Close
                    </button>
                  }
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <KpiCard
                      title="Revenue"
                      value={inr(selected.revenue)}
                      sub={`Price ${inr(selected.price)}`}
                      gradient="from-emerald-500 to-emerald-600"
                    />
                    <KpiCard
                      title="Units"
                      value={selected.units.toLocaleString("en-IN")}
                      gradient="from-blue-500 to-blue-600"
                    />
                    <KpiCard
                      title="Orders"
                      value={selected.orders.toLocaleString("en-IN")}
                      sub={`Top city: ${selected.topCity}`}
                      gradient="from-orange-500 to-orange-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">
                        By date ({grainLabel})
                      </h3>
                      <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={selectedTrend}
                            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#E5E7EB"
                              opacity={0.6}
                            />
                            <XAxis
                              dataKey="period"
                              stroke="#6B7280"
                              fontSize={12}
                              minTickGap={24}
                            />
                            <YAxis
                              stroke="#6B7280"
                              fontSize={12}
                              tickFormatter={(v) => inrCompact(Number(v))}
                            />
                            <Tooltip
                              contentStyle={tooltipStyle}
                              formatter={(value) => [
                                inr(Number(value ?? 0)),
                                "Revenue",
                              ]}
                            />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              stroke={
                                categoryMap[selected.category]?.color ??
                                FALLBACK_COLOR
                              }
                              fill={
                                categoryMap[selected.category]?.color ??
                                FALLBACK_COLOR
                              }
                              fillOpacity={0.5}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">
                        By location
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-500 border-b border-gray-200">
                              <th className="py-3 pr-4 font-semibold">
                                Location
                              </th>
                              <th className="py-3 pr-4 font-semibold text-right">
                                Orders
                              </th>
                              <th className="py-3 pr-4 font-semibold text-right">
                                Units
                              </th>
                              <th className="py-3 font-semibold text-right">
                                Revenue
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedLocations.map((l) => (
                              <tr
                                key={l.city}
                                className="border-b border-gray-100 hover:bg-gray-50"
                              >
                                <td className="py-3 pr-4">
                                  <div className="font-semibold text-gray-800">
                                    {l.city}
                                  </div>
                                  {l.state && (
                                    <div className="text-xs text-gray-500">
                                      {l.state}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 pr-4 text-right">
                                  {l.orders.toLocaleString("en-IN")}
                                </td>
                                <td className="py-3 pr-4 text-right">
                                  {l.units.toLocaleString("en-IN")}
                                </td>
                                <td className="py-3 text-right font-semibold text-gray-800">
                                  {inr(l.revenue)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            <Card
              title="Product details"
              subtitle="Click a product to see its sales by date and location"
              className="mb-8"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="py-3 pr-4 font-semibold">#</th>
                      <th className="py-3 pr-4 font-semibold">Product</th>
                      <th className="py-3 pr-4 font-semibold">Category</th>
                      <th className="py-3 pr-4 font-semibold">Age</th>
                      <th className="py-3 pr-4 font-semibold text-right">
                        Orders
                      </th>
                      <th className="py-3 pr-4 font-semibold text-right">
                        Units
                      </th>
                      <th className="py-3 pr-4 font-semibold text-right">
                        Price
                      </th>
                      <th className="py-3 pr-4 font-semibold">Top city</th>
                      <th className="py-3 font-semibold text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productRows.map((p, i) => {
                      const cat = categoryMap[p.category];
                      return (
                        <tr
                          key={p.id}
                          onClick={() =>
                            setSelectedId(p.id === selectedId ? null : p.id)
                          }
                          className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                            p.id === selectedId ? "bg-blue-50" : ""
                          }`}
                        >
                          <td className="py-3 pr-4 text-gray-400">{i + 1}</td>
                          <td className="py-3 pr-4 font-semibold text-gray-800">
                            {p.name}
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className="px-2.5 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap"
                              style={{
                                backgroundColor: cat?.color ?? FALLBACK_COLOR,
                              }}
                            >
                              {cat?.label ?? p.category}
                            </span>
                          </td>
                          <td className="py-3 pr-4 whitespace-nowrap">
                            {p.ageGroup}
                          </td>
                          <td className="py-3 pr-4 text-right">
                            {p.orders.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 pr-4 text-right">
                            {p.units.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 pr-4 text-right">
                            {inr(p.price)}
                          </td>
                          <td className="py-3 pr-4 whitespace-nowrap">
                            {p.topCity}
                          </td>
                          <td className="py-3 text-right font-semibold text-gray-800">
                            {inr(p.revenue)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card
              title="Product sales by location"
              subtitle="Revenue of every product in every city. The best city for each product is highlighted"
              className="mb-8"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="py-3 pr-4 font-semibold">Product</th>
                      {locationRows.map((l) => (
                        <th
                          key={l.city}
                          className="py-3 pr-4 font-semibold text-right whitespace-nowrap"
                        >
                          {l.city}
                        </th>
                      ))}
                      <th className="py-3 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productRows.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 pr-4 font-semibold text-gray-800 whitespace-nowrap">
                          {p.name}
                        </td>
                        {locationRows.map((l) => {
                          const v = matrix[p.id]?.[l.city] ?? 0;
                          const rowMax = Math.max(
                            ...locationRows.map(
                              (x) => matrix[p.id]?.[x.city] ?? 0,
                            ),
                          );
                          const best = v > 0 && v === rowMax;
                          return (
                            <td
                              key={l.city}
                              className={`py-3 pr-4 text-right ${
                                best
                                  ? "font-bold text-emerald-700 bg-emerald-50"
                                  : v
                                    ? ""
                                    : "text-gray-300"
                              }`}
                            >
                              {v ? inr(v) : "-"}
                            </td>
                          );
                        })}
                        <td className="py-3 text-right font-semibold text-gray-800">
                          {inr(p.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card
              title="Most purchased products by location"
              subtitle="Top 3 products in each city"
              className="mb-8"
              action={
                <div className="flex gap-2">
                  {(["units", "revenue"] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => setRankBy(k)}
                      className={pillClass(rankBy === k)}
                    >
                      {k === "units" ? "By units" : "By revenue"}
                    </button>
                  ))}
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="py-3 pr-4 font-semibold">Location</th>
                      <th className="py-3 pr-4 font-semibold">1st</th>
                      <th className="py-3 pr-4 font-semibold">2nd</th>
                      <th className="py-3 font-semibold">3rd</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topByLocation.map((l) => (
                      <tr
                        key={l.city}
                        className="border-b border-gray-100 align-top hover:bg-gray-50"
                      >
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-gray-800">
                            {l.city}
                          </div>
                          {l.state && (
                            <div className="text-xs text-gray-500">
                              {l.state}
                            </div>
                          )}
                        </td>
                        {[0, 1, 2].map((i) => {
                          const p = l.products[i];
                          return (
                            <td key={i} className="py-3 pr-4">
                              {p ? (
                                <div className="flex items-start gap-2">
                                  <span
                                    className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{
                                      backgroundColor:
                                        categoryMap[p.category]?.color ??
                                        FALLBACK_COLOR,
                                    }}
                                  />
                                  <div>
                                    <div className="font-semibold text-gray-800">
                                      {p.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {p.units.toLocaleString("en-IN")} units ·{" "}
                                      {inr(p.revenue)}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card
              title="Location details"
              subtitle="Where your buyers are, by city / state and category"
              className="mb-8"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="py-3 pr-4 font-semibold">#</th>
                      <th className="py-3 pr-4 font-semibold">Location</th>
                      <th className="py-3 pr-4 font-semibold text-right">
                        Buyers
                      </th>
                      <th className="py-3 pr-4 font-semibold text-right">
                        Orders
                      </th>
                      {activeCats.map((c) => (
                        <th
                          key={c.key}
                          className="py-3 pr-4 font-semibold text-right whitespace-nowrap"
                        >
                          {c.label}
                        </th>
                      ))}
                      <th className="py-3 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationRows.map((l, i) => (
                      <tr
                        key={l.city}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 pr-4 text-gray-400">{i + 1}</td>
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-gray-800">
                            {l.city}
                          </div>
                          {l.state && (
                            <div className="text-xs text-gray-500">
                              {l.state}
                            </div>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-right">
                          {l.customers.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 pr-4 text-right">
                          {l.orders.toLocaleString("en-IN")}
                        </td>
                        {activeCats.map((c) => (
                          <td key={c.key} className="py-3 pr-4 text-right">
                            {inr(l.perCat[c.key] ?? 0)}
                          </td>
                        ))}
                        <td className="py-3 text-right font-semibold text-gray-800">
                          {inr(l.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </PageShell>
  );
};

export default SalesAnalytics;
