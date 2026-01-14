export interface Benefit {
  title: string;
  description: string;
}

export interface WhyChooseUs {
  heading: string;
  description: string;
}

export interface AgeGroupDetails {
  ageRange: string;
  serviceOverview: string;
  benefits: Benefit[];
  image: string | null;
}

export interface WorkshopFormValues {
  workshopName: string;
  overview: string;
  whyChooseUs: WhyChooseUs[];
  ageGroups: AgeGroupDetails[];
}

export interface WorkshopCategory {
  categoryName: string;
  description: string;
  workshops: WorkshopFormValues[];
  subtitle: string;
}

export interface WorkshopPrice {
  original: number;
  introductory: number;
  monthly?: number;
}

export type WorkshopMode = "Online" | "Offline";

export interface WorkshopPlan {
  age: string;
  duration: string;
  mode: WorkshopMode[];
  totalSession: number;
  price: WorkshopPrice;
  features: string[];
  paymentOption?: "fullPayment" | "twoStep" | "emi";
  materials: string;
}
