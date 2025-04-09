export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  status: "booked" | "completed" | "cancelled" | "pending" | "aborted";
  description?: string;
  psychologistId?: string;
  completedAt?: string | null;
}
