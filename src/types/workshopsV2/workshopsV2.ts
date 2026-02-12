export interface WorkshopModule {
  moduleId: string;
  name: string;
  image: string;
}

export interface ModuleSession {
  title?: string;
  description?: string;
  sessionCount?: number;
}

export interface Price {
  original: number;
  introductory: number;
}

export interface EmiConfig {
  enabled: boolean;
  downPayment?: number;
  durationMonths?: number;
  monthlyAmount?: number;
  interestRate: number;
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
  emi: EmiConfig;
  features: string[];
  paymentOptions: ("FULL" | "EMI")[];
  image: string;
  materials: string;
  includesIntroSession: boolean;
  includesFinalSession: boolean;
  moduleSessions: ModuleSession[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Workshop {
  _id: string;
  workshopCode: string;
  name: string;
  description: string;
  isActive: boolean;
  modules: WorkshopModule[];
  plans: WorkshopPlan[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
