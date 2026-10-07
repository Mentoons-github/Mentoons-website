import {
  getRevenueOrdersByCategory,
  getRevenueSummary,
  RevenueMonth,
  RevenueOrder,
  RevenueSummary,
} from "@/api/revenue";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type RangeKey = "this_month" | "last_3_months" | "this_year" | "all_time";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "this_month", label: "This month" },
  { key: "last_3_months", label: "Last 3 months" },
  { key: "this_year", label: "This year" },
  { key: "all_time", label: "All time" },
];

const rangeToDates = (range: RangeKey): { startDate?: string; endDate?: string } => {
  const now = new Date();
  if (range === "all_time") return {};

  if (range === "this_month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { startDate: start.toISOString() };
  }

  if (range === "last_3_months") {
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    return { startDate: start.toISOString() };
  }

  const start = new Date(now.getFullYear(), 0, 1);
  return { startDate: start.toISOString() };
};
const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const monthLabel = (m: string) => {
  const [year, month] = m.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
    month: "short",
    year: "2-digit",
  });
};

const dateTimeLabel = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CATEGORY_COLORS: Record<string, string> = {
  product_purchase: "#2563EB",
  subscription_purchase: "#D97706",
  consultancy_purchase: "#059669",
  assessment_purchase: "#7C3AED",
};

const ORDERS_PAGE_SIZE = 20;

