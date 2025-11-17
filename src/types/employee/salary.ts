export interface SalaryData {
  _id?: string;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  totalDays: number;
  presentDays: number;
  halfDays: number;
  leaveDays: number;
  totalHoursWorked: number;
  salaryAmount: number;
  generatedAt?: string;
}

export interface AdminAttendanceRecord {
  _id: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: "present" | "absent" | "onLeave" | "halfDay";
  workHours: number;
  lateBy: number;
  earlyLeave?: number;
}

export interface AdminMonthlyStats {
  month: string;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  halfDay: number;
}

export interface AdminStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  onLeaveDays: number;
  halfDays: number;
  presentPercentage: number;
  averageWorkHours: number;
}

export interface AdminDailySalary {
  date: string;
  dayCount: number;
  dailySalary: number;
  cumulativeSalary: number;
}

export interface AdminSalaryData {
  employeeId: string;
  employeeName?: string;
  monthlySalary: number;
  annualSalary: number;
  totalDaysWorked?: number;
  currentDate?: string;
  dailySalaries?: AdminDailySalary[];
  salaries: SalaryData[];
}