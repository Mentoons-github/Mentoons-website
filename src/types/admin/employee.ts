import { EmploymentType } from "../employee/employee";

export interface FormValues {
  department: string;
  employmentType: EmploymentType;
  salary: string;
  active: boolean;
  jobRole: string;
  user: {
    name: string;
    email: string;
    role: string;
    gender: string;
    phoneNumber: string;
  };
}
