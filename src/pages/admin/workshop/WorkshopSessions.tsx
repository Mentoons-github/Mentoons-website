import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getAllWorkshopBatchesThunk } from "@/redux/workshop/workshopBatches/workshopBatchThunk";
import { useAuth } from "@clerk/clerk-react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  History,
  IndianRupee,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const statusColor = {
  ongoing: "bg-green-200 text-green-700",
  completed: "bg-gray-200 text-gray-700",
  upcoming: "bg-yellow-200 text-yellow-700",
  draft: "bg-blue-200 text-blue-700",
};

const BPL_DISCOUNT = 0.75;

interface HistoryStudent {
  _id: string;
  name?: string;
  paymentStatus?: string;
  isBpl?: boolean;
  bplStatus?: string;
}

interface HistoryBatch {
  _id: string;
  title?: string;
  status: keyof typeof statusColor;
  maxStudents?: number;
  startDate?: string | null;
  endDate?: string | null;
  students?: HistoryStudent[];
  psychologist?: { user?: { name?: string; email?: string } } | string | null;
  workshopId: {
    name: string;
    image: string;
    duration: string;
    age: string;
    price?: { original?: number; introductory?: number };
  };
}

const isBpl = (s: HistoryStudent) =>
  s.isBpl === true || s.bplStatus?.toLowerCase() === "approved";

const isPaid = (s: HistoryStudent) =>
  ["paid", "success", "completed"].includes(
    (s.paymentStatus ?? "").toLowerCase(),
  );

const getConductor = (b: HistoryBatch) => {
  if (!b.psychologist) return "Unassigned";
  if (typeof b.psychologist === "string") return "Assigned";
  return b.psychologist.user?.name ?? "Assigned";
};

const getConductorEmail = (b: HistoryBatch) => {
  if (!b.psychologist || typeof b.psychologist === "string") return "-";
  return b.psychologist.user?.email ?? "-";
};

const getStats = (b: HistoryBatch) => {
  const students = b.students ?? [];
  const strength = students.length;
  const bpl = students.filter(isBpl).length;
  const unitPrice = b.workshopId?.price?.introductory ?? 0;
  const bplPrice = Math.round(unitPrice * (1 - BPL_DISCOUNT));
  const feeOf = (s: HistoryStudent) => (isBpl(s) ? bplPrice : unitPrice);
  const paidList = students.filter(isPaid);
  const pendingList = students.filter((s) => !isPaid(s));
  const paid = paidList.length;
  const pending = pendingList.length;
  return {
    strength,
    max: b.maxStudents ?? 0,
    bpl,
    regular: strength - bpl,
    paid,
    pending,
    paidPct: strength ? Math.round((paid / strength) * 100) : 100,
    unitPrice,
    bplPrice,
    collected: paidList.reduce((sum, s) => sum + feeOf(s), 0),
    outstanding: pendingList.reduce((sum, s) => sum + feeOf(s), 0),
    discountGiven: bpl * (unitPrice - bplPrice),
    conductor: getConductor(b),
    feeOf,
  };
};

const formatDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const tabs = ["ongoing", "upcoming", "completed", "draft", "history"];

