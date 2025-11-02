import { Calendar, User, AlertCircle } from "lucide-react";
import { Employee } from "@/types/employee";
import EmployeeSelector from "@/components/admin/employee/attendance/employeeSelector";
import { useEffect } from "react";

interface AttendanceHeaderProps {
  selectedEmployee: string;
  selectedYear: string;
  selectedMonth: string;
  employeeInfo: Employee | null;
  employees: Employee[];
  onSelectEmployee: (employeeId: string) => void;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
}

const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
  selectedEmployee,
  selectedYear,
  selectedMonth,
  employeeInfo,
  employees,
  onSelectEmployee,
  onYearChange,
  onMonthChange,
}) => {
  // Get available years based on employee joining date
  const getAvailableYears = () => {
    if (!employeeInfo?.joinDate) {
      // Fallback to current year and previous 2 years
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 3 }, (_, i) => currentYear - 2 + i);
    }

    const joiningDate = new Date(employeeInfo.joinDate);
    const joiningYear = joiningDate.getFullYear();
    const currentYear = new Date().getFullYear();

    // Generate years from joining year to current year
    const years = [];
    for (let year = joiningYear; year <= currentYear; year++) {
      years.push(year);
    }

    return years;
  };

  // Get available months based on employee joining date and selected year
  const getAvailableMonths = () => {
    const allMonths = [
      { value: "01", label: "January" },
      { value: "02", label: "February" },
      { value: "03", label: "March" },
      { value: "04", label: "April" },
      { value: "05", label: "May" },
      { value: "06", label: "June" },
      { value: "07", label: "July" },
      { value: "08", label: "August" },
      { value: "09", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" },
    ];

    if (!employeeInfo?.joinDate) {
      return allMonths;
    }

    const joiningDate = new Date(employeeInfo.joinDate);
    const joiningYear = joiningDate.getFullYear();
    const joiningMonth = joiningDate.getMonth() + 1;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const selectedYearNum = parseInt(selectedYear);

    if (!selectedYear || selectedYearNum < joiningYear) {
      return [];
    }

    if (selectedYearNum === joiningYear) {
      return allMonths.filter((month) => parseInt(month.value) >= joiningMonth);
    }

    if (selectedYearNum === currentYear) {
      return allMonths.filter((month) => parseInt(month.value) <= currentMonth);
    }

    return allMonths;
  };

  const availableYears = getAvailableYears();
  const availableMonths = getAvailableMonths();

  useEffect(() => {
    if (employeeInfo?.joinDate) {
      const joiningDate = new Date(employeeInfo.joinDate);
      const joiningYear = joiningDate.getFullYear();
      const joiningMonth = joiningDate.getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      if (!selectedYear || parseInt(selectedYear) < joiningYear) {
        onYearChange(joiningYear.toString());
      }

      if (selectedYear) {
        const selectedYearNum = parseInt(selectedYear);
        if (
          selectedYearNum === joiningYear &&
          (!selectedMonth || parseInt(selectedMonth) < joiningMonth)
        ) {
          onMonthChange(joiningMonth.toString().padStart(2, "0"));
        } else if (
          selectedYearNum === currentYear &&
          (!selectedMonth || parseInt(selectedMonth) > currentMonth)
        ) {
          onMonthChange(currentMonth.toString().padStart(2, "0"));
        }
      }
    }
  }, [employeeInfo, selectedYear, selectedMonth, onYearChange, onMonthChange]);

  const getJoiningDateText = () => {
    if (!employeeInfo?.joinDate) return null;
    const joiningDate = new Date(employeeInfo.joinDate);
    return joiningDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section - Employee Info */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            Employee Attendance
          </h1>
          {employeeInfo ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Current Employee</p>
              <p className="text-xl font-bold text-blue-700">
                {employeeInfo.name}
              </p>
              {employeeInfo.email && (
                <p className="text-sm text-gray-600 mt-1">
                  {employeeInfo.email}
                </p>
              )}
              {getJoiningDateText() && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Joined
                  </p>
                  <p className="text-sm font-semibold text-blue-600 mt-1">
                    {getJoiningDateText()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                Please select an employee to view attendance details.
              </p>
            </div>
          )}
        </div>

        {/* Right Section - Filters */}
        <div className="lg:w-96">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-700">Filters</h3>
            </div>

            {/* Date Filters */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  className="w-full border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent px-4 py-2.5 rounded-lg text-sm bg-white shadow-sm transition-all disabled:bg-gray-100 disabled:text-gray-400"
                  value={selectedYear}
                  onChange={(e) => onYearChange(e.target.value)}
                  disabled={!employeeInfo || availableYears.length === 0}
                >
                  {availableYears.length > 0 ? (
                    availableYears.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))
                  ) : (
                    <option value="">No years available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <select
                  className="w-full border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent px-4 py-2.5 rounded-lg text-sm bg-white shadow-sm transition-all disabled:bg-gray-100 disabled:text-gray-400"
                  value={selectedMonth}
                  onChange={(e) => onMonthChange(e.target.value)}
                  disabled={!employeeInfo || availableMonths.length === 0}
                >
                  {availableMonths.length > 0 ? (
                    availableMonths.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))
                  ) : (
                    <option value="">No months available</option>
                  )}
                </select>
              </div>

              {!employeeInfo && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    Please select an employee to enable date filters.
                  </p>
                </div>
              )}
              {employeeInfo && availableYears.length === 0 && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    No years available. Employee joining date is in the future
                    or invalid.
                  </p>
                </div>
              )}
              {employeeInfo &&
                availableYears.length > 0 &&
                availableMonths.length === 0 && (
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700">
                      No months available for the selected year. Please choose a
                      different year.
                    </p>
                  </div>
                )}
            </div>

            {/* Employee Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Employee
              </label>
              <EmployeeSelector
                employees={employees}
                selectedEmployee={selectedEmployee}
                onSelectEmployee={onSelectEmployee}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHeader;
