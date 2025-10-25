export type Department =
  | "developer"
  | "illustrator"
  | "designer"
  | "hr"
  | "marketing"
  | "finance"
  | "sales";

export interface UserFormData {
  name: string;
  email: string;
  role: string;
  picture?: string;
  gender: "male" | "female" | "other";
  phoneNumber: number | null;
}

export interface EmployeeInterface {
  department: Department | null;
  salary: number;
  active: boolean;
  user: UserFormData;
  jobRole: string;
  profileEditRequest?: {
    status: "pending" | "approved" | "rejected";
    requestedAt?: string;
    approvedAt?: string;
    adminId?: string;
  };
}

export interface IAttendance {
  _id?: string;
  employeeId: string;
  date: Date;
  checkInTime?: Date;
  checkOutTime?: Date;
  status?: "present" | "absent" | "onLeave" | "halfDay";
  workHours?: number;
  lateBy?: number;
  earlyLeave?: number;
  notes?: string;
  remote?: boolean;
  overtimeHours?: number;
  editedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}