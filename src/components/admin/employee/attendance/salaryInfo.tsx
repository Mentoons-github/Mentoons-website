import React from "react";
import {
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  User,
  IndianRupee,
} from "lucide-react";

interface AdminSalaryData {
  monthlySalary?: number;
  annualSalary?: number;
}

interface SalaryInfoProps {
  salaryData: AdminSalaryData | null;
  monthlySalaryStats: any;
  selectedYear: string;
  selectedMonth: string;
}

const SalaryInfo: React.FC<SalaryInfoProps> = ({
  salaryData,
  monthlySalaryStats,
  selectedYear,
  selectedMonth,
}) => {
  if (!salaryData && !monthlySalaryStats) return null;

  const monthName = new Date(0, parseInt(selectedMonth) - 1).toLocaleString(
    "default",
    {
      month: "long",
    }
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Salary Overview</h2>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-semibold text-gray-600">
            {`${monthName} ${selectedYear}`}
          </p>
        </div>
      </div>

      {monthlySalaryStats?.employeeName && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Employee
              </p>
              <p className="text-xl font-bold text-gray-800">
                {monthlySalaryStats.employeeName}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {monthlySalaryStats?.salaryEarned !== undefined && (
          <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                  <IndianRupee className="w-8 h-8 text-white" />
                </div>
                <p className="text-emerald-100 font-medium text-sm uppercase tracking-wider">
                  Salary Earned This Month
                </p>
              </div>
              <p className="text-5xl font-black text-white mb-2">
                ₹{monthlySalaryStats.salaryEarned.toFixed(2)}
              </p>
              {monthlySalaryStats?.totalDaysWorked !== undefined && (
                <p className="text-emerald-100 text-sm">
                  Based on {monthlySalaryStats.totalDaysWorked} working days
                </p>
              )}
            </div>
          </div>
        )}

        {monthlySalaryStats?.presentDays !== undefined && (
          <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-blue-100 font-medium text-sm uppercase tracking-wider">
                  Present Days
                </p>
              </div>
              <p className="text-5xl font-black text-white mb-2">
                {monthlySalaryStats.presentDays}
              </p>
              {monthlySalaryStats?.totalDays !== undefined && (
                <p className="text-blue-100 text-sm">
                  Out of {monthlySalaryStats.totalDays} total days
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {monthlySalaryStats?.halfDays !== undefined && (
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Half Days
              </p>
            </div>
            <p className="text-3xl font-bold text-amber-600">
              {monthlySalaryStats.halfDays}
            </p>
          </div>
        )}

        {monthlySalaryStats?.totalDaysWorked !== undefined && (
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Days Worked
              </p>
            </div>
            <p className="text-3xl font-bold text-orange-600">
              {monthlySalaryStats.totalDaysWorked}
            </p>
          </div>
        )}

        {(salaryData?.monthlySalary !== undefined ||
          monthlySalaryStats?.monthlySalary !== undefined) && (
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="w-5 h-5 text-green-500" />
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Monthly Salary
              </p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₹
              {(
                monthlySalaryStats?.monthlySalary ||
                salaryData?.monthlySalary ||
                0
              ).toFixed(2)}
            </p>
          </div>
        )}

        {(salaryData?.annualSalary !== undefined ||
          monthlySalaryStats?.annualSalary !== undefined) && (
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Annual Salary
              </p>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              ₹
              {(
                monthlySalaryStats?.annualSalary ||
                salaryData?.annualSalary ||
                0
              ).toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Cumulative Earnings Banner */}
      {monthlySalaryStats?.lastCumulativeSalary !== undefined && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-1">
                  Total Earned So Far
                </p>
                <p className="text-4xl font-black text-white">
                  ₹{monthlySalaryStats.lastCumulativeSalary.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryInfo;
