import { Employee } from "./employeeResponse";

export interface Diagnosis {
  _id?: string;
  symptoms?: string;
  remedies?: string;
  addedAt?: Date;
}

export interface Session {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  state: string;
  date: Date;
  time: string;
  status: "booked" | "pending" | "completed" | "cancelled" | "aborted";
  completedAt?: Date;
  description?: string;
  psychologistId?: string | Employee;
  diagnosis?: Diagnosis | null;
}

export interface Stats {
  total: number;
  pending: number;
  today: number;
  completed: number;
}

export interface HeaderProps {
  title: string;
  description: string;
}

export interface StatsBarProps {
  stats: Stats;
}

export interface TabsAndViewToggleProps {
  activeTab: "not-completed" | "completed";
  setActiveTab: (tab: "not-completed" | "completed") => void;
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
  activeSessionsCount: number;
  completedSessionsCount: number;
}

export interface FiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  searchFilter: string;
  setSearchFilter: (value: string) => void;
  activeTab: "not-completed" | "completed";
}

export interface SessionListProps {
  sessions: Session[];
  viewMode: "list" | "grid";
  isLoading: boolean;
  error: string | null;
  activeTab: "not-completed" | "completed";
  expandedSessions: Set<string>;
  toggleSessionDetails: (sessionId: string) => void;
  openCompleteModal: (sessionId: string) => void;
  cancelSession: (sessionId: string) => Promise<void>;
}

export interface SessionCardProps {
  session: Session;
  viewMode: "list" | "grid";
  expanded: boolean;
  toggleSessionDetails: (sessionId: string) => void;
  openCompleteModal: (sessionId: string) => void;
  cancelSession: (sessionId: string) => Promise<void>;
}

export interface CompleteSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSession: Session | null;
  onSubmit: (values: { symptoms: string; remedies: string }) => Promise<void>;
}
