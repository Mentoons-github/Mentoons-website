export interface WorkshopEnquiry {
  _id: string;
  name: string;
  age: string;
  guardianName: string;
  guardianContact: string;
  guardianEmail?: string;
  city: string;
  duration: string;
  workshop: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  message: string;
}

export interface WorkshopEnquiriesListResponse {
  success: boolean;
  message: string;
  data: {
    enquiryData: WorkshopEnquiry[];
    currentPage: number;
    totalPages: number;
    totalEnquiries: number;
  };
}

export interface AssesmentReport {
  success: boolean;
  message: string;
  data: {
    feedbacks: FeedbackFormValues[];
    currentPage: number;
    totalPages: number;
    totalFeedbacks: number;
  };
}

export interface FeedbackFormValues {
  childName: string;
  childAge: string;
  parentNames: {
    mother: string;
    father: string;
    carer?: string;
  };
  easeOfUseRating: number;
  learnings: string;
  favoriteFeature:
    | "speak-easy"
    | "silent-stories-and-contest"
    | "menu-mania"
    | "all-of-the-above";
  issues: string;
  monitoringEaseRating: number;
  wouldRecommend: boolean;
  recommendationReason: string;
  overallExperience: "negative" | "neutral" | "positive";
}

export interface CallRequestsResponse {
  success: boolean;
  message: string;
  data: {
    callRequestData: CallRequest[];
    currentPage: number;
    totalPages: number;
    totalCallRequests: number;
  };
}

export type CallRequest = {
  _id: string;
  name: string;
  phone: string;
  status: string;
  assignedTo?: User[];
};

export interface User {
  _id: string;
  clerkId: string;
  role: string;
  name: string;
  email: string;
  phoneNumber: string;
  picture: string;
  joinDate?: string;
}

export interface SingleWorkshopEnquiryResponse {
  success: boolean;
  message: string;
  data: WorkshopEnquiry;
}
