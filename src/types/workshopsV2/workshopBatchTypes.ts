import { Employee } from "../employee";
import { WorkshopPlan } from "./workshopsV2";

export type WorkshopStatus = "draft" | "ongoing" | "completed" | "upcoming";

export interface WorkshopStudentsTypes {
  _id: string;
  workshopId: WorkshopPlan;
  workshopBatch: WorkshopBatchTypes;
  name: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  class: string;
  school: string;
  motherName: string;
  fatherName: string;
  address: string;
  mobileNumber: number;
  scoring: {
    completedSessions: number;
    totalSessions: number;
    sessions: SessionScoringType[];
  };
}

export interface WorkshopBatchTypes {
  _id: string;
  psychologist: Employee;
  //   workshop: string;
  title: string;
  duration: string;
  ageCategory: string;
  status: WorkshopStatus;
  startDate: string;
  endDate: string;
  totalSessions: number;
  currentSession: number;
  coverImage: string;
  workshopId: WorkshopPlan;
  maxStudents: string;
  students: WorkshopStudentsTypes[];
}

export interface SessionScoringType {
  _id?: string;
  sessionName: string;
  sessionNumber: number;
  sessionDate: string;
  scors: {
    headings: {
      headingIndex: number;
      headingScore: number;
      questions: {
        questionIndex: number;
        score: number;
      }[];
    }[];

    totalScore: number;
  };
  psychologist?: {
    user: {
      name: string;
    };
  };
}

export interface WorkshopPagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}
