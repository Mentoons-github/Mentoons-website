export interface IUser {
  clerkId: string;
  role: "ADMIN" | "SUPER-ADMIN" | "USER";
  name?: string;
  email?: string;
  picture?: string;

  subscription: {
    plan: "prime" | "platinum" | "free";
    status: "active" | "cancelled";
    startDate: Date;
    validUntil: Date;
  };

  activeSession: Date;
  userActivityPerDay: number;
}
