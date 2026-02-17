export interface WorkshopCandidatedDetails {
  name: string;
  age: number;
  fatherName: string;
  motherName: string;
  mobileNumber: number;
  address: string;
  dateOfBirth: string;
  gender: string;
  class: number;
  school: string;
}

export type WorkshopStatus = "Ongoing" | "Completed" | "Upcoming";

export interface PsychologistWorkshop {
  _id: string;
  psychologist: string;
  workshop: string;
  // title: string;
  duration: string;
  ageCategory: string;
  status: WorkshopStatus;
  startDate: string;
  endDate: string;
  totalSessions: number;
  completedSession: number;
  coverImage: string;
  candidates: WorkshopCandidatedDetails[];
}
