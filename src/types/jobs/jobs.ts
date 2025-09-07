export interface JobPosting {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  jobType: "FULLTIME" | "PARTTIME" | "CONTRACT" | "INTERNSHIP";
  location: string;
  skillsRequired: string[];
  applicationCount: number;
  thumbnail: string;
  responsibilities?: string[];
  requirements?: string[];
  whatWeOffer?: string[];
}
