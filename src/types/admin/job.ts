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
}
