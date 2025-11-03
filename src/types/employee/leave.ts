export interface LeaveValues {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  document?: string;
}

export interface LeaveData {
  taken: number;
  available: number | "Unlimited";
}
export interface LeaveStatsData {
  [key: string]: LeaveData;
}
export interface RecentLeave {
  _id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
}
