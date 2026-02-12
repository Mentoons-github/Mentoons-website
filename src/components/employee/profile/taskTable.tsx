import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { getStatusColor } from "@/utils/task/admin/taskUtils";
import { RecentTask } from "@/redux/employee/api";

interface EmployeeTasksTabProps {
  tasks: RecentTask[];
}

const EmployeeTasksTab = ({ tasks }: EmployeeTasksTabProps) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const tempTaskData: { [key: string]: RecentTask[] } = {
    taskOfDay: [
      {
        id: "1",
        title: "Complete project documentation",
        dueDate: "2026-01-28",
        status: "in-progress",
      },
      {
        id: "2",
        title: "Review code changes",
        dueDate: "2026-01-28",
        status: "pending",
      },
    ],
    completed: [
      {
        id: "3",
        title: "Deploy to production",
        dueDate: "2026-01-27",
        status: "completed",
      },
      {
        id: "4",
        title: "Update dependencies",
        dueDate: "2026-01-26",
        status: "completed",
      },
      {
        id: "5",
        title: "Write unit tests",
        dueDate: "2026-01-25",
        status: "completed",
      },
    ],
    pending: [
      {
        id: "6",
        title: "Fix bug in authentication",
        dueDate: "2026-01-30",
        status: "pending",
      },
      {
        id: "7",
        title: "Implement new feature",
        dueDate: "2026-02-01",
        status: "pending",
      },
      {
        id: "8",
        title: "Update API endpoints",
        dueDate: "2026-02-02",
        status: "pending",
      },
    ],
    transferred: [
      {
        id: "9",
        title: "Database optimization",
        dueDate: "2026-01-29",
        status: "transferred",
      },
      {
        id: "10",
        title: "Redesign landing page",
        dueDate: "2026-02-05",
        status: "transferred",
      },
    ],
  };

  const getFilteredTasks = () => {
    if (activeFilter === "all") return tasks;
    return tempTaskData[activeFilter] || [];
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Tasks</h3>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${
            activeFilter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setActiveFilter("taskOfDay")}
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${
            activeFilter === "taskOfDay"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Task of the Day
        </button>
        <button
          onClick={() => setActiveFilter("completed")}
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${
            activeFilter === "completed"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Completed Tasks
        </button>
        <button
          onClick={() => setActiveFilter("pending")}
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${
            activeFilter === "pending"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Pending Tasks
        </button>
        <button
          onClick={() => setActiveFilter("transferred")}
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${
            activeFilter === "transferred"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Transferred Tasks
        </button>
      </div>

      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <CheckCircle
                className={`${
                  task.status === "completed"
                    ? "text-green-500"
                    : task.status === "in-progress"
                      ? "text-blue-500"
                      : task.status === "overdue"
                        ? "text-red-500"
                        : task.status === "transferred"
                          ? "text-purple-500"
                          : "text-gray-400"
                }`}
                size={24}
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                task.status,
              )}`}
            >
              {task.status.replace("-", " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeTasksTab;
