export interface JobData {
  _id: string | any;
  jobTitle: string;
  jobDescription: string;
  skillsRequired: string[];
  location?: string;
  jobType?: string;
  status?: string;
  thumbnail: string | File | null;
  applicationCount?: number;
  applicationDetails?: JobApplication[];
  responsibilities?: string[];
  requirements?: string[];
  whatWeOffer?: string[];
  applicationSource?: string[];
}

export interface JobApplication {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  portfolioLink: string;
  coverNote: string;
  resume: string;
  coverLetterLink: string;
  createdAt: string;
  jobTitle: string;
}

export interface JobApplicationResponse {
  success: boolean;
  data: {
    jobs: JobApplication[];
    currentPage: number;
    totalPages: number;
    totalJobs: number;
  };
}
export interface singleJobDataResponse {
  success: boolean;
  data: JobData;
}

export interface JobDataResponse {
  success: boolean;
  message?: string;
  data: {
    jobs: JobData[];
    currentPage: number;
    totalPages: number;
    totalJobs: number;
    message?: string;
  };
}
