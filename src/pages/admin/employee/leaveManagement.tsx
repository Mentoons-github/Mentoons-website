import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Filter,
  FileText,
  User,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import axios from "axios";

interface Attachment {
  name: string;
  url: string;
  uploadedAt?: string;
}

interface UserInfo {
  name: string;
  email?: string;
}

interface EmployeeInfo {
  department?: string;
}

export interface Leave {
  _id: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  notes?: string;
  attachments?: Attachment[];
  totalDays: number;
  createdAt: string;
  user: UserInfo;
  employee?: EmployeeInfo;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/leave`;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

const AdminLeaveManagement = () => {
  const { getToken } = useAuth();

  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [rejecting, setRejecting] = useState<Leave | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [approving, setApproving] = useState<Leave | null>(null);
  const [actioning, setActioning] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const limit = 10;

  const [preview, setPreview] = useState<{
    type: "image" | "video" | "pdf";
    url: string;
    name: string;
    mime?: string;
  } | null>(null);

  const apiCall = async (config: any) => {
    const token = await getToken();
    return axios({
      ...config,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...config.headers,
      },
    });
  };

  const loadLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);
      if (selectedMonth) params.append("month", selectedMonth.toString());
      if (selectedYear) params.append("year", selectedYear.toString());
      params.append("page", currentPage.toString());
      params.append("limit", limit.toString());

      const { data } = await apiCall({
        method: "GET",
        url: `${BASE_URL}/all`,
        params,
      });

      setLeaves(data.data.data ?? []);
      setPagination(data.pagination);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load leave requests";
      toast.error(message);
      setLeaves([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [
    statusFilter,
    debouncedSearchQuery,
    selectedMonth,
    selectedYear,
    currentPage,
  ]);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= (pagination?.pages || 1)) {
      setCurrentPage(page);
    }
  };

  const handleApproveClick = (leave: Leave) => setApproving(leave);
  const handleRejectClick = (leave: Leave) => {
    setRejecting(leave);
    setRejectNotes("");
  };

  const confirmApprove = async () => {
    if (!approving) return;
    setActioning(approving._id);
    try {
      await apiCall({
        method: "PUT",
        url: `${BASE_URL}/approve/${approving._id}`,
      });
      toast.success("Leave approved successfully");
      setApproving(null);
      loadLeaves();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve leave");
    } finally {
      setActioning(null);
    }
  };

  const confirmReject = async () => {
    if (!rejecting || !rejectNotes.trim()) {
      toast.error("Please provide rejection notes");
      return;
    }
    setActioning(rejecting._id);
    try {
      await apiCall({
        method: "PUT",
        url: `${BASE_URL}/reject/${rejecting._id}`,
        data: { notes: rejectNotes },
      });
      toast.success("Leave rejected successfully");
      setRejecting(null);
      setRejectNotes("");
      loadLeaves();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject leave");
    } finally {
      setActioning(null);
    }
  };

  const format = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statusBadge = (s: Leave["status"]) => {
    const map: Record<Leave["status"], string> = {
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return map[s];
  };

  const typeBadge = (t: string) => {
    const map: Record<string, string> = {
      sick: "bg-red-50 text-red-700 border-red-200",
      casual: "bg-blue-50 text-blue-700 border-blue-200",
      earned: "bg-purple-50 text-purple-700 border-purple-200",
      unpaid: "bg-orange-50 text-orange-700 border-orange-200",
      maternity: "bg-pink-50 text-pink-700 border-pink-200",
      other: "bg-indigo-50 text-indigo-700 border-indigo-200",
    };
    return map[t.toLowerCase()] ?? "bg-gray-50 text-gray-700 border-gray-200";
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Leave Management
            </h1>
            <p className="text-gray-600">
              Review and manage employee leave requests
            </p>
          </div>

          <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Filters:
                </span>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <input
                type="text"
                placeholder="Search by name or department..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("en", { month: "short" })}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  min="2020"
                  max="2030"
                  className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => {
                  setStatusFilter("");
                  setSearchQuery("");
                  setSelectedMonth(new Date().getMonth() + 1);
                  setSelectedYear(new Date().getFullYear());
                  setCurrentPage(1);
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing leaves for{" "}
              <span className="font-medium text-gray-800">
                {new Date(selectedYear, selectedMonth - 1).toLocaleString(
                  "en",
                  { month: "long", year: "numeric" }
                )}
              </span>
            </div>
            {pagination && (
              <div className="text-gray-500">
                {pagination.total} total request
                {pagination.total !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {leaves.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow-sm">
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                No Leave Requests
              </h3>
              <p className="text-gray-600">
                No requests match your current filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {leaves.map((lv) => (
                  <div
                    key={lv._id}
                    className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-500" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              {lv.user.name}
                            </h3>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge(
                              lv.status
                            )}`}
                          >
                            {lv.status.toUpperCase()}
                          </span>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${typeBadge(
                              lv.leaveType
                            )}`}
                          >
                            {lv.leaveType}
                          </span>
                        </div>

                        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(lv.fromDate)} – {format(lv.toDate)}
                            </span>
                            <span className="font-medium text-blue-600">
                              ({lv.totalDays}{" "}
                              {lv.totalDays === 1 ? "day" : "days"})
                            </span>
                          </div>
                          {lv.employee?.department && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Dept:</span>{" "}
                              {lv.employee.department}
                            </div>
                          )}
                        </div>

                        <div className="mb-4">
                          <p className="mb-1 text-sm font-medium text-gray-700">
                            Reason:
                          </p>
                          <p className="text-sm text-gray-600">{lv.reason}</p>
                        </div>

                        {lv.notes && (
                          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                            <p className="mb-1 text-sm font-medium text-red-700">
                              Rejection notes:
                            </p>
                            <p className="text-sm text-red-600">{lv.notes}</p>
                          </div>
                        )}

                        {/* Attachments */}
                        {lv.attachments && lv.attachments.length > 0 && (
                          <div className="mb-4">
                            <div className="mb-2 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {lv.attachments.length} attachment(s):
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              {lv.attachments.map((a) => {
                                const ext =
                                  a.name.split(".").pop()?.toLowerCase() ?? "";
                                const isImage = [
                                  "png",
                                  "jpg",
                                  "jpeg",
                                  "gif",
                                  "webp",
                                ].includes(ext);
                                const isPdf = ext === "pdf";
                                const isVideo = ["mp4", "webm", "ogg"].includes(
                                  ext
                                );
                                const mime = isVideo
                                  ? `video/${
                                      ext === "webm"
                                        ? "webm"
                                        : ext === "ogg"
                                        ? "ogg"
                                        : "mp4"
                                    }`
                                  : undefined;

                                return (
                                  <div
                                    key={a.url}
                                    className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                                  >
                                    {isImage && (
                                      <img
                                        src={a.url}
                                        alt={a.name}
                                        className="h-20 w-20 object-cover transition-transform group-hover:scale-105"
                                        onClick={() =>
                                          setPreview({
                                            type: "image",
                                            url: a.url,
                                            name: a.name,
                                          })
                                        }
                                        loading="lazy"
                                      />
                                    )}
                                    {isPdf && (
                                      <div
                                        className="flex h-20 w-20 flex-col items-center justify-center p-2 text-center"
                                        onClick={() =>
                                          window.open(a.url, "_blank")
                                        }
                                      >
                                        <FileText className="h-8 w-8 text-red-600" />
                                        <span className="mt-1 text-xs text-gray-600">
                                          PDF
                                        </span>
                                      </div>
                                    )}
                                    {isVideo && (
                                      <video
                                        src={a.url}
                                        className="h-20 w-20 object-cover"
                                        onClick={() =>
                                          setPreview({
                                            type: "video",
                                            url: a.url,
                                            name: a.name,
                                            mime,
                                          })
                                        }
                                      />
                                    )}
                                    {!isImage && !isPdf && !isVideo && (
                                      <div className="flex h-20 w-20 flex-col items-center justify-center p-2 text-center">
                                        <FileText className="h-8 w-8 text-gray-500" />
                                        <span className="mt-1 text-xs text-gray-600">
                                          {ext.toUpperCase()}
                                        </span>
                                      </div>
                                    )}

                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 p-2 text-center text-xs text-white opacity-0 transition-all group-hover:bg-opacity-60 group-hover:opacity-100">
                                      {a.name}
                                    </div>

                                    <button
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        try {
                                          const response = await fetch(a.url);
                                          if (!response.ok)
                                            throw new Error("Download failed");
                                          const blob = await response.blob();
                                          const blobUrl =
                                            window.URL.createObjectURL(blob);
                                          const link =
                                            document.createElement("a");
                                          link.href = blobUrl;
                                          link.download = a.name;
                                          document.body.appendChild(link);
                                          link.click();
                                          document.body.removeChild(link);
                                          window.URL.revokeObjectURL(blobUrl);
                                        } catch (err) {
                                          toast.error(
                                            "Failed to download file"
                                          );
                                        }
                                      }}
                                      className="absolute right-1 top-1 rounded bg-white p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                                      title="Download"
                                    >
                                      <Download className="h-3 w-3 text-gray-600" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-gray-500">
                          Requested on: {format(lv.createdAt)}
                        </div>
                      </div>

                      {lv.status === "pending" && (
                        <div className="ml-4 flex gap-2">
                          <button
                            onClick={() => handleApproveClick(lv)}
                            disabled={actioning === lv._id}
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                            {actioning === lv._id ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleRejectClick(lv)}
                            disabled={actioning === lv._id}
                            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </button>

                  <div className="flex gap-1">
                    {Array.from(
                      { length: pagination.pages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {preview && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
            onClick={() => setPreview(null)}
          >
            <div
              className="relative max-h-full max-w-4xl overflow-auto rounded-lg bg-white p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreview(null)}
                className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
              >
                <XCircle className="h-5 w-5 text-gray-600" />
              </button>

              {preview.type === "image" && (
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="max-h-screen w-full object-contain"
                />
              )}

              {preview.type === "video" && (
                <video controls autoPlay className="max-h-screen w-full">
                  <source src={preview.url} type={preview.mime} />
                  Your browser does not support the video tag.
                </video>
              )}

              {preview.type === "pdf" && (
                <iframe
                  src={preview.url}
                  className="h-screen w-full"
                  title={preview.name}
                />
              )}
            </div>
          </div>
        )}

        {approving && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Approve Leave Request
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                Employee:{" "}
                <span className="font-medium">{approving.user.name}</span>
              </p>
              <p className="mb-6 text-sm text-gray-700">
                Approve this{" "}
                <span className="font-medium">{approving.totalDays}-day</span>{" "}
                {approving.leaveType} leave from{" "}
                <span className="font-medium">
                  {format(approving.fromDate)}
                </span>{" "}
                to{" "}
                <span className="font-medium">{format(approving.toDate)}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmApprove}
                  disabled={actioning === approving._id}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actioning === approving._id ? "Approving…" : "Yes, Approve"}
                </button>
                <button
                  onClick={() => setApproving(null)}
                  disabled={actioning === approving._id}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {rejecting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Reject Leave Request
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                Employee:{" "}
                <span className="font-medium">{rejecting.user.name}</span>
              </p>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Enter rejection notes (required)"
                className="mb-4 h-32 w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={confirmReject}
                  disabled={actioning === rejecting._id || !rejectNotes.trim()}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actioning === rejecting._id ? "Rejecting…" : "Confirm"}
                </button>
                <button
                  onClick={() => {
                    setRejecting(null);
                    setRejectNotes("");
                  }}
                  disabled={actioning === rejecting._id}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminLeaveManagement;
