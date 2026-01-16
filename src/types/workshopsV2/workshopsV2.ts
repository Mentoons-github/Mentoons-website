export type PaymentOption = "FULL" | "EMI";

export interface Price {
  original: number;
  introductory: number;
}

export interface ModuleSession {
  title: string;
  description: string;
  sessionCount: number;
}

export interface EMI {
  enabled: boolean;
  downPayment: number;
  durationMonths: number;
  monthlyAmount: number;
  interestRate?: number;
}

export interface WorkshopPlan {
  planId: string;
  name: string;
  age: string;
  duration: string;
  durationMonths: number;
  mode: ("Online" | "Offline")[];
  totalSession: number;
  price: Price;
  emi?: EMI;
  features: string[];
  paymentOptions: PaymentOption[];
  image: string;
  materials: string;
  includesIntroSession?: boolean;
  includesFinalSession?: boolean;
  moduleSessions: ModuleSession[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
