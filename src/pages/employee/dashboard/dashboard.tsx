import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useStatusModal } from "@/context/adda/statusModalContext";
import TodayAttendance from "@/components/employee/dashboard/attendance";
import CalendarView from "@/components/employee/dashboard/calenderView";
import ChartView from "@/components/employee/dashboard/chartsection";
import StatsCards from "@/components/employee/dashboard/stats";
import { Calendar } from "lucide-react";
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
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (new Date().getMonth() + 1).toString().padStart(2, "0")
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
        }
      );

      setTodayAttendance(response.data.todayAttendance || null);
      setYearlyStats(response.data.yearlyStats || null);
      setMonthlyStats(response.data.monthlyStats || []);
    } catch (error: any) {
      console.error("Error fetching attendance:", error);
      showStatus(
        "error",
        error.response?.data?.error || "Failed to fetch attendance data"
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
        }
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
        }
      );

      const attendanceData = (response.data.monthlyDetails || []).filter(
        (att: AttendanceRecord) => att && att.date
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
        }
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
          }
        );

        const attendanceData = (monthResponse.data.monthlyDetails || []).filter(
          (att: AttendanceRecord) => att && att.date
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

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
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 md:p-6 text-white shadow-lg mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Welcome Back!</h1>
        <p className="mt-1 opacity-90">
          Here's your attendance dashboard for {selectedYear}
        </p>
      </div>

      <TodayAttendance
        todayAttendance={todayAttendance}
        currentTime={currentTime}
        fetchAttendanceData={fetchAttendanceData}
      />

      <div className="flex justify-end mb-4">
        <button
          onClick={handleToggleView}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Calendar className="w-4 h-4" />
          {calendarView ? "Show Charts" : "Show Calendar"}
        </button>
      </div>

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
  );
};

export default EmployeeDashboard;
