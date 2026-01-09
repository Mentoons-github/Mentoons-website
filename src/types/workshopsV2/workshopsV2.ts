export interface WorkshopModule {
  moduleId: string;
  name: string;
  image: string;
}

export interface ModuleSession {
  moduleId: string;
  totalSessions: number;
}

export interface Price {
  original: number;
  introductory: number;
}

export interface WorkshopPlan {
  planId: string;
  name: string;
  age: string;
  image: string;
  duration: string;
  durationMonths: number;
  totalSession: number;
  price: Price;
  paymentOption: "fullPayment" | "emi";
  features: string[];
  mode: ("Online" | "Offline")[];
  materials: string;
  includesIntroSession: boolean;
  includesFinalSession: boolean;
  moduleSessions: ModuleSession[];
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