// Small stat card used in the top KPI row
const StatCard = ({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: string;
  isLoading: boolean;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-2 text-2xl font-semibold tabular-nums text-gray-900">
      {isLoading ? "···" : value}
    </p>
  </div>
);

// Modal that lists the individual orders for a chosen category
const CategoryOrdersModal = ({
  orderType,
  label,
  startDate,
  endDate,
  onClose,
}: {
  orderType: string;
  label: string;
  startDate?: string;
  endDate?: string;
  onClose: () => void;
}) => {
  const [orders, setOrders] = useState<RevenueOrder[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const result = await getRevenueOrdersByCategory({
          orderType,
          startDate,
          endDate,
          page,
          limit: ORDERS_PAGE_SIZE,
          search: search || undefined,
        });
        if (!cancelled) {
          setOrders(result.orders);
          setTotalPages(result.pagination.totalPages);
          setTotalCount(result.pagination.totalCount);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : "Failed to load orders",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [orderType, startDate, endDate, page, search]);

  useEffect(() => {
    // Reset to page 1 whenever the search term actually changes
    setPage(1);
  }, [search]);

  useEffect(() => {
    // Close on Escape, lock background scroll
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: CATEGORY_COLORS[orderType] || "#111827",
              }}
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
              <p className="text-sm text-gray-400">
                {isLoading
                  ? "Loading…"
                  : `${totalCount} order${totalCount === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-gray-100 px-6 py-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email or order ID"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Search
            </button>
          </form>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {errorMessage && (
            <div className="m-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Couldn't load orders — {errorMessage}.
            </div>
          )}

          {!errorMessage && (
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Payment</th>
                  <th className="px-6 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4" colSpan={5}>
                        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                      </td>
                    </tr>
                  ))}

                {!isLoading && orders.length === 0 && (
                  <tr>
                    <td
                      className="px-6 py-10 text-center text-gray-400"
                      colSpan={5}
                    >
                      No orders found.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {order.picture ? (
                            <img
                              src={order.picture}
                              alt={order.customerName}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                              {order.customerName?.[0]?.toUpperCase() || "?"}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.customerName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {order.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {dateTimeLabel(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-gray-500 capitalize">
                        {order.paymentMethod.replace(/_/g, " ")}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold tabular-nums text-gray-900">
                        {currency.format(order.amount)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!errorMessage && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const RevenuePage = () => {
  const [range, setRange] = useState<RangeKey>("this_month");
  const [data, setData] = useState<RevenueSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{
    orderType: string;
    label: string;
  } | null>(null);

  const dateParams = useMemo(() => rangeToDates(range), [range]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const result = await getRevenueSummary(dateParams);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : "Failed to load revenue",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [dateParams]);

  const maxMonthTotal = useMemo(() => {
    if (!data?.monthlyTrend?.length) return 0;
    return Math.max(...data.monthlyTrend.map((m: RevenueMonth) => m.total));
  }, [data]);

  const avgOrderValue = useMemo(() => {
    if (!data?.totalOrders) return 0;
    return data.totalRevenue / data.totalOrders;
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Page header — breadcrumb, title, range filter */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">Dashboard / Revenue</p>
            <h1 className="mt-1 text-2xl font-semibold text-gray-900">
              Revenue
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Earnings across products, subscriptions and consultancy. Click a
              category to see who purchased and when.
            </p>
          </div>

          <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  range === r.key
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Couldn't load revenue — {errorMessage}.
          </div>
        )}

        {/* KPI row */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total revenue"
            value={currency.format(data?.totalRevenue ?? 0)}
            isLoading={isLoading}
          />
          <StatCard
            label="Successful orders"
            value={`${data?.totalOrders ?? 0}`}
            isLoading={isLoading}
          />
          <StatCard
            label="Avg. order value"
            value={currency.format(avgOrderValue)}
            isLoading={isLoading}
          />
        </div>

        {/* One card per category — click to see the individual orders */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(data?.byCategory ?? []).map((cat) => (
            <button
              key={cat.orderType}
              onClick={() =>
                setSelectedCategory({
                  orderType: cat.orderType,
                  label: cat.label,
                })
              }
              className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      CATEGORY_COLORS[cat.orderType] || "#111827",
                  }}
                />
                <p className="text-sm font-medium text-gray-500">{cat.label}</p>
              </div>
              <p className="mt-2 text-xl font-semibold tabular-nums text-gray-900">
                {currency.format(cat.revenue)}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {cat.orders} orders · view details →
              </p>
            </button>
          ))}
          {!isLoading && !data?.byCategory?.length && (
            <p className="text-sm text-gray-400">
              No successful orders in this range yet.
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* Category breakdown */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-sm font-semibold text-gray-900">By category</h2>
            <div className="mt-4 divide-y divide-gray-100">
              {(data?.byCategory ?? []).map((cat) => {
                const pct = data?.totalRevenue
                  ? (cat.revenue / data.totalRevenue) * 100
                  : 0;
                return (
                  <button
                    key={cat.orderType}
                    onClick={() =>
                      setSelectedCategory({
                        orderType: cat.orderType,
                        label: cat.label,
                      })
                    }
                    className="w-full py-3 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-sm font-medium text-gray-700">
                        {cat.label}
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-gray-900">
                        {currency.format(cat.revenue)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor:
                              CATEGORY_COLORS[cat.orderType] || "#111827",
                          }}
                        />
                      </div>
                      <span className="w-24 shrink-0 text-right text-xs text-gray-400">
                        {cat.orders} orders
                      </span>
                    </div>
                  </button>
                );
              })}
              {!isLoading && !data?.byCategory?.length && (
                <p className="py-6 text-sm text-gray-400">
                  No successful orders in this range yet.
                </p>
              )}
            </div>
          </div>

          {/* Monthly trend */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Monthly trend
            </h2>
            <div className="mt-6 flex h-48 items-end gap-3">
              {(data?.monthlyTrend ?? []).map((m: RevenueMonth) => (
                <div
                  key={m.month}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex w-full flex-1 items-end justify-center">
                    <div
                      className="w-full max-w-10 rounded-t-md bg-blue-600 transition-all"
                      style={{
                        height: maxMonthTotal
                          ? `${(m.total / maxMonthTotal) * 100}%`
                          : "0%",
                      }}
                      title={currency.format(m.total)}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {monthLabel(m.month)}
                  </span>
                </div>
              ))}
              {!isLoading && !data?.monthlyTrend?.length && (
                <p className="text-sm text-gray-400">Nothing to chart yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedCategory && (
        <CategoryOrdersModal
          orderType={selectedCategory.orderType}
          label={selectedCategory.label}
          startDate={dateParams.startDate}
          endDate={"endDate" in dateParams ? dateParams.endDate : undefined}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
};

export default RevenuePage;
