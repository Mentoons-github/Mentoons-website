interface UserFormData {
  name: string;
  email: string;
  role: string;
  picture: string;
  gender: "male" | "female" | "other";
}

export interface EmployeeInterface {
  department: string;
  salary: number;
  active: boolean;
  user: UserFormData;
}
