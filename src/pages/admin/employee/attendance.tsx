import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Calendar, ChevronLeft, ChevronRight, User } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getEmployees } from "@/redux/admin/employee/api";

// Employee interface from Redux
export interface Employee {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  department: string;
  joinDate: string;
  isActive: boolean;
  salary: number;
  place: {
    houseName: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    country: string;
  };
  profilePicture: string;
  profileEditRequest?: {
    status: "pending" | "approved" | "rejected";
    requestedAt?: string;
    approvedAt?: string;
    adminId?: string;
  };
}

interface AttendanceRecord {
  _id: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: "present" | "absent" | "onLeave" | "halfDay";
  workHours: number;
  lateBy: number;
  earlyLeave?: number;
}

interface MonthlyStats {
  month: string;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  halfDay: number;
}

interface Stats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  onLeaveDays: number;
  halfDays: number;
  presentPercentage: number;
  averageWorkHours: number;
}

interface SalaryRecord {
  _id: string;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  salaryAmount: number;
  presentDays: number;
  totalDays: number;
  halfDays: number;
  leaveDays: number;
  totalHoursWorked: number;
}

interface SalaryData {
  employeeId: string;
  monthlySalary: number;
  annualSalary: number;
  salaries: SalaryRecord[];
}

const BASE_URL = `${import.meta.env.VITE_PROD_URL}`;

