export type Department =
  | "developer"
  | "illustrator"
  | "designer"
  | "hr"
  | "marketing"
  | "finance"
  | "sales"
  | "psychologist";

export interface UserFormData {
  name: string;
  email: string;
  role: string;
  picture?: string;
  gender: "male" | "female" | "other";
  phoneNumber: number | null;
  dob: string | null;
}

export interface EmployeeInterface {
  department: Department | null;
  salary: number;
  active: boolean;
  user: UserFormData;
  jobRole: string;
  dob?: string | null;
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

export type EmploymentType =
  | "full-time"
  | "part-time"
  | "intern"
  | "contract"
  | "freelance";

export interface UserFormData {
  name: string;
  email: string;
  role: string;
  picture?: string;
  gender: "male" | "female" | "other";
  phoneNumber: number | null;
  dob: string | null;
}

export interface EmployeeInterface {
  department: Department | null;
  employmentType: EmploymentType; 
  salary: number;
  active: boolean;
  user: UserFormData;
  jobRole: string;
  dob?: string | null;
  profileEditRequest?: {
    status: "pending" | "approved" | "rejected";
    requestedAt?: string;
    approvedAt?: string;
    adminId?: string;
  };
}
