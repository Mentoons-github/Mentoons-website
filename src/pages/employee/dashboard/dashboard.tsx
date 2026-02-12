import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useStatusModal } from "@/context/adda/statusModalContext";
import TodayAttendance from "@/components/employee/dashboard/attendance";
import CalendarView from "@/components/employee/dashboard/calenderView";
import ChartView from "@/components/employee/dashboard/chartsection";
import StatsCards from "@/components/employee/dashboard/stats";
import {
  Calendar,
  TrendingUp,
  BarChart3,
  CalendarDays,
  Sparkles,
  Target,
  Clock,
} from "lucide-react";
import {
  AttendanceRecord,
  AttendanceStats,
  MonthlyStats,
  TodayAttendanceType,
} from "@/types/employee";

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/attendance`;

const EmployeeDashboard = () => {
  const { getToken } = useAuth();
  const { showStatus } = useStatusModal();
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (new Date().getMonth() + 1).toString().padStart(2, "0"),
  );
  const [viewMode, setViewMode] = useState<"bar" | "pie" | "line">("bar");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [todayAttendance, setTodayAttendance] =
    useState<TodayAttendanceType | null>(null);
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [yearlyStats, setYearlyStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [calendarView, setCalendarView] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sectionLoading, setSectionLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!calendarView && !loading) {
      fetchChartData();
    }
  }, [selectedYear]);

  useEffect(() => {
    if (calendarView && !loading) {
      const newMonth = (currentMonth.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const newYear = currentMonth.getFullYear().toString();
      setSelectedMonth(newMonth);
      setSelectedYear(newYear);
      fetchCalendarData(newYear, newMonth);
    }
  }, [currentMonth]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        showStatus("error", "Authentication error. Please log in again.");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/my-attendance?year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTodayAttendance(response.data.todayAttendance || null);
      setYearlyStats(response.data.yearlyStats || null);
      setMonthlyStats(response.data.monthlyStats || []);
    } catch (error: any) {
      console.error("Error fetching attendance:", error);
      showStatus(
        "error",
        error.response?.data?.error || "Failed to fetch attendance data",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      setSectionLoading(true);
      const token = await getToken();
      if (!token) return;

      const response = await axios.get(
        `${BASE_URL}/my-attendance?year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setYearlyStats(response.data.yearlyStats || null);
      setMonthlyStats(response.data.monthlyStats || []);
    } catch (error: any) {
      console.error("Error fetching chart data:", error);
      showStatus("error", "Failed to fetch chart data");
    } finally {
      setSectionLoading(false);
    }
  };

  const fetchCalendarData = async (year: string, month: string) => {
    try {
      setSectionLoading(true);
      const token = await getToken();
      if (!token) return;

      const response = await axios.get(
        `${BASE_URL}/my-attendance?year=${year}&month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const attendanceData = (response.data.monthlyDetails || []).filter(
        (att: AttendanceRecord) => att && att.date,
      );
      setAllAttendance(attendanceData);
    } catch (error: any) {
      console.error("Error fetching calendar data:", error);
      showStatus("error", "Failed to fetch calendar data");
    } finally {
      setSectionLoading(false);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const yearResponse = await axios.get(
        `${BASE_URL}/my-attendance?year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTodayAttendance(yearResponse.data.todayAttendance || null);
      setYearlyStats(yearResponse.data.yearlyStats || null);
      setMonthlyStats(yearResponse.data.monthlyStats || []);

      if (calendarView) {
        const monthResponse = await axios.get(
          `${BASE_URL}/my-attendance?year=${selectedYear}&month=${selectedMonth}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const attendanceData = (monthResponse.data.monthlyDetails || []).filter(
          (att: AttendanceRecord) => att && att.date,
        );
        setAllAttendance(attendanceData);
      }
    } catch (error: any) {
      console.error("Error fetching attendance:", error);
    }
  };

  const handleToggleView = () => {
    const newCalendarView = !calendarView;
    setCalendarView(newCalendarView);

    if (newCalendarView) {
      fetchCalendarData(selectedYear, selectedMonth);
    }
  };

  const getMonthlyStats = (): MonthlyStats[] => {
    if (calendarView) return [];
    return monthlyStats;
  };

  const getOverallStats = (): AttendanceStats => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Clock className="w-10 h-10 text-white" />
            </div>
          </div>
          <p className="text-slate-700 font-semibold text-xl">
            Loading Dashboard...
          </p>
          <p className="text-slate-500 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  const stats = getOverallStats();
  const presentPercentage = stats.presentPercentage || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-800 rounded-2xl p-6 md:p-8 text-white shadow-2xl mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Welcome Back!
                </h1>
                <p className="text-blue-100 mt-1">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">
                      Attendance Rate
                    </p>
                    <p className="text-3xl font-bold">{presentPercentage}%</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Present Days</p>
                    <p className="text-3xl font-bold">{stats.presentDays}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Total Days</p>
                    <p className="text-3xl font-bold">{stats.totalDays}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TodayAttendance
          todayAttendance={todayAttendance}
          currentTime={currentTime}
          fetchAttendanceData={fetchAttendanceData}
        />

        <div className="flex justify-end mb-6">
          <button
            onClick={handleToggleView}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${
              calendarView
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-xl"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl"
            }`}
          >
            {calendarView ? (
              <>
                <BarChart3 className="w-5 h-5" />
                Show Charts
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5" />
                Show Calendar
              </>
            )}
          </button>
        </div>

        {sectionLoading ? (
          <div className="flex items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg">
            {calendarView ? (
              <div className="flex flex-col items-center gap-6">
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(28)].map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-lg animate-pulse"
                      style={{ animationDelay: `${i * 0.03}s` }}
                    ></div>
                  ))}
                </div>
                <p className="text-gray-700 font-medium">
                  Loading calendar view...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-80 h-48">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bottom-0 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg"
                      style={{
                        left: `${i * 16}%`,
                        width: "12%",
                        height: `${30 + Math.random() * 60}%`,
                        animation: `pulse 1.5s ease-in-out ${i * 0.15}s infinite`,
                      }}
                    ></div>
                  ))}
                </div>
                <p className="text-gray-700 font-medium">
                  Loading chart data...
                </p>
              </div>
            )}
          </div>
        ) : calendarView ? (
          <CalendarView
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            allAttendance={allAttendance}
          />
        ) : (
          <ChartView
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            viewMode={viewMode}
            setViewMode={setViewMode}
            monthlyStats={getMonthlyStats()}
            overallStats={getOverallStats()}
          />
        )}

        <StatsCards overallStats={getOverallStats()} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