const AdminAttendanceView = () => {
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading, error, currentPage } = useSelector(
    (state: RootState) => state.employee
  );
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (new Date().getMonth() + 1).toString().padStart(2, "0")
  );
  const [viewMode, setViewMode] = useState<"bar" | "pie" | "line">("bar");
  const [calendarView, setCalendarView] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [todayAttendance, setTodayAttendance] =
    useState<AttendanceRecord | null>(null);
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [yearlyStats, setYearlyStats] = useState<Stats | null>(null);
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);

  useEffect(() => {
    if (selectedEmployee) {
      fetchAttendanceData();
      fetchSalaryData();
    }
  }, [selectedEmployee, selectedYear, selectedMonth]);

  useEffect(() => {
    if (calendarView && selectedEmployee) {
      const newMonth = (currentMonth.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const newYear = currentMonth.getFullYear().toString();
      setSelectedMonth(newMonth);
      setSelectedYear(newYear);
      fetchCalendarData(newYear, newMonth);
    }
  }, [currentMonth, selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      await dispatch(
        getEmployees({
          sortOrder: "asc",
          searchTerm: "",
          page: currentPage,
          limit: 10,
        })
      ).unwrap();
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      setSectionLoading(true);
      const token = await getToken();
      if (!token || !selectedEmployee) return;

      const response = await axios.get(`${BASE_URL}/attendance/my-attendance`, {
        params: {
          year: selectedYear,
          userId: selectedEmployee,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTodayAttendance(response.data.todayAttendance || null);
      setYearlyStats(response.data.yearlyStats || null);
      setMonthlyStats(response.data.monthlyStats || []);
      setEmployeeInfo(
        employees.find((emp) => emp._id === selectedEmployee) || null
      );
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setSectionLoading(false);
    }
  };

  const fetchSalaryData = async () => {
    try {
      setSectionLoading(true);
      const token = await getToken();
      if (!token || !selectedEmployee) return;

      const response = await axios.get(`${BASE_URL}/employee/salary`, {
        query: {
          employeeId: selectedEmployee,
          year: selectedYear,
          month: selectedMonth,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);

      setSalaryData(response.data);
    } catch (error) {
      console.error("Error fetching salary data:", error);
    } finally {
      setSectionLoading(false);
    }
  };

  const fetchCalendarData = async (year: string, month: string) => {
    try {
      setSectionLoading(true);
      const token = await getToken();
      if (!token || !selectedEmployee) return;

      const response = await axios.get(`${BASE_URL}/attendance/my-attendance`, {
        params: {
          year,
          month,
          userId: selectedEmployee,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const attendanceData = (response.data.monthlyDetails || []).filter(
        (att: AttendanceRecord) => att && att.date
      );
      setAllAttendance(attendanceData);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setSectionLoading(false);
    }
  };

  const handleToggleView = () => {
    const newCalendarView = !calendarView;
    setCalendarView(newCalendarView);

    if (newCalendarView && selectedEmployee) {
      fetchCalendarData(selectedYear, selectedMonth);
    }
  };

  const getOverallStats = (): Stats => {
    return (
      yearlyStats || {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        onLeaveDays: 0,
        halfDays: 0,
        presentPercentage: 0,
        averageWorkHours: 0,
      }
    );
  };

  const getPieData = () => {
    const stats = getOverallStats();
    return [
      { name: "Present", value: stats.presentDays, color: "#4ADE80" },
      { name: "Absent", value: stats.absentDays, color: "#F87171" },
      { name: "On Leave", value: stats.onLeaveDays, color: "#A78BFA" },
      { name: "Half Day", value: stats.halfDays, color: "#FBBF24" },
    ].filter((item) => item.value > 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700 border-green-300";
      case "absent":
        return "bg-red-100 text-red-700 border-red-300";
      case "onLeave":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "halfDay":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-400";
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getAttendanceForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return allAttendance.find(
      (att) => att.date && att.date.split("T")[0] === dateStr
    );
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-20 border border-gray-200"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const attendance = getAttendanceForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`h-20 border border-gray-200 p-2 ${
            isToday ? "ring-2 ring-blue-500" : ""
          } ${attendance ? getStatusColor(attendance.status) : "bg-white"}`}
        >
          <div className="font-semibold text-sm">{day}</div>
          {attendance && (
            <div className="text-xs mt-1">
              <div className="capitalize">{attendance.status}</div>
              {attendance.lateBy > 0 && (
                <div className="text-red-600">Late: {attendance.lateBy}m</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const getMonthlySalaryStats = () => {
    if (!salaryData || !monthlyStats) return null;

    const selectedMonthStats = monthlyStats.find(
      (stat) => stat.month === `${selectedYear}-${selectedMonth}`
    );

    if (!selectedMonthStats) return null;

    const salaryRecord = salaryData.salaries.find((salary) => {
      const periodStart = new Date(salary.periodStart);
      return (
        periodStart.getFullYear().toString() === selectedYear &&
        (periodStart.getMonth() + 1).toString().padStart(2, "0") ===
          selectedMonth
      );
    });

    if (!salaryRecord) return null;

    return {
      presentDays: selectedMonthStats.present,
      halfDays: selectedMonthStats.halfDay,
      salaryEarned: salaryRecord.salaryAmount,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!selectedEmployee) {
    return (
      <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <User className="w-6 h-6" />
            Select Employee
          </h2>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">-- Select an employee --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} - {emp.email}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  const overallStats = getOverallStats();
  const pieData = getPieData();
  const monthlySalaryStats = getMonthlySalaryStats();

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <style>
        {`
          @keyframes chartGrow {
            0%, 100% { transform: scaleY(0.3); opacity: 0.5; }
            50% { transform: scaleY(1); opacity: 1; }
          }
        `}
      </style>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 md:p-6 text-white shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Attendance Dashboard
            </h1>
            <p className="mt-1 opacity-90">
              {employeeInfo?.name || "Employee"} - {selectedYear}
            </p>
          </div>
          <select
            className="bg-white text-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-white outline-none"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Today's Attendance */}
      {todayAttendance && (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            Today's Attendance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Check-in Time</p>
              <p className="text-xl font-bold text-blue-600">
                {todayAttendance.checkInTime
                  ? new Date(todayAttendance.checkInTime).toLocaleTimeString()
                  : "--:--:--"}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Check-out Time</p>
              <p className="text-xl font-bold text-purple-600">
                {todayAttendance.checkOutTime
                  ? new Date(todayAttendance.checkOutTime).toLocaleTimeString()
                  : "--:--:--"}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Total Hours</p>
              <p className="text-xl font-bold text-green-600">
                {Math.floor(todayAttendance.workHours)}h{" "}
                {Math.floor((todayAttendance.workHours % 1) * 60)}m
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Salary Stats */}
      {monthlySalaryStats && (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            Monthly Salary Stats ({`${selectedYear}-${selectedMonth}`})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Present Days</p>
              <p className="text-xl font-bold text-green-600">
                {monthlySalaryStats.presentDays}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-600 mb-1">Half Days</p>
              <p className="text-xl font-bold text-yellow-600">
                {monthlySalaryStats.halfDays}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Salary Earned</p>
              <p className="text-xl font-bold text-blue-600">
                ${monthlySalaryStats.salaryEarned.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleToggleView}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Calendar className="w-4 h-4" />
          {calendarView ? "Show Charts" : "Show Calendar"}
        </button>
      </div>

      {/* Calendar/Chart Section */}
      {sectionLoading ? (
        <div className="flex items-center justify-center py-20">
          {calendarView ? (
            <div className="flex flex-col items-center gap-4">
              <div className="grid grid-cols-7 gap-2">
                {[...Array(28)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-gray-200 rounded animate-pulse"
                    style={{ animationDelay: `${i * 0.02}s` }}
                  ></div>
                ))}
              </div>
              <p className="text-gray-600 text-sm">Loading calendar...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-64 h-40">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bottom-0 bg-blue-500 rounded-t"
                    style={{
                      left: `${i * 20}%`,
                      width: "15%",
                      height: `${20 + Math.random() * 60}%`,
                      animation: `chartGrow 1s ease-out ${i * 0.1}s infinite`,
                    }}
                  ></div>
                ))}
              </div>
              <p className="text-gray-600 text-sm">Loading chart...</p>
            </div>
          )}
        </div>
      ) : calendarView ? (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1
                  )
                )
              }
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1
                  )
                )
              }
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="font-semibold text-center py-2 bg-gray-100 border border-gray-200"
              >
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300"></div>
              <span>Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300"></div>
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 border border-purple-300"></div>
              <span>On Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300"></div>
              <span>Half Day</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Attendance Overview
            </h2>
            <div className="flex flex-col md:flex-row gap-3 mt-3 md:mt-0">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("bar")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewMode === "bar"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Bar
                </button>
                <button
                  onClick={() => setViewMode("pie")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewMode === "pie"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Pie
                </button>
                <button
                  onClick={() => setViewMode("line")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewMode === "line"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Line
                </button>
              </div>
              <select
                className="border outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1 rounded-md text-sm bg-white"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
              <select
                className="border outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1 rounded-md text-sm bg-white"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {[
                  "01",
                  "02",
                  "03",
                  "04",
                  "05",
                  "06",
                  "07",
                  "08",
                  "09",
                  "10",
                  "11",
                  "12",
                ].map((month) => (
                  <option key={month} value={month}>
                    {new Date(0, parseInt(month) - 1).toLocaleString(
                      "default",
                      {
                        month: "long",
                      }
                    )}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                {viewMode === "bar" ? (
                  <BarChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" name="Present" fill="#4ADE80" />
                    <Bar dataKey="absent" name="Absent" fill="#F87171" />
                    <Bar dataKey="onLeave" name="On Leave" fill="#A78BFA" />
                    <Bar dataKey="halfDay" name="Half Day" fill="#FBBF24" />
                  </BarChart>
                ) : viewMode === "pie" ? (
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${
                          percent !== undefined ? (percent * 100).toFixed(0) : 0
                        }%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <LineChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="present"
                      name="Present"
                      stroke="#4ADE80"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="absent"
                      name="Absent"
                      stroke="#F87171"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="onLeave"
                      name="On Leave"
                      stroke="#A78BFA"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="halfDay"
                      name="Half Day"
                      stroke="#FBBF24"
                      strokeWidth={2}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mt-6">
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <h3 className="text-sm md:text-lg font-medium text-gray-500">
            Total Days
          </h3>
          <div className="flex justify-between items-end mt-2">
            <p className="text-xl md:text-2xl font-bold text-gray-800">
              {overallStats.totalDays}
            </p>
            <span className="text-xs md:text-sm text-blue-500 font-medium">
              100%
            </span>
          </div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm md:text-lg font-medium text-gray-500">
            Present Days
          </h3>
          <div className="flex justify-between items-end mt-2">
            <p className="text-xl md:text-2xl font-bold text-green-600">
              {overallStats.presentDays}
            </p>
            <span className="text-xs md:text-sm text-green-500 font-medium">
              {overallStats.presentPercentage.toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm md:text-lg font-medium text-gray-500">
            Absent Days
          </h3>
          <div className="flex justify-between items-end mt-2">
            <p className="text-xl md:text-2xl font-bold text-red-600">
              {overallStats.absentDays}
            </p>
            <span className="text-xs md:text-sm text-red-500 font-medium">
              {overallStats.totalDays > 0
                ? Math.round(
                    (overallStats.absentDays / overallStats.totalDays) * 100
                  )
                : 0}
              %
            </span>
          </div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm md:text-lg font-medium text-gray-500">
            Half Days
          </h3>
          <div className="flex justify-between items-end mt-2">
            <p className="text-xl md:text-2xl font-bold text-yellow-600">
              {overallStats.halfDays}
            </p>
            <span className="text-xs md:text-sm text-yellow-500 font-medium">
              {overallStats.totalDays > 0
                ? Math.round(
                    (overallStats.halfDays / overallStats.totalDays) * 100
                  )
                : 0}
              %
            </span>
          </div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm md:text-lg font-medium text-gray-500">
            On Leave
          </h3>
          <div className="flex justify-between items-end mt-2">
            <p className="text-xl md:text-2xl font-bold text-purple-600">
              {overallStats.onLeaveDays}
            </p>
            <span className="text-xs md:text-sm text-purple-500 font-medium">
              {overallStats.totalDays > 0
                ? Math.round(
                    (overallStats.onLeaveDays / overallStats.totalDays) * 100
                  )
                : 0}
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceView;
