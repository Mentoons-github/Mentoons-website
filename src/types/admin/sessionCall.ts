import { User } from "../adda/userProfile";

export interface ISessionCall {
  _id?: string;
  user: string | User;
  name: string;
  state: string;
  phone: string;
  email: string;
  date: Date;
  time: string;
  psychologistId: string;
  status: "booked" | "completed" | "cancelled" | "pending" | "aborted";
  completedAt?: Date | null;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
