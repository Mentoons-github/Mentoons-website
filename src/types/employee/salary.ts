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
