import { useState, useEffect } from "react";
import { Download, TrendingUp, Calendar } from "lucide-react";
import axios from "axios";
import { SalaryData } from "@/types/employee";
import { useAuth } from "@clerk/clerk-react";

interface SalaryResponse {
  employeeId: string;
  salaries: SalaryData[];
  monthlySalary?: number;
  annualSalary?: number;
}

interface EmployeeSalaryPanelProps {
  employeeId?: string;
}

const EmployeeSalaryPanel: React.FC<EmployeeSalaryPanelProps> = ({
  employeeId,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "history">(
    "overview"
  );
  const [employeeData, setEmployeeData] = useState<Pick<
    SalaryResponse,
    "employeeId"
  > | null>(null);
  const [salaries, setSalaries] = useState<SalaryData[]>([]);
  const [monthlySalary, setMonthlySalary] = useState<number>(0);
  const [annualSalary, setAnnualSalary] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const { getToken, userId } = useAuth();

  const baseUrl = `${import.meta.env.VITE_PROD_URL}/employee`;

  useEffect(() => {
    const fetchSalaryData = async () => {
      if (!employeeId && !userId) {
        setError("Employee ID or user authentication required");
        setLoading(false);
        return;
      }

      const token = await getToken();
      try {
        setLoading(true);
        const response = await axios.get<SalaryResponse>(`${baseUrl}/salary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEmployeeData({ employeeId: response.data.employeeId });
        setMonthlySalary(response.data.monthlySalary || 0);
        setAnnualSalary(response.data.annualSalary || 0);
        setSalaries(response.data.salaries);
        setLoading(false);
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? err.response?.status === 404
              ? "No salary records found. Payments are available after the period ends."
              : err.response?.data?.message || "Failed to fetch salary data"
            : "An unexpected error occurred"
        );
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, [employeeId, userId, baseUrl, getToken]);

  const formatCurrency = (
    amount: number,
    showCents: boolean = false
  ): string => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: showCents ? 2 : 0,
      maximumFractionDigits: showCents ? 2 : 0,
    });
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const exportHistory = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${baseUrl}/salary/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `salary_history_${employeeId || userId}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      setNotification("Salary history exported successfully as Excel!");
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.status === 404
          ? "No salary data available to export"
          : err.response?.data?.message || "Failed to export salary history"
        : "An unexpected error occurred";
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    }
  };

  const calculateAttendancePercentage = (salary: SalaryData) => {
    if (salary.totalDays === 0) return "0.0";
    return ((salary.presentDays / salary.totalDays) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading salary information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Unable to Load Data</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
            {notification}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Salary & Compensation
            </h1>
            <p className="text-gray-600">
              {employeeId
                ? "View daily salary and attendance details"
                : "View your compensation details and payment history (available after period ends)"}
            </p>
          </div>
        </div>

        {/* Salary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Base Salary Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg rounded-xl p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <TrendingUp className="mr-2" size={20} />
                  <p className="text-blue-100 text-sm font-medium">
                    Base Salary (CTC)
                  </p>
                </div>
                <p className="text-2xl font-bold mb-1">
                  Monthly:{" "}
                  {monthlySalary ? formatCurrency(monthlySalary) : "N/A"}
                </p>
                <p className="text-xl font-semibold mb-1">
                  Annual: {annualSalary ? formatCurrency(annualSalary) : "N/A"}
                </p>
                <p className="text-blue-100 text-sm">Cost to company</p>
              </div>
              <div className="rounded-full bg-white bg-opacity-20 p-3">
                <span className="text-2xl">💼</span>
              </div>
            </div>
          </div>

          {/* Last Payment Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 shadow-lg rounded-xl p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Calendar className="mr-2" size={20} />
                  <p className="text-green-100 text-sm font-medium">
                    {employeeId
                      ? "Latest Daily Payment"
                      : "Last Period Payment"}
                  </p>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {salaries[0]?.salaryAmount
                    ? formatCurrency(salaries[0].salaryAmount, true)
                    : "N/A"}
                </p>
                <p className="text-green-100 text-sm">
                  {salaries[0]
                    ? `${formatDate(salaries[0].periodStart)} - ${formatDate(
                        salaries[0].periodEnd
                      )}`
                    : employeeId
                    ? "No daily payment data"
                    : "Payment available after period ends"}
                </p>
              </div>
              <div className="rounded-full bg-white bg-opacity-20 p-3">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors ${
                  activeTab === "overview"
                    ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors ${
                  activeTab === "history"
                    ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {employeeId ? "Daily History" : "Payment History"}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Employee Info */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">👤</span>
                      Employee Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">
                          Employee ID
                        </span>
                        <span className="font-semibold text-gray-900">
                          {employeeData?.employeeId || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">
                          {employeeId ? "Total Days" : "Total Payments"}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {salaries.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Latest Payment Details */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">📊</span>
                      {employeeId
                        ? "Latest Daily Payment Details"
                        : "Latest Payment Details"}
                    </h3>
                    {salaries[0] ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                          <span className="text-gray-700 font-medium">
                            Payment Amount
                          </span>
                          <span className="font-bold text-blue-700 text-lg">
                            {formatCurrency(salaries[0].salaryAmount, true)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                          <span className="text-gray-700 font-medium">
                            Period
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatDate(salaries[0].periodStart)} -{" "}
                            {formatDate(salaries[0].periodEnd)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                          <span className="text-gray-700 font-medium">
                            Attendance
                          </span>
                          <span className="font-semibold text-gray-900">
                            {salaries[0].presentDays}/{salaries[0].totalDays}{" "}
                            days ({calculateAttendancePercentage(salaries[0])}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                          <span className="text-gray-700 font-medium">
                            Half Days
                          </span>
                          <span className="font-semibold text-gray-900">
                            {salaries[0].halfDays.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                          <span className="text-gray-700 font-medium">
                            Leave Days
                          </span>
                          <span className="font-semibold text-gray-900">
                            {salaries[0].leaveDays.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-700 font-medium">
                            Total Hours Worked
                          </span>
                          <span className="font-semibold text-gray-900">
                            {salaries[0].totalHoursWorked.toFixed(1)}h
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          {employeeId
                            ? "No daily payment data available"
                            : "Payment details available after period ends"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment History Tab */}
            {activeTab === "history" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {employeeId ? "Daily Payment History" : "Payment History"}
                  </h3>
                  <button
                    className="flex items-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow transition-colors"
                    onClick={exportHistory}
                  >
                    <Download size={16} className="mr-2" />
                    Export to Excel
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                          >
                            Period Start
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                          >
                            Period End
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                          >
                            Payment Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                          >
                            Attendance
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                          >
                            Hours
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {salaries.length > 0 ? (
                          salaries.map((salary, index) => (
                            <tr
                              key={salary._id}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatDate(salary.periodStart)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatDate(salary.periodEnd)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                {formatCurrency(salary.salaryAmount, true)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className="font-medium">
                                  {salary.presentDays}/{salary.totalDays}
                                </span>
                                <span className="text-gray-500 ml-2">
                                  ({calculateAttendancePercentage(salary)}%)
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {salary.totalHoursWorked.toFixed(1)}h
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-8 text-center text-sm text-gray-500"
                            >
                              <div className="text-center">
                                <span className="text-4xl mb-2 block">📭</span>
                                <p>
                                  {employeeId
                                    ? "No daily payment history available"
                                    : "No payment history available. Payments are available after period ends."}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSalaryPanel;
