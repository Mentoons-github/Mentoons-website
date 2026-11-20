import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  fetchExpenseSummary,
  fetchPayees,
  updateExpense,
  type ExpenseCategory,
  type ExpensePayload,
  type ExpenseRecord,
  type ExpenseSummaryData,
  type ExpenseType,
  type Payee,
  type PaymentMode,
  type PaymentStatus,
} from "@/api/expense";
import { useAuth } from "@clerk/clerk-react";
import {
  Banknote,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Coffee,
  Gift,
  IndianRupee,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ----------------------------- constants ----------------------------- */

const CATEGORIES: {
  value: ExpenseCategory;
  label: string;
  hint: string;
  icon: LucideIcon;
}[] = [
  {
    value: "daily",
    label: "Daily Expenses",
    hint: "Snacks, travel, small purchases",
    icon: Coffee,
  },
  {
    value: "salary",
    label: "Salary",
    hint: "Monthly pay of an employee",
    icon: Banknote,
  },
  {
    value: "freelancer",
    label: "Freelancer",
    hint: "Payment to a freelancer",
    icon: Briefcase,
  },
  {
    value: "incentive",
    label: "Incentives",
    hint: "Bonus or reward for a team member",
    icon: Gift,
  },
  {
    value: "infrastructure",
    label: "Infrastructure",
    hint: "Rent, internet, equipment, software",
    icon: Building2,
  },
  {
    value: "miscellaneous",
    label: "Miscellaneous",
    hint: "Anything that does not fit above",
    icon: MoreHorizontal,
  },
];

const PAYMENT_MODES: { value: PaymentMode; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "card", label: "Card" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Period = "month" | "lastMonth" | "year" | "all" | "custom";

const PERIODS: { value: Period; label: string }[] = [
  { value: "month", label: "This month" },
  { value: "lastMonth", label: "Last month" },
  { value: "year", label: "This year" },
  { value: "all", label: "All time" },
  { value: "custom", label: "Pick dates" },
];

const categoryColor: Record<ExpenseCategory, string> = {
  daily: "bg-blue-100 text-blue-700",
  salary: "bg-green-100 text-green-700",
  freelancer: "bg-purple-100 text-purple-700",
  incentive: "bg-yellow-100 text-yellow-700",
  infrastructure: "bg-orange-100 text-orange-700",
  miscellaneous: "bg-gray-200 text-gray-700",
};

const EMPLOYEE_CATEGORIES: ExpenseCategory[] = [
  "salary",
  "freelancer",
  "incentive",
];

/* ----------------------------- helpers ----------------------------- */

const categoryLabel = (c: string) =>
  CATEGORIES.find((x) => x.value === c)?.label ?? c;

const modeLabel = (m: string) =>
  PAYMENT_MODES.find((x) => x.value === m)?.label ?? m;

const formatINR = (n: number) => `₹${(n || 0).toLocaleString("en-IN")}`;

const formatDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "-";

const pad = (n: number) => String(n).padStart(2, "0");

// local date as YYYY-MM-DD (toISOString would shift the day in India)
const ymd = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const defaultTypeFor = (c: ExpenseCategory): ExpenseType =>
  c === "freelancer" ? "external" : "internal";

const sumOf = (
  rows: { _id: string; total: number }[] | undefined,
  key: string,
) => rows?.find((r) => r._id === key)?.total ?? 0;

interface FormState {
  category: ExpenseCategory;
  expenseType: ExpenseType;
  title: string;
  description: string;
  amount: string;
  date: string;
  paymentMode: PaymentMode;
  transactionRef: string;
  status: PaymentStatus;
  employee: string;
  salaryMonth: number;
  salaryYear: number;
  vendorName: string;
  billNumber: string;
}

const emptyForm = (): FormState => ({
  category: "daily",
  expenseType: "internal",
  title: "",
  description: "",
  amount: "",
  date: ymd(new Date()),
  paymentMode: "cash",
  transactionRef: "",
  status: "paid",
  employee: "",
  salaryMonth: new Date().getMonth() + 1,
  salaryYear: new Date().getFullYear(),
  vendorName: "",
  billNumber: "",
});

const inputCls =
  "w-full border border-gray-300 rounded-lg h-11 px-3 text-sm bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600";

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) => (
  <label className="block text-sm">
    <span className="mb-1 block text-sm font-medium text-gray-800">
      {label}
    </span>
    {children}
    {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
  </label>
);

const SectionTitle = ({ n, text }: { n: number; text: string }) => (
  <div className="mb-3 flex items-center gap-2">
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
      {n}
    </span>
    <h3 className="text-sm font-semibold text-gray-900">{text}</h3>
  </div>
);

/* ------------------------------- page ------------------------------- */

const AdminExpenses = () => {
  const { getToken } = useAuth();

  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [summary, setSummary] = useState<ExpenseSummaryData | null>(null);
  const [catSummary, setCatSummary] = useState<ExpenseSummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // filters
  const [category, setCategory] = useState<ExpenseCategory | "">("");
  const [expenseType, setExpenseType] = useState<ExpenseType | "">("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode | "">("");
  const [period, setPeriod] = useState<Period>("month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ExpenseRecord | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [showOptional, setShowOptional] = useState(false);
  const [payees, setPayees] = useState<Payee[]>([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const limit = 10;

  const range = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    switch (period) {
      case "month":
        return { from: ymd(new Date(y, m, 1)), to: ymd(new Date(y, m + 1, 0)) };
      case "lastMonth":
        return { from: ymd(new Date(y, m - 1, 1)), to: ymd(new Date(y, m, 0)) };
      case "year":
        return { from: `${y}-01-01`, to: `${y}-12-31` };
      case "custom":
        return { from: customFrom, to: customTo };
      default:
        return { from: "", to: "" };
    }
  }, [period, customFrom, customTo]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = await getToken();

    const base = {
      expenseType,
      paymentMode,
      from: range.from,
      to: range.to,
      search: debouncedSearch,
    };

    const [list, sum, catSum] = await Promise.all([
      fetchExpenses({ ...base, category, page, limit }, token),
      fetchExpenseSummary({ ...base, category }, token),
      // without the category filter, so the category chips keep their amounts
      fetchExpenseSummary(base, token),
    ]);

    if (list.success && list.data) {
      setExpenses(list.data.expenses);
      setTotalPages(list.data.totalPages);
      setTotal(list.data.total);
    } else {
      setExpenses([]);
      setTotal(0);
      setError(list.error || "Failed to fetch expenses");
    }
    if (sum.success && sum.data) setSummary(sum.data);
    if (catSum.success && catSum.data) setCatSummary(catSum.data);
    setLoading(false);
  }, [
    getToken,
    category,
    expenseType,
    paymentMode,
    range.from,
    range.to,
    debouncedSearch,
    page,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    reloadKey,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  // people dropdown for salary / freelancer / incentive
  useEffect(() => {
    if (!modalOpen || !EMPLOYEE_CATEGORIES.includes(form.category)) return;
    let cancelled = false;
    const run = async () => {
      const token = await getToken();
      const group =
        form.category === "salary"
          ? "staff"
          : form.category === "freelancer"
            ? "freelancer"
            : "all";
      const res = await fetchPayees(group, token);
      if (!cancelled) setPayees(res.data?.employees ?? []);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [modalOpen, form.category, getToken]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onCategoryChange = (c: ExpenseCategory) => {
    setForm((prev) => ({
      ...prev,
      category: c,
      expenseType: defaultTypeFor(c),
      employee: "",
      amount: EMPLOYEE_CATEGORIES.includes(c) ? "" : prev.amount,
    }));
  };

  const onEmployeeChange = (id: string) => {
    const person = payees.find((p) => p._id === id);
    setForm((prev) => ({
      ...prev,
      employee: id,
      amount:
        person && prev.category !== "incentive" && !prev.amount
          ? String(person.salary || "")
          : prev.amount,
    }));
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowOptional(false);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (e: ExpenseRecord) => {
    setEditing(e);
    setForm({
      category: e.category,
      expenseType: e.expenseType,
      title: e.title,
      description: e.description || "",
      amount: String(e.amount),
      date: e.date.slice(0, 10),
      paymentMode: e.paymentMode,
      transactionRef: e.transactionRef || "",
      status: e.status,
      employee: e.employee?._id ?? "",
      salaryMonth: e.salaryMonth ?? new Date().getMonth() + 1,
      salaryYear: e.salaryYear ?? new Date().getFullYear(),
      vendorName: e.vendorName || "",
      billNumber: e.billNumber || "",
    });
    setShowOptional(Boolean(e.description || e.billNumber));
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const needsEmployee = EMPLOYEE_CATEGORIES.includes(form.category);

  const handleSave = async () => {
    setFormError("");

    if (needsEmployee && !form.employee) {
      setFormError(
        form.category === "freelancer"
          ? "Please choose the freelancer"
          : "Please choose the employee",
      );
      return;
    }
    if (!needsEmployee && !form.title.trim()) {
      setFormError("Please write what this expense was for");
      return;
    }
    if (!Number(form.amount) || Number(form.amount) <= 0) {
      setFormError("Please enter the amount");
      return;
    }

    const payload: ExpensePayload = {
      category: form.category,
      expenseType: form.expenseType,
      // for people-based expenses the title is created automatically
      title: needsEmployee ? "" : form.title.trim(),
      description: form.description.trim(),
      amount: Number(form.amount),
      date: form.date,
      paymentMode: form.paymentMode,
      transactionRef: form.transactionRef.trim(),
      status: form.status,
      vendorName: needsEmployee ? "" : form.vendorName.trim(),
      billNumber: form.billNumber.trim(),
    };
    if (needsEmployee) payload.employee = form.employee;
    if (form.category === "salary") {
      payload.salaryMonth = form.salaryMonth;
      payload.salaryYear = form.salaryYear;
    }

    setSaving(true);
    const token = await getToken();
    const res = editing
      ? await updateExpense(editing._id, payload, token)
      : await createExpense(payload, token);
    setSaving(false);

    if (!res.success) {
      setFormError(res.error || "Something went wrong. Please try again.");
      return;
    }

    closeModal();

    if (!editing) {
      // make sure the new entry is visible: clear filters, pick a period that has it
      setCategory("");
      setExpenseType("");
      setPaymentMode("");
      setSearch("");
      setDebouncedSearch("");
      setPeriod(
        payload.date.slice(0, 7) === ymd(new Date()).slice(0, 7)
          ? "month"
          : "all",
      );
      setPage(1);
    }
    setReloadKey((k) => k + 1);
    setNotice(editing ? "Expense updated" : "Expense added");
  };

  const handleDelete = async (e: ExpenseRecord) => {
    if (!window.confirm(`Delete "${e.title}"? This cannot be undone.`)) return;
    const token = await getToken();
    const res = await deleteExpense(e._id, token);
    if (!res.success) {
      setError(res.error || "Failed to delete");
      return;
    }
    setReloadKey((k) => k + 1);
    setNotice("Expense deleted");
  };

  const clearFilters = () => {
    setCategory("");
    setExpenseType("");
    setPaymentMode("");
    setPeriod("month");
    setCustomFrom("");
    setCustomTo("");
    setSearch("");
    setPage(1);
  };

  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? "";
  const paid = sumOf(summary?.byStatus, "paid");
  const pending = sumOf(summary?.byStatus, "pending");

  return (
    <div className="mx-auto max-w-6xl p-4">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-sm text-gray-500">
            Track everything the company spends money on.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} /> Add expense
        </button>
      </div>

      {notice && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          <CheckCircle2 size={16} /> {notice}
        </div>
      )}

      {/* Summary - only three numbers */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Total spent</p>
          <p className="mt-1 text-2xl font-bold">
            {formatINR(summary?.grandTotal ?? 0)}
          </p>
          <p className="text-xs text-gray-400">
            {periodLabel} · {summary?.count ?? 0}{" "}
            {summary?.count === 1 ? "entry" : "entries"}
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Already paid</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {formatINR(paid)}
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Yet to pay</p>
          <p
            className={`mt-1 text-2xl font-bold ${
              pending > 0 ? "text-red-600" : "text-gray-700"
            }`}
          >
            {formatINR(pending)}
          </p>
        </div>
      </div>

      {/* Category chips (also work as the category filter) */}
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-gray-700">
          Where was the money spent?
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setCategory("");
              setPage(1);
            }}
            className={`rounded-full border px-4 py-2 text-sm ${
              category === ""
                ? "border-blue-600 bg-blue-600 text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            All · {formatINR(catSummary?.grandTotal ?? 0)}
          </button>
          {CATEGORIES.map((c) => {
            const active = category === c.value;
            return (
              <button
                key={c.value}
                onClick={() => {
                  setCategory(active ? "" : c.value);
                  setPage(1);
                }}
                className={`rounded-full border px-4 py-2 text-sm ${
                  active
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {c.label} · {formatINR(sumOf(catSummary?.byCategory, c.value))}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border bg-gray-50 p-3">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value as Period);
              setPage(1);
            }}
            className="h-10 rounded-lg border bg-white px-3 text-sm"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          {period === "custom" && (
            <>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => {
                  setCustomFrom(e.target.value);
                  setPage(1);
                }}
                className="h-10 rounded-lg border bg-white px-3 text-sm"
              />
              <span className="text-sm text-gray-500">to</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => {
                  setCustomTo(e.target.value);
                  setPage(1);
                }}
                className="h-10 rounded-lg border bg-white px-3 text-sm"
              />
            </>
          )}

          <div className="flex h-10 overflow-hidden rounded-lg border bg-white text-sm">
            {[
              { v: "", l: "All" },
              { v: "internal", l: "Internal" },
              { v: "external", l: "External" },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => {
                  setExpenseType(o.v as ExpenseType | "");
                  setPage(1);
                }}
                title={
                  o.v === "internal"
                    ? "Our own team"
                    : o.v === "external"
                      ? "Outside vendors and people"
                      : ""
                }
                className={`px-4 ${
                  expenseType === o.v
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px] flex-1">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses..."
              className="h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm"
            />
          </div>

          <button
            onClick={() => setShowMore((s) => !s)}
            className="flex h-10 items-center gap-1 rounded-lg border bg-white px-3 text-sm hover:bg-gray-50"
          >
            <SlidersHorizontal size={15} /> More
          </button>
          <button
            onClick={clearFilters}
            className="h-10 px-2 text-sm text-blue-600 hover:underline"
          >
            Reset
          </button>
        </div>

        {showMore && (
          <div className="mt-3 flex flex-wrap items-center gap-3 border-t pt-3">
            <span className="text-sm text-gray-600">Paid by</span>
            <select
              value={paymentMode}
              onChange={(e) => {
                setPaymentMode(e.target.value as PaymentMode | "");
                setPage(1);
              }}
              className="h-10 rounded-lg border bg-white px-3 text-sm"
            >
              <option value="">Any mode</option>
              {PAYMENT_MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            {summary && summary.byMode.length > 0 && (
              <span className="text-xs text-gray-500">
                {summary.byMode
                  .map((m) => `${modeLabel(m._id)} ${formatINR(m.total)}`)
                  .join("  ·  ")}
              </span>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* List */}
      {loading && expenses.length === 0 ? (
        <div className="py-20 text-center text-gray-500">Loading...</div>
      ) : expenses.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <IndianRupee size={30} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-medium text-gray-700">
            No expenses found
          </h2>
          <p className="mb-4 mt-1 text-sm text-gray-500">
            Try a different period, or add a new expense.
          </p>
          <div className="flex gap-3">
            <button
              onClick={clearFilters}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Reset filters
            </button>
            <button
              onClick={openAdd}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Add expense
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Expense</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => {
                const payee = e.employee?.user?.name || e.vendorName;
                return (
                  <tr key={e._id} className="border-t hover:bg-gray-50">
                    <td className="whitespace-nowrap p-3 text-gray-600">
                      {formatDate(e.date)}
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-gray-900">{e.title}</p>
                      <p className="text-xs text-gray-500">
                        {[
                          payee ? `Paid to ${payee}` : null,
                          modeLabel(e.paymentMode),
                          e.expenseType === "internal"
                            ? "Internal"
                            : "External",
                          e.category === "salary" && e.salaryMonth
                            ? `For ${MONTHS[e.salaryMonth - 1]} ${e.salaryYear}`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </td>
                    <td className="p-3">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs ${categoryColor[e.category]}`}
                      >
                        {categoryLabel(e.category)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap p-3 text-right font-semibold">
                      {formatINR(e.amount)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs ${
                          e.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {e.status === "paid" ? "Paid" : "Yet to pay"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap p-3">
                      <button
                        onClick={() => openEdit(e)}
                        className="mr-3 text-sm text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(e)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add / Edit form */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-xl font-bold">
                {editing ? "Edit expense" : "Add a new expense"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-7 overflow-y-auto p-5">
              {/* 1. category */}
              <section>
                <SectionTitle n={1} text="What is this expense for?" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {CATEGORIES.map((c) => {
                    const Icon = c.icon;
                    const active = form.category === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => onCategoryChange(c.value)}
                        className={`rounded-xl border p-3 text-left transition ${
                          active
                            ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <Icon
                          size={20}
                          className={active ? "text-blue-600" : "text-gray-500"}
                        />
                        <p className="mt-2 text-sm font-medium">{c.label}</p>
                        <p className="text-xs text-gray-500">{c.hint}</p>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 2. who / what */}
              <section>
                <SectionTitle
                  n={2}
                  text={needsEmployee ? "Who is this payment for?" : "Details"}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {needsEmployee ? (
                    <>
                      <div className="sm:col-span-2">
                        <Field
                          label={
                            form.category === "freelancer"
                              ? "Freelancer"
                              : "Employee"
                          }
                        >
                          <select
                            value={form.employee}
                            onChange={(e) => onEmployeeChange(e.target.value)}
                            className={inputCls}
                          >
                            <option value="">Choose a name...</option>
                            {payees.map((p) => (
                              <option key={p._id} value={p._id}>
                                {p.name} ({p.jobRole})
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>

                      {form.category === "salary" && (
                        <>
                          <Field label="Salary for which month?">
                            <select
                              value={form.salaryMonth}
                              onChange={(e) =>
                                setField("salaryMonth", Number(e.target.value))
                              }
                              className={inputCls}
                            >
                              {MONTHS.map((m, i) => (
                                <option key={m} value={i + 1}>
                                  {m}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Year">
                            <input
                              type="number"
                              value={form.salaryYear}
                              onChange={(e) =>
                                setField("salaryYear", Number(e.target.value))
                              }
                              className={inputCls}
                            />
                          </Field>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="sm:col-span-2">
                        <Field label="What was it for?">
                          <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setField("title", e.target.value)}
                            placeholder="e.g. Office snacks, Wi-Fi bill, Laptop repair"
                            className={inputCls}
                          />
                        </Field>
                      </div>
                      <div className="sm:col-span-2">
                        <Field label="Paid to (optional)">
                          <input
                            type="text"
                            value={form.vendorName}
                            onChange={(e) =>
                              setField("vendorName", e.target.value)
                            }
                            placeholder="Shop, company or person's name"
                            className={inputCls}
                          />
                        </Field>
                      </div>
                    </>
                  )}

                  <div className="sm:col-span-2">
                    <Field
                      label="Is this spent on our own team or an outside party?"
                      hint="Internal = our own team. External = outside vendors, shops or freelancers."
                    >
                      <div className="flex h-11 overflow-hidden rounded-lg border">
                        {(
                          [
                            ["internal", "Internal (our team)"],
                            ["external", "External (outside party)"],
                          ] as [ExpenseType, string][]
                        ).map(([t, l]) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setField("expenseType", t)}
                            className={`flex-1 text-sm ${
                              form.expenseType === t
                                ? "bg-blue-600 text-white"
                                : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>
                </div>
              </section>

              {/* 3. money */}
              <section>
                <SectionTitle n={3} text="Amount and payment" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Amount">
                    <div className="relative">
                      <IndianRupee
                        size={15}
                        className="absolute left-3 top-3.5 text-gray-500"
                      />
                      <input
                        type="number"
                        min={0}
                        value={form.amount}
                        onChange={(e) => setField("amount", e.target.value)}
                        className={`${inputCls} pl-8`}
                      />
                    </div>
                  </Field>

                  <Field label="Date">
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setField("date", e.target.value)}
                      className={inputCls}
                    />
                  </Field>

                  <Field label="How was it paid?">
                    <select
                      value={form.paymentMode}
                      onChange={(e) =>
                        setField("paymentMode", e.target.value as PaymentMode)
                      }
                      className={inputCls}
                    >
                      {PAYMENT_MODES.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Has the money been paid?">
                    <div className="flex h-11 overflow-hidden rounded-lg border">
                      {(
                        [
                          ["paid", "Yes, paid"],
                          ["pending", "Not yet"],
                        ] as [PaymentStatus, string][]
                      ).map(([s, l]) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setField("status", s)}
                          className={`flex-1 text-sm ${
                            form.status === s
                              ? s === "paid"
                                ? "bg-green-600 text-white"
                                : "bg-red-600 text-white"
                              : "bg-white hover:bg-gray-50"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {form.paymentMode !== "cash" && (
                    <div className="sm:col-span-2">
                      <Field
                        label="Transaction or cheque number (optional)"
                        hint="Helps you find this payment later."
                      >
                        <input
                          type="text"
                          value={form.transactionRef}
                          onChange={(e) =>
                            setField("transactionRef", e.target.value)
                          }
                          className={inputCls}
                        />
                      </Field>
                    </div>
                  )}
                </div>
              </section>

              {/* optional */}
              <section>
                <button
                  type="button"
                  onClick={() => setShowOptional((s) => !s)}
                  className="flex items-center gap-1 text-sm font-medium text-blue-600"
                >
                  {showOptional ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  Add more details (optional)
                </button>

                {showOptional && (
                  <div className="mt-3 grid grid-cols-1 gap-4">
                    <Field label="Bill / invoice number">
                      <input
                        type="text"
                        value={form.billNumber}
                        onChange={(e) => setField("billNumber", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Notes">
                      <textarea
                        value={form.description}
                        onChange={(e) =>
                          setField("description", e.target.value)
                        }
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </Field>
                  </div>
                )}
              </section>
            </div>

            <div className="border-t p-5">
              {formError && (
                <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {formError}
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="rounded-lg border px-5 py-2.5 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editing
                      ? "Save changes"
                      : "Add expense"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExpenses;