const WorkshopSessions = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { batches, allPagination } = useAppSelector(
    (state) => state.workshop_batch,
  );
  const [filter, setFilter] = useState("ongoing");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState<HistoryBatch | null>(null);
  const [showFull, setShowFull] = useState(false);

  const limit = 12;
  const isHistory = filter === "history";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchBatches = async () => {
      const token = await getToken();
      dispatch(
        getAllWorkshopBatchesThunk({
          token: token as string,
          filter: isHistory ? "completed" : filter,
          search: debouncedSearch,
          sort,
          page,
          limit,
        }),
      );
    };

    fetchBatches();
  }, [debouncedSearch, dispatch, filter, getToken, isHistory, page, sort]);

  useEffect(() => {
    if (!selectedBatch) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedBatch(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedBatch]);

  const openDetails = (b: HistoryBatch) => {
    setShowFull(false);
    setSelectedBatch(b);
  };

  const list = batches as unknown as HistoryBatch[];

  const summary = useMemo(() => {
    return list.reduce(
      (acc, b) => {
        const s = getStats(b);
        acc.batches += 1;
        acc.students += s.strength;
        acc.bpl += s.bpl;
        acc.regular += s.regular;
        acc.collected += s.collected;
        return acc;
      },
      { batches: 0, students: 0, bpl: 0, regular: 0, collected: 0 },
    );
  }, [list]);

  const selectedStats = selectedBatch ? getStats(selectedBatch) : null;

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between">
        <h1 className=" text-2xl font-bold">Workshop Sessions</h1>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div className="md:flex space-y-5 md:space-y-0 justify-between mb-6">
        <div className="flex flex-wrap gap-4 md:gap-6 lg:gap-10">
          {tabs.map((status) => (
            <div
              key={status}
              onClick={() => {
                setFilter(status);
                setPage(1);
              }}
              className={`cursor-pointer flex items-center gap-1 capitalize ${
                status === filter
                  ? "border-b-[3px] border-blue-600 font-medium"
                  : ""
              }`}
            >
              {status === "history" && <History size={16} />}
              {status}
            </div>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="border border-gray-700 rounded-md h-10 w-64 p-3"
        />
      </div>

      {isHistory && list.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-gray-500">Batches</p>
            <p className="text-xl font-bold">{summary.batches}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-gray-500">Total students</p>
            <p className="text-xl font-bold">{summary.students}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-gray-500">BPL students (75% off)</p>
            <p className="text-xl font-bold text-purple-600">{summary.bpl}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-gray-500">Regular students (full fee)</p>
            <p className="text-xl font-bold text-blue-600">{summary.regular}</p>
          </div>
          <div className="rounded-xl border p-3 col-span-2 lg:col-span-1">
            <p className="text-xs text-gray-500">Fees collected</p>
            <p className="text-xl font-bold text-green-600">
              {formatINR(summary.collected)}
            </p>
          </div>
        </div>
      )}

      {list.length === 0 && (
        <div className="min-h-[400px] flex items-center justify-center">
          <h2 className="text-center text-gray-500 text-lg">
            No {isHistory ? "history" : filter} Workshop Batches available
          </h2>
        </div>
      )}

      {isHistory && list.length > 0 && (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Workshop</th>
                <th className="p-3">Batch</th>
                <th className="p-3">Strength</th>
                <th className="p-3">Conducted by</th>
                <th className="p-3">Period</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((workshop) => {
                const s = getStats(workshop);
                return (
                  <tr
                    key={workshop._id}
                    onClick={() => openDetails(workshop)}
                    className="border-t cursor-pointer hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={workshop.workshopId.image}
                          alt={workshop.workshopId.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <span className="font-semibold text-[#11b5e1]">
                          {workshop.workshopId.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">{workshop.title ?? "-"}</td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-medium">
                        <Users size={14} /> {s.strength}
                        {s.max ? ` / ${s.max}` : ""}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <UserCheck size={14} /> {s.conductor}
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap text-xs text-gray-600">
                      {formatDate(workshop.startDate)} -{" "}
                      {formatDate(workshop.endDate)}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetails(workshop);
                        }}
                        className="px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 whitespace-nowrap"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isHistory && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mt-3">
          {list.map((workshop) => {
            const s = getStats(workshop);
            const pct = s.max ? Math.min(100, (s.strength / s.max) * 100) : 0;
            return (
              <div
                key={workshop._id}
                onClick={() => navigate(workshop._id)}
                className="cursor-pointer rounded-xl border p-2 md:p-4 hover:shadow-md transition"
              >
                <img
                  src={workshop.workshopId.image}
                  alt={workshop.workshopId.name}
                  className=" md:h-60 lg:h-80 w-full rounded-lg object-cover "
                />

                <div className="mt-3 space-y-3">
                  <div className="lg:flex justify-between text-sm md:text-base">
                    <div className="">
                      <div className="flex items-center gap-2 font-semibold text-[#11b5e1]">
                        <BookOpen size={18} /> {workshop.workshopId.name}
                      </div>
                      <div>
                        {/* <p className="text-sm text-gray-600">{workshop.title}</p> */}
                      </div>
                    </div>
                    <div>{workshop.workshopId.duration}</div>
                  </div>

                  <div className="flex items-center justify-between mt-2 ">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${statusColor[workshop.status]}`}
                    >
                      {workshop.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      Age: {workshop.workshopId.age}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="flex items-center gap-1">
                        <Users size={12} /> Strength
                      </span>
                      <span>
                        {s.strength}
                        {s.max ? ` / ${s.max}` : ""}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded">
                      <div
                        className="h-1.5 bg-blue-500 rounded"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {workshop.status === "completed" && (
                    <div className="space-y-1 text-xs text-gray-600 border-t pt-2">
                      <div className="flex justify-between">
                        <span>BPL (75% off) / Regular</span>
                        <span>
                          {s.bpl} / {s.regular}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fees collected</span>
                        <span>{formatINR(s.collected)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conducted by</span>
                        <span>{s.conductor}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {allPagination && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-4 py-2">
            {page} / {allPagination.totalPages}
          </span>

          <button
            disabled={page === allPagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {selectedBatch && selectedStats && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedBatch(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBatch(null)}
              className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 pr-8">
              <img
                src={selectedBatch.workshopId.image}
                alt={selectedBatch.workshopId.name}
                className="h-20 w-20 rounded-xl object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-[#11b5e1]">
                  {selectedBatch.workshopId.name}
                </h2>
                <p className="text-sm text-gray-600">{selectedBatch.title}</p>
                <span
                  className={`mt-1 inline-block px-2 py-0.5 rounded text-xs ${statusColor[selectedBatch.status]}`}
                >
                  {selectedBatch.status}
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border p-3">
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <Users size={12} /> Strength
                </p>
                <p className="mt-1 font-semibold">
                  {selectedStats.strength}
                  {selectedStats.max ? ` / ${selectedStats.max}` : ""}
                </p>
              </div>
              <div className="rounded-xl border p-3">
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <UserCheck size={12} /> Conducted by
                </p>
                <p className="mt-1 font-semibold">{selectedStats.conductor}</p>
              </div>
              <div className="rounded-xl border p-3">
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <CalendarDays size={12} /> Period
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {formatDate(selectedBatch.startDate)} -{" "}
                  {formatDate(selectedBatch.endDate)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFull((prev) => !prev)}
              className="mt-5 flex w-full items-center justify-center gap-1 rounded-lg border border-blue-600 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              {showFull ? "Hide full details" : "View full details"}
              {showFull ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showFull && (
              <div className="mt-5 space-y-5">
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Workshop</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div className="rounded-xl border p-3">
                      <p className="text-xs text-gray-500">Age group</p>
                      <p className="font-medium">
                        {selectedBatch.workshopId.age}
                      </p>
                    </div>
                    <div className="rounded-xl border p-3">
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium">
                        {selectedBatch.workshopId.duration}
                      </p>
                    </div>
                    <div className="rounded-xl border p-3">
                      <p className="text-xs text-gray-500">Fee per student</p>
                      <p className="font-medium">
                        {formatINR(selectedStats.unitPrice)}
                      </p>
                      <p className="text-xs text-purple-700">
                        BPL: {formatINR(selectedStats.bplPrice)}
                      </p>
                    </div>
                    <div className="rounded-xl border p-3">
                      <p className="text-xs text-gray-500">Conductor email</p>
                      <p className="truncate font-medium">
                        {getConductorEmail(selectedBatch)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold">Batch strength</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border p-4 text-center">
                      <p className="text-3xl font-bold text-gray-900">
                        {selectedStats.strength}
                      </p>
                      <p className="mt-1 text-xs font-medium text-gray-600">
                        Total students
                      </p>
                      {selectedStats.max > 0 && (
                        <p className="text-xs text-gray-400">
                          out of {selectedStats.max} seats
                        </p>
                      )}
                    </div>
                    <div className="rounded-xl bg-purple-50 p-4 text-center">
                      <p className="text-3xl font-bold text-purple-700">
                        {selectedStats.bpl}
                      </p>
                      <p className="mt-1 text-xs font-medium text-purple-700">
                        BPL students
                      </p>
                      <p className="text-xs text-purple-500">75% off</p>
                    </div>
                    <div className="rounded-xl bg-blue-50 p-4 text-center">
                      <p className="text-3xl font-bold text-blue-700">
                        {selectedStats.regular}
                      </p>
                      <p className="mt-1 text-xs font-medium text-blue-700">
                        Regular students
                      </p>
                      <p className="text-xs text-blue-500">full fee</p>
                    </div>
                  </div>
                  {selectedStats.max > 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                      Empty seats:{" "}
                      {Math.max(0, selectedStats.max - selectedStats.strength)}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold">Fees</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="rounded-xl border p-3">
                      <p className="text-xs text-gray-500">Money received</p>
                      <p className="flex items-center font-semibold text-green-700">
                        <IndianRupee size={14} />
                        {selectedStats.collected.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="rounded-xl border p-3">
                      <p className="text-xs text-gray-500">Money still due</p>
                      <p
                        className={`flex items-center font-semibold ${
                          selectedStats.outstanding > 0
                            ? "text-red-600"
                            : "text-gray-700"
                        }`}
                      >
                        <IndianRupee size={14} />
                        {selectedStats.outstanding.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="rounded-xl border p-3">
                      <p className="text-xs text-gray-500">
                        Discount given to BPL (75%)
                      </p>
                      <p className="flex items-center font-semibold text-purple-700">
                        <IndianRupee size={14} />
                        {selectedStats.discountGiven.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">
                        Fee payment status
                      </p>
                      {selectedStats.pending === 0 ? (
                        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          <CheckCircle2 size={14} /> All fees received
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          <Clock size={14} /> {selectedStats.pending} yet to pay
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-2xl font-bold">
                      {selectedStats.paid}{" "}
                      <span className="text-base font-medium text-gray-500">
                        of {selectedStats.strength} students have paid
                      </span>
                    </p>
                    <div className="mt-2 h-2 w-full rounded bg-gray-200">
                      <div
                        className="h-2 rounded bg-green-500"
                        style={{ width: `${selectedStats.paidPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold">Students</h3>
                  <div className="max-h-64 overflow-y-auto rounded-xl border">
                    <table className="w-full text-sm text-left">
                      <thead className="sticky top-0 bg-gray-100 text-gray-700">
                        <tr>
                          <th className="p-2">#</th>
                          <th className="p-2">Name</th>
                          <th className="p-2">Type</th>
                          <th className="p-2">Fee</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedBatch.students ?? []).map((st, i) => (
                          <tr key={st._id} className="border-t">
                            <td className="p-2">{i + 1}</td>
                            <td className="p-2">{st.name ?? "-"}</td>
                            <td className="p-2">
                              <span
                                className={`rounded px-2 py-0.5 text-xs whitespace-nowrap ${
                                  isBpl(st)
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {isBpl(st) ? "BPL (75% off)" : "Regular"}
                              </span>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              {formatINR(selectedStats.feeOf(st))}
                            </td>
                            <td className="p-2">
                              <span
                                className={`rounded px-2 py-0.5 text-xs whitespace-nowrap ${
                                  isPaid(st)
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {isPaid(st) ? "Paid" : "Not paid yet"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopSessions;
