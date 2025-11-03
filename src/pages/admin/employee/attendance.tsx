import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getEmployees } from "@/redux/admin/employee/api";
import { User } from "lucide-react";
import { Employee } from "@/types/employee";
import {
  AdminMonthlyStats,
  AdminAttendanceRecord,
  AdminStats,
  AdminSalaryData,
  SalaryData,
} from "@/types/employee";
import EmployeeSelector from "@/components/admin/employee/attendance/employeeSelector";
import AttendanceHeader from "@/components/admin/employee/attendance/header";
import TodayAttendance from "@/components/admin/employee/attendance/todayAttendance";
import SalaryInfo from "@/components/admin/employee/attendance/salaryInfo";
import SalaryChart from "@/components/admin/employee/attendance/salaryChart";
import AttendanceViewToggle from "@/components/admin/employee/attendance/adminViewToggle/attendanceToggleView";
import AttendanceCalendar from "@/components/admin/employee/attendance/attendanceCalender";
import AttendanceChart from "@/components/admin/employee/attendance/attendanceChart";
import AttendanceStats from "@/components/admin/employee/attendance/attendanceStats";

const BASE_URL = `${import.meta.env.VITE_PROD_URL}`;

const AdminAttendanceView: React.FC = () => {
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
    useState<AdminAttendanceRecord | null>(null);
  const [allAttendance, setAllAttendance] = useState<AdminAttendanceRecord[]>(
    []
  );
  const [monthlyStats, setMonthlyStats] = useState<AdminMonthlyStats[]>([]);
  const [yearlyStats, setYearlyStats] = useState<AdminStats | null>(null);
  const [salaryData, setSalaryData] = useState<AdminSalaryData | null>(null);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState<Employee | null>(null);

  // Add separate loading states for better control
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [salaryLoading, setSalaryLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);

  // Update employeeInfo whenever selectedEmployee or employees changes
  useEffect(() => {
    if (selectedEmployee && employees.length > 0) {
      const employee = employees.find((emp) => emp._id === selectedEmployee);
      setEmployeeInfo(employee || null);
    } else {
      setEmployeeInfo(null);
    }
  }, [selectedEmployee, employees]);

  useEffect(() => {
    if (employeeInfo?.joinDate) {
      const joiningDate = new Date(employeeInfo.joinDate);
      const joiningYear = joiningDate.getFullYear();
      const joiningMonth = joiningDate.getMonth() + 1;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const selectedYearNum = parseInt(selectedYear);
      const selectedMonthNum = parseInt(selectedMonth);

      if (selectedYearNum < joiningYear) {
        setSelectedYear(joiningYear.toString());
        setSelectedMonth(joiningMonth.toString().padStart(2, "0"));
        return;
      }

      if (selectedYearNum === joiningYear && selectedMonthNum < joiningMonth) {
        setSelectedMonth(joiningMonth.toString().padStart(2, "0"));
      }

      if (selectedYearNum === currentYear && selectedMonthNum > currentMonth) {
        setSelectedMonth(currentMonth.toString().padStart(2, "0"));
      }

      if (selectedYearNum > currentYear) {
        setSelectedYear(currentYear.toString());
        setSelectedMonth(currentMonth.toString().padStart(2, "0"));
      }
    }
  }, [selectedYear, selectedMonth, employeeInfo]);

  useEffect(() => {
    if (selectedEmployee) {

      setTodayAttendance(null);
      setYearlyStats(null);
      setMonthlyStats([]);
      setSalaryData(null);

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
      setAttendanceLoading(true);
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

      console.log("Attendance Response:", response.data);

      setTodayAttendance(response.data.todayAttendance || null);
      setYearlyStats(response.data.yearlyStats || null);
      setMonthlyStats(response.data.monthlyStats || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setAttendanceLoading(false);
      if (!salaryLoading) {
        setSectionLoading(false);
      }
    }
  };

  const fetchSalaryData = async () => {
    try {
      setSalaryLoading(true);
      setSectionLoading(true);
      const token = await getToken();
      if (!token || !selectedEmployee) return;

      const response = await axios.get(
        `${BASE_URL}/employee/salary?employeeId=${selectedEmployee}&year=${selectedYear}&month=${selectedMonth}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Salary Response:", response.data);
      setSalaryData(response.data);
    } catch (error) {
      console.error("Error fetching salary data:", error);
      setSalaryData(null);
    } finally {
      setSalaryLoading(false);
      if (!attendanceLoading) {
        setSectionLoading(false);
      }
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
        (att: AdminAttendanceRecord) => att && att.date
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

  const getOverallStats = (): AdminStats => {
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

  const getMonthlySalaryStats = () => {
    if (!salaryData) {
      console.log("No salary data available");
      return null;
    }

    console.log("Full salary data:", salaryData);
    console.log("Monthly stats:", monthlyStats);
    console.log("Selected year/month:", selectedYear, selectedMonth);

    if (
      salaryData.dailySalaries &&
      Array.isArray(salaryData.dailySalaries) &&
      salaryData.dailySalaries.length > 0
    ) {
      console.log("Using dailySalaries path");
      const selectedMonthSalaries = salaryData.dailySalaries.filter((daily) => {
        const date = new Date(daily.date);
        return (
          date.getFullYear().toString() === selectedYear &&
          (date.getMonth() + 1).toString().padStart(2, "0") === selectedMonth
        );
      });

      console.log("Filtered salaries for month:", selectedMonthSalaries);

      if (selectedMonthSalaries.length === 0) {
        console.log("No salaries for selected month, showing basic info");
        return {
          employeeName: salaryData.employeeName,
          monthlySalary: salaryData.monthlySalary,
          totalDaysWorked: 0,
          lastCumulativeSalary: 0,
        };
      }

      return {
        employeeName: salaryData.employeeName,
        monthlySalary: salaryData.monthlySalary,
        totalDaysWorked: selectedMonthSalaries.length,
        lastCumulativeSalary:
          selectedMonthSalaries[selectedMonthSalaries.length - 1]
            ?.cumulativeSalary || 0,
      };
    } else {
      console.log("Using salaries array path");
      const selectedMonthStats =
        monthlyStats && Array.isArray(monthlyStats)
          ? monthlyStats.find(
              (stat) =>
                stat && stat.month === `${selectedYear}-${selectedMonth}`
            )
          : null;

      console.log("Found monthly stats:", selectedMonthStats);

      const salaryRecord =
        salaryData.salaries && Array.isArray(salaryData.salaries)
          ? salaryData.salaries.find((salary: SalaryData) => {
              if (!salary || !salary.periodStart) return false;
              const periodStart = new Date(salary.periodStart);
              return (
                periodStart.getFullYear().toString() === selectedYear &&
                (periodStart.getMonth() + 1).toString().padStart(2, "0") ===
                  selectedMonth
              );
            })
          : null;

      console.log("Found salary record:", salaryRecord);

      if (!selectedMonthStats && !salaryRecord) {
        console.log(
          "No monthly stats or salary record found, showing basic info"
        );
        // Still show basic salary info
        return {
          monthlySalary: salaryData.monthlySalary,
          annualSalary: salaryData.annualSalary,
          presentDays: 0,
          halfDays: 0,
          totalDays: 0,
          salaryEarned: 0,
        };
      }

      return {
        presentDays: selectedMonthStats?.present || 0,
        halfDays: selectedMonthStats?.halfDay || 0,
        totalDays: salaryRecord?.totalDays || 0,
        salaryEarned: salaryRecord?.salaryAmount || 0,
      };
    }
  };

  const getSalaryChartData = () => {
    if (!salaryData) return [];

    if (
      salaryData.dailySalaries &&
      Array.isArray(salaryData.dailySalaries) &&
      salaryData.dailySalaries.length > 0
    ) {
      return salaryData.dailySalaries
        .filter((daily) => {
          if (!daily || !daily.date) return false;
          const date = new Date(daily.date);
          return (
            date.getFullYear().toString() === selectedYear &&
            (date.getMonth() + 1).toString().padStart(2, "0") === selectedMonth
          );
        })
        .map((daily) => ({
          date: daily.date.split("T")[0],
          cumulativeSalary: daily.cumulativeSalary || 0,
        }));
    } else if (salaryData.salaries && Array.isArray(salaryData.salaries)) {
      return salaryData.salaries
        .filter((salary: SalaryData) => {
          if (!salary || !salary.periodStart) return false;
          const periodStart = new Date(salary.periodStart);
          return periodStart.getFullYear().toString() === selectedYear;
        })
        .map((salary) => ({
          date: `${new Date(salary.periodStart).toLocaleString("default", {
            month: "short",
          })} ${new Date(salary.periodStart).getFullYear()}`,
          salaryAmount: salary.salaryAmount || 0,
        }));
    }

    return [];
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
          <EmployeeSelector
            employees={employees}
            selectedEmployee={selectedEmployee}
            onSelectEmployee={setSelectedEmployee}
          />
        </div>
      </div>
    );
  }

  const overallStats = getOverallStats();
  const monthlySalaryStats = getMonthlySalaryStats();
  const salaryChartData = getSalaryChartData();


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

      <AttendanceHeader
        selectedEmployee={selectedEmployee}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        employeeInfo={employeeInfo}
        employees={employees}
        onSelectEmployee={setSelectedEmployee}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
      />

      {attendanceLoading ? (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <TodayAttendance todayAttendance={todayAttendance} />
      )}

      {salaryLoading ? (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <SalaryInfo
            salaryData={salaryData}
            monthlySalaryStats={monthlySalaryStats}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
          />

          <SalaryChart
            salaryData={salaryData}
            salaryChartData={salaryChartData}
          />
        </>
      )}

      <AttendanceViewToggle
        calendarView={calendarView}
        onToggleView={handleToggleView}
      />

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
        <AttendanceCalendar
          currentMonth={currentMonth}
          allAttendance={allAttendance}
          onPreviousMonth={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
            )
          }
          onNextMonth={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
            )
          }
        />
      ) : (
        <AttendanceChart
          viewMode={viewMode}
          monthlyStats={monthlyStats}
          yearlyStats={yearlyStats}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onViewModeChange={setViewMode}
        />
      )}

      <AttendanceStats overallStats={overallStats} />
    </div>
  );
};

export default AdminAttendanceView;
