interface User {
  _id?: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  name: string;
  completed: boolean;
  files: string[];
  deadline: Date;
  assignedTo: User;
  assignedBy: User;
  createdAt: Date;
}
