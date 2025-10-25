export interface AttendanceRecord {
  _id: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: "present" | "absent" | "onLeave" | "halfDay";
  workHours: number;
  lateBy: number;
  earlyLeave?: number;
  notes?: string;
}

export interface TodayAttendanceType extends AttendanceRecord {}

export interface MonthlyStats {
  month: string;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  halfDay: number;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  onLeaveDays: number;
  halfDays: number;
  presentPercentage: number;
  averageWorkHours: number;
}