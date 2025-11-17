import { CheckCircle } from "lucide-react";
import { getStatusColor } from "@/utils/task/admin/taskUtils";
import { RecentTask } from "@/redux/employee/api";

interface EmployeeTasksTabProps {
  tasks: RecentTask[];
}

const EmployeeTasksTab = ({ tasks }: EmployeeTasksTabProps) => (
  <div>
    <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Tasks</h3>
    <div className="space-y-3">
      {tasks.map((task) => (
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
              task.status
            )}`}
          >
            {task.status.replace("-", " ")}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default EmployeeTasksTab;
