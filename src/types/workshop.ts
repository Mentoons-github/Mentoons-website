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
  whyChooseUs: WhyChooseUs[];
  ageGroups: AgeGroupDetails[];
}

export interface WorkshopCategory {
  categoryName: string;
  workshops: WorkshopFormValues[];
  subtitle: string;
}
