"use client";

import { Form, Formik, Field, ErrorMessage } from "formik";
import { useState, useEffect, useCallback } from "react";
import getLeaveFormConfig from "@/utils/formik/leaveForm";
import { FormikHelpers } from "formik";
import { useSubmissionModal } from "@/context/adda/commonModalContext";
import axios from "axios";
import {
  FaSpinner,
  FaCalendarAlt,
  FaFileUpload,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBan,
  FaHeart,
  FaBriefcase,
  FaSun,
  FaStethoscope,
  FaNotesMedical,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { uploadFile } from "@/redux/fileUploadSlice";
import { useAuth } from "@clerk/clerk-react";

interface RecentLeave {
  _id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  fromDate: string;
  toDate: string;
  notes?: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface LeaveValues {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  document?: string;
}

const EmployeeLeaveRequest = () => {
  const BASE_URL = `${import.meta.env.VITE_PROD_URL}/leave`;
  const { initialValues, validationSchema } = getLeaveFormConfig();
  const { showModal } = useSubmissionModal();
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();

  const [requestStats, setRequestStats] = useState<Record<string, number>>({});
  const [recentLeaves, setRecentLeaves] = useState<RecentLeave[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const today = new Date().toISOString().split("T")[0];

  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const leaveTypes = [
    {
      value: "sick",
      label: "Sick Leave",
      icon: <FaStethoscope className="text-red-500" />,
    },
    {
      value: "casual",
      label: "Casual Leave",
      icon: <FaSun className="text-yellow-500" />,
    },
    {
      value: "earned",
      label: "Earned Leave",
      icon: <FaStar className="text-green-500" />,
    },
    {
      value: "unpaid",
      label: "Unpaid Leave",
      icon: <FaBriefcase className="text-gray-500" />,
    },
    {
      value: "maternity",
      label: "Maternity Leave",
      icon: <FaHeart className="text-pink-500" />,
    },
    {
      value: "other",
      label: "Other",
      icon: <FaNotesMedical className="text-blue-500" />,
    },
  ];

  const getLeaveIcon = (type: string) => {
    const found = leaveTypes.find((lt) => lt.value === type);
    return found ? found.icon : <FaNotesMedical className="text-blue-500" />;
  };

  const calculateDaysBetween = (start: string, end: string): number => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const fetchRequestStats = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${BASE_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequestStats(data.data || {});
    } catch (e) {
      console.error("Failed to fetch request stats:", e);
    }
  }, [getToken]);

  const fetchRecentLeaves = useCallback(async () => {
    try {
      const token = await getToken();
      const params = new URLSearchParams();
      params.append("month", selectedMonth.toString());
      params.append("year", selectedYear.toString());
      params.append("page", currentPage.toString());
      params.append("limit", limit.toString());

      const { data } = await axios.get(`${BASE_URL}/my-leaves?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const transformed: RecentLeave[] = (data.data.data || []).map(
        (l: any) => ({
          ...l,
          startDate: l.fromDate,
          endDate: l.toDate,
          notes: l.notes || undefined,
        })
      );

      setRecentLeaves(transformed);
      setPagination(data.pagination);
    } catch (e) {
      console.error("Failed to fetch recent leaves:", e);
      setRecentLeaves([]);
      setPagination(null);
    }
  }, [getToken, selectedMonth, selectedYear, currentPage]);

  useEffect(() => {
    fetchRequestStats();
    fetchRecentLeaves();
  }, [fetchRequestStats, fetchRecentLeaves]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= (pagination?.pages || 1)) {
      setCurrentPage(page);
    }
  };

  const uploadDocument = async (): Promise<string | undefined> => {
    if (!selectedFile) return undefined;

    showModal({
      isSubmitting: true,
      currentStep: "uploading",
      message: "Uploading document…",
    });

    const result = await dispatch(uploadFile({ file: selectedFile, getToken }));
    if (uploadFile.fulfilled.match(result)) {
      return result.payload.data.fileDetails?.url;
    } else {
      showModal({
        isSubmitting: true,
        currentStep: "error",
        message: "Document upload failed",
        error: result.error.message || "Upload failed",
      });
      return undefined;
    }
  };

  const handleSubmit = async (
    values: LeaveValues,
    { setSubmitting, resetForm }: FormikHelpers<LeaveValues>
  ) => {
    let documentUrl: string | undefined;
    try {
      const token = await getToken();

      if (selectedFile) {
        documentUrl = await uploadDocument();
        if (!documentUrl) throw new Error("Upload failed");
      } else {
        showModal({
          isSubmitting: true,
          currentStep: "saving",
          message: "Submitting request…",
        });
      }

      const payload: any = {
        leaveType: values.leaveType,
        fromDate: values.startDate,
        toDate: values.endDate,
        reason: values.reason,
        ...(documentUrl && { document: [documentUrl] }),
      };

      await axios.post(`${BASE_URL}/request`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showModal({
        isSubmitting: true,
        currentStep: "success",
        message: "Leave request submitted!",
      });

      resetForm();
      setSelectedFile(null);
      setCurrentPage(1); // Reset to first page
      fetchRecentLeaves();
      fetchRequestStats();
    } catch (err: any) {
      showModal({
        isSubmitting: true,
        currentStep: "error",
        message: "Failed to submit",
        error: err.response?.data?.message || err.message || "Try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="text-green-600" />;
      case "pending":
        return <FaClock className="text-amber-600" />;
      case "rejected":
        return <FaTimesCircle className="text-red-600" />;
      case "cancelled":
        return <FaBan className="text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">Leave Portal</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Request time off in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 order-2 lg:order-1">
            {/* Request Summary */}
            {Object.keys(requestStats).length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Request Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-amber-600" />
                    <div>
                      <div className="font-medium">Pending</div>
                      <div className="text-xl font-bold text-amber-700">
                        {requestStats.pending || 0}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-600" />
                    <div>
                      <div className="font-medium">Approved</div>
                      <div className="text-xl font-bold text-green-700">
                        {requestStats.approved || 0}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaTimesCircle className="text-red-600" />
                    <div>
                      <div className="font-medium">Rejected</div>
                      <div className="text-xl font-bold text-red-700">
                        {requestStats.rejected || 0}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBan className="text-gray-500" />
                    <div>
                      <div className="font-medium">Cancelled</div>
                      <div className="text-xl font-bold text-gray-700">
                        {requestStats.cancelled || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Requests with Pagination */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-7 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                  Recent Requests
                </div>

                {/* Month & Year Picker */}
                <div className="flex items-center gap-2 text-sm">
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("en", {
                          month: "short",
                        })}
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
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </h2>

              {recentLeaves.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaCalendarAlt className="text-gray-400 text-xl" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    No requests in this month
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {recentLeaves.map((l) => {
                      const colorMap = {
                        pending: {
                          bg: "bg-amber-50",
                          text: "text-amber-800",
                          border: "border-amber-300",
                        },
                        approved: {
                          bg: "bg-emerald-50",
                          text: "text-emerald-800",
                          border: "border-emerald-300",
                        },
                        rejected: {
                          bg: "bg-red-50",
                          text: "text-red-800",
                          border: "border-red-300",
                        },
                        cancelled: {
                          bg: "bg-gray-50",
                          text: "text-gray-700",
                          border: "border-gray-300",
                        },
                      };
                      const c = colorMap[l.status] || colorMap.cancelled;

                      return (
                        <div
                          key={l._id}
                          className={`p-3 rounded-lg bg-white border-l-4 ${c.border} hover:shadow-md transition-shadow`}
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="text-base">
                                  {getLeaveIcon(l.leaveType)}
                                </div>
                                <span className="font-medium text-gray-800 text-sm capitalize">
                                  {l.leaveType} Leave
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <FaCalendarAlt className="text-gray-400" />
                                <span>
                                  {formatDate(l.startDate)} –{" "}
                                  {formatDate(l.endDate)}
                                </span>
                              </div>

                              {l.status === "rejected" && l.notes && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                                  <p className="text-xs font-medium text-red-700 flex items-center gap-1">
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Rejection Notes
                                  </p>
                                  <p className="text-xs text-red-600 mt-0.5">
                                    {l.notes}
                                  </p>
                                </div>
                              )}
                            </div>

                            <span
                              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${c.bg} ${c.text}`}
                            >
                              {getStatusIcon(l.status)}
                              {l.status.charAt(0).toUpperCase() +
                                l.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-center gap-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-1 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaChevronLeft className="w-3 h-3" />
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
                            className={`px-2 py-1 text-xs rounded-md ${
                              currentPage === page
                                ? "bg-indigo-600 text-white"
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
                        className="flex items-center gap-1 px-3 py-1 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <FaChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Bottom: Show selected month/year + total */}
                  <div className="mt-2 pt-2 border-t border-gray-200 text-center text-xs text-gray-500">
                    <p>
                      Showing leaves for{" "}
                      <span className="font-medium text-gray-700">
                        {new Date(
                          selectedYear,
                          selectedMonth - 1
                        ).toLocaleString("en", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      {pagination && (
                        <span className="ml-2">({pagination.total} total)</span>
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* === Main Form === */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <FaFileUpload className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Request Time Off
                  </h2>
                  <p className="text-sm text-gray-500">
                    Fill in the details below
                  </p>
                </div>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                  <Form className="space-y-5">
                    <div>
                      <label
                        htmlFor="leaveType"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Leave Type
                      </label>
                      <Field
                        as="select"
                        id="leaveType"
                        name="leaveType"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm ${
                          errors.leaveType && touched.leaveType
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select leave type</option>
                        {leaveTypes.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="leaveType"
                        component="div"
                        className="mt-1.5 text-xs text-red-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="startDate"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          From
                        </label>
                        <Field
                          type="date"
                          id="startDate"
                          name="startDate"
                          min={today}
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                            errors.startDate && touched.startDate
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          name="startDate"
                          component="div"
                          className="mt-1.5 text-xs text-red-600"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="endDate"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          To
                        </label>
                        <Field
                          type="date"
                          id="endDate"
                          name="endDate"
                          min={values.startDate || today}
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                            errors.endDate && touched.endDate
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          name="endDate"
                          component="div"
                          className="mt-1.5 text-xs text-red-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="reason"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Reason
                      </label>
                      <Field
                        as="textarea"
                        id="reason"
                        name="reason"
                        rows={3}
                        placeholder="Briefly explain your leave..."
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-sm ${
                          errors.reason && touched.reason
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                      />
                      <ErrorMessage
                        name="reason"
                        component="div"
                        className="mt-1.5 text-xs text-red-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="document"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Supporting Document{" "}
                        <span className="font-normal text-gray-400">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="file"
                        id="document"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setSelectedFile(file);
                          setFieldValue(
                            "document",
                            file ? file.name : undefined
                          );
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="document"
                        className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                      >
                        <div className="text-center">
                          <FaFileUpload className="mx-auto h-7 w-7 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-600">
                            {selectedFile
                              ? selectedFile.name
                              : "Click to upload"}
                          </span>
                          {!selectedFile && (
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, PNG, JPG up to 10MB
                            </p>
                          )}
                        </div>
                      </label>
                    </div>

                    {values.startDate && values.endDate && (
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <FaCalendarAlt className="text-white text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-indigo-700 font-medium">
                              Duration
                            </p>
                            <p className="text-xl font-bold text-indigo-900">
                              {calculateDaysBetween(
                                values.startDate,
                                values.endDate
                              )}{" "}
                              day
                              {calculateDaysBetween(
                                values.startDate,
                                values.endDate
                              ) > 1
                                ? "s"
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle /> Submit Request
                        </>
                      )}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveRequest;
