import { motion } from "framer-motion";

export interface Incentive {
  _id: string;
  employee: string;
  sourceType: "WORKSHOP_BATCH" | "SESSION";
  sourceId: string;
  incentiveAmount: number;
  status: "PENDING" | "PAID";
  initialPaymentDate?: string;
  finalPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  incentives?: Incentive[] | null;
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

const sampleIncentives: Incentive[] = [
  {
    _id: "inc_6749201",
    employee: "emp_10023",
    sourceType: "WORKSHOP_BATCH",
    sourceId: "batch_wksp_348",
    incentiveAmount: 125.0,
    status: "PAID",
    initialPaymentDate: "2026-01-15T00:00:00.000Z",
    finalPaymentDate: "2026-01-28T00:00:00.000Z",
    createdAt: "2025-11-12T14:30:22.000Z",
    updatedAt: "2026-01-29T09:15:47.000Z",
  },
  {
    _id: "inc_5593812",
    employee: "emp_10023",
    sourceType: "SESSION",
    sourceId: "sess_8921",
    incentiveAmount: 320.5,
    status: "PENDING",
    createdAt: "2026-01-08T10:22:15.000Z",
    updatedAt: "2026-02-02T16:40:09.000Z",
  },
  {
    _id: "inc_9032147",
    employee: "emp_10456",
    sourceType: "WORKSHOP_BATCH",
    sourceId: "batch_wksp_415",
    incentiveAmount: 800.0,
    status: "PAID",
    initialPaymentDate: "2025-12-20T00:00:00.000Z",
    createdAt: "2025-10-29T09:05:33.000Z",
    updatedAt: "2025-12-21T11:12:00.000Z",
  },
  {
    _id: "inc_2389471",
    employee: "emp_10891",
    sourceType: "SESSION",
    sourceId: "sess_9740",
    incentiveAmount: 450.75,
    status: "PENDING",
    createdAt: "2026-01-25T13:47:19.000Z",
    updatedAt: "2026-02-03T08:22:55.000Z",
  },
  {
    _id: "inc_7819203",
    employee: "emp_10023",
    sourceType: "SESSION",
    sourceId: "sess_6532",
    incentiveAmount: 275.0,
    status: "PAID",
    finalPaymentDate: "2026-01-10T00:00:00.000Z",
    createdAt: "2025-12-05T17:18:44.000Z",
    updatedAt: "2026-01-11T14:55:30.000Z",
  },
];

const IncentiveTable = ({
  incentives: propIncentives,
  loading,
  pagination,
  onPageChange,
}: Props) => {
  const safeIncentives = Array.isArray(propIncentives) ? propIncentives : [];
  const showSamples = safeIncentives.length === 0;
  const displayIncentives = showSamples ? sampleIncentives : safeIncentives;

  const displayPagination = {
    ...pagination,
    total: showSamples
      ? sampleIncentives.length
      : pagination.total || displayIncentives.length,
    totalPages: showSamples
      ? Math.ceil(sampleIncentives.length / (pagination.limit || 10))
      : pagination.totalPages || 1,
  };

  const getStatusColor = (status: "PENDING" | "PAID") => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="mt-10 w-full px-4">
        <div className="mx-auto max-w-6xl text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent" />
          <p className="mt-4 text-gray-600">Loading your incentives...</p>
        </div>
      </div>
    );
  }

  if (showSamples) {
    return (
      <div className="mt-10 w-full px-4">
        <div className="mx-auto max-w-6xl">
          {/* <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No incentives found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              There are currently no incentive records available.
            </p>
            <p className="text-sm text-indigo-600 font-medium">
              Showing sample/preview data
            </p>
          </div> */}

          <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  {[
                    "SI",
                    "Source",
                    "Type",
                    "Amount",
                    "Status",
                    "Payment Date",
                  ].map((header, i) => (
                    <th
                      key={i}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider first:rounded-tl-2xl last:rounded-tr-2xl"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayIncentives.map((incentive, index) => (
                  <motion.tr
                    key={incentive._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                    className="transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(displayPagination.page - 1) * displayPagination.limit +
                        index +
                        1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {incentive.sourceId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {incentive.sourceType}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-base font-semibold text-gray-900">
                        {formatCurrency(incentive.incentiveAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          incentive.status,
                        )}`}
                      >
                        {incentive.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {incentive.finalPaymentDate
                        ? new Date(
                            incentive.finalPaymentDate,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : incentive.initialPaymentDate
                          ? new Date(
                              incentive.initialPaymentDate,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {displayIncentives.map((incentive, index) => (
              <motion.div
                key={incentive._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-xl border border-gray-200 shadow-md p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {incentive.sourceId}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {incentive.sourceType}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      incentive.status,
                    )}`}
                  >
                    {incentive.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Amount
                    </p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {formatCurrency(incentive.incentiveAmount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Payment Date
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {incentive.finalPaymentDate
                        ? new Date(
                            incentive.finalPaymentDate,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : incentive.initialPaymentDate
                          ? new Date(
                              incentive.initialPaymentDate,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 w-full px-4">
      <div className="mx-auto max-w-6xl">
        <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                {[
                  "SI",
                  "Source",
                  "Type",
                  "Amount",
                  "Status",
                  "Payment Date",
                ].map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider first:rounded-tl-2xl last:rounded-tr-2xl"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayIncentives.map((incentive, index) => (
                <motion.tr
                  key={incentive._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                  className="transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {(displayPagination.page - 1) * displayPagination.limit +
                      index +
                      1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {incentive.sourceId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {incentive.sourceType}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-base font-semibold text-gray-900">
                      {formatCurrency(incentive.incentiveAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        incentive.status,
                      )}`}
                    >
                      {incentive.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {incentive.finalPaymentDate
                      ? new Date(incentive.finalPaymentDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )
                      : incentive.initialPaymentDate
                        ? new Date(
                            incentive.initialPaymentDate,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {displayIncentives.map((incentive, index) => (
            <motion.div
              key={incentive._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white rounded-xl border border-gray-200 shadow-md p-5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {incentive.sourceId}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {incentive.sourceType}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    incentive.status,
                  )}`}
                >
                  {incentive.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Amount
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {formatCurrency(incentive.incentiveAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Payment Date
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {incentive.finalPaymentDate
                      ? new Date(incentive.finalPaymentDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : incentive.initialPaymentDate
                        ? new Date(
                            incentive.initialPaymentDate,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {displayPagination.total > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(displayPagination.page - 1) * displayPagination.limit + 1} –{" "}
                {(displayPagination.page - 1) * displayPagination.limit +
                  displayIncentives.length}
              </span>{" "}
              of <span className="font-medium">{displayPagination.total}</span>{" "}
              incentives
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(displayPagination.page - 1)}
                disabled={displayPagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-sm font-medium text-gray-900">
                Page {displayPagination.page} of{" "}
                {Math.max(displayPagination.totalPages, 1)}
              </span>

              <button
                onClick={() => onPageChange(displayPagination.page + 1)}
                disabled={
                  displayPagination.page >= displayPagination.totalPages
                }
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncentiveTable;
